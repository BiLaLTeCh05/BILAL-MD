const { isAntibotEnabled } = require('./antibot-cmd.js');

module.exports = {
    async before(m, { conn, isAdmin, isBotAdmin }) {
        if (!m.isGroup) return !1;
        if (m.fromMe) return !0;

        // WhatsApp bot IDs ka regex
        const botPatterns = [
            /^3EB0/, /^4EB0/, /^5EB0/, /^6EB0/, /^7EB0/, /^8EB0/,
            /^9EB0/, /^AEB0/, /^BEB0/, /^CEB0/, /^DEB0/, /^EEB0/,
            /^FEB0/, /^BAE5/, /^BAE7/, /^CAEB0/, /^DAEB0/, /^EAEB0/,
            /^FAEB0/
        ];

        // Sirf tab chale jab antibot ON hai
        if (!isAntibotEnabled()) return !0;

        // Agar message ek bot ka hai
        if (botPatterns.some(rx => rx.test(m.key.id)) && m.key.remoteJid.endsWith('@g.us')) {
            if (isBotAdmin) {
                console.log('🤖 BOT DETECTED, removing: ' + m.key.participant);

                // Message delete kare
                await conn.sendMessage(m.chat, {
                    delete: {
                        remoteJid: m.chat,
                        fromMe: false,
                        id: m.key.id,
                        participant: m.key.participant
                    }
                });

                // Participant remove kare
                await conn.groupParticipantsUpdate(m.chat, [m.key.participant], 'remove');

                // Notification bheje
                await conn.sendMessage(m.chat, {
                    text: `🛑 BOT DETECTED!\nUser ${m.key.participant} has been removed.`
                });
            } else {
                console.log('⚠️ Bot detected lekin mai admin nahi hoon.');
                m.reply(`🧧 Mai admin nahi hoon, isliye remove nahi kar sakta.\n\n> 🧨 Tip: Mujhe admin bana do, mai automatically handle kar lunga.`);
            }
        }

        return !0;
    }
};
