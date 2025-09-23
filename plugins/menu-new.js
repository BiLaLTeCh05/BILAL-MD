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
        const menuCaption = `*╭━━━〔 👑 BiLAL-MD 👑 〕━━━┈⊷*
*┃👑╭──────────────*
*┃👑│ USER:❯* ${config.OWNER_NAME}
*┃👑│ DEVELOPER :❯* BiLAL
*┃👑│ PLATFORM :❯* LiNUX
*┃👑│ MODE :❯* ${config.MODE}
*┃👑│ PREFiX :❯* ${config.PREFIX}
*┃👑│ VERSION :❯* 1.0
*┃👑╰──────────────*
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 SELECT YOUR MENU 👑*`;

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
            { buttonId: "download_menu", buttonText: { displayText: "📥 Download Menu" }, type: 1 },
            { buttonId: "group_menu", buttonText: { displayText: "👥 Group Menu" }, type: 1 },
            { buttonId: "user_menu", buttonText: { displayText: "🙋 User Menu" }, type: 1 },
            { buttonId: "ai_menu", buttonText: { displayText: "🤖 Ai Menu" }, type: 1 },
            { buttonId: "converter_menu", buttonText: { displayText: "🔄 Converter Menu" }, type: 1 },
            { buttonId: "xtra_menu", buttonText: { displayText: "⚡ Xtra Menu" }, type: 1 },
            { buttonId: "main_menu", buttonText: { displayText: "🏠 Main Menu" }, type: 1 },
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

        // Menu Data (same design as your style)
        const menuData = {
            "download_menu": `*╭━━━〔 📥 DOWNLOAD MENU 📥 〕━━━┈⊷*
*┃🔰 fb*
*┃🔰 tiktok*
*┃🔰 insta*
*┃🔰 apk*
*┃🔰 img*
*┃🔰 song*
*┃🔰 play*
*┃🔰 video*
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 BILAL-MD WHATSAPP BOT 👑*`,

            "group_menu": `*╭━━━〔 👥 GROUP MENU 👥 〕━━━┈⊷*
*┃🔰 grouplink*
*┃🔰 add*
*┃🔰 remove*
*┃🔰 kick*
*┃🔰 promote*
*┃🔰 demote*
*┃🔰 tagall*
*┃🔰 tagadmins*
*┃🔰 invite*
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 BILAL-MD WHATSAPP BOT 👑*`,

            "user_menu": `*╭━━━〔 🙋 USER MENU 🙋 〕━━━┈⊷*
*┃🔰 block*
*┃🔰 unblock*
*┃🔰 fullpp*
*┃🔰 setpp*
*┃🔰 restart*
*┃🔰 updatecmd*
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 BILAL-MD WHATSAPP BOT 👑*`,

            "ai_menu": `*╭━━━〔 🤖 AI MENU 🤖 〕━━━┈⊷*
*┃🔰 ai*
*┃🔰 gpt*
*┃🔰 bing*
*┃🔰 imagine*
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 BILAL-MD WHATSAPP BOT 👑*`,

            "converter_menu": `*╭━━━〔 🔄 CONVERTER MENU 🔄 〕━━━┈⊷*
*┃🔰 sticker*
*┃🔰 emojimix 😎+😂*
*┃🔰 take*
*┃🔰 tomp3*
*┃🔰 fancy*
*┃🔰 tts*
*┃🔰 trt*
*┃🔰 base64*
*┃🔰 unbase64*
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 BILAL-MD WHATSAPP BOT 👑*`,

            "xtra_menu": `*╭━━━〔 ⚡ XTRA MENU ⚡ 〕━━━┈⊷*
*┃🔰 timenow*
*┃🔰 date*
*┃🔰 count*
*┃🔰 calculate*
*┃🔰 news*
*┃🔰 movie*
*┃🔰 weather*
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 BILAL-MD WHATSAPP BOT 👑*`,

            "main_menu": `*╭━━━〔 🏠 MAIN MENU 🏠 〕━━━┈⊷*
*┃🔰 ping*
*┃🔰 alive*
*┃🔰 runtime*
*┃🔰 uptime*
*┃🔰 repo*
*┃🔰 owner*
*┃🔰 menu*
*┃🔰 menu2*
*┃🔰 restart*
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 BILAL-MD WHATSAPP BOT 👑*`
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
