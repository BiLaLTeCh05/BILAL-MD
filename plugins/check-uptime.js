const { cmd } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
  pattern: "uptime",
  alias: ["runtime", "up"],
  desc: "Show bot uptime",
  category: "main",
  react: "⏱️",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const uptime = runtime(process.uptime());

    const message = `⏱️ *BOT UPTIME:* ${uptime}`;

    await conn.sendMessage(from, {
      text: message
    }, { quoted: mek });

  } catch (e) {
    console.error("Uptime Error:", e);
    reply(`❌ Error: ${e.message}`);
  }
});
