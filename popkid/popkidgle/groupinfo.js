import config from "../../config.cjs";

const groupInfo = async (message, sock) => {
    const prefix = config.PREFIX;
    const command = message.body.startsWith(prefix)
        ? message.body.slice(prefix.length).split(" ")[0].toLowerCase()
        : "";

    if (command !== "groupinfo") return;

    const chatId = message.key.remoteJid;
    const isGroup = chatId.endsWith("@g.us");
    if (!isGroup) return message.reply("*This command only works in group chats!*");

    try {
        const metadata = await sock.groupMetadata(chatId);
        const admins = metadata.participants.filter(p => p.admin);
        const creatorJid = metadata.owner || null;
        const creatorTag = creatorJid ? `@${creatorJid.split("@")[0]}` : "Unknown";
        const description = metadata.desc || "No description set.";
        const creationDate = new Date(metadata.creation * 1000).toLocaleString();

        const infoText = `
╭─⟪  *𝐁𝐈𝐋𝐀𝐋 𝐗𝐌𝐃 𝐌𝐀𝐊𝐄𝐒*  ⟫─╮
│
│ 🛰️ *Name:* _${metadata.subject}_
│ 🆔 *ID:* _${metadata.id}_
│ 👥 *Members:* _${metadata.participants.length}_
│ 🛡️ *Admins:* _${admins.length}_
│ 👑 *Creator:* _${creatorTag}_
│ 🕐 *Created:* _${creationDate}_
│
╰────────────────────────╯

🧾 *Description:*
_${description}_

──────〔 ⚡ 𝐗𝐌𝐃 𝐁𝐎𝐓 ⚡ 〕──────
`.trim();

        await sock.sendMessage(chatId, {
            text: infoText,
            mentions: creatorJid ? [creatorJid] : []
        }, { quoted: message });

    } catch (error) {
        console.error(`Group Info Error in ${chatId}:`, error);
        return message.reply("*Something went wrong while fetching group info. Please try again later!*");
    }
};

export default groupInfo;
