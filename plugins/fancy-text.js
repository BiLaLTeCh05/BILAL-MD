const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "fancy",
  alias: ["font", "style"],
  react: "🌹",
  desc: "Convert text into various fonts.",
  category: "tools",
  filename: __filename
}, async (conn, m, store, { from, args, q, reply }) => {
  try {
    const text = q || (args && args.length > 0 ? args.join(" ") : null);

    if (!text) {
      return reply(
        "🌹 *Fancy Command Usage* 🌹\n\n" +
        "👉 Example:\n" +
        "``` .fancy Bilal ```"
      );
    }

    // API call
    const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(text)}`;
    const response = await axios.get(apiUrl);

    if (!response.data || !response.data.result) {
      return reply("⚠️ API se koi fonts nahi mile!");
    }

    const fonts = Object.entries(response.data.result);

    // Sirf pehle 30 fonts bhejna
    const limit = 30;
    let count = 0;
    for (const [, styled] of fonts) {
      if (count >= limit) break;
      await conn.sendMessage(from, { text: styled }, { quoted: m });
      count++;
    }

  } catch (error) {
    console.error("Fancy command error:", error.message);
    reply("⚠️ Error aagaya, baad me try karo!");
  }
});
