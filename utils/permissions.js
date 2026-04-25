const { PermissionFlagsBits } = require('discord.js');

function yetkiKontrol(member, config) {
  if (!member) return false;
  return (
    member.roles.cache.has(config.roles.yetkili) ||
    member.roles.cache.has(config.roles.admin) ||
    member.permissions.has(PermissionFlagsBits.Administrator)
  );
}

function adminKontrol(member, config) {
  if (!member) return false;
  return (
    member.roles.cache.has(config.roles.admin) ||
    member.permissions.has(PermissionFlagsBits.Administrator)
  );
}

module.exports = { yetkiKontrol, adminKontrol };
