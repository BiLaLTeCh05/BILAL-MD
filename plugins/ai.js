const axios = require("axios");
const fetch = require("node-fetch");
const { cmd } = require("../command");

// =============================
// 📌 GPT & GEMINI COMMAND
// =============================
cmd({
    pattern: "gpt",
    alias: ["ai", "chatgpt"],
    desc: "Ask ChatGPT AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Usage: *.gpt write a poem*");

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        const response = await axios.get(
            `https://api.dreaded.site/api/chatgpt?text=${encodeURIComponent(q)}`
        );

        if (response.data && response.data.success && response.data.result) {
            const answer = response.data.result.prompt;
            await conn.sendMessage(from, { text: answer }, { quoted: m });
        } else {
            reply("⚠️ GPT API se sahi response nahi aaya.");
        }
    } catch (e) {
        console.error("GPT Error:", e.message);
        reply("❌ GPT se error aagaya, baad me try karo.");
    }
});

cmd({
    pattern: "ai",
    alias: ["ai2", "gem"],
    desc: "Ask Gemini AI",
    category: "ai",
    react: "🤖",
    filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Usage: *.gemini who are you*");

        await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

        const apis = [
            `https://vapis.my.id/api/gemini?q=${encodeURIComponent(q)}`,
            `https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(q)}`,
            `https://api.ryzendesu.vip/api/ai/gemini?text=${encodeURIComponent(q)}`,
            `https://api.dreaded.site/api/gemini2?text=${encodeURIComponent(q)}`,
            `https://api.giftedtech.my.id/api/ai/geminiai?apikey=gifted&q=${encodeURIComponent(q)}`,
            `https://api.giftedtech.my.id/api/ai/geminiaipro?apikey=gifted&q=${encodeURIComponent(q)}`
        ];

        let answered = false;
        for (const api of apis) {
            try {
                const res = await fetch(api);
                const data = await res.json();

                if (data.message || data.data || data.answer || data.result) {
                    const answer =
                        data.message || data.data || data.answer || data.result;
                    await conn.sendMessage(from, { text: answer }, { quoted: m });
                    answered = true;
                    break;
                }
            } catch (e) {
                continue;
            }
        }

        if (!answered) {
            reply("⚠️ Saare Gemini APIs fail ho gaye.");
        }
    } catch (e) {
        console.error("Gemini Error:", e.message);
        reply("❌ Gemini se error aagaya, baad me try karo.");
    }
});
