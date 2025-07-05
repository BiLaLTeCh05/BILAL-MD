import config from '../../config.cjs';

const modeCommand = async (m, Matrix) => {
  const botNumber = await Matrix.decodeJid(Matrix.user.id);
  const isCreator = [botNumber, config.OWNER_NUMBER + '@s.whatsapp.net'].includes(m.sender);
  const prefix = config.PREFIX;
  const cmd = m.body.slice(prefix.length).split(' ')[0].toLowerCase();
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd !== 'mode') return;

  const sendStyled = (msg) =>
    Matrix.sendMessage(m.from, {
      text: msg,
      contextInfo: {
        externalAdReply: {
          title: "💻 POPKID-XMD // MODECORE™",
          body: "System Access Node | Terminal vX.3.2",
          thumbnailUrl: "https://i.ibb.co/hWsYdX0/pkmode.jpg",
          mediaType: 1,
          mediaUrl: "https://github.com/devpopkid",
          sourceUrl: "https://github.com/devpopkid"
        },
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363290715861418@newsletter",
          newsletterName: "🧠 POPKID-XMD // CORE ENGINE"
        }
      }
    });

  // 🛑 Intruder Warning
  if (!isCreator) {
    return sendStyled(`
┏━[🚨 SYSTEM BREACH DETECTED]━┓
┃
┃ ⚠️ *UNAUTHORIZED ACCESS* ⚠️
┃ 🧑‍💻 User: ${m.pushName || "Unknown"}
┃ 🔒 Command locked to OWNER only.
┃
┃ 🔁 Report logged to POPKID-Net™
┃ 🧬 Firewall status: *ACTIVE*
┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛`);
  }

  // ✅ Mode Switch
  if (['public', 'private'].includes(text.toLowerCase())) {
    const mode = text.toLowerCase();
    Matrix.public = mode === 'public';
    config.MODE = mode;

    return sendStyled(`
┏━[⚙️ MODECORE™ UPDATE]━┓
┃
┃ ✅ *MODE OVERRIDE SUCCESS*
┃ 🔧 MODE: ${mode.toUpperCase()}
┃
┃ 🔓 PUBLIC  ➤ Anyone can use bot
┃ 🔐 PRIVATE ➤ Owner-only access
┃
┃ 🧠 ENGINE: POPKID-XMD vX.3.2
┃ 🌐 Status: LINKED ✔️
┃
┗━━━━━━━━━━━━━━━━━━━━━━━┛`);
  }

  // ⚙️ Help Menu
  return sendStyled(`
┏━[🧩 MODECORE™ HELP PANEL]━┓
┃
┃ 🧾 *COMMAND USAGE:*
┃
┃ ▶ .mode public
┃    ➤ Unlock bot globally
┃
┃ ▶ .mode private
┃    ➤ Lock bot to OWNER only
┃
┃ 📡 Current MODE: ${config.MODE?.toUpperCase() || 'UNKNOWN'}
┃ 🧠 Core: POPKID-XMD vX.3.2
┃
┗━━━━━━━━━━━━━━━━━━━━━━━┛`);
};

export default modeCommand;
