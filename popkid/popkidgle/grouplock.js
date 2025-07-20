import config from '../../config.cjs';

const groupControl = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (m.isGroup) {
    if (cmd === "lock") {
      await sock.groupUpdateSettings(m.from, 'announcement') // 'announcement' locks the group for non-admins
        .then(async (res) => {
          await m.react('🔒'); // Lock emoji
          await sock.sendMessage(m.from, { text: '*Group locked successfully! Only admins can send messages.*' }, { quoted: m });
        })
        .catch(async (err) => {
          console.error('Error locking group:', err);
          await sock.sendMessage(m.from, { text: '*Failed to lock the group. Make sure I am an admin.*' }, { quoted: m });
        });
    } else if (cmd === "unlock") {
      await sock.groupUpdateSettings(m.from, 'not_announcement') // 'not_announcement' unlocks the group
        .then(async (res) => {
          await m.react('🔓'); // Unlock emoji
          await sock.sendMessage(m.from, { text: '*Group unlocked! All members can now send messages.*' }, { quoted: m });
        })
        .catch(async (err) => {
          console.error('Error unlocking group:', err);
          await sock.sendMessage(m.from, { text: '*Failed to unlock the group. Make sure I am an admin.*' }, { quoted: m });
        });
    }
  }
};

export default groupControl;
