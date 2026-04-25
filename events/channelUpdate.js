const { AuditLogEvent } = require('discord.js');
const { logGonder, kanalGuncellendi } = require('../modules/log');

module.exports = {
  name: 'channelUpdate',
  async execute(eskiKanal, yeniKanal, config) {
    if (yeniKanal.guild?.id !== config.guildId) return;
    try {
      const logs = await yeniKanal.guild.fetchAuditLogs({ type: AuditLogEvent.ChannelUpdate, limit: 1 });
      const entry = logs.entries.first();
      const yetkili = entry && Date.now() - entry.createdTimestamp < 5000 ? entry.executor : null;
      const embed = kanalGuncellendi(eskiKanal, yeniKanal, yetkili);
      if (!embed) return;
      await logGonder(yeniKanal.guild, config, embed, 'kanal');
    } catch (err) {
      console.error('[LOG] Kanal güncelleme logu gönderilemedi:', err.message);
    }
  }
};