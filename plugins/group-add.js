const { cmd } = require('../command');
const fetch = require('node-fetch');
const { getBinaryNodeChild, getBinaryNodeChildren } = require('@whiskeysockets/baileys');

cmd({
    pattern: "add",
    desc: "Add a user to the group (admin only)",
    category: "group",
    react: "➕",
    filename: __filename
}, 
async (conn, mek, m, { from, q, sender, reply, isGroup }) => {
    try {
        if (!isGroup) return reply("⚠️ This command only works in groups.");

        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants.map(p => p.id);

        if (!q) return reply("⚠️ Please provide a number. Example: `.add 923000000000`");

        // Clean and prepare numbers
        let numbers = q.split(',')
            .map(v => v.replace(/[^0-9]/g, ''))
            .filter(v => v.length > 4 && v.length < 20 && !participants.includes(v + "@s.whatsapp.net"));

        if (numbers.length === 0) return reply("⚠️ No valid numbers found or user already in group.");

        let users = (await Promise.all(
            numbers.map(async v => [
                v,
                await conn.onWhatsApp(v + "@s.whatsapp.net")
            ])
        ))
        .filter(v => v[1][0]?.exists)
        .map(v => v[0] + "@s.whatsapp.net");

        if (users.length === 0) return reply("⚠️ These numbers are not on WhatsApp.");

        // Try to add users
        const response = await conn.query({
            tag: "iq",
            attrs: {
                type: "set",
                xmlns: "w:g2",
                to: from,
            },
            content: users.map(jid => ({
                tag: "add",
                attrs: {},
                content: [{ tag: "participant", attrs: { jid } }]
            }))
        });

        const add = getBinaryNodeChild(response, "add");
        const participant = getBinaryNodeChildren(add, "participant");

        for (const user of participant.filter(item => item.attrs.error == 403)) {
            const jid = user.attrs.jid;
            const content = getBinaryNodeChild(user, "add_request");
            const invite_code = content.attrs.code;
            const invite_code_exp = content.attrs.expiration;

            let teks = `✳️ Cannot add @${jid.split('@')[0]} because they only allow contacts to add them.`;
            await conn.sendMessage(from, { text: teks, mentions: [jid] }, { quoted: mek });

            // Agar chaho to auto invite bhej do
            // await conn.sendGroupV4Invite(from, jid, invite_code, invite_code_exp, groupMetadata.subject, 'Invitation to join group', jpegThumbnail)
        }

        if (users.length > 0) {
            await conn.sendMessage(from, {
                text: `✅ Added: ${users.map(u => "@" + u.split("@")[0]).join(", ")}`,
                mentions: users
            }, { quoted: mek });
        }

    } catch (e) {
        console.error("Add command error:", e);
        reply("❌ Failed to add user(s).");
    }
});
