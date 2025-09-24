const axios = require('axios');
const yts = require('yt-search');
const { cmd } = require('../command');

// =============================
// 📌 SONG DOWNLOAD COMMAND
// =============================
cmd({
    pattern: "song",
    alias: ["music", "play"],
    desc: "Download song from YouTube",
    category: "download",
    react: "🎵",
    filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Usage: *.song shape of you*");

        let video;
        if (q.includes("youtube.com") || q.includes("youtu.be")) {
            video = { url: q };
        } else {
            const search = await yts(q);
            if (!search || !search.videos.length) return reply("❌ No results found.");
            video = search.videos[0];
        }

        // Inform user
        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: `🎵 *Downloading:* ${video.title}\n⏱ Duration: ${video.timestamp}`
        }, { quoted: m });

        // API link
        const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube?url=${encodeURIComponent(video.url)}&format=mp3`;

        const res = await axios.get(apiUrl, {
            timeout: 30000,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
            }
        });

        if (!res.data || !res.data.result || !res.data.result.download) {
            return reply("⚠️ API failed to return a valid link.");
        }

        const audioData = res.data.result;

        // Send audio
        await conn.sendMessage(from, {
            audio: { url: audioData.download },
            mimetype: "audio/mpeg",
            fileName: `${audioData.title || video.title || 'song'}.mp3`,
            ptt: false
        }, { quoted: m });

    } catch (err) {
        console.error("Song command error:", err);
        reply("❌ Failed to download song. Try again later.");
    }
});
