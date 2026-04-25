/**
 * Otorol Modülü
 * Bot ve kullanıcılar için ayrı rol listesi destekler.
 *
 * config.roles.otorol        → normal kullanıcılara verilecek roller (string[] veya string)
 * config.roles.otorolBot     → botlara verilecek roller (string[] veya string, opsiyonel)
 */
async function otorolVer(member, config) {
  const isBot = member.user.bot;

  let roller;
  if (isBot) {
    roller = config.roles?.otorolBot;
    if (!roller || roller.length === 0) return;
    roller = Array.isArray(roller) ? roller : [roller];
  } else {
    roller = config.roles?.otorol;
    if (!roller || roller.length === 0) return;
    roller = Array.isArray(roller) ? roller : [roller];
  }

  for (const rolId of roller) {
    if (!rolId || rolId.startsWith('ROL_ID')) continue;
    await member.roles.add(rolId).catch(err => {
      console.error(`[OTOROL] Rol verilemedi (${rolId}):`, err.message);
    });
  }
}

module.exports = { otorolVer };