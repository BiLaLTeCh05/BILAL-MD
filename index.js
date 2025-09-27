//======================
// 📦 Required Modules
//======================
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, getContentType, Browsers, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const os = require('os');
const P = require('pino');
const express = require('express');
const config = require('./config');
const { sms } = require('./lib/functions');
const { saveMessage } = require('./lib');

//======================
// 👑 Owner & Prefix
//======================
const ownerNumber = [config.OWNER_NUMBER || '923078071982'];
const prefix = config.PREFIX || '.';

//======================
// 🗑️ Temp Directory
//======================
const tempDir = path.join(os.tmpdir(), 'cache-temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
setInterval(() => {
  fs.readdir(tempDir, (err, files) => {
    if (err) return;
    for (const file of files) fs.unlinkSync(path.join(tempDir, file));
  });
}, 5 * 60 * 1000);

//======================
// 🌐 Express Server
//======================
const app = express();
const port = process.env.PORT || 9090;
app.get("/", (req, res) => res.send("✅ BILAL-MD Bot is running"));
app.listen(port, () => console.log(`🌍 Server running on port ${port}`));

//======================
// 📂 Plugins Loader
//======================
const loadPlugins = (conn) => {
  const pluginPath = path.join(__dirname, "plugins");
  fs.readdirSync(pluginPath).forEach((file) => {
    if (file.endsWith(".js")) {
      try {
        const plugin = require(path.join(pluginPath, file));
        if (typeof plugin === "function") {
          plugin(conn); // agar plugin function export kare
        }
        console.log(`✅ Plugin Loaded: ${file}`);
      } catch (err) {
        console.error(`❌ Error in plugin ${file}:`, err);
      }
    }
  });
};

//======================
// 🤖 Connect WhatsApp
//======================
async function connectToWA() {
  console.log("📡 Connecting BILAL-MD to WhatsApp...");
  const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'sessions'));
  const { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    browser: Browsers.macOS("Firefox"),
    auth: state,
    version
  });

  // Connection Update
  conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.statusCode;
      console.log("❌ Connection closed. Code:", code);
      if (code !== DisconnectReason.loggedOut) connectToWA();
      else console.log("🔄 Please scan again.");
    } else if (connection === 'open') {
      console.log("✅ BOT CONNECTED TO WHATSAPP");
      loadPlugins(conn);
      await conn.sendMessage(conn.user.id, { text: "*👑 BILAL-MD Started Successfully 👑*" });
    }
  });

  // Save Creds
  conn.ev.on('creds.update', saveCreds);

  // Message Handler
  conn.ev.on('messages.upsert', async(mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') 
      ? mek.message.ephemeralMessage.message 
      : mek.message;

    if(config.READ_MESSAGE === 'true') await conn.readMessages([mek.key]);
    await saveMessage(mek);

    const m = sms(conn, mek);
    const body = m.body || "";
    const from = m.from;
    const sender = m.sender;
    const isOwner = ownerNumber.includes(sender.split('@')[0]);

    const reply = (text) => conn.sendMessage(from, { text }, { quoted: mek });

    // Default Commands
    if (body.startsWith(prefix)) {
      const cmd = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase();

      if (cmd === "ping") {
        reply("🏓 Pong! BILAL-MD is alive ✅");
      }

      if (cmd === "owner") {
        reply(`👑 Owner: ${ownerNumber.join(', ')}`);
      }

      if (cmd === "menu") {
        reply("📜 *BILAL-MD MENU* \n1. .ping\n2. .owner\n3. .menu");
      }
    }
  });
}

connectToWA();
