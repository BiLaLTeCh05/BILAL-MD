const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "fancy",
  alias: ["font", "style"],
  react: "🌹",
  desc: "Convert text into various fonts.",
  category: "tools",
  filename: __filename
}, async (conn, m, store, { from, quoted, args, q, reply }) => {
  try {
    if (!q) {
      return reply("AP NE KISI BHI TEXT KO STYLISH BANAN HAI TO ESE LIKHE ☺️❤️");
    }

    const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(q)}`;
    const response = await axios.get(apiUrl);
    
    if (!response.data.status) {
      return reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }

    const fonts = response.data.result.map(item => `*${item.name}:*\n${item.result}`).join("\n\n");
    const resultText = `*YOUR NAME WITH STYLISH TEXT* \n\n${fonts}\n\n *👑 BILAL-MD WHATSAPP BOT 👑**`;

    await conn.sendMessage(from, { text: resultText }, { quoted: m });
  } catch (error) {
    console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", error);
    reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
  }
});
