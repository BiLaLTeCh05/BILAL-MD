let handler = async (m, { conn, args, usedPrefix, command }) => {
  let chat = global.db.data.chats[m.chat]
  if (!args[0]) {
    return m.reply(`⚙️ Usage:\n\n${usedPrefix + command} on\n${usedPrefix + command} off`)
  }

  if (args[0] === 'on') {
    chat.antiBot = true
    m.reply('✅ AntiBot activated! Now I will auto-remove bots.')
  } else if (args[0] === 'off') {
    chat.antiBot = false
    m.reply('❌ AntiBot deactivated!')
  } else {
    m.reply(`⚙️ Usage:\n\n${usedPrefix + command} on\n${usedPrefix + command} off`)
  }
}

handler.help = ['antibot <on/off>']
handler.tags = ['group']
handler.command = /^antibot$/i
handler.group = true
handler.admin = true

export default handler
