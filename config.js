const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });
if (fs.existsSync('.env')) require('dotenv').config({ path: './.env' }); // ✅ added for safety

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
SESSION_ID: process.env.SESSION_ID || "BILAL-MD~6J0iWa4I#Pv8b1tGcyX0HGI0Ib9iRB3PMon6S7MWYfN9_NlXfYXA",
AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY BILAL KING 🤍*",
WELCOME: process.env.WELCOME || "true",
ADMIN_EVENTS: process.env.ADMIN_EVENTS || "false",
ANTI_LINK: process.env.ANTI_LINK || "true",
MENTION_REPLY: process.env.MENTION_REPLY || "false",
MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/kunzpz.png",
PREFIX: process.env.PREFIX || ".",
BOT_NAME: process.env.BOT_NAME || "BILAL-MD",
STICKER_NAME: process.env.STICKER_NAME || "BILAL-MD",
CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
DELETE_LINKS: process.env.DELETE_LINKS || "false",
OWNER_NUMBER: process.env.OWNER_NUMBER || "923078071982",
OWNER_NAME: process.env.OWNER_NAME || "BILAL KING",
DESCRIPTION: process.env.DESCRIPTION || "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ BILAL-MD*",
ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/kunzpz.png",
LIVE_MSG: process.env.LIVE_MSG || "> hi! dear I am alive now*⚡",
READ_MESSAGE: process.env.READ_MESSAGE || "false",
AUTO_REACT: process.env.AUTO_REACT || "false",
ANTI_BAD: process.env.ANTI_BAD || "false",
MODE: process.env.MODE || "public",
ANTI_LINK_KICK: process.env.ANTI_LINK_KICK || "false",
AUTO_VOICE: process.env.AUTO_VOICE || "false",
AUTO_STICKER: process.env.AUTO_STICKER || "false",
AUTO_REPLY: process.env.AUTO_REPLY || "false",
ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
PUBLIC_MODE: process.env.PUBLIC_MODE || "true",
AUTO_TYPING: process.env.AUTO_TYPING || "false",
READ_CMD: process.env.READ_CMD || "false",
DEV: process.env.DEV || "923078071982",
ANTI_VV: process.env.ANTI_VV || "true",
ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "log",
AUTO_RECORDING: process.env.AUTO_RECORDING || "false",

// ────────────────────────────────
// 🔧 Added Heroku Restart Support
// ────────────────────────────────
HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || "",
HEROKU_API_KEY: process.env.HEROKU_API_KEY || "",

// ────────────────────────────────
// 🍃 Added MongoDB Support (SAFE)
// ────────────────────────────────
MONGODB_URL: process.env.MONGODB_URL || ""
};
