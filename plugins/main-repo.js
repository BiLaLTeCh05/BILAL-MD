const axios = require("axios");
const config = require("../config");
const { cmd } = require("../command");

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch GitHub repository information",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = "https://github.com/BilalTech05/BILAL-MD";
    const channelLink = "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G";

    try {
        const cleanUrl = githubRepoURL.replace(/\/+$/, "");
        const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return reply("⚠️ Invalid GitHub repo URL set in code!");

        const [, username, repoName] = match;
        const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);
        const repoData = response.data;

        // Caption style
        const style = `📦 *Repository*: ${repoData.name}
👑 *Owner*: ${repoData.owner.login}
⭐ *Stars*: ${repoData.stargazers_count}
🍴 *Forks*: ${repoData.forks_count}
🛠 *Issues*: ${repoData.open_issues_count}
🔗 *URL*: ${repoData.html_url}
📝 *Description*: ${repoData.description || 'No description'}

> ${config.DESCRIPTION}`;

        // ✅ Send image with buttons
        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || "https://files.catbox.moe/kunzpz.png" },
            caption: style,
            footer: "👑 BILAL-MD BOT 👑",
            templateButtons: [
                { index: 1, urlButton: { displayText: "🔗 Open Repo", url: repoData.html_url } },
                { index: 2, quickReplyButton: { displayText: `⭐ Stars (${repoData.stargazers_count})`, id: "stars_info" } },
                { index: 3, quickReplyButton: { displayText: `🍴 Forks (${repoData.forks_count})`, id: "forks_info" } },
                { index: 4, urlButton: { displayText: "📢 Join Channel", url: channelLink } }
            ]
        }, { quoted: mek });

        // ✅ Optional: Send audio jingle
        await conn.sendMessage(from, {
            audio: { url: "https://files.catbox.moe/kfsn0s.mp3" },
            mimetype: "audio/mp4",
            ptt: true
        }, { quoted: mek });

    } catch (error) {
        console.error("Repo command error:", error);
        reply(`❌ Error: ${error.message}`);
    }
});
