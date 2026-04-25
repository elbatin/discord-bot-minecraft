const { AuditLogEvent } = require('discord.js');
const { logGonder, rolGuncellendi } = require('../modules/log');

module.exports = {
  name: 'roleUpdate',
  async execute(eskiRol, yeniRol, config) {
    if (yeniRol.guild?.id !== config.guildId) return;
    try {
      const logs = await yeniRol.guild.fetchAuditLogs({ type: AuditLogEvent.RoleUpdate, limit: 1 });
      const entry = logs.entries.first();
      const yetkili = entry && Date.now() - entry.createdTimestamp < 5000 ? entry.executor : null;
      const embed = rolGuncellendi(eskiRol, yeniRol, yetkili);
      if (!embed) return;
      await logGonder(yeniRol.guild, config, embed, 'rol');
    } catch (err) {
      console.error('[LOG] Rol güncelleme logu gönderilemedi:', err.message);
    }
  }
};