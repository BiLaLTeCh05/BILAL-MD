const { cmd } = require('../command');

cmd({
    pattern: "kick",
    alias: ["out", "remove"],
    desc: "Remove member by reply or by country code",
    category: "admin",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isBotAdmins, reply, groupMetadata }) => {
    try {
        if (!isGroup) return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        if (!isBotAdmins) return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");

        let targetIds = [];

        // Agar kisi member ke msg ko reply karke command use kare
        if (m.quoted) {
            const quotedSender = m.quoted.sender || m.quoted.participant || m.quoted.key.participant;
            if (quotedSender) targetIds.push(quotedSender);
        } 
        // Agar country code diya ho (e.g .kick 92)
        else if (q) {
            const countryCode = q.trim();
            if (!/^\d+$/.test(countryCode)) {
                return reply("*DUBARA KOSHISH KAREIN 🥺❤️* (sirf numbers likho)");
            }

            const participants = groupMetadata.participants || [];
            const targets = participants.filter(p => {
                const num = (p.id || p.jid).split("@")[0];
                return num.startsWith(countryCode) && !(p.admin === "admin" || p.admin === "superadmin");
            });

            if (targets.length === 0) {
                return reply(`*IS GROUP ME KOI MEMBER NAHI HAI JISKA NUMBER +${countryCode} SE START HOTA HAI 🥺🌹*`);
            }

            targetIds = targets.map(p => p.id || p.jid);
        } 
        else {
            return reply("*KISI MEMBER KO REPLY KARKE `.kick` LIKHO YA PHIR COUNTRY CODE DO ☺️❤️*");
        }

        await conn.groupParticipantsUpdate(from, targetIds, "remove");

        const mentions = targetIds.map(j => "@" + j.split("@")[0]).join("\n");
        await conn.sendMessage(from, {
            text: `✅ REMOVE HO GAYA:\n${mentions}`,
            mentions: targetIds
        }, { quoted: mek });

    } catch (e) {
        console.error("Kick Command Error:", e);
        reply("❌ Error: " + e.message);
    }
});
