const { logGonder, uyeCikti } = require('../modules/log');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member, config) {
    if (member.user.bot) return;
    await logGonder(member.guild, config, uyeCikti(member));
  }
};
