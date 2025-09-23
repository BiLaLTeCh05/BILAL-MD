const { cmd } = require("../command");
const axios = require("axios");

// Memory to store pagination data per chat
let imageCache = {};

cmd({
    pattern: "img",
    alias: ["image", "googleimage", "searchimg"],
    react: "🖼️",
    desc: "Search and download images with pagination",
    category: "fun",
    use: ".img <keywords>",
    filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply(
                "*APKO KON C PHOTOS DOWNLOAD KARNI HAI...🤔* \n\n" +
                "ESE LIKHO: \n```.img flowers``` 🌹"
            );
        }

        await reply(`🔎 *"${query}" ki photos dhundi ja rahi hain...* 🖼️`);

        // ✅ Pinterest API (Stable)
        const apiUrl = `https://api.akuari.my.id/search/pinterest?query=${encodeURIComponent(query)}`;
        const response = await axios.get(apiUrl);

        if (!response.data?.hasil || response.data.hasil.length === 0) {
            return reply("*APKI PHOTOS NAHI MILI 😔*");
        }

        // Save images in cache for this chat
        imageCache[from] = {
            query,
            results: response.data.hasil,
            index: 0
        };

        // Send first page
        sendImagePage(conn, from, mek);

    } catch (error) {
        console.error("Image Search Error:", error);
        reply("❌ Error: Images fetch karne me dikkat aa rahi hai. Baad me try karo.");
    }
});

// ====================
// 📸 Helper Function
// ====================
async function sendImagePage(conn, from, mek) {
    const cache = imageCache[from];
    if (!cache) return;

    const start = cache.index;
    const end = start + 5;
    const images = cache.results.slice(start, end);

    if (images.length === 0) {
        return conn.sendMessage(from, { text: "✅ Aur photos nahi milin 😅" }, { quoted: mek });
    }

    // Send each image
    for (const imageUrl of images) {
        await conn.sendMessage(
            from,
            { image: { url: imageUrl }, caption: `*👑 BILAL-MD WHATSAPP BOT 👑*` },
            { quoted: mek }
        );
        await new Promise(res => setTimeout(res, 1200));
    }

    // Update index for next page
    cache.index += 5;

    // Add Next button if more images left
    if (cache.index < cache.results.length) {
        await conn.sendMessage(from, {
            text: `🔎 Aur photos dekhne ke liye *Next Page* dabaye 👇`,
            buttons: [
                { buttonId: `nextimg_${cache.query}`, buttonText: { displayText: "➡️ Next Page" }, type: 1 }
            ],
            headerType: 2
        }, { quoted: mek });
    } else {
        await conn.sendMessage(from, { text: "✅ Ye sari photos thi jo milin 🌹" }, { quoted: mek });
        delete imageCache[from]; // clear cache after last page
    }
}

// ====================
// 🔘 Next Button Handler
// ====================
cmd({
    pattern: "nextimg_",
    dontAddCommandList: true
}, async (conn, mek, m, { from, body }) => {
    try {
        const query = body.split("_")[1];
        if (!imageCache[from]) {
            return conn.sendMessage(from, { text: "⚠️ Pehle `.img <query>` use karein." }, { quoted: mek });
        }
        await sendImagePage(conn, from, mek);
    } catch (error) {
        console.error("Next page error:", error);
    }
});
