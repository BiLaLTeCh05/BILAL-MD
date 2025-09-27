//======================
// 🔐 Required Modules
//======================
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, jidNormalizedUser, getContentType, Browsers, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const os = require('os');
const P = require('pino');
const qrcode = require('qrcode-terminal');
const express = require('express');
const Crypto = require('crypto');
const config = require('./config');
const { getBuffer, getGroupAdmins, sms } = require('./lib/functions');
const { AntiDelete, saveMessage } = require('./lib');
const { File } = require('megajs');
const ff = require('fluent-ffmpeg');

//======================
// 🔐 Owner & Prefix
//======================
const ownerNumber = ['923078071982'];
const prefix = config.PREFIX;

//======================
// 🔐 Temp Directory
//======================
const tempDir = path.join(os.tmpdir(), 'cache-temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

const clearTempDir = () => {
  fs.readdir(tempDir, (err, files) => {
    if (err) throw err;
    for (const file of files) fs.unlinkSync(path.join(tempDir, file));
  });
};
setInterval(clearTempDir, 5 * 60 * 1000);

//======================
// 🔐 Crypto Functions
//======================
function encrypt(text, secretKey) {
  const cipher = Crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), Buffer.alloc(16, 0));
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(encryptedText, secretKey) {
  const decipher = Crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), Buffer.alloc(16, 0));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function generateKey() {
  return Crypto.randomBytes(32).toString('hex');
}

//======================
// 🔐 Express Setup
//======================
const app = express();
const port = process.env.PORT || 9090;
app.get("/", (req, res) => res.send("BILAL-MD Bot is running ✅"));
app.listen(port, () => console.log(`Server running on port ${port}`));

//======================
// 🔐 Session & Connect
//======================
async function connectToWA() {
  console.log("BILAL-MD BOT APKI WHATSAPP K SATH CONNECT HO RAHA HAI");
  const { state, saveCreds } = await useMultiFileAuthState(__dirname + '/sessions/');
  const { version } = await fetchLatestBaileysVersion();

  const conn = makeWASocket({
    logger: P({ level: 'silent' }),
    printQRInTerminal: false,
    browser: Browsers.macOS("Firefox"),
    syncFullHistory: true,
    auth: state,
    version
  });

  conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.statusCode;
      console.log("Connection closed. Reason code:", code);
      if (code !== DisconnectReason.loggedOut) connectToWA();
      else console.log("AP BOT KO DUBARA SCAN KARO");
    } else if (connection === 'open') {
      console.log("BOT CONNECTED. LOADING PLUGINS...");
      fs.readdirSync("./plugins/").forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() === ".js") {
          try { require("./plugins/" + plugin); console.log(`ADDED :❯ ${plugin}`); }
          catch (err) { console.error(`ERROR ${plugin}:`, err); }
        }
      });
      console.log("BILAL-MD STARTED ✅");
      const up = "*👑 BILAL-MD STARTED 👑*";
      await conn.sendMessage(conn.user.id, { image: { url: 'https://files.catbox.moe/kunzpz.png' }, caption: up });
    }
  });

  conn.ev.on('creds.update', saveCreds);

  //======================
  // 🔐 Messages Update
  //======================
  conn.ev.on('messages.upsert', async(mek) => {
    mek = mek.messages[0];
    if (!mek.message) return;
    mek.message = (getContentType(mek.message) === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message;
    
    if(config.READ_MESSAGE === 'true') await conn.readMessages([mek.key]);
    
    await saveMessage(mek);
    const m = sms(conn, mek);

    const type = getContentType(mek.message);
    const from = mek.key.remoteJid;
    const sender = mek.key.fromMe ? (conn.user.id.split(':')[0]+'@s.whatsapp.net') : (mek.key.participant || mek.key.remoteJid);
    const senderNumber = sender.split('@')[0];
    const isOwner = ownerNumber.includes(senderNumber);

    const reply = (text) => { conn.sendMessage(from, { text }, { quoted: mek }); }

    //======================
    // 🔐 Crypto Commands
    //======================
    if (isOwner && mek.message.conversation) {
      const body = mek.message.conversation;
      if (body.startsWith(`${prefix}encrypt `)) {
        const textToEncrypt = body.replace(`${prefix}encrypt `, '');
        const key = generateKey();
        const encrypted = encrypt(textToEncrypt, key);
        reply(`Encrypted: ${encrypted}\nKey: ${key}`);
      }
      if (body.startsWith(`${prefix}decrypt `)) {
        const [enc, key] = body.replace(`${prefix}decrypt `, '').split('|');
        if(!enc || !key) return reply("Format: decrypt <encryptedText>|<key>");
        const decrypted = decrypt(enc.trim(), key.trim());
        reply(`Decrypted: ${decrypted}`);
      }
    }
  });
}

connectToWA();
