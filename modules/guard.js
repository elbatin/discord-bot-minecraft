const { AuditLogEvent } = require('discord.js');
const { logGonder, guardUyari } = require('./log');

// Kısa sürede gerçekleşen aksiyon sayısını izlemek için
const aksiyonSayac = new Map();

function aksiyonKaydet(userId) {
  const simdi = Date.now();
  const gecmis = aksiyonSayac.get(userId) || [];
  // Son 10 saniyedeki aksiyonları tut
  const guncel = [...gecmis.filter(t => simdi - t < 10000), simdi];
  aksiyonSayac.set(userId, guncel);
  return guncel.length;
}

async function yapaniGetir(guild, tip, limit = 1) {
  try {
    const logs = await guild.fetchAuditLogs({ type: tip, limit });
    const entry = logs.entries.first();
    if (!entry) return null;
    // Sadece son 5 saniyedeki aksiyonları geçerli say
    if (Date.now() - entry.createdTimestamp > 5000) return null;
    return entry.executor;
  } catch {
    return null;
  }
}

async function adminMi(guild, kullanici, config) {
  try {
    const uye = await guild.members.fetch(kullanici.id).catch(() => null);
    if (!uye) return false;
    return (
      uye.roles.cache.has(config.roles.admin) ||
      uye.permissions.has('Administrator')
    );
  } catch {
    return false;
  }
}

function baslat(client, config) {
  // Kanal silme koruması
  client.on('channelDelete', async (kanal) => {
    if (kanal.guild?.id !== config.guildId) return;
    const guild = kanal.guild;
    const yapan = await yapaniGetir(guild, AuditLogEvent.ChannelDelete);
    if (!yapan || yapan.id === client.user.id) return;

    if (await adminMi(guild, yapan, config)) return;

    const sayac = aksiyonKaydet(yapan.id);
    const embed = guardUyari(
      'Yetkisiz Kanal Silme',
      `**${kanal.name}** kanalı yetkisiz kişi tarafından silindi.\n10 saniyede ${sayac}. aksiyon.`,
      yapan
    );
    await logGonder(guild, config, embed);

    if (sayac >= 2) {
      await guild.members.ban(yapan.id, { reason: 'Guard: Toplu kanal silme' }).catch(() => {});
    }
  });

  // Rol silme koruması
  client.on('roleDelete', async (rol) => {
    if (rol.guild?.id !== config.guildId) return;
    const guild = rol.guild;
    const yapan = await yapaniGetir(guild, AuditLogEvent.RoleDelete);
    if (!yapan || yapan.id === client.user.id) return;

    if (await adminMi(guild, yapan, config)) return;

    const sayac = aksiyonKaydet(yapan.id);
    const embed = guardUyari(
      'Yetkisiz Rol Silme',
      `**${rol.name}** rolü yetkisiz kişi tarafından silindi.\n10 saniyede ${sayac}. aksiyon.`,
      yapan
    );
    await logGonder(guild, config, embed);

    if (sayac >= 2) {
      await guild.members.ban(yapan.id, { reason: 'Guard: Toplu rol silme' }).catch(() => {});
    }
  });

  // Yetkisiz ban koruması
  client.on('guildBanAdd', async (ban) => {
    if (ban.guild?.id !== config.guildId) return;
    const guild = ban.guild;

    // Botun kendisi banlanırsa yapacak bir şey yok, sadece logla
    if (ban.user.id === client.user.id) {
      console.error('[GUARD] Bot sunucudan banlandı!');
      return;
    }

    const yapan = await yapaniGetir(guild, AuditLogEvent.MemberBanAdd);
    if (!yapan || yapan.id === client.user.id) return;
    if (await adminMi(guild, yapan, config)) return;

    const embed = guardUyari(
      'Yetkisiz Ban',
      `${ban.user} kullanıcısı yetkisiz kişi tarafından banlandı.`,
      yapan
    );
    await logGonder(guild, config, embed);
  });

  // Yetkisiz kick (üye çıkarma) koruması
  client.on('guildMemberRemove', async (member) => {
    if (member.guild?.id !== config.guildId) return;
    if (member.user.bot) return;
    const guild = member.guild;

    try {
      const logs = await guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick, limit: 1 });
      const entry = logs.entries.first();
      if (!entry) return;
      if (entry.target.id !== member.user.id) return;
      if (Date.now() - entry.createdTimestamp > 5000) return;

      const yapan = entry.executor;
      if (!yapan || yapan.id === client.user.id) return;
      if (await adminMi(guild, yapan, config)) return;

      const embed = guardUyari(
        'Yetkisiz Kick',
        `${member.user} kullanıcısı yetkisiz kişi tarafından sunucudan atıldı.`,
        yapan
      );
      await logGonder(guild, config, embed);
    } catch {
      // Kick olmayabilir, normal çıkış
    }
  });

  console.log('[GUARD] Guard sistemi aktif.');
}

module.exports = { baslat };
