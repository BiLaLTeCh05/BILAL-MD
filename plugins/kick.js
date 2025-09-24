const { cmd } = require('../command');
const isAdmin = require('../lib/isAdmin');

cmd({
    pattern: "kick",
    alias: ["remove"],
    desc: "Remove a user from the group (admin only)",
    category: "group",
    react: "👢",
    filename: __filename
}, 
async (conn, mek, m, { from, reply, sender, participants }) => {
    try {
        // Check admin rights
        const { isSenderAdmin, isBotAdmin } = await isAdmin(conn, from, sender);

        if (!isBotAdmin) return reply("⚠️ Please make the bot an *Admin* first.");
        if (!isSenderAdmin) return reply("⚠️ Only *Group Admins* can use this command.");

        let usersToKick = [];

        // If user mentioned someone
        const ctxInfo = mek.message?.extendedTextMessage?.contextInfo || {};
        if (ctxInfo.mentionedJid && ctxInfo.mentionedJid.length > 0) {
            usersToKick = ctxInfo.mentionedJid;
        }
        // If user replied to someone's message
        else if (ctxInfo.participant) {
            usersToKick = [ctxInfo.participant];
        }

        if (usersToKick.length === 0) {
            return reply("⚠️ Please reply to a message or mention a user to kick!");
        }

        // Bot ka apna ID
        const botId = conn.user.id.split(':')[0] + "@s.whatsapp.net";
        if (usersToKick.includes(botId)) {
            return reply("🤖 I can't kick myself!");
        }

        // Kick action
        await conn.groupParticipantsUpdate(from, usersToKick, "remove");

        // Confirmation message
        await conn.sendMessage(from, {
            text: `✅ Kicked: ${usersToKick.map(j => "@" + j.split("@")[0]).join(", ")}`,
            mentions: usersToKick
        }, { quoted: mek });

    } catch (e) {
        console.error("Kick command error:", e);
        reply("❌ Failed to kick user(s).");
    }
});
