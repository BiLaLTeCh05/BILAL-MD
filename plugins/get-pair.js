const axios = require('axios');
const { sleep } = require('../lib/myfunc');
const { cmd } = require('../command');

cmd({
    pattern: "pair",
    desc: "Get WhatsApp pairing code",
    category: "tools",
    react: "🔑",
    filename: __filename
},
async (conn, m, store, { from, q, reply }) => {
    try {
        if (!q) {
            return reply("📌 Please provide valid WhatsApp number\n\nExample: .pair 91702395XXXX");
        }

        const numbers = q.split(',')
            .map((v) => v.replace(/[^0-9]/g, ''))
            .filter((v) => v.length > 5 && v.length < 20);

        if (numbers.length === 0) {
            return reply("❌ Invalid number. Please use the correct format!");
        }

        for (const number of numbers) {
            const whatsappID = number + '@s.whatsapp.net';
            const result = await conn.onWhatsApp(whatsappID);

            if (!result[0]?.exists) {
                return reply(`❌ Number *${number}* is not registered on WhatsApp!`);
            }

            reply("⏳ Wait a moment, generating your pairing code...");

            try {
                const response = await axios.get(`https://pair-vd1s.onrender.com/code?number=${number}`);

                if (response.data && response.data.code) {
                    const code = response.data.code;
                    if (code === "Service Unavailable") {
                        throw new Error('Service Unavailable');
                    }

                    await sleep(5000);
                    await conn.sendMessage(from, {
                        text: `✅ Pairing code for *${number}*:\n\n\`\`\`${code}\`\`\``
                    }, { quoted: m });
                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (apiError) {
                console.error('API Error:', apiError);
                const errorMessage = apiError.message === 'Service Unavailable'
                    ? "⚠️ Service is currently unavailable. Please try again later."
                    : "❌ Failed to generate pairing code. Please try again later.";
                reply(errorMessage);
            }
        }
    } catch (err) {
        console.error("Pair command error:", err);
        reply("❌ An unexpected error occurred. Please try again later.");
    }
});
