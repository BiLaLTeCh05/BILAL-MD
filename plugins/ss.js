const fetch = require("node-fetch");
const { cmd } = require("../command");

cmd({
  pattern: "ss",
  alias: ["ssweb", "screenshot"],
  desc: "Take a screenshot of any website",
  category: "tools",
  react: "🖼️",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    if (!args[0]) {
      return reply(
        `*🌐 SCREENSHOT TOOL*\n\n` +
        `*.ss <url>*\n*.ssweb <url>*\n*.screenshot <url>*\n\n` +
        `Take a screenshot of any website.\n\n` +
        `Example:\n.ss https://google.com\n.ssweb https://google.com\n.screenshot https://google.com`
      );
    }

    const url = args[0].trim();

    // URL validation
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return reply("❌ Please provide a valid URL starting with http:// or https://");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

    // Screenshot API
    const apiUrl = `https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(url)}&theme=light&device=desktop`;
    const response = await fetch(apiUrl, { headers: { accept: "*/*" } });

    if (!response.ok) throw new Error(`API Error ${response.status}`);

    const buffer = await response.buffer();

    await conn.sendMessage(from, { image: buffer, caption: `🖼️ Screenshot of: ${url}` }, { quoted: mek });

  } catch (err) {
    console.error("❌ SS Command Error:", err);
    reply(
      "❌ Failed to take screenshot. Possible reasons:\n" +
      "• Invalid URL\n" +
      "• Website blocking screenshot\n" +
      "• Website down\n" +
      "• API unavailable"
    );
  }
});
