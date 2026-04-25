const { AuditLogEvent } = require('discord.js');
const { logGonder, uyeRolEklendi, uyeRolAlindi, timeoutUygulandi, timeoutKaldirildi } = require('../modules/log');

module.exports = {
  name: 'guildMemberUpdate',
  async execute(eskiUye, yeniUye, config) {
    if (eskiUye.guild?.id !== config.guildId) return;
    const guild = eskiUye.guild;

    // ── Timeout değişimi ─────────────────────────────────────────
    const eskiTimeout = eskiUye.communicationDisabledUntilTimestamp;
    const yeniTimeout = yeniUye.communicationDisabledUntilTimestamp;

    if (!eskiTimeout && yeniTimeout && yeniTimeout > Date.now()) {
      try {
        const logs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberUpdate, limit: 1 });
        const entry = logs.entries.first();
        const yetkili = entry && Date.now() - entry.createdTimestamp < 5000 ? entry.executor : null;
        const kalacakMs = yeniTimeout - Date.now();
        const sure = kalacakMs < 60000
          ? `${Math.round(kalacakMs / 1000)}s`
          : kalacakMs < 3600000
          ? `${Math.round(kalacakMs / 60000)}dk`
          : kalacakMs < 86400000
          ? `${Math.round(kalacakMs / 3600000)}s`
          : `${Math.round(kalacakMs / 86400000)}g`;

        const embed = timeoutUygulandi(yeniUye, sure, yetkili, entry?.reason);
        await logGonder(guild, config, embed, 'moderasyon');
      } catch (err) {
        console.error('[LOG] Timeout logu gönderilemedi:', err.message);
      }
      return;
    }

    if (eskiTimeout && eskiTimeout > Date.now() && (!yeniTimeout || yeniTimeout <= Date.now())) {
      try {
        const logs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberUpdate, limit: 1 });
        const entry = logs.entries.first();
        const yetkili = entry && Date.now() - entry.createdTimestamp < 5000 ? entry.executor : null;
        const embed = timeoutKaldirildi(yeniUye, yetkili);
        await logGonder(guild, config, embed, 'moderasyon');
      } catch (err) {
        console.error('[LOG] Timeout kaldırma logu gönderilemedi:', err.message);
      }
      return;
    }

    // ── Rol değişimi ──────────────────────────────────────────────
    const eklenenRoller = yeniUye.roles.cache.filter(r => !eskiUye.roles.cache.has(r.id));
    const alinanRoller = eskiUye.roles.cache.filter(r => !yeniUye.roles.cache.has(r.id));

    if (eklenenRoller.size === 0 && alinanRoller.size === 0) return;

    try {
      const logs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberRoleUpdate, limit: 1 });
      const entry = logs.entries.first();
      const yetkili = entry && Date.now() - entry.createdTimestamp < 5000 ? entry.executor : null;

      for (const [, rol] of eklenenRoller) {
        const embed = uyeRolEklendi(yeniUye, rol, yetkili);
        await logGonder(guild, config, embed, 'rol');
      }
      for (const [, rol] of alinanRoller) {
        const embed = uyeRolAlindi(yeniUye, rol, yetkili);
        await logGonder(guild, config, embed, 'rol');
      }
    } catch (err) {
      console.error('[LOG] Rol güncelleme logu gönderilemedi:', err.message);
    }
  }
};