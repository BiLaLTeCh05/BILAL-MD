const axios = require("axios");
const { cmd } = require("../command");

// Fancy Command
cmd({
  pattern: "fancy",
  alias: ["font", "style"],
  react: "🌹",
  desc: "Convert text into various fonts.",
  category: "tools",
  filename: __filename
}, async (conn, m, store, { from, quoted, args, q, reply }) => {
  try {
    const text = q || (args && args.length > 0 ? args.join(" ") : null);

    if (!text) {
      return reply(
        "🌹 *Fancy Command Usage* 🌹\n\n" +
        "👉 Example likho:\n" +
        "``` .fancy Bilal ```\n\n" +
        "Isse tumhara naam stylish fonts me mil jaayega ✨"
      );
    }

    // API se fonts
    const apiUrl = `https://violetics.pw/api/texts/font?apikey=beta&text=${encodeURIComponent(text)}`;
    const response = await axios.get(apiUrl);

    if (!response.data || !response.data.result) {
      return reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }

    const fonts = Object.entries(response.data.result);

    // Pehla page bhejna
    await sendFancyPage(conn, from, m, fonts, 0, text);

  } catch (error) {
    console.error("Fancy command error:", error.message);
    reply("*SERVER ERROR YA API DOWN HAI 🥺❤️*");
  }
});


// ====================
// 🔥 Helper: Send Fonts Page
// ====================
async function sendFancyPage(conn, chatId, m, fonts, page, originalText) {
  const perPage = 5;
  const start = page * perPage;
  const end = start + perPage;
  const pageFonts = fonts.slice(start, end);

  const caption =
    `*YOUR NAME WITH STYLISH TEXT* ✨\n\n` +
    pageFonts.map(([name, styled]) => `*${name}:* ${styled}`).join("\n") +
    `\n\n_Page ${page + 1} of ${Math.ceil(fonts.length / perPage)}_\n\n` +
    `*👑 BILAL-MD WHATSAPP BOT 👑*`;

  // Buttons banate hain
  let buttons = pageFonts.map(([name, styled]) => ({
    buttonId: `copyfont_${styled}`,
    buttonText: { displayText: styled },
    type: 1
  }));

  // Pagination buttons
  if (page > 0) {
    buttons.push({
      buttonId: `fancy_prev_${page - 1}_${encodeURIComponent(originalText)}`,
      buttonText: { displayText: "⬅️ Prev" },
      type: 1
    });
  }
  if (end < fonts.length) {
    buttons.push({
      buttonId: `fancy_next_${page + 1}_${encodeURIComponent(originalText)}`,
      buttonText: { displayText: "➡️ Next" },
      type: 1
    });
  }

  // "Send All Fonts" button
  buttons.push({
    buttonId: `fancy_all_${encodeURIComponent(originalText)}`,
    buttonText: { displayText: "📜 Send All Fonts" },
    type: 1
  });

  await conn.sendMessage(chatId, {
    text: caption,
    buttons,
    headerType: 2
  }, { quoted: m });
}


// ====================
// 🔥 Button Handlers
// ====================

// Copy font button
cmd({
  pattern: "copyfont_",
  dontAddCommandList: true
}, async (conn, m, store, { body, reply }) => {
  try {
    const font = body.split("_")[1];
    if (font) {
      await reply(`✨ *Your Selected Stylish Font:* ✨\n\n${font}`);
    } else {
      await reply("⚠️ Invalid font button click!");
    }
  } catch (error) {
    console.error("Copy font button error:", error.message);
  }
});

// Next/Prev page buttons
cmd({
  pattern: "fancy_next_",
  dontAddCommandList: true
}, async (conn, m, store, { body, from }) => {
  try {
    const [, , page, text] = body.split("_");
    const apiUrl = `https://violetics.pw/api/texts/font?apikey=beta&text=${decodeURIComponent(text)}`;
    const response = await axios.get(apiUrl);
    const fonts = Object.entries(response.data.result);
    await sendFancyPage(conn, from, m, fonts, parseInt(page), decodeURIComponent(text));
  } catch (error) {
    console.error("Next page button error:", error.message);
  }
});

cmd({
  pattern: "fancy_prev_",
  dontAddCommandList: true
}, async (conn, m, store, { body, from }) => {
  try {
    const [, , page, text] = body.split("_");
    const apiUrl = `https://violetics.pw/api/texts/font?apikey=beta&text=${decodeURIComponent(text)}`;
    const response = await axios.get(apiUrl);
    const fonts = Object.entries(response.data.result);
    await sendFancyPage(conn, from, m, fonts, parseInt(page), decodeURIComponent(text));
  } catch (error) {
    console.error("Prev page button error:", error.message);
  }
});

// Send All Fonts button
cmd({
  pattern: "fancy_all_",
  dontAddCommandList: true
}, async (conn, m, store, { body, from }) => {
  try {
    const [, , text] = body.split("_");
    const apiUrl = `https://violetics.pw/api/texts/font?apikey=beta&text=${decodeURIComponent(text)}`;
    const response = await axios.get(apiUrl);
    const fonts = Object.entries(response.data.result);

    const allFonts = fonts.map(([name, styled]) => `*${name}:* ${styled}`).join("\n\n");

    await conn.sendMessage(from, {
      text: `*ALL STYLISH FONTS* ✨\n\n${allFonts}\n\n*👑 BILAL-MD WHATSAPP BOT 👑*`
    }, { quoted: m });

  } catch (error) {
    console.error("Send All Fonts error:", error.message);
  }
});
