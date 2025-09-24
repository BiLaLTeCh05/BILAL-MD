const { cmd } = require('../command');
const isAdmin = require('../lib/isAdmin');

cmd({
    pattern: "kick",
    alias: ["remove", "k"],
    desc: "Kick group members (admin only)",
    category: "group",
    react: "👢",
    filename: __filename
}, 
async (conn, mek, m, { from, reply, sender }) => {
    try {
        const { isSenderAdmin, isBotAdmin } = await isAdmin(conn, from, sender);

        if (!isBotAdmin) return reply("⚠️ Please make me *Admin* first.");
        if (!isSenderAdmin) return reply("⚠️ Only *Group Admins* can use this command.");

        // Find user (mention or reply)
        const ctxInfo = mek.message?.extendedTextMessage?.contextInfo || {};
        const mentioned = Array.isArray(ctxInfo.mentionedJid) && ctxInfo.mentionedJid.length > 0 ? ctxInfo.mentionedJid : [];
        const replied = ctxInfo.participant ? [ctxInfo.participant] : [];

        const usersToKick = mentioned.length > 0 ? mentioned : replied;

        if (usersToKick.length === 0) {
            return reply("⚠️ Please reply to a message or mention the user to kick.");
        }

        // Prevent bot from kicking itself
        const botId = conn.user.id.split(":")[0] + "@s.whatsapp.net";
        if (usersToKick.includes(botId)) {
            return reply("😅 I can't kick myself!");
        }

        // Kick members
        await conn.groupParticipantsUpdate(from, usersToKick, "remove");

        await conn.sendMessage(from, { 
            text: `✅ Removed: ${usersToKick.map(jid => "@" + jid.split("@")[0]).join(", ")}`,
            mentions: usersToKick
        }, { quoted: mek });

    } catch (e) {
        console.error("Kick command error:", e);
        reply("❌ Failed to kick user(s).");
    }
});
