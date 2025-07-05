import config from '../../config.cjs';

// ʜᴀᴄᴋᴇʀ-ꜱᴛʏʟᴇ ᴄᴏᴍᴍᴀɴᴅ ғᴏʀ ᴀɴᴛɪᴄᴀʟʟ
const anticallCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd !== 'statusreply') return;

  if (!isCreator) {
    return m.reply('🚫 *ACCESS DENIED: ONLY OWNER CAN EXECUTE THIS COMMAND!*');
  }

  try {
    let responseText;

    if (text) {
      config.STATUS_READ_MSG = text;
      responseText = `
╭━〔 ✅ 𝐒𝐓𝐀𝐓𝐔𝐒 𝐌𝐄𝐒𝐒𝐀𝐆𝐄 𝐔𝐏𝐃𝐀𝐓𝐄𝐃 〕━⬣
┃ 🧠 *New Status Message:*
┃ 💬 ${text}
┃ 👤 *Updated By:* @${m.sender.split("@")[0]}
╰━━━━━━━━━━━━━━━━━━━━⬣
`.trim();
    } else {
      responseText = `
╭━〔 ❗ 𝐔𝐒𝐀𝐆𝐄 〕━⬣
┃ ✍️ *Use:* ${prefix}setstatusmsg <message>
┃ 📌 *Example:* ${prefix}setstatusmsg I am currently busy!
╰━━━━━━━━━━━━⬣
`.trim();
    }

    await Matrix.sendMessage(m.from, {
      text: responseText,
      mentions: [m.sender],
      contextInfo: {
        forwardingScore: 777,
        isForwarded: true,
        externalAdReply: {
          title: "POPKID-XTECH - STATUS SET",
          body: "Smart Status Handler",
          thumbnailUrl: "https://i.imgur.com/vfFQ5UZ.png",
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: "https://popkid-xtech.web.app"
        }
      }
    }, { quoted: m });

  } catch (err) {
    console.error('❌ Error:', err);
    await Matrix.sendMessage(m.from, { text: '⚠️ *ERROR SETTING STATUS MESSAGE.*' }, { quoted: m });
  }
};

export default anticallCommand;
