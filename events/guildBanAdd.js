const { logGonder, banEklendi } = require('../modules/log');

module.exports = {
  name: 'guildBanAdd',
  async execute(ban, config) {
    await logGonder(ban.guild, config, banEklendi(ban));
  }
};
