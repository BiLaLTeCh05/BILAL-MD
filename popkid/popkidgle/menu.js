import config from '../../config.cjs';

const startTime = Date.now();

const formatRuntime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};

const menu = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "menu") {
    const start = new Date().getTime();
    await m.React('🪆');
    const end = new Date().getTime();
    const responseTime = (end - start) / 1000;

    const runtime = formatRuntime(Date.now() - startTime);
    const mode = m.isGroup ? "public" : "private";
    const ownerName = config.OWNER_NAME || "POPKID";

    let profilePictureUrl = 'https://files.catbox.moe/e1k73u.jpg';
    try {
      const pp = await sock.profilePictureUrl(m.sender, 'image');
      if (pp) profilePictureUrl = pp;
    } catch (err) {
      console.error("Error fetching profile picture:", err);
    }

    const menuText = `

╔══⬡ POPKID-XD BOT V2 ⬡══╗
┃ 🧠 Dev   : Popkid KE
┃ 🤖 Name  : Popkid-XD
┃ ⚡ Uptime: ${runtime}
┃ 🌐 Mode  : ${mode}
┃ 🆙 Ver.  : 2.0.0
┃ 🔧 Prefix: ${prefix}
┃ 👑 Owner : ${ownerName}
╚════════════════════╝

╔═『 *🌟 MAIN MENU* 』═╗
┃ ⏺️ .menu
┃ ⏺️ .speed
┃ ⏺️ .alive
┃ ⏺️ .bugmenu
┃ ⏺️ .owner
┃ ⏺️ .allcmds
┃ ⏺️ .addpremium
┃ ⏺️ .repo
┃ ⏺️ .dev
┃ ⏺️ .ping
┃ ⏺️ .version
╚════════════════════╝

╔═『 *👑 OWNER ZONE* 』═╗
┃ 👑 .join
┃ 👑 .autoread
┃ 👑 .pair
┃ 👑 .leave
┃ 👑 .jid
┃ 👑 .autoblock
┃ 👑 .statusreply
┃ 👑 .restart
┃ 👑 .host
┃ 👑 .upload
┃ 👑 .vv
┃ 👑 .alwaysonline
┃ 👑 .block
┃ 👑 .unblock
┃ 👑 .setstatusmsg
┃ 👑 .setprefix
┃ 👑 .setownername
╚════════════════════╝

╔═『 *🤖 AI SECTION* 』═╗
┃ 🤖 .ai
┃ 🤖 .gpt
┃ 🤖 .lydia
┃ 🤖 .gemini
┃ 🤖 .chatbot
╚════════════════════╝

╔═『 *🎨 CONVERTERS* 』═╗
┃ 🎨 .attp
┃ 🎨 .sticker
┃ 🎨 .take
┃ 🎨 .mp3
┃ 🎨 .ss
┃ 🎨 .shorten
╚════════════════════╝

╔═『 *🔍 SEARCH* 』════╗
┃ 🔍 .play
┃ 🔍 .video
┃ 🔍 .song
┃ 🔍 .ytsearch
┃ 🔍 .mediafire
┃ 🔍 .facebook
┃ 🔍 .instagram
┃ 🔍 .tiktok
┃ 🔍 .githubstalk
┃ 🔍 .lyrics
┃ 🔍 .app
┃ 🔍 .pinterest
┃ 🔍 .imdb
┃ 🔍 .ipstalk
╚════════════════════╝

╔═『 *👥 GROUP ZONE* 』═╗
┃ 👥 .kickall
┃ 👥 .remove
┃ 👥 .tagall
┃ 👥 .hidetag
┃ 👥 .group open
┃ 👥 .group close
┃ 👥 .add
┃ 👥 .vcf
┃ 👥 .left
┃ 👥 .promoteall
┃ 👥 .demoteall
┃ 👥 .setdescription
┃ 👥 .linkgc
┃ 👥 .antilink
┃ 👥 .antisticker
┃ 👥 .antispam
┃ 👥 .create
┃ 👥 .setname
┃ 👥 .promote
┃ 👥 .demote
┃ 👥 .groupinfo
┃ 👥 .balance
╚════════════════════╝

╔═『 *🎧 AUDIO FX* 』═══╗
┃ 🎧 .earrape
┃ 🎧 .deep
┃ 🎧 .blown
┃ 🎧 .bass
┃ 🎧 .nightcore
┃ 🎧 .fat
┃ 🎧 .fast
┃ 🎧 .robot
┃ 🎧 .tupai
┃ 🎧 .smooth
┃ 🎧 .slow
┃ 🎧 .reverse
╚══════════════════╝

╔═『 *😊 REACTIONS* 』══╗
┃ 😊 .bonk
┃ 😊 .bully
┃ 😊 .yeet
┃ 😊 .slap
┃ 😊 .nom
┃ 😊 .poke
┃ 😊 .awoo
┃ 😊 .wave
┃ 😊 .smile
┃ 😊 .dance
┃ 😊 .smug
┃ 😊 .blush
┃ 😊 .cringe
┃ 😊 .sad
┃ 😊 .happy
┃ 😊 .shinobu
┃ 😊 .cuddle
┃ 😊 .glomp
┃ 😊 .handhold
┃ 😊 .highfive
┃ 😊 .kick
┃ 😊 .kill
┃ 😊 .kiss
┃ 😊 .cry
┃ 😊 .bite
┃ 😊 .lick
┃ 😊 .pat
┃ 😊 .hug
╚════════════════════╝

╭─────────────◆
│ ⚡ *POPKID TECH NEWS*
│ Stay updated with the
│ latest tools, bots, and
│ tips from Popkid KE!
╰─────────────◆
`;

    await sock.sendMessage(m.from, {
      image: { url: profilePictureUrl },
      caption: menuText.trim(),
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "POPKID TECH",
          newsletterJid: "120363420342566562@newsletter"
        }
      }
    }, { quoted: m });
  }
};

export default menu;
