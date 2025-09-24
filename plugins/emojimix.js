const fetch = require('node-fetch');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const { cmd } = require('../command');

// ====================================
// 📌 EMOJIMIX COMMAND
// ====================================
cmd({
    pattern: "emojimix",
    alias: ["mixemoji", "emix"],
    desc: "Mix two emojis into a sticker",
    category: "fun",
    react: "🎴",
    filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
    try {
        if (!q) return reply("🎴 Example: .emojimix 😎+🥰");

        if (!q.includes('+')) {
            return reply(
                "✳️ Separate the emoji with a *+* sign\n\n📌 Example:\n*.emojimix* 😎+🥰"
            );
        }

        let [emoji1, emoji2] = q.split('+').map(e => e.trim());

        // ✅ Tenor API endpoint
        const url = `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            return reply("❌ These emojis cannot be mixed! Try different ones.");
        }

        const imageUrl = data.results[0].url;

        // Temp folder
        const tmpDir = path.join(process.cwd(), 'tmp');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        const tempFile = path.join(tmpDir, `temp_${Date.now()}.png`).replace(/\\/g, '/');
        const outputFile = path.join(tmpDir, `sticker_${Date.now()}.webp`).replace(/\\/g, '/');

        // Download image
        const imgRes = await fetch(imageUrl);
        const buffer = await imgRes.buffer();
        fs.writeFileSync(tempFile, buffer);

        // Convert to WebP with ffmpeg
        const ffmpegCommand = `ffmpeg -i "${tempFile}" -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" "${outputFile}"`;
        
        await new Promise((resolve, reject) => {
            exec(ffmpegCommand, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        if (!fs.existsSync(outputFile)) {
            return reply("❌ Failed to create sticker.");
        }

        // Send sticker
        const stickerBuffer = fs.readFileSync(outputFile);
        await conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: m });

        // Cleanup
        fs.unlinkSync(tempFile);
        fs.unlinkSync(outputFile);

    } catch (e) {
        console.error("❌ EmojiMix Error:", e);
        reply("❌ Failed to mix emojis! Example: .emojimix 😎+🥰");
    }
});
