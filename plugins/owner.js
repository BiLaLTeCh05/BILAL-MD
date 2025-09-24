const config = require('../config');
const { cmd } = require('../command');

cmd({
  pattern: "owner",
  desc: "Show bot owner contact",
  category: "info",
  react: "👑",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${config.BOT_NAME || "Bot Owner"}
TEL;waid=${config.OWNER_NUMBER}:${config.OWNER_NUMBER}
END:VCARD
`;

    await conn.sendMessage(from, {
      contacts: {
        displayName: config.BOT_NAME || "Bot Owner",
        contacts: [{ vcard }]
      }
    }, { quoted: mek });

  } catch (err) {
    console.error("❌ Owner command error:", err);
    reply("❌ Failed to send owner contact!");
  }
});
