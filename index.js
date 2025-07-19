// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

import {
    makeWASocket,
    Browsers,
    fetchLatestBaileysVersion,
    DisconnectReason,
    useMultiFileAuthState,
} from '@whiskeysockets/baileys';

import { Handler, Callupdate, GroupUpdate } from './popkid/popkidd/popkiddd.js';
import express from 'express';
import pino from 'pino';
import fs from 'fs';
import NodeCache from 'node-cache';
import path from 'path';
import chalk from 'chalk';
import moment from 'moment-timezone';
import axios from 'axios';
import config from './config.cjs';
import pkg from './lib/autoreact.cjs';
import { File } from 'megajs';
import { fileURLToPath } from 'url';

const { emojis, doReact } = pkg;

const sessionName = "session";
const app = express();
const orange = chalk.bold.hex("#FFA500");
const lime = chalk.bold.hex("#32CD32");
let useQR = false;
let initialConnection = true;
const PORT = process.env.PORT || 3000;

const MAIN_LOGGER = pino({ timestamp: () => `,"time":"${new Date().toJSON()}"` });
const logger = MAIN_LOGGER.child({});
logger.level = "trace";

const msgRetryCounterCache = new NodeCache();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir, { recursive: true });

async function downloadSessionData() {
    try {
        if (!config.SESSION_ID) {
            console.error('❌ Please add your session to SESSION_ID env!');
            return false;
        }

        const sessdata = config.SESSION_ID.split("POPKID;;;")[1];
        if (!sessdata || !sessdata.includes("#")) {
            console.error('❌ Invalid SESSION_ID format! It must contain both file ID and decryption key.');
            return false;
        }

        const [fileID, decryptKey] = sessdata.split("#");
        const file = File.fromURL(`https://mega.nz/file/${fileID}#${decryptKey}`);

        console.log("🔄 Downloading Session...");
        const data = await new Promise((resolve, reject) => {
            file.download((err, data) => err ? reject(err) : resolve(data));
        });

        await fs.promises.writeFile(credsPath, data);
        console.log("🔒 Session Successfully Loaded !!");
        return true;

    } catch (error) {
        console.error('❌ Failed to download session data:', error.message);
        return false;
    }
}

const lifeQuotes = [
    "The only way to do great work is to love what you do.",
    "Strive not to be a success, but rather to be of value.",
    "The mind is everything. What you think you become.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Life is what happens when you're busy making other plans.",
    "Be the change that you wish to see in the world.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It is never too late to be what you might have been.",
    "Do not wait to strike till the iron is hot; but make the iron hot by striking.",
    "The journey of a thousand miles begins with a single step."
];

async function updateBio(Matrix) {
    try {
        const now = moment().tz('Africa/Nairobi');
        const bio = `🧋bilal xᴍᴅ ɪs ᴀᴄᴛɪᴠᴇ🧋ᴀᴛ ${now.format('HH:mm:ss')} | ${lifeQuotes[Math.floor(Math.random() * lifeQuotes.length)]}`;
        await Matrix.updateProfileStatus(bio);
        console.log(chalk.yellow(`ℹ️ Bio updated to: "${bio}"`));
    } catch (err) {
        console.error(chalk.red('Bio update failed:'), err.message);
    }
}

async function updateLiveBio(Matrix) {
    try {
        const now = moment().tz('Africa/Nairobi');
        await Matrix.updateProfileStatus(`🧋bilal xᴍᴅ ɪs ᴀᴄᴛɪᴠᴇ🧋ᴀᴛ ${now.format('HH:mm:ss')}`);
    } catch (err) {
        console.error(chalk.red('Live bio update failed:'), err.message);
    }
}

async function start() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
        const { version } = await fetchLatestBaileysVersion();
        console.log(`📦 WhatsApp version: ${version.join('.')}`);

        const Matrix = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: useQR,
            browser: ["bilal", "safari", "3.3"],
            auth: state,
            getMessage: async (key) => {
                if (store) return (await store.loadMessage(key.remoteJid, key.id))?.message;
                return { conversation: "popkid md whatsapp user bot" };
            }
        });

        Matrix.ev.on('connection.update', async ({ connection, lastDisconnect }) => {
            if (connection === 'close') {
                const reason = lastDisconnect?.error?.output?.statusCode;
                console.log(chalk.red(`❌ Disconnected [Reason: ${reason}]`));
                if (reason !== DisconnectReason.loggedOut) start();
            } else if (connection === 'open') {
                console.log(chalk.green("✅ BILAL MD is now ONLINE"));

                // Newsletter auto-follow removed here
                await updateBio(Matrix);

                await Matrix.sendMessage(Matrix.user.id, {
                    image: { url: "https://files.catbox.moe/nk71o3.jpg" },
                    caption: `╭━━ *『 bilal xᴍᴅ ᴄᴏɴɴᴇᴄᴛᴇᴅ 』*
┃  |⚡| *ʙᴏᴛ:* bilal xᴍᴅ
┃  |👑| *ᴏᴡɴᴇʀ:* bilal
┃  |⚙️| *ᴍᴏᴅᴇ:* ${config.MODE}
┃  |🎯| *ᴘʀᴇꜰɪx:* ${config.PREFIX}
┃  |✅| *ꜱᴛᴀᴛᴜꜱ:* ᴏɴʟɪɴᴇ & ꜱᴛᴀʙʟᴇ
╰━━━━━━━━━━━━━━━━━━━╯`,
                    contextInfo: {
                        isForwarded: true,
                        forwardingScore: 999,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363290715861418@newsletter',
                            newsletterName: "bilal xmd ʙᴏᴛ",
                            serverMessageId: -1,
                        },
                        externalAdReply: {
                            title: "bilal xᴍᴅ ʙᴏᴛ",
                            body: "ᴘᴏᴡᴇʀᴇᴅ ʙʏ bilal",
                            thumbnailUrl: 'https://files.catbox.moe/nk71o3.jpg',
                            sourceUrl: 'https://whatsapp.com/channel/0029VajweHxKQuJP6qnjLM31',
                            mediaType: 1,
                            renderLargerThumbnail: false,
                        },
                    },
                });

                if (!global.isLiveBioRunning) {
                    global.isLiveBioRunning = true;
                    setInterval(() => updateLiveBio(Matrix), 60 * 1000);
                }

                initialConnection = false;
            }
        });

        Matrix.ev.on('creds.update', saveCreds);

        Matrix.ev.on("messages.upsert", async (chatUpdate) => {
            if (!chatUpdate.messages?.length) return;
            await Handler(chatUpdate, Matrix, logger);

            try {
                const mek = chatUpdate.messages[0];
                if (!mek.key.fromMe && config.AUTO_REACT && mek.message) {
                    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
                    await doReact(emoji, mek, Matrix);
                }
            } catch (err) {
                console.error('Auto-react failed:', err.message);
            }
        });

        Matrix.ev.on("call", (json) => Callupdate(json, Matrix));
        Matrix.ev.on("group-participants.update", (msg) => GroupUpdate(Matrix, msg));

        Matrix.public = config.MODE === "public";

    } catch (err) {
        console.error('❌ Startup Error:', err.stack || err.message);
        process.exit(1);
    }
}

async function init() {
    global.isLiveBioRunning = false;

    if (fs.existsSync(credsPath)) {
        console.log("🔒 Session file exists. Starting...");
        await start();
    } else {
        const ok = await downloadSessionData();
        if (ok) {
            console.log("✅ Session downloaded successfully.");
            await start();
        } else {
            console.log("📸 Starting in QR mode...");
            useQR = true;
            await start();
        }
    }
}

init();

// Serve web UI
app.use(express.static(path.join(__dirname, 'mydata')));
app.get('/', (_, res) => res.sendFile(path.join(__dirname, 'mydata', 'index.html')));

// Keep app awake (Render/Heroku workaround)
setInterval(() => {
    axios.get(`http://localhost:${PORT}`).catch(() => {});
}, 4 * 60 * 1000); // every 4 minutes

// Start Express server
app.listen(PORT, () => {
    console.log(`🌐 Server running on port ${PORT}`);
});
