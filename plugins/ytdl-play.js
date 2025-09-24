const { cmd } = require('../command');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
const ytSearch = require('yt-search');

cmd({
    pattern: "play",
    alias: ["song", "yt"],
    desc: "Download audio from YouTube by link or search query",
    category: "download",
    react: "🎶",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("⚠️ Please give me a YouTube link or song name.\nExample: *.play pasoori*");

        let url = q.trim();

        // Agar link valid nahi hai to YouTube search karo
        if (!ytdl.validateURL(url)) {
            reply("🔍 Searching on YouTube...");
            const search = await ytSearch(url);
            if (!search.videos.length) return reply("❌ No results found.");
            url = search.videos[0].url; // top result
        }

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

            fs.unlinkSync(filePath); // temp delete
        });

        reply(`⬇️ Downloading: *${title}*`);
    } catch (e) {
        console.error("Play Command Error:", e);
        reply("❌ Error: " + e.message);
    }
});
