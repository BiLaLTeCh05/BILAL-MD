const { cmd } = require('../command');
const isAdmin = require('../lib/isAdmin');

cmd({
  pattern: "kick",
  alias: ["remove"],
  desc: "Kick user(s) from group (admin only)",
  category: "group",
  react: "👢",
  filename: __filename
},
async (conn, mek, m, { from, reply, sender }) => {
  try {
    const { isSenderAdmin, isBotAdmin } = await isAdmin(conn, from, sender);

    if (!isBotAdmin) return reply("⚠️ Please make me *Admin* first.");
    if (!isSenderAdmin) return reply("⚠️ Only *Group Admins* can use this command.");

    const ctxInfo = mek.message?.extendedTextMessage?.contextInfo || {};
    let usersToKick = [];

    if (ctxInfo.mentionedJid && ctxInfo.mentionedJid.length > 0) {
      usersToKick = ctxInfo.mentionedJid;
    } else if (ctxInfo.participant) {
      usersToKick = [ctxInfo.participant];
    }

    if (usersToKick.length === 0) {
      return reply("⚠️ Please *mention* the user or *reply* to their message to kick.");
    }

    // Bot's own ID
    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    if (usersToKick.includes(botId)) {
      return reply("🤖 I can’t kick myself!");
    }

    await conn.groupParticipantsUpdate(from, usersToKick, "remove");

    await conn.sendMessage(from, {
      text: `👢 Removed: ${usersToKick.map(u => `@${u.split('@')[0]}`).join(', ')}`,
      mentions: usersToKick
    }, { quoted: mek });

  } catch (err) {
    console.error("Kick command error:", err);
    reply("❌ Failed to kick user(s).");
  }
});
