import config from '../../config.cjs';
import axios from 'axios';

const instagram = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "ig" || cmd === "instagram" || cmd === "insta") {
    if (!text) {
      return sock.sendMessage(m.from, { text: `⚠️ *Provide an Instagram post URL.*\n\nExample: ${prefix}${cmd} https://www.instagram.com/p/example/` }, { quoted: m });
    }

    try {
      await sock.sendMessage(m.from, { react: { text: "⏳", key: m.key } });

      const { data } = await axios.get(`https://api.davidcyriltech.my.id/instagram?url=${text}`);

      if (!data.success || !data.downloadUrl) {
        await sock.sendMessage(m.from, { text: "⚠️ *Failed to fetch Instagram content. The URL might be invalid or the post might not exist.*" }, { quoted: m });
        return await sock.sendMessage(m.from, { react: { text: "❌", key: m.key } });
      }

      await sock.sendMessage(m.from, {
        video: { url: data.downloadUrl },
        mimetype: "video/mp4",
        caption: "📥 *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴏᴘᴋɪᴅ ✅*",
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: "120363290715861418@newsletter",
            newsletterName: "ᴘᴏᴘᴋɪᴅ xᴍᴅ",
            serverMessageId: 143,
          },
        },
      }, { quoted: m });

      await sock.sendMessage(m.from, { react: { text: "✅", key: m.key } });

    } catch (error) {
      console.error("Instagram Downloader Error:", error);
      await sock.sendMessage(m.from, { text: "❌ *An error occurred while processing your request. Please try again later.*" }, { quoted: m });
      await sock.sendMessage(m.from, { react: { text: "❗", key: m.key } });
    }
  }
};

export default instagram;
