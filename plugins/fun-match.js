const { cmd } = require("../command");

// Command for random boy selection
cmd({
  pattern: "bacha",
  alias: ["boy", "man"],
  desc: "Randomly selects a boy from the group",
  react: "👦",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👦 *නොබෙන කොල්ලෙක්!* \n\n@${randomUser.id.split('@')[0]} is your handsome boy! 😎`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bacha command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});

// Command for random girl selection
cmd({
  pattern: "bachi",
  alias: ["girl", "කෙල්ල", "single"],
  desc: "Randomly selects a girl from the group",
  react: "👧",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    const participants = groupMetadata.participants;
    
    // Filter out bot and get random participant
    const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
    
    if (eligible.length < 1) return reply("❌ No eligible participants found!");

    const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
    
    await conn.sendMessage(
      mek.chat,
      { 
        text: `👧 *ඔන්න ඔයාගෙ ගෑනු ලමයා🌝!* \n\n@${randomUser.id.split('@')[0]} is your beautiful girl! 💖`, 
        mentions: [randomUser.id] 
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("Error in .bachi command:", error);
    reply(`❌ Error: ${error.message}`);
  }
});
