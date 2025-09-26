const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");

// ================================
// 📦 MERGED terri.js (quoted message)
// ================================
const config = require("../config") || {};
const ownerNumber = (config.ownerNumber || config.OWNER_NUMBER || "923000000000").toString();
const ownerName = (config.OWNER_NAME || "BILAL-MD").toString();
const waid = ownerNumber.replace(/\D/g, "");

const anony = {
  key: { remoteJid: "status@broadcast", participant: `${waid}@s.whatsapp.net` },
  message: {
    contactMessage: {
      displayName: ownerName,
      vcard: [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${ownerName}`,
        `ORG:${ownerName}`,
        `TEL;type=CELL;type=VOICE;waid=${waid}:+${waid}`,
        "END:VCARD",
      ].join("\n"),
    },
  },
};

// ================================
// 📦 MERGED updateDB.js (commit hash DB)
// ================================
const dbPath = path.join(__dirname, "../data/commit.json");

function getCommitHash() {
  try {
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, "utf-8");
      const json = JSON.parse(raw);
      return json.commit || null;
    }
  } catch (err) {
    console.error("❌ Error reading commit hash:", err);
  }
  return null;
}

function setCommitHash(hash) {
  try {
    const json = { commit: hash };
    fs.writeFileSync(dbPath, JSON.stringify(json, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("❌ Error writing commit hash:", err);
    return false;
  }
}

// ================================
// 🔄 UPDATE COMMAND
// ================================
cmd({
  pattern: "update",
  alias: ["upgrade", "sync"],
  react: "🆕",
  desc: "Update the bot to the latest version.",
  category: "misc",
  filename: __filename,
}, async (conn, mek, m, { from, reply, isOwner }) => {
  if (!isOwner) return reply("❌ This command is only for the bot owner.");

  try {
    const newsletterConfig = {
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363397100406773@newsletter",
          newsletterName: "BILAL-MD UPDATES",
          serverMessageId: 143,
        },
      },
    };

    // fetch latest commit
    const { data: commitData } = await axios.get(
      "https://api.github.com/repos/BilalTech05/BILAL-MD/commits/main",
      { headers: { "User-Agent": "BILAL-MD" } }
    );
    const latestCommitHash = commitData.sha;
    const currentHash = getCommitHash();

    if (latestCommitHash === currentHash) {
      return await conn.sendMessage(from, { text: "*✅ Already up-to-date!*", ...newsletterConfig }, { quoted: anony });
    }

    // download zip
    const zipPath = path.join(__dirname, "../latest.zip");
    const { data: zipData } = await axios.get(
      "https://github.com/BilalTech05/BILAL-MD/archive/main.zip",
      { responseType: "arraybuffer", timeout: 60000 }
    );
    fs.writeFileSync(zipPath, zipData);

    // extract
    const extractPath = path.join(__dirname, "../latest");
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);

    // copy files
    const sourcePath = path.join(extractPath, "BILAL-MD-main");
    const destinationPath = path.join(__dirname, "..");
    if (fs.existsSync(sourcePath)) copyFolderSync(sourcePath, destinationPath);
    else throw new Error("Extracted folder not found!");

    // save + cleanup
    setCommitHash(latestCommitHash);
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    if (fs.existsSync(extractPath)) fs.rmSync(extractPath, { recursive: true, force: true });

    // progress msgs
    const progressMessages = [
      "🔄 Installing updates: [▒▒▒▒▒▒▒▒] 0%",
      "🔄 Installing updates: [████▒▒▒▒] 40%",
      "🔄 Installing updates: [██████▒▒] 70%",
      "🔄 Installing updates: [████████] 100%",
    ];
    for (const progress of progressMessages) {
      await conn.sendMessage(from, { text: progress, ...newsletterConfig }, { quoted: anony });
      await new Promise((r) => setTimeout(r, 1000));
    }

    // done
    await conn.sendMessage(
      from,
      {
        image: { url: "https://files.catbox.moe/ue0vkz.jpg" },
        caption: "✅ *Update complete!*\n\n_Restarting bot..._",
        ...newsletterConfig,
      },
      { quoted: mek }
    );

    setTimeout(() => process.exit(0), 3000);
  } catch (err) {
    console.error("Update error:", err);
    await conn.sendMessage(from, { text: `❌ Update failed!\n\n${err.message}` }, { quoted: anony });
  }
});

// ================================
// 🔍 CHECKUPDATE COMMAND
// ================================
cmd({
  pattern: "checkupdate",
  alias: ["checkupgrade", "updatecheck"],
  react: "🔍",
  desc: "Check if updates are available for BILAL-MD.",
  category: "misc",
  filename: __filename,
}, async (conn, mek, m, { from, reply, isOwner }) => {
  if (!isOwner) return reply("❌ This command is only for the bot owner.");

  try {
    const newsletterConfig = {
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363397100406773@newsletter",
          newsletterName: "BILAL-MD UPDATES",
          serverMessageId: 143,
        },
      },
    };

    await conn.sendMessage(from, { text: "🔍 *Checking for updates...*", ...newsletterConfig }, { quoted: mek });

    const { data: commitData } = await axios.get(
      "https://api.github.com/repos/BilalTech05/BILAL-MD/commits/main",
      { headers: { "User-Agent": "BILAL-MD" }, timeout: 10000 }
    );

    const latestCommitHash = commitData.sha;
    const latestCommitMessage = commitData.commit.message;
    const commitDate = new Date(commitData.commit.committer.date).toLocaleString();
    const author = commitData.commit.author.name;

    const currentHash = getCommitHash();

    if (latestCommitHash === currentHash) {
      return await conn.sendMessage(
        from,
        {
          text: `✅ *Up-to-date!*\n\n*Current:* \`${currentHash.substring(0, 7)}\`\n*Commit:* ${latestCommitMessage}\n*Date:* ${commitDate}\n*Author:* ${author}`,
          ...newsletterConfig,
        },
        { quoted: anony }
      );
    }

    // changelog
    let changelog = "";
    try {
      const { data: compareData } = await axios.get(
        `https://api.github.com/repos/BilalTech05/BILAL-MD/compare/${currentHash}...${latestCommitHash}`,
        { headers: { "User-Agent": "BILAL-MD" }, timeout: 10000 }
      );
      if (compareData.commits?.length > 0) {
        changelog = "\n\n*What's New:*\n";
        compareData.commits.slice(0, 5).forEach((c) => (changelog += `• ${c.commit.message.split("\n")[0]}\n`));
        if (compareData.commits.length > 5) changelog += `• ...and ${compareData.commits.length - 5} more changes\n`;
      }
    } catch (err) {
      console.log("⚠️ changelog fetch fail:", err.message);
    }

    await conn.sendMessage(
      from,
      {
        text: `🆕 *Update Available!*\n\n*Current:* \`${currentHash ? currentHash.substring(0, 7) : "Unknown"}\`\n*Latest:* \`${latestCommitHash.substring(0, 7)}\`\n*Commit:* ${latestCommitMessage}\n*Date:* ${commitDate}\n*Author:* ${author}${changelog}\n\nUse *.update* to install.`,
        ...newsletterConfig,
      },
      { quoted: anony }
    );
  } catch (err) {
    console.error("Checkupdate error:", err);
    await conn.sendMessage(from, { text: `❌ Failed!\n\n${err.message}` }, { quoted: anony });
  }
});

// ================================
// 📂 COPY FOLDER FUNCTION
// ================================
function copyFolderSync(source, target) {
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
  const items = fs.readdirSync(source);

  for (const item of items) {
    const srcPath = path.join(source, item);
    const destPath = path.join(target, item);

    const preserved = ["config.js", "app.json", "credentials.json", "data", "sessions", "node_modules", ".git"];
    if (preserved.includes(item)) {
      console.log(`⚠️ Preserving: ${item}`);
      continue;
    }

    const stat = fs.lstatSync(srcPath);
    if (stat.isDirectory()) copyFolderSync(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}
