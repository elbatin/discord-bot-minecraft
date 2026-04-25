const { AuditLogEvent } = require('discord.js');
const { logGonder, rolSilindi } = require('../modules/log');

module.exports = {
  name: 'roleDelete',
  async execute(rol, config) {
    if (rol.guild?.id !== config.guildId) return;
    try {
      const logs = await rol.guild.fetchAuditLogs({ type: AuditLogEvent.RoleDelete, limit: 1 });
      const entry = logs.entries.first();
      const yetkili = entry && Date.now() - entry.createdTimestamp < 5000 ? entry.executor : null;
      const embed = rolSilindi(rol, yetkili);
      await logGonder(rol.guild, config, embed, 'rol');
    } catch (err) {
      console.error('[LOG] Rol silme logu gönderilemedi:', err.message);
    }
  }
};