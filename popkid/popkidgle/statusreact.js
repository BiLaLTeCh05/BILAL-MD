let autoReactEnabled = false; // In-memory state for auto-reaction
const reactionEmojis = ["🩵", "👍", "💯", "🔥", "🎉", "😊", "😂", "😍", "🙌", "👏",
                          "🌟", "✨", "💫", "💖", "🤩", "😎", "🥳", "😇", "🙏", "☕"]; // 20 emojis
let currentEmojiIndex = 0;

const autoStatusReactCommand = async (m, sock) => {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    if (cmd === "autostatusreact") {
        autoReactEnabled = !autoReactEnabled;
        const status = autoReactEnabled ? "*enabled*" : "*disabled*";
        const response = `Auto status reaction is now ${status}`;
        await sock.sendMessage(m.from, { text: response }, { quoted: m });
    }
};

const handleStatusUpdate = async (zk, update) => {
    if (autoReactEnabled && update.broadcast === 'status' && update.messages) {
        const status = update.messages[0]; // Assuming only one status update per event
        const message = status; // Rename for clarity

        try {
            const adams = zk.user && zk.user.id ? zk.user.id.split(":")[0] + "@s.whatsapp.net" : null;
            const statusJid = message.key.participant || message.key.remoteJid; // Get JID of the status poster

            if (statusJid) {
                const jidsToReact = [statusJid];
                if (adams) {
                    jidsToReact.push(adams);
                }

                // React to the status with a cycling emoji
                const emojiToUse = reactionEmojis[currentEmojiIndex % reactionEmojis.length];
                currentEmojiIndex++; // Move to the next emoji for the next reaction

                for (const jid of jidsToReact) {
                    await zk.sendMessage(jid, {
                        react: {
                            key: message.key,
                            text: emojiToUse,
                        },
                    });
                    await new Promise(resolve => setTimeout(resolve, 2000)); // 2-second delay
                }
            }
        } catch (error) {
            console.error("Error reacting to status:", error);
        }
    }
};

export { autoStatusReactCommand, handleStatusUpdate };
