const { AuditLogEvent } = require('discord.js');
const { logGonder, kanalOlusturuldu } = require('../modules/log');

module.exports = {
  name: 'channelCreate',
  async execute(kanal, config) {
    if (kanal.guild?.id !== config.guildId) return;
    try {
      const logs = await kanal.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelCreate, limit: 1 });
      const entry = logs.entries.first();
      const yetkili = entry && Date.now() - entry.createdTimestamp < 5000 ? entry.executor : null;
      const embed = kanalOlusturuldu(kanal, yetkili);
      await logGonder(kanal.guild, config, embed, 'kanal');
    } catch (err) {
      console.error('[LOG] Kanal oluşturma logu gönderilemedi:', err.message);
    }
  }
};