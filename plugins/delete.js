const { cmd } = require('../command');
const isAdmin = require('../lib/isAdmin');
const store = require('../lib/lightweight_store');

cmd({
  pattern: "delete",
  alias: ["delmsg", "del"],
  desc: "Delete recent messages of a user (admin only)",
  category: "group",
  react: "🗑️",
  filename: __filename
}, 
async (conn, mek, m, { from, reply, sender }) => {
  try {
    const { isSenderAdmin, isBotAdmin } = await isAdmin(conn, from, sender);

    if (!isBotAdmin) return reply("⚠️ I need to be *Admin* to delete messages.");
    if (!isSenderAdmin) return reply("⚠️ Only *Group Admins* can use this command.");

    // Extract text (for count)
    const text = m.body || "";
    const parts = text.trim().split(/\s+/);
    let count = 1;
    if (parts.length > 1) {
      const maybeNum = parseInt(parts[1], 10);
      if (!isNaN(maybeNum) && maybeNum > 0) count = Math.min(maybeNum, 50);
    }

    // Get target user (reply or mention)
    const ctxInfo = mek.message?.extendedTextMessage?.contextInfo || {};
    const mentioned = Array.isArray(ctxInfo.mentionedJid) && ctxInfo.mentionedJid.length > 0 ? ctxInfo.mentionedJid[0] : null;
    const repliedParticipant = ctxInfo.participant || null;

    let targetUser = null;
    let repliedMsgId = null;
    if (repliedParticipant && ctxInfo.stanzaId) {
      targetUser = repliedParticipant;
      repliedMsgId = ctxInfo.stanzaId;
    } else if (mentioned) {
      targetUser = mentioned;
    } else {
      return reply("⚠️ Please reply to a message or mention a user.");
    }

    // Collect messages from store
    const chatMessages = Array.isArray(store.messages[from]) ? store.messages[from] : [];
    const toDelete = [];
    const seenIds = new Set();

    if (repliedMsgId) {
      const repliedInStore = chatMessages.find(
        msg => msg.key.id === repliedMsgId && (msg.key.participant || msg.key.remoteJid) === targetUser
      );
      if (repliedInStore) {
        toDelete.push(repliedInStore);
        seenIds.add(repliedInStore.key.id);
        count = Math.max(0, count - 1);
      }
    }

    for (let i = chatMessages.length - 1; i >= 0 && toDelete.length < count; i--) {
      const msg = chatMessages[i];
      const participant = msg.key.participant || msg.key.remoteJid;
      if (participant === targetUser && !seenIds.has(msg.key.id)) {
        if (!msg.message?.protocolMessage) {
          toDelete.push(msg);
          seenIds.add(msg.key.id);
        }
      }
    }

    if (toDelete.length === 0) return reply("⚠️ No recent messages found for that user.");

    // Delete messages
    for (const msg of toDelete) {
      try {
        await conn.sendMessage(from, {
          delete: {
            remoteJid: from,
            fromMe: false,
            id: msg.key.id,
            participant: msg.key.participant || targetUser
          }
        });
        await new Promise(r => setTimeout(r, 300));
      } catch {}
    }

    await conn.sendMessage(from, { 
      text: `🗑️ Deleted ${toDelete.length} message(s) from @${(targetUser||'').split('@')[0]}`, 
      mentions: [targetUser] 
    }, { quoted: mek });

  } catch (err) {
    console.error("Delete command error:", err);
    reply("❌ Failed to delete messages.");
  }
});
