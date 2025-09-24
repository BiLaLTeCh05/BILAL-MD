const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu",
    desc: "Show interactive menu with buttons",
    category: "menu",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        const menuCaption = `*╭━━━〔 👑 BILAL-MD 👑 〕━━━┈⊷*
*┃👑 USER:* ${config.OWNER_NAME}
*┃👑 DEVELOPER:* BiLAL
*┃👑 PLATFORM:* LINUX
*┃👑 MODE:* ${config.MODE}
*┃👑 PREFIX:* ${config.PREFIX}
*┃👑 VERSION:* 1.0
*╰━━━━━━━━━━━━━━━┈⊷*
*👉 SELECT YOUR MENU 👈*`;

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363296818107681@newsletter',
                newsletterName: config.OWNER_NAME,
                serverMessageId: 143
            }
        };

        // Buttons
        const buttons = [
            { buttonId: "download_menu", buttonText: { displayText: "📥 DOWNLOAD MENU" }, type: 1 },
            { buttonId: "group_menu", buttonText: { displayText: "👥 GROUP MENU" }, type: 1 },
            { buttonId: "user_menu", buttonText: { displayText: "🙋 USER MENU" }, type: 1 },
            { buttonId: "ai_menu", buttonText: { displayText: "🤖 AI MENU" }, type: 1 },
            { buttonId: "converter_menu", buttonText: { displayText: "🔄 CONVERTER MENU" }, type: 1 },
            { buttonId: "xtra_menu", buttonText: { displayText: "⚡ XTRA MENU" }, type: 1 },
            { buttonId: "main_menu", buttonText: { displayText: "🏠 MAIN MENU" }, type: 1 },
            { buttonId: "support_channel", buttonText: { displayText: "📢 BILAL-MD SUPPORT" }, type: 1 },
        ];

        // Send Main Menu with Buttons
        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/kunzpz.png' },
                caption: menuCaption,
                footer: "*👑 BILAL-MD WHATSAPP BOT 👑*",
                buttons: buttons,
                headerType: 4,
                contextInfo: contextInfo
            },
            { quoted: mek }
        );

        // Menu Data
        const menuData = {
            "download_menu": `*╭━━━〔 📥 DOWNLOAD MENU 〕━━━┈⊷*
*┃🔰 FB*
*┃🔰 TIKTOK*
*┃🔰 INSTA*
*┃🔰 APK*
*┃🔰 IMG*
*┃🔰 SONG*
*┃🔰 PLAY*
*┃🔰 VIDEO*
*╰━━━━━━━━━━━━━━━┈⊷*`,

            "group_menu": `*╭━━━〔 👥 GROUP MENU 〕━━━┈⊷*
*┃🔰 GROUPLINK*
*┃🔰 ADD*
*┃🔰 REMOVE*
*┃🔰 KICK*
*┃🔰 PROMOTE*
*┃🔰 DEMOTE*
*┃🔰 TAGALL*
*┃🔰 TAGADMINS*
*┃🔰 INVITE*
*╰━━━━━━━━━━━━━━━┈⊷*`,

            "user_menu": `*╭━━━〔 🙋 USER MENU 〕━━━┈⊷*
*┃🔰 BLOCK*
*┃🔰 UNBLOCK*
*┃🔰 FULLPP*
*┃🔰 SETPP*
*┃🔰 RESTART*
*┃🔰 UPDATECMD*
*╰━━━━━━━━━━━━━━━┈⊷*`,

            "ai_menu": `*╭━━━〔 🤖 AI MENU 〕━━━┈⊷*
*┃🔰 AI*
*┃🔰 GPT*
*┃🔰 BING*
*┃🔰 IMAGINE*
*╰━━━━━━━━━━━━━━━┈⊷*`,

            "converter_menu": `*╭━━━〔 🔄 CONVERTER MENU 〕━━━┈⊷*
*┃🔰 STICKER*
*┃🔰 EMOJIMIX 😎+😂*
*┃🔰 TAKE*
*┃🔰 TOMP3*
*┃🔰 FANCY*
*┃🔰 TTS*
*┃🔰 TRT*
*┃🔰 BASE64*
*┃🔰 UNBASE64*
*╰━━━━━━━━━━━━━━━┈⊷*`,

            "xtra_menu": `*╭━━━〔 ⚡ XTRA MENU 〕━━━┈⊷*
*┃🔰 TIMENOW*
*┃🔰 DATE*
*┃🔰 COUNT*
*┃🔰 CALCULATE*
*┃🔰 NEWS*
*┃🔰 MOVIE*
*┃🔰 WEATHER*
*╰━━━━━━━━━━━━━━━┈⊷*`,

            "main_menu": `*╭━━━〔 🏠 MAIN MENU 〕━━━┈⊷*
*┃🔰 PING*
*┃🔰 ALIVE*
*┃🔰 RUNTIME*
*┃🔰 UPTIME*
*┃🔰 REPO*
*┃🔰 OWNER*
*┃🔰 MENU*
*┃🔰 MENU2*
*┃🔰 RESTART*
*╰━━━━━━━━━━━━━━━┈⊷*`,

            "support_channel": `📢 *BILAL-MD SUPPORT CHANNEL:*\n👉 https://whatsapp.com/channel/0029VaFgYtRLoKp3blEq4F3H`
        };

        // Button Reply Handler
        conn.ev.on("messages.upsert", async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message?.buttonsResponseMessage) return;

                const buttonId = receivedMsg.message.buttonsResponseMessage.selectedButtonId;
                const senderID = receivedMsg.key.remoteJid;

                if (menuData[buttonId]) {
                    await conn.sendMessage(
                        senderID,
                        {
                            image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/kunzpz.png' },
                            caption: menuData[buttonId],
                            contextInfo: contextInfo
                        },
                        { quoted: receivedMsg }
                    );
                }
            } catch (e) {
                console.log("Button handler error:", e);
            }
        });

    } catch (e) {
        console.error("ERROR:", e);
        await conn.sendMessage(
            from,
            { text: `_BOT ERROR: MENU NOT SHOWING 😓_` },
            { quoted: mek }
        );
    }
});
