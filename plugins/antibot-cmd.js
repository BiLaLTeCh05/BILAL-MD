const { cmd } = require('../command');

// Global flag for AntiBot mode
let antibotEnabled = false;

cmd({
    pattern: "antibot",
    react: "🤖",
    desc: "Enable or disable AntiBot protection in groups",
    category: "group",
    use: ".antibot on / .antibot off",
    filename: __filename
}, async (conn, mek, m, { text, isGroup, isAdmin }) => {
    try {
        if (!isGroup) return m.reply("⚠️ Yeh command sirf groups me use ho sakti hai.");
        if (!isAdmin) return m.reply("❌ Sirf *Group Admins* is command ko use kar sakte hain.");

        const choice = text.trim().toLowerCase();
        if (choice === "on") {
            antibotEnabled = true;
            return m.reply("✅ AntiBot mode *enabled* ho gaya hai. Ab koi bot detect hote hi remove ho jayega.");
        } else if (choice === "off") {
            antibotEnabled = false;
            return m.reply("🚫 AntiBot mode *disabled* ho gaya hai.");
        } else {
            return m.reply("❓ Usage: `.antibot on` ya `.antibot off` likho.");
        }
    } catch (e) {
        console.error("AntiBot Command Error:", e);
        return m.reply("❌ Kuch error aagaya hai, logs check karo.");
    }
});

// Export flag so antibot.js can use it
module.exports = {
    isAntibotEnabled: () => antibotEnabled
};
