module.exports = async (conn, from, sender) => {
  const groupMetadata = await conn.groupMetadata(from);
  const groupAdmins = groupMetadata.participants
    .filter(p => p.admin)
    .map(p => p.id);

  // Bot ka JID normalize karke check karo
  const botNumber = (conn.user.id.split(":")[0]) + "@s.whatsapp.net";

  const isBotAdmin = groupAdmins.includes(botNumber);
  const isSenderAdmin = groupAdmins.includes(sender);

  return { isBotAdmin, isSenderAdmin };
};
