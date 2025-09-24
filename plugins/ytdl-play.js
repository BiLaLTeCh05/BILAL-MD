const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
  pattern: "play12",
  alias: ["song"],
  desc: "Download songs from YouTube",
  category: "media",
  react: "🎵",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    const text = m.body ? m.body.trim().split(" ").slice(1).join(" ") : "";
    if (!text) return reply("🎶 Please tell me the *song name*.\nExample: .play Shape of You");

    const { videos } = await yts(text);
    if (!videos || videos.length === 0) return reply("❌ No songs found!");

    const video = videos[0];
    const urlYt = video.url;

    await reply("_⏳ Please wait, downloading your song..._");

    const response = await axios.get(`https://apis-keith.vercel.app/download/dlmp3?url=${urlYt}`);
    const data = response.data;

    if (!data || !data.status || !data.result || !data.result.downloadUrl) {
      return reply("⚠️ Failed to fetch audio from API. Try again later.");
    }

    const audioUrl = data.result.downloadUrl;
    const title = data.result.title;

    await conn.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      fileName: `${title}.mp3`
    }, { quoted: mek });

  } catch (err) {
    console.error("Play command error:", err);
    reply("❌ Download failed. Please try again later.");
  }
});
