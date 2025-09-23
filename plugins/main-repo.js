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

    try {
        // Remove trailing slash if any
        const cleanUrl = githubRepoURL.replace(/\/+$/, "");
        const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return reply("⚠️ Invalid GitHub repo URL set in code!");

        const [, username, repoName] = match;

        const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);
        const repoData = response.data;

        // Random style
        const style = `📦 *Repository*: ${repoData.name}
👑 *Owner*: ${repoData.owner.login}
⭐ *Stars*: ${repoData.stargazers_count}
🍴 *Forks*: ${repoData.forks_count}
🔗 *URL*: ${repoData.html_url}
📝 *Description*: ${repoData.description || 'No description'}

> ${config.DESCRIPTION}`;

        // Send image + caption + buttons
        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || "https://files.catbox.moe/kunzpz.png" },
            caption: style,
            buttons: [
                { buttonId: "repo_open", buttonText: { displayText: "🔗 Open Repo" }, type: 1 },
                { buttonId: "repo_stars", buttonText: { displayText: `⭐ Stars: ${repoData.stargazers_count}` }, type: 1 },
                { buttonId: "repo_forks", buttonText: { displayText: `🍴 Forks: ${repoData.forks_count}` }, type: 1 },
            ],
            headerType: 4
        }, { quoted: mek });

        // Send audio (optional)
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
