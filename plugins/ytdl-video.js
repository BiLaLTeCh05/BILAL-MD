const config = require('../config');
const { cmd } = require('../command');
const yts = require('yt-search');
const fetch = require('node-fetch');

cmd({
    pattern: "video",
    alias: ["mp4", "ytv"],
    react: "🎥",
    desc: "Download video from YouTube",
    category: "download",
    use: ".video <query or url>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("*APKO KOI VIDEO DOWNLOAD KARNI HAI TO ESE LIKHEIN 😊♥️* \n *.VIDEO ❮APKI VIDEO KA NAME❯* \n *JESE 😊* \n *.VIDEO MERE BAT BAN GAI HAI NAAT* \n *.VIDEO QURAN MAJEED TILAWAT* \n *ESE JAB LIKHO GE TO APKI VIDEOS DOWNLOAD HO JAYE GE OK 🌹*");

        let videoUrl, title;

        // Check if it's a URL
        if (q.match(/(youtube\.com|youtu\.be)/)) {
            videoUrl = q;
            const videoInfo = await yts({ videoId: q.split(/[=/]/).pop() });
            title = videoInfo.title;
        } else {
            // Search YouTube
            const search = await yts(q);
            if (!search.videos.length) return await reply("*APKI VIDEO MUJHE NAHI MILI SORRY 😔*");
            videoUrl = search.videos[0].url;
            title = search.videos[0].title;
        }

        await reply("*APKI VIDEO DOWNLOAD HO RAHI HAI ☺️♥️* \n *THORA SA INTAZAR KAREIN 🌹*");

        // 🔑 Apify API call
        const API_KEY = "apify_api_pvubpkMlZfgVv8bUXLmAHiSSiMULUy1kCJg0";
        const apiUrl = `https://api.apify.com/v2/acts/streamers~youtube-video-downloader/run-sync-get-dataset-items?token=${API_KEY}&url=${encodeURIComponent(videoUrl)}`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.length) return await reply("❌ Failed to download video!");

        // Apify se hamesha array milta hai
        const downloadLink = data[0].url;

        await conn.sendMessage(from, {
            video: { url: downloadLink },
            mimetype: 'video/mp4',
            caption: `*${title}*`
        }, { quoted: mek });

        await reply(`✅ *${title}* \n\n *YEH LE G APKI VIDEO 😊♥️*`);

    } catch (error) {
        console.error(error);
        await reply(`*AP IS VIDEO KO THORI DER BAD DOWNLOAD KAR LENA PLEZ 🥺🦋*
        *`);
    }
});
