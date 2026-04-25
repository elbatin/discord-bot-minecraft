const { AuditLogEvent } = require('discord.js');
const { logGonder, kanalSilindi } = require('../modules/log');

module.exports = {
  name: 'channelDelete',
  async execute(kanal, config) {
    if (kanal.guild?.id !== config.guildId) return;
    try {
      const logs = await kanal.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelDelete, limit: 1 });
      const entry = logs.entries.first();
      const yetkili = entry && Date.now() - entry.createdTimestamp < 5000 ? entry.executor : null;
      const embed = kanalSilindi(kanal, yetkili);
      await logGonder(kanal.guild, config, embed, 'kanal');
    } catch (err) {
      console.error('[LOG] Kanal silme logu gönderilemedi:', err.message);
    }
  }
};