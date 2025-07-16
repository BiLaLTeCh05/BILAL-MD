import config from '../../config.cjs';
import fetch from 'node-fetch'; // Ensure you have this installed

const repo = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "repo") {
    await m.React('💎'); // A gem for a precious repo!
    const repoUrl = 'https://github.com/Popkiddevs/POPKID-XTECH';
    const imageUrl = 'https://files.catbox.moe/kiy0hl.jpg'; // ❗ REPLACE WITH YOUR ACTUAL IMAGE URL

    try {
      const apiUrl = `https://api.github.com/repos/Popkiddevs/POPKID-XTECH`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.forks_count !== undefined && data.stargazers_count !== undefined) {
        const stylishMessage = {
          image: { url: imageUrl },
          caption: `
╔════ 💎✨ *POPKID XTECH* ✨💎 ═════╗
║                                     
║  ║ 🚀 *Explore the Innovation Hub!* ║
║                                     
║ 🔗 *Repository:* ${repoUrl}        
║                                    
║     📊 *Project Stats:* 
║     🍴    Forks: \`${data.forks_count}\`       
║     ⭐ Stars: \`${data.stargazers_count}\`       
║                                     
║   🤝 *Join the Community!* 
║   Contribute & Shape the Future!    
║                                     
╚═════════════════════════════╝
💖 *𝐩𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐩𝐨𝐩𝐤𝐢𝐝* 💖
`.trim(),
        };

        sock.sendMessage(m.from, stylishMessage, { quoted: m });
      } else {
        sock.sendMessage(m.from, { text: '⚠️ Could not retrieve full repo details. Please try again later. 🥺', quoted: m });
      }
    } catch (error) {
      console.error("Error fetching repo info:", error);
      sock.sendMessage(m.from, { text: '🚨 Error encountered while fetching repo data. 😢', quoted: m });
    } finally {
      await m.React('✅');
    }
  }
};

export default repo;
