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
        // Check if bot and sender are admins
        const { isSenderAdmin, isBotAdmin } = await isAdmin(conn, from, sender);

        if (!isBotAdmin) return reply("⚠️ Please make me *Admin* first.");
        if (!isSenderAdmin) return reply("⚠️ Only *Group Admins* can use this command.");

        const ctxInfo = mek.message?.extendedTextMessage?.contextInfo || {};
        let usersToKick = [];

        // Mentioned users
        if (ctxInfo.mentionedJid && ctxInfo.mentionedJid.length > 0) {
            usersToKick = ctxInfo.mentionedJid;
        } 
        // Replied user
        else if (ctxInfo.participant) {
            usersToKick = [ctxInfo.participant];
        }

        if (usersToKick.length === 0) {
            return reply("⚠️ Please *mention* the user or *reply* to their message to kick.");
        }

        // Prevent bot from kicking itself
        const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        if (usersToKick.includes(botId)) {
            return reply("🤖 I can’t kick myself!");
        }

        // Execute kick
        await conn.groupParticipantsUpdate(from, usersToKick, "remove");

        await conn.sendMessage(from, {
            text: `👢 Removed: ${usersToKick.map(u => `@${u.split('@')[0]}`).join(', ')}`,
            mentions: usersToKick
        }, { quoted: mek });

    } catch (err) {
        console.error("Kick command error:", err);
        reply("❌ Failed to kick user(s). Maybe I’m not admin or the target is an admin.");
    }
});
