const { cmd } = require('../command');
const fs = require('fs');

const ANTICALL_PATH = './data/anticall.json';

function readState() {
  try {
    if (!fs.existsSync(ANTICALL_PATH)) return { enabled: false };
    const raw = fs.readFileSync(ANTICALL_PATH, 'utf8');
    const data = JSON.parse(raw || '{}');
    return { enabled: !!data.enabled };
  } catch {
    return { enabled: false };
  }
}

function writeState(enabled) {
  try {
    if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });
    fs.writeFileSync(ANTICALL_PATH, JSON.stringify({ enabled: !!enabled }, null, 2));
  } catch {}
}

cmd({
  pattern: "anticall",
  desc: "Enable/disable or check anticall status",
  category: "owner",
  react: "📵",
  filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
  try {
    if (!mek.key.fromMe) return reply("❌ Only bot owner can use this command!");

    const state = readState();
    const sub = (args[0] || '').trim().toLowerCase();

    if (!sub || (sub !== 'on' && sub !== 'off' && sub !== 'status')) {
      return reply(
        `*📵 ANTICALL*\n\n` +
        `.anticall on  - Enable auto-block on incoming calls\n` +
        `.anticall off - Disable anticall\n` +
        `.anticall status - Show current status`
      );
    }

    if (sub === 'status') {
      return reply(`📌 Anticall is currently *${state.enabled ? 'ON ✅' : 'OFF ❌'}*`);
    }

    const enable = sub === 'on';
    writeState(enable);
    return reply(`✅ Anticall is now *${enable ? 'ENABLED' : 'DISABLED'}*`);
    
  } catch (err) {
    console.error("Anticall command error:", err);
    reply("⚠️ Failed to update anticall settings.");
  }
});

module.exports = { readState };
