const { cmd } = require('../command');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "play",
    alias: ["song", "yt"],
    desc: "Download audio from YouTube",
    category: "download",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("⚠️ Please give me a YouTube link or search query.\nExample: *.play https://youtu.be/xxxx*");

        let url = q.trim();

        // Agar link YouTube ka hai
        if (ytdl.validateURL(url)) {
            const info = await ytdl.getInfo(url);
            const title = info.videoDetails.title;
            const filePath = path.join(__dirname, "../temp", `${Date.now()}.mp3`);

            const audioStream = ytdl(url, {
                filter: 'audioonly',
                quality: 'highestaudio'
            });

            const writeStream = fs.createWriteStream(filePath);
            audioStream.pipe(writeStream);

            writeStream.on("finish", async () => {
                await conn.sendMessage(from, {
                    audio: fs.readFileSync(filePath),
                    mimetype: 'audio/mpeg',
                    fileName: `${title}.mp3`
                }, { quoted: mek });

                fs.unlinkSync(filePath); // delete temp file
            });

            reply(`⬇️ Downloading: *${title}*`);
        } else {
            reply("❌ Please provide a valid YouTube URL.");
        }
    } catch (e) {
        console.error("Play Command Error:", e);
        reply("❌ Error: " + e.message);
    }
});
