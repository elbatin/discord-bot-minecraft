const { logGonder, mesajDuzenlendi } = require('../modules/log');

module.exports = {
  name: 'messageUpdate',
  async execute(eskiMesaj, yeniMesaj, config) {
    if (!eskiMesaj.guild) return;
    if (eskiMesaj.author?.bot) return;
    if (!eskiMesaj.author) return;
    if (eskiMesaj.content === yeniMesaj.content) return;
    await logGonder(eskiMesaj.guild, config, mesajDuzenlendi(eskiMesaj, yeniMesaj));
  }
};
