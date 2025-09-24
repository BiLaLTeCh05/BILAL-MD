const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const config = require('../config');
const { cmd } = require('../command');
const fetch = require('node-fetch');

const envPath = path.join(__dirname, "../.env");

// 🔹 Heroku Variable Update
async function updateHerokuEnv(key, value) {
    const apiKey = process.env.HEROKU_API_KEY;
    const appName = process.env.HEROKU_APP_NAME;

    if (!apiKey || !appName) {
        console.log("⚠️ HEROKU_API_KEY or HEROKU_APP_NAME not set, skipping Heroku sync.");
        return;
    }

    try {
        await fetch(`https://api.heroku.com/apps/${appName}/config-vars`, {
            method: "PATCH",
            headers: {
                "Accept": "application/vnd.heroku+json; version=3",
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ [key]: value })
        });
        console.log(`✅ Heroku var updated: ${key}=${value}`);
    } catch (e) {
        console.error("❌ Failed to update Heroku vars:", e.message);
    }
}

// 🔹 Local .env Update
async function updateEnvVariable(key, value) {
    let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    const regex = new RegExp(`^${key}=.*`, "m");

    if (regex.test(env)) {
        env = env.replace(regex, `${key}=${value}`);
    } else {
        env += `\n${key}=${value}`;
    }

    fs.writeFileSync(envPath, env);

    dotenv.config({ path: envPath });

    delete require.cache[require.resolve('../config')];
    const freshConfig = require('../config');
    Object.assign(config, freshConfig);

    await updateHerokuEnv(key, value);
}

// 🔹 Bot Restart
async function restartBot(conn, from, msg) {
    await conn.sendMessage(from, { text: "♻️ Changes applied. Restarting bot..." }, { quoted: msg });
    process.exit(0);
}

// 🔹 Button Sender
function sendToggleMessage(conn, m, from, key, label, current) {
    return conn.sendMessage(from, {
        text: `⚙️ *${label}*\nCurrent: ${current ? "✅ ON" : "❌ OFF"}`,
        footer: "Tap below to toggle",
        buttons: [
            { buttonId: `set_${key}_true`, buttonText: { displayText: "ON ✅" }, type: 1 },
            { buttonId: `set_${key}_false`, buttonText: { displayText: "OFF ❌" }, type: 1 }
        ],
        headerType: 2
    }, { quoted: m });
}

// ======================
// ⚙️ ENV COMMAND
// ======================
cmd({
    pattern: "env",
    alias: ["config", "settings"],
    desc: "Bot config control panel (ON/OFF buttons + Owner set)",
    category: "owner",
    react: "⚙️",
    filename: __filename
},
async (conn, m, store, { from, reply }) => {
    const senderNum = m.sender.split("@")[0];
    const owners = (config.OWNER_NUMBER || []).map(n => n.toString());

    // ✅ Owner check
    if (!owners.includes(senderNum)) {
        return reply("⚠️ Command reserved for *Owner* only.");
    }

    // 🔹 Options
    const options = [
        { key: "AUTO_REACT", label: "Auto React" },
        { key: "ANTI_LINK", label: "Anti Link" },
        { key: "ANTI_BAD", label: "Anti Bad" },
        { key: "DELETE_LINKS", label: "Delete Links" },
        { key: "AUTO_STATUS_SEEN", label: "Auto Status Seen" },
        { key: "AUTO_STATUS_REPLY", label: "Auto Status Reply" },
        { key: "AUTO_STATUS_REACT", label: "Auto Status React" },
        { key: "ALWAYS_ONLINE", label: "Always Online" },
        { key: "READ_MESSAGE", label: "Read Message" },
        { key: "READ_CMD", label: "Read CMD" },
        { key: "PUBLIC_MODE", label: "Public Mode" },
        { key: "AUTO_TYPING", label: "Auto Typing" },
        { key: "AUTO_RECORDING", label: "Auto Recording" },
    ];

    // 🔹 Send toggles
    for (const opt of options) {
        const current = config[opt.key] && config[opt.key].toString().toLowerCase() === "true";
        await sendToggleMessage(conn, m, from, opt.key, opt.label, current);
    }

    // 🔹 OWNER_NUMBER update command
    await conn.sendMessage(from, {
        text: `📌 *Set Owner Number*\nCurrent: ${owners.join(", ")}\n\nReply this message with:\n> .setowner 923001234567,923009876543`
    }, { quoted: m });

    // Button listener
    conn.ev.on("messages.upsert", async (msgData) => {
        const msg = msgData.messages[0];
        const btnId = msg?.message?.buttonsResponseMessage?.selectedButtonId;
        if (!btnId || !btnId.startsWith("set_")) return;

        const [, key, value] = btnId.split("_");
        const newVal = value === "true" ? "true" : "false";

        await updateEnvVariable(key, newVal);
        await conn.sendMessage(from, { text: `✅ *${key}* updated to: *${newVal.toUpperCase()}*` }, { quoted: msg });

        setTimeout(() => restartBot(conn, from, msg), 2000);
    });
});

// ======================
// ⚙️ .setowner COMMAND
// ======================
cmd({
    pattern: "setowner",
    desc: "Update bot owner number(s) via Heroku",
    category: "owner",
    react: "👑",
    filename: __filename
},
async (conn, m, store, { from, reply, args }) => {
    const senderNum = m.sender.split("@")[0];
    const owners = (config.OWNER_NUMBER || []).map(n => n.toString());

    if (!owners.includes(senderNum)) {
        return reply("⚠️ Command reserved for *Owner* only.");
    }

    if (!args[0]) return reply("❌ Usage: .setowner 923001234567,923009876543");

    const newOwners = args[0].split(",").map(n => n.trim());

    await updateEnvVariable("OWNER_NUMBER", newOwners.join(","));
    await conn.sendMessage(from, { text: `✅ Owner updated:\n*${newOwners.join(", ")}*` }, { quoted: m });

    setTimeout(() => restartBot(conn, from, m), 2000);
});
