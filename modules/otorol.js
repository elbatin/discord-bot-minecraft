async function otorolVer(member, config) {
  const roller = config.roles.otorol;
  if (!roller || roller.length === 0) return;

  for (const rolId of roller) {
    if (rolId === 'ROL_ID_1' || rolId === 'ROL_ID_2') continue;
    await member.roles.add(rolId).catch((err) => {
      console.error(`[OTOROL] Rol verilemedi (${rolId}):`, err.message);
    });
  }
}

module.exports = { otorolVer };
