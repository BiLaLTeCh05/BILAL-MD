const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
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
            isForwarded: true
        };

        // send menu with image + buttons
        const sentMsg = await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/kunzpz.png' },
                caption: menuCaption,
                contextInfo: contextInfo,
                buttons: [
                    { buttonId: "1", buttonText: { displayText: "👑 DOWNLOAD MENU👑" }, type: 1 },
                    { buttonId: "2", buttonText: { displayText: "👑 GROUP MENU👑" }, type: 1 },
                    { buttonId: "3", buttonText: { displayText: "👑 USER MENU 👑" }, type: 1 },
                    { buttonId: "4", buttonText: { displayText: "👑 AI MENU 👑" }, type: 1 },
                    { buttonId: "5", buttonText: { displayText: "👑 CONVERT MENU 👑" }, type: 1 },
                    { buttonId: "6", buttonText: { displayText: "👑 XTRA MENU 👑" }, type: 1 },
                    { buttonId: "7", buttonText: { displayText: "👑 MAIN MENU 👑" }, type: 1 }
                ],
                headerType: 4
            },
            { quoted: mek }
        );

        const messageID = sentMsg.key.id;

        // ==============================
        // ✅ MENU DATA (same design)
        // ==============================
        const menuData = {
            '1': {
                content: `*╭━━━〔 👑 DOWNLOAD 👑 〕━━━┈⊷*
*┃👑╭──────────────*
┃👑│ • fb 
┃👑│ • tiktok 
┃👑│ • Insta 
┃👑│ • apk 
┃👑│ • img   
┃👑│ • song 
┃👑│ • play 
┃👑│ • video  
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 BILAL-MD WHATSAPP BOT 👑*`
            },
            '2': {
                content: `*╭━━━〔 👑 GROUP MENU 👑 〕━━━┈⊷*
*┃👑╭──────────────*
┃👑│ • grouplink
┃👑│ • kickall
┃👑│ • add 
┃👑│ • remove 
┃👑│ • kick 
┃👑│ • promote 
┃👑│ • demote 
┃👑│ • revoke
┃👑│ • mute 
┃👑│ • unmute
┃👑│ • lockgc
┃👑│ • unlockgc
┃👑│ • tagall
┃👑│ • hidetag
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 BILAL-MD WHATSAPP BOT 👑*`
            },
            '3': {
                content: `*╭━━━〔 👑 USER MENU 👑 〕━━━┈⊷*
*┃👑╭──────────────*
┃👑│ • block 
┃👑│ • unblock 
┃👑│ • fullpp 
┃👑│ • setpp 
┃👑│ • getpp 
┃👑│ • restart
┃👑│ • updatecmd
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 BILAL-MD WHATSAPP BOT 👑*`
            },
            '4': {
                content: `*╭━━━〔 👑 AI MENU 👑 〕━━━┈⊷*
┃👑│ • ai 
┃👑│ • gpt 
┃👑│ • bing 
┃👑│ • imagine 
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 BILAL-MD WHATSAPP BOT 👑*`
            },
            '5': {
                content: `*╭━━━〔 👑 CONVERTER 👑 〕━━━┈⊷*
┃👑╭──────────────
┃👑│ • sticker 
┃👑│ • ss
┃👑│ • take 
┃👑│ • tomp3 
┃👑│ • fancy 
┃👑│ • tts 
┃👑│ • trt 
┃👑│ • getpp 
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 BILAL-MD WHATSAPP BOT 👑*`
            },
            '6': {
                content: `*╭━━━〔 👑 XTRA MENU 👑 〕━━━┈⊷*
*┃👑╭──────────────*
┃👑│ • timenow
┃👑│ • date
┃👑│ • count 
┃👑│ • calculate 
┃👑│ • flip
┃👑│ • coinflip
┃👑│ • rcolor
┃👑│ • roll
┃👑│ • fact
┃👑│ • define 
┃👑│ • news 
┃👑│ • movie 
┃👑│ • weather 
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 BILAL-MD WHATSAPP BOT 👑*`
            },
            '7': {
                content: `*╭━━━〔 👑 MAIN MENU 👑 〕━━━┈⊷*
*┃👑╭──────────────*
┃👑│ • ping
┃👑│ • alive
┃👑│ • runtime
┃👑│ • uptime
┃👑│ • repo
┃👑│ • owner
┃👑│ • menu
┃👑│ • menu2
┃👑│ • restart
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 BILAL-MD WHATSAPP BOT 👑*`
            }
        };

        // ==============================
        // ✅ HANDLER
        // ==============================
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message) return;

                const textMsg = receivedMsg.message.conversation || 
                    receivedMsg.message.extendedTextMessage?.text || 
                    receivedMsg.message.buttonsResponseMessage?.selectedButtonId;

                if (menuData[textMsg]) {
                    await conn.sendMessage(
                        from,
                        { text: menuData[textMsg].content, contextInfo: contextInfo },
                        { quoted: receivedMsg }
                    );
                }
            } catch (e) {
                console.log("Menu handler error:", e);
            }
        };

        conn.ev.on("messages.upsert", handler);

        // auto remove listener after 5 min
        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
        }, 300000);

    } catch (e) {
        console.error('ERROR:', e);
        await conn.sendMessage(from, { text: "_Menu show karte waqt error aagaya._" }, { quoted: mek });
    }
});
