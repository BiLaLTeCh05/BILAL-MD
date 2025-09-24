const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "menu5",
    desc: "Show fancy carousel menu with channel button",
    category: "menu",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        const channelLink = "https://whatsapp.com/channel/0029VaFgYtRLoKp3blEq4F3H"; // apna channel link

        const rainbow = (text) => {
            const colors = ["🟥","🟧","🟨","🟩","🟦","🟪"];
            return text.split("").map((ch,i)=> colors[i % colors.length] + ch).join("");
        };

        await conn.sendMessage(from, {
            carouselMessage: {
                cards: [
                    {
                        header: {
                            title: "👑✨ DOWNLOAD MENU ✨👑",
                            hasMediaAttachment: true,
                            imageMessage: { url: config.MENU_IMAGE_URL || "https://files.catbox.moe/kunzpz.png" }
                        },
                        body: { 
                            text: `╔═══🔥 ${rainbow("DOWNLOAD COMMANDS")} 🔥═══╗
┃ 🔰 **${rainbow("FB")}**
┃ 🔰 **${rainbow("TIKTOK")}**
┃ 🔰 **${rainbow("INSTA")}**
┃ 🔰 **${rainbow("APK")}**
┃ 🔰 **${rainbow("IMG")}**
┃ 🔰 **${rainbow("SONG")}**
┃ 🔰 **${rainbow("PLAY")}**
┃ 🔰 **${rainbow("VIDEO")}**
╚════════════════════╝`
                        },
                        nativeFlowMessage: {
                            buttons: [
                                { name: "cta_url", buttonParamsJson: `{"display_text":"📢 BILAL-MD SUPPORT","url":"${channelLink}"}` },
                                { name: "quick_reply", buttonParamsJson: '{"display_text":"🏠 MAIN MENU","id":"main_menu"}' }
                            ]
                        }
                    },
                    {
                        header: {
                            title: "⚡👥 GROUP MENU ⚡",
                            hasMediaAttachment: true,
                            imageMessage: { url: config.MENU_IMAGE_URL || "https://files.catbox.moe/kunzpz.png" }
                        },
                        body: { 
                            text: `╔═══⚡ ${rainbow("GROUP COMMANDS")} ⚡═══╗
┃ 🔰 **${rainbow("GROUPLINK")}**
┃ 🔰 **${rainbow("ADD")}**
┃ 🔰 **${rainbow("REMOVE")}**
┃ 🔰 **${rainbow("KICK")}**
┃ 🔰 **${rainbow("PROMOTE")}**
┃ 🔰 **${rainbow("DEMOTE")}**
┃ 🔰 **${rainbow("TAGALL")}**
┃ 🔰 **${rainbow("TAGADMINS")}**
┃ 🔰 **${rainbow("INVITE")}**
╚════════════════════╝`
                        },
                        nativeFlowMessage: {
                            buttons: [
                                { name: "cta_url", buttonParamsJson: `{"display_text":"📢 BILAL-MD SUPPORT","url":"${channelLink}"}` },
                                { name: "quick_reply", buttonParamsJson: '{"display_text":"🏠 MAIN MENU","id":"main_menu"}' }
                            ]
                        }
                    },
                    {
                        header: {
                            title: "🤖🌈 AI MENU 🌈🤖",
                            hasMediaAttachment: true,
                            imageMessage: { url: config.MENU_IMAGE_URL || "https://files.catbox.moe/kunzpz.png" }
                        },
                        body: { 
                            text: `╔═══✨ ${rainbow("AI COMMANDS")} ✨═══╗
┃ 🔰 **${rainbow("AI")}**
┃ 🔰 **${rainbow("GPT")}**
┃ 🔰 **${rainbow("BING")}**
┃ 🔰 **${rainbow("IMAGINE")}**
╚════════════════════╝`
                        },
                        nativeFlowMessage: {
                            buttons: [
                                { name: "cta_url", buttonParamsJson: `{"display_text":"📢 BILAL-MD SUPPORT","url":"${channelLink}"}` },
                                { name: "quick_reply", buttonParamsJson: '{"display_text":"🏠 MAIN MENU","id":"main_menu"}' }
                            ]
                        }
                    },
                    {
                        header: {
                            title: "🏆👑 MAIN MENU 👑🏆",
                            hasMediaAttachment: true,
                            imageMessage: { url: config.MENU_IMAGE_URL || "https://files.catbox.moe/kunzpz.png" }
                        },
                        body: { 
                            text: `╔═══👑 ${rainbow("MAIN COMMANDS")} 👑═══╗
┃ 🔰 **${rainbow("PING")}**
┃ 🔰 **${rainbow("ALIVE")}**
┃ 🔰 **${rainbow("RUNTIME")}**
┃ 🔰 **${rainbow("UPTIME")}**
┃ 🔰 **${rainbow("REPO")}**
┃ 🔰 **${rainbow("OWNER")}**
┃ 🔰 **${rainbow("MENU")}**
┃ 🔰 **${rainbow("MENU2")}**
┃ 🔰 **${rainbow("MENU3")}**
┃ 🔰 **${rainbow("MENU4")}**
┃ 🔰 **${rainbow("MENU5")}**
╚════════════════════╝`
                        },
                        nativeFlowMessage: {
                            buttons: [
                                { name: "cta_url", buttonParamsJson: `{"display_text":"📢 BILAL-MD SUPPORT","url":"${channelLink}"}` },
                                { name: "quick_reply", buttonParamsJson: '{"display_text":"⬅️ BACK","id":"menu"}' }
                            ]
                        }
                    }
                ]
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Fancy Menu with Channel Button Error:", e);
        await conn.sendMessage(from, { text: `_BOT ERROR: MENU BUTTON FAILED 😓_` }, { quoted: mek });
    }
});
