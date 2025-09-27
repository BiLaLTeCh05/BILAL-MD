// ==========================
// BILAL-MD WhatsApp Bot
// Stable Heroku Ready Version
// ==========================

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  getContentType,
  fetchLatestBaileysVersion,
  Browsers
} = require('@whiskeysockets/baileys');

const P = require('pino');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const express = require('express');
const util = require('util');
const { File } = require('megajs');

// ====== Local Imports ======
const { AntiDelete } = require('./lib');
const { saveMessage } = require('./data');
const config = require('./config');

// ==========================
// CONFIG
// ==========================
const prefix = config.PREFIX || '.';
const ownerNumber = [config.OWNER_NUMBER || '923078071982'];

// ==========================
// EXPRESS SERVER (Heroku Keep Alive)
// ==========================
const app = express();
app.get('/', (req, res) => res.send('✅ BILAL-MD is running!'));
app.listen(process.env.PORT || 3000, () => console.log("🌐 Express server started"));

// ==========================
// SESSION SETUP
// ==========================
(async () => {
  if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
    if (!config.SESSION_ID) return console.log('❌ Please add your SESSION_ID in Heroku config vars');
    const sessdata = config.SESSION_ID.replace("BILAL-MD~", '');
    const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
    filer.download((err, data) => {
      if (err) throw err;
      fs.writeFileSync(__dirname + '/sessions/creds.json', data);
      console.log("✅ Session downloaded successfully");
    });
  }
})();

// ==========================
// CMD HANDLER FUNCTION
// ==========================
global.cmd = function (options, callback) {
  if (!global.commands) global.commands = [];
  global.commands.push({ ...options, callback });
};

// ==========================
// START BOT
// ==========================
async function connectToWA() {
  console.log("⚡ Connecting to WhatsApp...");

  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/');
  const { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    browser: Browsers.macOS("Firefox"),
    auth: state,
    version
  });

  // ===== CONNECTION HANDLER =====
  conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode || "unknown";
      console.log("❌ Connection closed. Reason:", reason);

      if (reason !== DisconnectReason.loggedOut) {
        console.log("♻️ Reconnecting...");
        connectToWA();
      } else {
        console.log("❌ Session expired. Please update SESSION_ID.");
      }
    }

    if (connection === 'open') {
      console.log("✅ BILAL-MD Connected Successfully!");

      // Load plugins dynamically
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() === ".js") {
          try {
            require("./plugins/" + plugin);
            console.log(`📂 Plugin Loaded: ${plugin}`);
          } catch (err) {
            console.error(`❌ Error in plugin ${plugin}:`, err);
          }
        }
      });

      // Notify owner
      conn.sendMessage(ownerNumber[0] + "@s.whatsapp.net", {
        text: `✅ *BILAL-MD Connected!*\n\nNow your bot is live 👑`
      });
    }
  });

  // ===== SAVE CREDS =====
  conn.ev.on('creds.update', saveCreds);

  // ===== ANTIDELETE =====
  conn.ev.on('messages.update', async updates => {
    for (const update of updates) {
      if (update.update.message === null) {
        await AntiDelete(conn, updates);
      }
    }
  });

  // ===== MESSAGE HANDLER =====
  conn.ev.on('messages.upsert', async (mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;

    mek.message = (getContentType(mek.message) === 'ephemeralMessage')
      ? mek.message.ephemeralMessage.message
      : mek.message;

    const from = mek.key.remoteJid;
    const type = getContentType(mek.message);
    const body =
      type === 'conversation' ? mek.message.conversation :
      type === 'extendedTextMessage' ? mek.message.extendedTextMessage.text :
      type === 'imageMessage' ? mek.message.imageMessage.caption :
      type === 'videoMessage' ? mek.message.videoMessage.caption : '';

    const isCmd = body.startsWith(prefix);
    const command = isCmd ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : '';
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(' ');

    const sender = mek.key.fromMe ? conn.user.id : (mek.key.participant || mek.key.remoteJid);
    const senderNumber = sender.split('@')[0];
    const isOwner = ownerNumber.includes(senderNumber);

    const reply = (teks) => conn.sendMessage(from, { text: teks }, { quoted: mek });

    // ==== EVAL FOR OWNER ONLY ====
    if (isOwner && body.startsWith('%')) {
      try {
        let result = eval(body.slice(1));
        reply(util.format(result));
      } catch (e) {
        reply(util.format(e));
      }
    }

    // ==== SAVE MESSAGE TO DB ====
    await saveMessage(mek);

    // ==== COMMAND HANDLER ====
    if (isCmd && global.commands) {
      const cmdFound = global.commands.find(x => x.pattern === command || (x.alias && x.alias.includes(command)));
      if (cmdFound) {
        cmdFound.callback(conn, mek, {}, { from, q, reply, command, args });
      } else {
        reply(`❌ Unknown command: *${command}*`);
      }
    }
  });
}

connectToWA();
