// Plugins/song.js
// .song <query or youtube url>  -> returns mp3 (uses obfuscated-encoding style endpoints)

const { cmd } = require('../command');
const config = require('../config');
const yts = require('yt-search');
const axios = require('axios');

// --- small utils (same encoding style as in your obfuscated file) ---
function hash() {
  return require('crypto').randomBytes(16).toString('hex');
}
function encoded(str) {
  if (!str) return '';
  let o = '';
  for (let i = 0; i < str.length; i++) o += String.fromCharCode(str.charCodeAt(i) ^ 1);
  return o;
}
function encUrl(url, sep = ',') {
  if (!url) return '';
  const codes = [];
  for (let i = 0; i < url.length; i++) codes.push(String(url.charCodeAt(i)));
  return codes.join(sep).split(sep).reverse().join(sep);
}
function youtubeId(url) {
  if (!url) return null;
  try {
    const patterns = [
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m) return m[1];
    }
    const u = new URL(url);
    if (u.searchParams.get('v')) {
      const v = u.searchParams.get('v');
      if (/^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
    }
  } catch (e) {}
  return null;
}

// --- API endpoints config (change in your config if needed) ---
const API_BASES = config.OGMP3_API_ENDPOINTS || [
  'https://api5.apiapi.lat',
  'https://api.apiapi.lat',
  'https://api3.apiapi.lat'
];
const API_BASE = config.OGMP3_API_BASE || 'https://api3.apiapi.lat';
const HEADERS = {
  'content-type': 'application/json',
  'origin': 'https://ogmp3.lat',
  'referer': 'https://ogmp3.lat/',
  'user-agent': 'Postify/1.0.0'
};

// helper: random endpoint
function pickBase() {
  const a = API_BASES[Math.floor(Math.random() * API_BASES.length)];
  return a;
}

// helper: request wrapper
async function apiRequest(endpointPath, body = {}, method = 'post') {
  const base = endpointPath.startsWith('http') ? '' : pickBase();
  const url = endpointPath.startsWith('http') ? endpointPath : `${base}${endpointPath}`;
  try {
    const res = await axios({
      method,
      url,
      headers: HEADERS,
      data: method === 'post' ? body : undefined,
      timeout: 30000
    });
    return { ok: true, data: res.data };
  } catch (e) {
    return { ok: false, error: e.response?.data || e.message || String(e) };
  }
}

// checkStatus (mimic original loop)
async function checkStatusLoop(id) {
  let tries = 0, max = 300;
  while (tries < max) {
    tries++;
    try {
      const c = hash();
      const d = hash();
      const path = `/${c}/status/${encoded(id)}/${d}/`;
      const r = await apiRequest(path, { data: id });
      if (!r.ok) {
        await new Promise(res => setTimeout(res, 2000));
        continue;
      }
      const stat = r.data;
      if (stat && stat.s === 'C') return stat;
      if (stat && stat.s === 'P') {
        await new Promise(res => setTimeout(res, 2000));
        continue;
      }
      return null;
    } catch (err) {
      await new Promise(res => setTimeout(res, 2000));
    }
  }
  return null;
}

// build init endpoint like /<hash>/init/<enc url>/<hash>/
function buildInit(link, quality = '320') {
  const c = hash();
  const d = hash();
  const endpoint = `/${c}/init/${encUrl(link)}/${d}/`;
  const body = {
    data: encoded(link),
    format: '0', // audio
    referer: 'https://ogmp3.cc',
    mp3Quality: quality,
    userTimeZone: String(new Date().getTimezoneOffset())
  };
  return { endpoint, body };
}

// command
cmd({
  pattern: 'song1',
  alias: ['mp3', 'ytaudio'],
  desc: 'Download audio (mp3) from YouTube',
  category: 'download',
  filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
  try {
    if (!q) return reply('*.song <query or youtube url>*');

    let videoUrl, title;
    if (/(youtube\.com|youtu\.be)/.test(q)) {
      videoUrl = q;
      const vid = youtubeId(q);
      if (vid) {
        const info = await yts({ videoId: vid });
        title = info.title || vid;
      } else title = q;
    } else {
      const s = await yts(q);
      if (!s || !s.videos || !s.videos.length) return reply('*No result found*');
      videoUrl = s.videos[0].url;
      title = s.videos[0].title;
    }

    await reply('*Preparing your audio...*');

    // init request
    const { endpoint, body } = buildInit(videoUrl, '320');
    const initRes = await apiRequest(endpoint, body);
    if (!initRes.ok) return reply('*Error initiating conversion: ' + String(initRes.error) + '*');

    const data = initRes.data;
    // handle common cases as original file did
    if (data.le) return reply('*Video duration is too long (max 3 hours).*');
    if (data.i === 'blacklisted') {
      const limit = new Set(['-330','-420','-480','-540']).has(String(new Date().getTimezoneOffset())) ? 5 : 100;
      return reply(`*Daily download limit (${limit}) reached.*`);
    }
    if (data.e || data.i === 'invalid') return reply('*Video not available.*');

    if (data.s === 'C') {
      // ready immediately
      const download = `${API_BASE}/${hash()}/download/${encoded(data.i)}/${hash()}/`;
      return conn.sendMessage(from, { audio: { url: download }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: mek })
        .then(() => reply(`✅ ${title}`));
    }

    // otherwise poll status
    const prod = await checkStatusLoop(data);
    if (prod && prod.s === 'C') {
      const download = `${API_BASE}/${hash()}/download/${encoded(prod.i)}/${hash()}/`;
      return conn.sendMessage(from, { audio: { url: download }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: mek })
        .then(() => reply(`✅ ${title}`));
    }

    return reply('*Failed to process the audio. Try again later.*');
  } catch (err) {
    console.error(err);
    return reply('*Error processing request.*');
  }
});
