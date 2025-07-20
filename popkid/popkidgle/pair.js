import axios from "axios";
import config from '../../config.cjs';

const pairHandler = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const args = m.body.trim().split(/\s+/).slice(1);
  const textnumber = args[0];

  const validCommands = ["pair", "paircode", "code"];
  if (!validCommands.includes(cmd)) return;

  if (!textnumber) {
    return m.reply("Please provide a phone number.\nExample: *.pair 254732297194*");
  }

  try {
    m.reply("⏳ Fetching pair code...");

    const api = `https://sessiongit-80e29bf0d13e.herokuapp.com?phone=${encodeURIComponent(textnumber)}`;
    const response = await axios.get(api);
    const data = response.data;

    if (!data?.pair_code) {
      return m.reply("Failed to retrieve pair code. Check the phone number and try again.");
    }

    const messagePayload = {
      text: `${data.pair_code}`,
      contextInfo: {
        isForwarded: true,
        forwardingScore: 777,
        externalAdReply: {
          title: data.title || "Pair Device",
          body: data.creator || "Unknown",
          thumbnailUrl: data.thumbnail || "",
          sourceUrl: data.channel_link,
          mediaType: 1,
          renderLargerThumbnail: false 
        }
      }
    };

    await gss.sendMessage(m.from, messagePayload, { quoted: m });

  } catch (err) {
    console.error("Pair Cmd Error:", err.message);
    m.reply("An error occurred:\n" + err.message);
  }
};

export default pairHandler;
