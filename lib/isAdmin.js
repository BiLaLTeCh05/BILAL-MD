async function isAdmin(sock, chatId, senderId) {
    try {
        const metadata = await sock.groupMetadata(chatId);
        const participants = metadata.participants || [];

        const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net";
        const botData = participants.find(p => p.id === botId);
        const senderData = participants.find(p => p.id === senderId);

        return {
            isBotAdmin: botData ? botData.admin !== null : false,
            isSenderAdmin: senderData ? senderData.admin !== null : false
        };
    } catch (e) {
        console.error("isAdmin error:", e);
        return { isBotAdmin: false, isSenderAdmin: false };
    }
}

module.exports = isAdmin;
