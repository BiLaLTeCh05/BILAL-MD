const { cmd } = require("../command");
const axios = require('axios');
const fs = require('fs');
const path = require("path");
const AdmZip = require("adm-zip");
const { setCommitHash, getCommitHash } = require('../data/updateDB');
const { anony } = require('../lib/terri');

cmd({
    pattern: "update",
    alias: ["upgrade", "sync"],
    react: '🆕',
    desc: "Update the bot to the latest version.",
    category: "misc",
    filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
    if (!isOwner) return reply("❌ This command is only for the bot owner.");

    try {
        // Newsletter configuration
        const newsletterConfig = {
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363397100406773@newsletter',
                    newsletterName: 'VERONICA 𝐔𝐏𝐃𝐀𝐓𝐄𝐒',
                    serverMessageId: 143
                }
            }
        };

        // Fetch the latest commit hash from GitHub
        const { data: commitData } = await axios.get("https://api.github.com/repos/Terrizev/VERONICA-AI/commits/main", {
            headers: {
                'User-Agent': 'VERONICA-AI'
            }
        });
        const latestCommitHash = commitData.sha;
        const currentHash = await getCommitHash();

        if (latestCommitHash === currentHash) {
            return await conn.sendMessage(from, {
                text: "BILAL-MD is already up-to-date!*",
                ...newsletterConfig
            }, { quoted: anony });
        }

        // Download the latest code
        const zipPath = path.join(__dirname, "../latest.zip");
        const { data: zipData } = await axios.get("https://github.com/Terrizev/VERONICA-AI/archive/main.zip", { 
            responseType: "arraybuffer",
            headers: {
                'User-Agent': 'VERONICA-AI'
            },
            timeout: 60000
        });
        fs.writeFileSync(zipPath, zipData);

        // Extract ZIP file
        const extractPath = path.join(__dirname, '../latest');
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractPath, true);

        // Copy updated files
        const sourcePath = path.join(extractPath, "VERONICA-AI-main");
        const destinationPath = path.join(__dirname, '..');
        
        if (fs.existsSync(sourcePath)) {
            copyFolderSync(sourcePath, destinationPath);
        } else {
            throw new Error("Extracted folder not found");
        }

        // Save the latest commit hash
        await setCommitHash(latestCommitHash);

        // Cleanup
        if (fs.existsSync(zipPath)) {
            fs.unlinkSync(zipPath);
        }
        if (fs.existsSync(extractPath)) {
            fs.rmSync(extractPath, { recursive: true, force: true });
        }

        // Send progress messages
        const progressMessages = [
            "🔄 Installing updates: [▒▒▒▒▒▒▒▒] 0%",
            "🔄 Installing updates: [████▒▒▒▒] 40%",
            "🔄 Installing updates: [██████▒▒] 70%",
            "🔄 Installing updates: [████████] 100%"
        ];
        
        for (const progress of progressMessages) {
            await conn.sendMessage(from, {
                text: progress,
                ...newsletterConfig
            }, { quoted: anony });
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Final success message with image
        await conn.sendMessage(from, {
            image: { 
                url: "https://files.catbox.moe/ue0vkz.jpg"
            },
            caption: "✅ *Update complete!*\n\n_Restarting the bot to apply changes..._\n\n⚡ Powered by Terri",
            ...newsletterConfig
        }, { quoted: mek });

        // Restart the bot after a short delay
        setTimeout(() => {
            process.exit(0);
        }, 3000);

    } catch (error) {
        console.error("Update error:", error);
        await conn.sendMessage(from, {
            text: `❌ *Update failed!*\n\nError: ${error.message}\n\nPlease try manually or contact support.`,
            ...newsletterConfig
        }, { quoted: anony });
    }
});

// Improved directory copy function
function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    const items = fs.readdirSync(source);
    for (const item of items) {
        const srcPath = path.join(source, item);
        const destPath = path.join(target, item);

        // Skip sensitive files and directories
        const preservedItems = ["config.js", "app.json", "credentials.json", "data", "sessions", "node_modules", ".git"];
        if (preservedItems.includes(item)) {
            console.log(`⚠️ Preserving existing: ${item}`);
            continue;
        }

        try {
            const stat = fs.lstatSync(srcPath);
            if (stat.isDirectory()) {
                copyFolderSync(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        } catch (copyError) {
            console.error(`Failed to copy ${item}:`, copyError);
        }
    }
}

cmd({
    pattern: "checkupdate",
    alias: ["checkupgrade", "updatecheck"],
    react: '🔍',
    desc: "Check if there are any updates available for the bot.",
    category: "misc",
    filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
    if (!isOwner) return reply("❌ This command is only for the bot owner.");

    try {
        // Newsletter configuration
        const newsletterConfig = {
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363397100406773@newsletter',
                    newsletterName: 'BILAL-MD UPDATE',
                    serverMessageId: 143
                }
            }
        };

        // Initial check message
        await conn.sendMessage(from, {
            text: "🔍 *Checking for BILAL-MD updates...*",
            ...newsletterConfig
        }, { quoted: mek });

        // Fetch the latest commit info from GitHub
        const { data: commitData } = await axios.get("https://api.github.com/repos/Terrizev/VERONICA-AI/commits/main", {
            headers: {
                'User-Agent': 'VERONICA-AI'
            },
            timeout: 10000
        });
        
        const latestCommitHash = commitData.sha;
        const latestCommitMessage = commitData.commit.message;
        const commitDate = new Date(commitData.commit.committer.date).toLocaleString();
        const author = commitData.commit.author.name;
        
        const currentHash = await getCommitHash();

        if (latestCommitHash === currentHash) {
            return await conn.sendMessage(from, {
                text: `✅ *VERONICA is up-to-date!*\n\n*Current Version:* \`${currentHash.substring(0, 7)}\`\n*Last Commit:* ${latestCommitMessage}\n*Date:* ${commitDate}\n*Author:* ${author}`,
                ...newsletterConfig
            }, { quoted: anony });
        }

        // Get commit comparison to show what's new
        let changelog = "";
        try {
            const { data: compareData } = await axios.get(`https://api.github.com/repos/Terrizev/VERONICA-AI/compare/${currentHash}...${latestCommitHash}`, {
                headers: {
                    'User-Agent': 'VERONICA-AI'
                },
                timeout: 10000
            });
            
            if (compareData.commits && compareData.commits.length > 0) {
                changelog = "\n\n*What's New:*\n";
                compareData.commits.slice(0, 5).forEach(commit => {
                    changelog += `• ${commit.commit.message.split('\n')[0]}\n`;
                });
                
                if (compareData.commits.length > 5) {
                    changelog += `• ...and ${compareData.commits.length - 5} more changes\n`;
                }
            }
        } catch (error) {
            console.log("Could not fetch detailed changelog:", error.message);
        }

        // Update available message
        await conn.sendMessage(from, {
            text: `🆕 *Update Available!*\n\n*Current Version:* \`${currentHash ? currentHash.substring(0, 7) : "Unknown"}\`\n*Latest Version:* \`${latestCommitHash.substring(0, 7)}\`\n*Last Commit:* ${latestCommitMessage}\n*Date:* ${commitDate}\n*Author:* ${author}${changelog}\n\nUse *.update* to install the latest version.`,
            ...newsletterConfig
        }, { quoted: anony });

    } catch (error) {
        console.error("Update check error:", error);
        await conn.sendMessage(from, {
            text: `❌ *Failed to check for updates!*\n\nError: ${error.message}\n\nPlease try again later.`,
            ...newsletterConfig
        }, { quoted: mek });
    }
});
