import fs from 'fs';
import acrcloud from 'acrcloud';
import config from '../../config.cjs';

const acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
  access_key: '716b4ddfa557144ce0a459344fe0c2c9',
  access_secret: 'Lz75UbI8g6AzkLRQgTgHyBlaQq9YT5wonr3xhFkf'
});

const shazam = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const text = m.body.slice(prefix.length + cmd.length).trim();

    const validCommands = ['shazam', 'popkidfind', 'whatmusic'];
    if (!validCommands.includes(cmd)) return;

    const quoted = m.quoted || {};

    if (!quoted || (quoted.mtype !== 'audioMessage' && quoted.mtype !== 'videoMessage')) {
      return m.reply('🎶 Please quote an audio or video message to identify the music.');
    }

    const mime = m.quoted.mimetype;
    try {
      const media = await m.quoted.download();
      const filePath = `./${Date.now()}.mp3`;
      fs.writeFileSync(filePath, media);

      m.reply('🎧 Identifying... Please wait a moment.');

      const res = await acr.identify(fs.readFileSync(filePath));
      const { code, msg } = res.status;

      if (code !== 0) {
        throw new Error(msg);
      }

      if (res.metadata && res.metadata.music && res.metadata.music.length > 0) {
        const { title, artists, album, genres, release_date } = res.metadata.music[0];
        const artistNames = artists ? artists.map(v => v.name).join(', ') : 'Not Found';
        const genreNames = genres ? genres.map(v => v.name).join(', ') : 'Not Found';
        const albumName = album ? album.name : 'Not Found';
        const release = release_date || 'Not Found';

        const txt = `🎼 *Music Found!* 🎼

📌 *Title:* ${title}
🎤 *Artist(s):* ${artistNames}
💿 *Album:* ${albumName}
 Genre(s): ${genreNames}
🗓️ *Release Date:* ${release}
        `.trim();

        fs.unlinkSync(filePath);
        m.reply(txt);
      } else {
        fs.unlinkSync(filePath);
        m.reply('😔 Sorry, no music information was found for this audio.');
      }
    } catch (error) {
      console.error(error);
      m.reply('⚠️ An error occurred while trying to identify the music.');
    }
  } catch (error) {
    console.error('Error:', error);
    m.reply('❗ An unexpected error occurred.');
  }
};

export default shazam;
