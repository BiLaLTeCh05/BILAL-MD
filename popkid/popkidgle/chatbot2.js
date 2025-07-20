import axios from 'axios';
import config from '../../config.cjs';

// Main command function
const chatbotcommand = async (m, Matrix) => {
    const botNumber = await Matrix.decodeJid(Matrix.user.id);
    const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    if (cmd === 'chatbot2') {
        if (!isCreator) return m.reply("*Only admin*");

        let responseMessage;

        if (text === 'on') {
            config.CHATBOT = true;
            responseMessage = "Chatbot has been enabled.";
        } else if (text === 'off') {
            config.CHATBOT = false;
            responseMessage = "Chatbot has been disabled.";
        } else {
            responseMessage = "Usage:\n- `chatbot on`: Enable Chatbot\n- `chatbot off`: Disable Chatbot";
        }

        try {
            await Matrix.sendMessage(m.from, { text: responseMessage }, { quoted: m });
        } catch (error) {
            console.error("Error processing your request:", error);
            await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
        }
    }

    // This part handles the chatbot response when it is enabled
    if (config.CHATBOT) {
        const mek = m;
        if (!mek.message || mek.key.fromMe) return;

        const from = mek.key.remoteJid;
        const sender = mek.key.participant || from;
        const isGroup = from.endsWith('@g.us');
        const msgText = mek.body || '';

        // Ensure that we only respond to group messages if mentioned
        if (isGroup) {
            const isMentioned = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(Matrix.user.id);
            const isQuoted = mek.message?.extendedTextMessage?.contextInfo?.participant === Matrix.user.id;
            const isReplied = mek.message?.extendedTextMessage?.contextInfo?.stanzaId && mek.message?.extendedTextMessage?.contextInfo?.participant === Matrix.user.id;
            if (!isMentioned && !isQuoted && !isReplied) return;
        }

        // Save user chats
        if (!global.userChats) global.userChats = {};
        if (!global.userChats[sender]) global.userChats[sender] = [];

        // Capture user input message
        global.userChats[sender].push(`User: ${msgText}`);

        if (global.userChats[sender].length > 15) {
            global.userChats[sender].shift();
        }

        const userHistory = global.userChats[sender].join("\n");

        // Prepare the prompt for the chatbot (including conversation history)
        const prompt = `
You are popkid-gle, a friendly WhatsApp bot.

### Conversation History:
${userHistory}
        `;

        try {
            const { data } = await axios.get("https://mannoffc-x.hf.space/ai/logic", {
                params: { "q": msgText, "logic": prompt }
            });

            const botResponse = data.result;

            // Add chatbot response to history
            global.userChats[sender].push(`Bot: ${botResponse}`);

            // Send the bot's response to the user
            await Matrix.sendMessage(from, { text: botResponse }, { quoted: mek });
        } catch (error) {
            console.error('Error in chatbot response:', error);
            await Matrix.sendMessage(m.from, { text: 'Error processing your request.' }, { quoted: m });
        }
    }
};

export default chatbotcommand;
  
