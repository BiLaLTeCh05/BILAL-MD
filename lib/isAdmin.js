async function isAdmin(conn, jid, sender) {
    try {
        const metadata = await conn.groupMetadata(jid);
        const participants = metadata.participants;

        // Group admins list
        const admins = participants
            .filter(p => p.admin !== null)
            .map(p => p.id);

        // Bot ID
        const botId = (conn.user.id.split(':')[0] + '@s.whatsapp.net').trim();

        // Check conditions
        const isBotAdmin = admins.includes(botId);
        const isSenderAdmin = admins.includes(sender);

        return { isBotAdmin, isSenderAdmin };
    } catch (e) {
        console.error("isAdmin.js error:", e);
        return { isBotAdmin: false, isSenderAdmin: false };
    }
}

module.exports = isAdmin;
