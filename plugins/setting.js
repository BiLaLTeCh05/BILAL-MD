const { cmd } = require('../command');
const fs = require('fs');

function readJsonSafe(path, fallback) {
  try {
    const txt = fs.readFileSync(path, 'utf8');
    return JSON.parse(txt);
  } catch (_) {
    return fallback;
  }
}

cmd({
  pattern: "setting",
  desc: "Show bot & group settings",
  category: "owner",
  react: "⚙️",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    if (!mek.key.fromMe) return reply("❌ Only bot owner can use this command!");

    const isGroup = from.endsWith('@g.us');
    const dataDir = './data';

    const mode = readJsonSafe(`${dataDir}/messageCount.json`, { isPublic: true });
    const autoStatus = readJsonSafe(`${dataDir}/autoStatus.json`, { enabled: false });
    const autoread = readJsonSafe(`${dataDir}/autoread.json`, { enabled: false });
    const autotyping = readJsonSafe(`${dataDir}/autotyping.json`, { enabled: false });
    const pmblocker = readJsonSafe(`${dataDir}/pmblocker.json`, { enabled: false });
    const anticall = readJsonSafe(`${dataDir}/anticall.json`, { enabled: false });
    const userGroupData = readJsonSafe(`${dataDir}/userGroupData.json`, {
      antilink: {}, antibadword: {}, welcome: {}, goodbye: {}, chatbot: {}, antitag: {}
    });
    const autoReaction = Boolean(userGroupData.autoReaction);

    const groupId = isGroup ? from : null;
    const antilinkOn = groupId ? Boolean(userGroupData.antilink && userGroupData.antilink[groupId]) : false;
    const antibadwordOn = groupId ? Boolean(userGroupData.antibadword && userGroupData.antibadword[groupId]) : false;
    const welcomeOn = groupId ? Boolean(userGroupData.welcome && userGroupData.welcome[groupId]) : false;
    const goodbyeOn = groupId ? Boolean(userGroupData.goodbye && userGroupData.goodbye[groupId]) : false;
    const chatbotOn = groupId ? Boolean(userGroupData.chatbot && userGroupData.chatbot[groupId]) : false;
    const antitagCfg = groupId ? (userGroupData.antitag && userGroupData.antitag[groupId]) : null;

    const lines = [];
    lines.push('*🤖 BOT SETTINGS*');
    lines.push('');
    lines.push(`• Mode: ${mode.isPublic ? '🌍 Public' : '🔒 Private'}`);
    lines.push(`• Auto Status: ${autoStatus.enabled ? 'ON ✅' : 'OFF ❌'}`);
    lines.push(`• Autoread: ${autoread.enabled ? 'ON ✅' : 'OFF ❌'}`);
    lines.push(`• Autotyping: ${autotyping.enabled ? 'ON ✅' : 'OFF ❌'}`);
    lines.push(`• PM Blocker: ${pmblocker.enabled ? 'ON ✅' : 'OFF ❌'}`);
    lines.push(`• Anticall: ${anticall.enabled ? 'ON ✅' : 'OFF ❌'}`);
    lines.push(`• Auto Reaction: ${autoReaction ? 'ON ✅' : 'OFF ❌'}`);

    if (groupId) {
      lines.push('');
      lines.push(`*📌 Group ID:* ${groupId}`);
      if (antilinkOn) {
        const al = userGroupData.antilink[groupId];
        lines.push(`• Antilink: ON (action: ${al.action || 'delete'})`);
      } else {
        lines.push('• Antilink: OFF');
      }
      if (antibadwordOn) {
        const ab = userGroupData.antibadword[groupId];
        lines.push(`• Antibadword: ON (action: ${ab.action || 'delete'})`);
      } else {
        lines.push('• Antibadword: OFF');
      }
      lines.push(`• Welcome: ${welcomeOn ? 'ON ✅' : 'OFF ❌'}`);
      lines.push(`• Goodbye: ${goodbyeOn ? 'ON ✅' : 'OFF ❌'}`);
      lines.push(`• Chatbot: ${chatbotOn ? 'ON ✅' : 'OFF ❌'}`);
      if (antitagCfg && antitagCfg.enabled) {
        lines.push(`• Antitag: ON (action: ${antitagCfg.action || 'delete'})`);
      } else {
        lines.push('• Antitag: OFF');
      }
    } else {
      lines.push('');
      lines.push('ℹ️ Use this command inside a group to see group-specific settings.');
    }

    await conn.sendMessage(from, { text: lines.join('\n') }, { quoted: mek });

  } catch (err) {
    console.error("Settings command error:", err);
    reply("⚠️ Failed to read settings.");
  }
});
