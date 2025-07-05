import config from '../../config.cjs';

const repo = async (m, sock) => {
  const prefix = config.PREFIX || '.';
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  if (cmd !== 'repo') return; // popkid

  try {
    await m.React('🔰');

    const owner = config.OWNER_NAME || 'BILAL';
    const githubRepo = 'https://github.com/BiLaLTeCh05/BILAL-MD';
    const imageUrl = 'https://files.catbox.moe/kunzpz.png'; 

    const repoText = `
╭───────────────⭓
│  *👑 BILAL-MD 👑*
╰───────────────⭓
┌───────────◇
│ 👑| *REPO:❯* ${githubRepo}
│ 👑| *OWNER:❯* BILAL
│ 👑| *FORK THE REPO*
│ 👑| *STAR THE REPO*

*👑 THANKS FOR CHOOSING 👑*
      *👑 BILAL-MD 👑*
`.trim();

    // 🖼️ popkid images
    await sock.sendMessage(m.from, {
      image: { url: imageUrl },
      caption: repoText,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "BILAL-MD",
          newsletterJid: "120363420342566562@newsletter"
        }
      }
    }, { quoted: m });

    // 🎵 Random song
    const songUrls = [
      'https://files.catbox.moe/2b33jv.mp3',
      'https://files.catbox.moe/0cbqfa.mp3',
      'https://files.catbox.moe/j4ids2.mp3',
      'https://files.catbox.moe/vv2qla.mp3'
    ];
    const randomSong = songUrls[Math.floor(Math.random() * songUrls.length)];

    // 🎧 music to the world
    await sock.sendMessage(m.from, {
      audio: { url: randomSong },
      mimetype: 'audio/mpeg',
      ptt: false,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "Popkid-Gle",
          newsletterJid: "120363420342566562@newsletter"
        }
      }
    }, { quoted: m });

  } catch (err) {
    console.error('*👑 BILAL-MD ERROR 👑*', err);
    await m.reply('*👑 BILAL-MD ERROR 👑*');
  }
};

export default repo;
