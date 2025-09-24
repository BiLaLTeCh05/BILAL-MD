const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

cmd({
  pattern: "setpp",
  desc: "Set bot profile picture by replying to an image",
  category: "owner",
  react: "🖼️",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Sirf owner use kar sake
    if (!m.key.fromMe) {
      return reply("❌ This command is only available for the owner!");
    }

    const quoted = m.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted || !quoted.imageMessage) {
      return reply("⚠️ Please reply to an *image* with the command `.setpp`");
    }

    // TMP folder ensure karo
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    // Image download karo
    const stream = await downloadContentFromMessage(quoted.imageMessage, "image");
    let buffer = Buffer.from([]);
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

    const imagePath = path.join(tmpDir, `pp_${Date.now()}.jpg`);
    fs.writeFileSync(imagePath, buffer);

    // Profile picture update karo
    await conn.updateProfilePicture(conn.user.id, { url: imagePath });

    // Temp file cleanup
    fs.unlinkSync(imagePath);

    reply("✅ Successfully updated bot profile picture!");
  } catch (err) {
    console.error("SetPP Error:", err);
    reply("❌ Failed to update profile picture!");
  }
});
