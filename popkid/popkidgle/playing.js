import config from '../../config.cjs';
import fetch from 'node-fetch';

async function fetchJson(url, options = {}) {
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
}

const play = async (m, sock) => {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (cmd === "play2") {
        if (!text) {
            return m.reply("🎶 Tell me the song you're in the mood for! 🎶");
        }

        try {
            await sock.sendMessage(m.from, { text: `🔎 Finding "${text}"...` }, { quoted: m });

            let kyuu = await fetchJson(`https://api.agatz.xyz/api/ytsearch?message=${encodeURIComponent(text)}`);
            let songData = kyuu.data[0];

            if (!songData) {
                return m.reply("Hmm, couldn't find that tune. 😔 Maybe try again?");
            }

            let tylor = await fetchJson(`https://api.nexoracle.com/downloader/yt-audio2?apikey=free_key@maher_apis&url=${songData.url}`);
            let audioUrl = tylor.result.audio;

            if (!audioUrl) {
                return m.reply("⚠️ Couldn't grab the audio. Let's try later! 😔");
            }

            await sock.sendMessage(m.from, {
                audio: { url: audioUrl },
                fileName: `${songData.title}.mp3`,
                mimetype: "audio/mpeg",
                contextInfo: {
                    forwardingScore: 5,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterName: "🎶 The bilal Jukebox 🎶",
                        newsletterJid: "120363290715861418@newsletter",
                    },
                    externalAdReply: {
                        title: `🎧 Now playing: ${songData.title} 🎧`,
                        body: `.mp3 audio delivered`,
                        thumbnailUrl: songData.thumbnail || 'https://files.catbox.moe/fhox3r.jpg',
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        thumbnailHeight: 500,
                        thumbnailWidth: 500,
                    },
                },
            }, { quoted: m });

        } catch (error) {
            console.error("Error in play command:", error);
            m.reply("Hmm, something went wrong. 😅 Let's try again!");
        }
    }
}

export default play;
