const { logGonder, banKaldirildi } = require('../modules/log');

module.exports = {
  name: 'guildBanRemove',
  async execute(ban, config) {
    await logGonder(ban.guild, config, banKaldirildi(ban));
  }
};
