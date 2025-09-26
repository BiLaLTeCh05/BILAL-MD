const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu",
    alias: ["help", "commands", "allmenu", "m", "me", "men", "meno", "mno", "menu1", "list", "allcmd", "allcmds", "cmd", "cmds"],
    desc: "Show all menu commands in one list with channel button",
    category: "menu",,
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

*╭━━〔 👑 DOWNLOAD MENU 👑 〕━━┈⊷*
┃👑│ • **FB**
┃👑│ • **TIKTOK**
┃👑│ • **INSTA**
┃👑│ • **APK**
┃👑│ • **IMG**
┃👑│ • **SONG**
┃👑│ • **PLAY**
┃👑│ • **VIDEO**
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 GROUP MENU 👑 〕━━┈⊷*
┃👑│ • **GROUPLINK**
┃👑│ • **KICKALL**
┃👑│ • **KICKALL2**
┃👑│ • **KICKALL3**
┃👑│ • **ADD**
┃👑│ • **REMOVE**
┃👑│ • **KICK**
┃👑│ • **PROMOTE**
┃👑│ • **DEMOTE**
┃👑│ • **DISMISS**
┃👑│ • **REVOKE**
┃👑│ • **MUTE**
┃👑│ • **UNMUTE**
┃👑│ • **LOCKGC**
┃👑│ • **UNLOCKGC**
┃👑│ • **TAG**
┃👑│ • **HIDETAG**
┃👑│ • **TAGALL**
┃👑│ • **TAGADMINS**
┃👑│ • **INVITE**
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 USER MENU 👑 〕━━┈⊷*
┃👑│ • **BLOCK**
┃👑│ • **UNBLOCK**
┃👑│ • **FULLPP**
┃👑│ • **SETPP**
┃👑│ • **GETPP**
┃👑│ • **RESTART**
┃👑│ • **UPDATECMD**
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 AI MENU 👑 〕━━┈⊷*
┃👑│ • **AI**
┃👑│ • **GPT**
┃👑│ • **BING**
┃👑│ • **IMAGINE**
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 CONVERTER MENU 👑 〕━━┈⊷*
┃👑│ • **STICKER**
┃👑│ • **EMOJIMIX**
┃👑│ • **TAKE**
┃👑│ • **TOMP3**
┃👑│ • **FANCY**
┃👑│ • **TTS**
┃👑│ • **TRT**
┃👑│ • **BASE64**
┃👑│ • **UNBASE64**
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 XTRA MENU 👑 〕━━┈⊷*
┃👑│ • **TIMENOW**
┃👑│ • **DATE**
┃👑│ • **FLIP**
┃👑│ • **COINFLIP**
┃👑│ • **RCOLOR**
┃👑│ • **ROLL**
┃👑│ • **SS**
┃👑│ • **NEWS**
┃👑│ • **MOVIE**
┃👑│ • **WEATHER**
*╰━━━━━━━━━━━━━━━┈⊷*

*╭━━〔 👑 MAIN MENU 👑 〕━━┈⊷*
┃👑│ • **PING**
┃👑│ • **ALIVE**
┃👑│ • **RUNTIME**
┃👑│ • **UPTIME**
┃👑│ • **REPO**
┃👑│ • **OWNER**
┃👑│ • **MENU**
┃👑│ • **LIST**
┃👑│ • **RESTART**
*╰━━━━━━━━━━━━━━━┈⊷*

*👑 BILAL-MD WHATSAPP BOT 👑*`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/kunzpz.png' },
                caption: menuCaption,
                footer: "👑 BILAL-MD WHATSAPP BOT 👑",
                buttons: [
                    {
                        buttonId: "channel_link",
                        buttonText: { displayText: "SUPPORT" },
                        type: 1
                    }
                ],
                headerType: 4
            },
            { quoted: mek }
        );

        // Handle button click
        conn.ev.on("messages.upsert", async (chatUpdate) => {
            try {
                const msg = chatUpdate.messages[0];
                if (!msg.message) return;
                const from = msg.key.remoteJid;
                const buttonResponse = msg.message.buttonsResponseMessage?.selectedButtonId;

                if (buttonResponse === "channel_link") {
                    await conn.sendMessage(from, {
                        text: "*👑 BILAL-MD SUPPORT 👑* \n *https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G*"
                    });
                }
            } catch (err) {
                console.error("Button Error:", err);
            }
        });

    } catch (e) {
        console.error('ERROR:', e);
        await conn.sendMessage(
            from,
            { text: `*SHYAD KOI MASLA HAI BOT ME 🥺❤️* \n *AP BAD ME MENU MANGWA LENA OKY 😊🌹*` },
            { quoted: mek }
        );
    }
});
