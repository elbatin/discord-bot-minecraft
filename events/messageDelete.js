const { logGonder, mesajSilindiEmbed } = require('../modules/log');

module.exports = {
  name: 'messageDelete',
  async execute(message, config) {
    if (!message.guild) return;
    if (message.author?.bot) return;
    if (!message.author) return;
    await logGonder(message.guild, config, mesajSilindiEmbed(message));
  }
};
