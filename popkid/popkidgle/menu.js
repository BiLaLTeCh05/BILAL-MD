import config from '../../config.cjs';

const menu = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "menu") {
    const start = new Date().getTime();
    await m.React('🪆');
    const end = new Date().getTime();
    const responseTime = (end - start) / 1000;

    let profilePictureUrl = 'https://files.catbox.moe/kiy0hl.jpg'; // Default image URL
    try {
      const pp = await sock.profilePictureUrl(m.sender, 'image');
      if (pp) {
        profilePictureUrl = pp;
      }
    } catch (error) {
      console.error("Failed to fetch profile picture:", error);
      // Use the default image if fetching fails
    }

    const menuText = `
═══════════════════════
> 🌟  *𝐁𝐈𝐋𝐀𝐋 𝗠𝗗 𝗕𝗢𝗧* 🌟
> *Version*: 7.1.0 |
> *DEVELOPED BY 𝐁𝐈𝐋𝐀𝐋🪆*
> *ULTRA SPEED ⚡ ⚡
═══════════════════════

_✨ *𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗠𝗘𝗡𝗨* ✨_
> *Explore the commands below to harness the bot's full power!*

═══════════════════════
   🌍  *𝗦𝗬𝗦𝗧𝗘𝗠 𝗠𝗘𝗡𝗨* 🌍
═══════════════════════
| ⚡ | ${prefix}menu
| 🟢 | ${prefix}alive
| 🛠️ | ${prefix}owner
| 🍔 | ${prefix}menu
═══════════════════════

═══════════════════════
   👑  *𝗢𝗪𝗡𝗘𝗥 𝗣𝗔𝗚𝗘* 👑
═══════════════════════
| 🎮 | ${prefix}join
| 🚪 | ${prefix}leave
| 🩷 | ${prefix}autobio
| 🔒 | ${prefix}block
| 🧋 | ${prefix}autolikestatus
| 🔓 | ${prefix}unblock
| 🤖 | ${prefix}setppbot
| 🚫 | ${prefix}anticall
| 🛑 | ${prefix}setstatus
| 📝 | ${prefix}setnamebot
═══════════════════════

═══════════════════════
  🤖  *𝗚𝗣𝗧 𝗠𝗘𝗡𝗨* 🤖
═══════════════════════
| 💬 | ${prefix}ai
| 🐞 | ${prefix}bug
| 📝 | ${prefix}report
| 🚪 | ${prefix}chatbot
| 🧠 | ${prefix}gpt
| 🎨 | ${prefix}dalle
═══════════════════════

═══════════════════════
  📦  *𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗘𝗥 𝗣𝗔𝗚𝗘* 📦
═══════════════════════
| 🎶 | ${prefix}attp
| 🎬 | ${prefix}gimage
| 🎧 | ${prefix}play
| 📹 | ${prefix}video
═══════════════════════

═══════════════════════
   🔍  *𝗦𝗘𝗔𝗥𝗖𝗛 𝗠𝗘𝗡𝗨* 🔍
═══════════════════════
| 🔎 | ${prefix}google
| 📽️ | ${prefix}mediafire
| 🚪 | ${prefix}facebook
| ❤️ | ${prefix}instagram
| 🚪 | ${prefix}tiktok
| 🎶 | ${prefix}lyrics
| 🎬 | ${prefix}imdb
═══════════════════════

═══════════════════════
   🔍  *𝗙𝗨𝗡 𝗠𝗘𝗡𝗨* 🔍
═══════════════════════
| 🔎 | ${prefix}getpp
| 📽️ | ${prefix}url
═══════════════════════


🔧 *Wᴇʟᴄᴏᴍᴇ ᴛᴏ ᴛʜᴇ ᴍᴇɴᴜ!*
*ᴡᴀɪᴛ ғᴏʀ ᴍᴏʀᴇ ᴄᴏᴍᴍᴀɴᴅs...*

📢 *𝐁𝐈𝐋𝐀𝐋 𝐌𝐃*

`;

    await sock.sendMessage(m.from, {
      image: { url: profilePictureUrl },
      caption: menuText.trim(),
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "bilal-Xmd",
          newsletterJid: "120363290715861418@newsletter",
        },
      }
    }, { quoted: m });
  }
};

export default menu;
