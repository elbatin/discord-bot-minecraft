const { EmbedBuilder } = require('discord.js');

/**
 * Belirtilen log kanalına embed gönderir.
 * config.channels.log[tip] formatını destekler (ayrı kanallar).
 * Geriye dönük uyumluluk için config.channels.log string olarak da çalışır.
 */
async function logGonder(guild, config, embed, tip = 'genel') {
  try {
    let kanalId;
    const logConfig = config.channels?.log;

    if (typeof logConfig === 'object' && logConfig !== null) {
      kanalId = logConfig[tip] || logConfig['genel'];
    } else {
      kanalId = logConfig;
    }

    if (!kanalId) return;
    const kanal = guild.channels.cache.get(kanalId);
    if (!kanal) return;
    await kanal.send({ embeds: [embed] });
  } catch (err) {
    console.error('[LOG] Log gönderilemedi:', err.message);
  }
}

// ─── Mesaj Logları ───────────────────────────────────────────────

function mesajSilindiEmbed(message) {
  return new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('🗑️ Mesaj Silindi')
    .addFields(
      { name: 'Kullanıcı', value: message.author ? `${message.author} (${message.author.tag})` : '*Bilinmiyor*', inline: true },
      { name: 'Kanal', value: message.channel.toString(), inline: true },
      { name: 'İçerik', value: message.content ? message.content.slice(0, 1024) : '*[medya/embed/boş]*' }
    )
    .setTimestamp();
}

function mesajDuzenlendi(eskiMesaj, yeniMesaj) {
  return new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle('✏️ Mesaj Düzenlendi')
    .addFields(
      { name: 'Kullanıcı', value: eskiMesaj.author ? `${eskiMesaj.author} (${eskiMesaj.author.tag})` : '*Bilinmiyor*', inline: true },
      { name: 'Kanal', value: eskiMesaj.channel.toString(), inline: true },
      { name: 'Mesaj Linki', value: `[Tıkla](${yeniMesaj.url})`, inline: true },
      { name: 'Eski İçerik', value: eskiMesaj.content ? eskiMesaj.content.slice(0, 512) : '*[boş]*' },
      { name: 'Yeni İçerik', value: yeniMesaj.content ? yeniMesaj.content.slice(0, 512) : '*[boş]*' }
    )
    .setTimestamp();
}

// ─── Üye Logları ─────────────────────────────────────────────────

function uyeGirdi(member) {
  const hesapYas = Math.floor((Date.now() - member.user.createdTimestamp) / 86400000);
  return new EmbedBuilder()
    .setColor('#00FF88')
    .setTitle('➕ Üye Sunucuya Katıldı')
    .addFields(
      { name: 'Kullanıcı', value: `${member.user} (${member.user.tag})`, inline: true },
      { name: 'ID', value: member.id, inline: true },
      { name: 'Hesap Yaşı', value: `${hesapYas} gün`, inline: true },
      { name: 'Hesap Oluşturulma', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: `Toplam üye: ${member.guild.memberCount}` })
    .setTimestamp();
}

function uyeCikti(member) {
  const roller = member.roles.cache
    .filter(r => r.id !== member.guild.id)
    .map(r => r.toString())
    .join(', ') || '*Yok*';

  return new EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('➖ Üye Sunucudan Ayrıldı')
    .addFields(
      { name: 'Kullanıcı', value: `${member.user} (${member.user.tag})`, inline: true },
      { name: 'ID', value: member.id, inline: true },
      { name: 'Roller', value: roller.slice(0, 1024) }
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: `Toplam üye: ${member.guild.memberCount}` })
    .setTimestamp();
}

// ─── Moderasyon Logları ───────────────────────────────────────────

function kicklendi(member, yetkili, sebep) {
  return new EmbedBuilder()
    .setColor('#FF6600')
    .setTitle('👢 Kullanıcı Atıldı (Kick)')
    .addFields(
      { name: 'Kullanıcı', value: `${member.user} (${member.user.tag})`, inline: true },
      { name: 'ID', value: member.id, inline: true },
      { name: 'Yetkili', value: yetkili ? yetkili.toString() : '*Bilinmiyor*', inline: true },
      { name: 'Sebep', value: sebep || '*Belirtilmedi*' }
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp();
}

function banEklendi(ban) {
  return new EmbedBuilder()
    .setColor('#8B0000')
    .setTitle('🔨 Kullanıcı Banlandı')
    .addFields(
      { name: 'Kullanıcı', value: `${ban.user} (${ban.user.tag})`, inline: true },
      { name: 'ID', value: ban.user.id, inline: true },
      { name: 'Sebep', value: ban.reason || '*Belirtilmedi*' }
    )
    .setThumbnail(ban.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp();
}

function banKaldirildi(ban) {
  return new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('🔓 Ban Kaldırıldı')
    .addFields(
      { name: 'Kullanıcı', value: `${ban.user} (${ban.user.tag})`, inline: true },
      { name: 'ID', value: ban.user.id, inline: true }
    )
    .setThumbnail(ban.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp();
}

function timeoutUygulandi(member, sure, yetkili, sebep) {
  return new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle('⏱️ Timeout Uygulandı')
    .addFields(
      { name: 'Kullanıcı', value: `${member.user} (${member.user.tag})`, inline: true },
      { name: 'Yetkili', value: yetkili ? yetkili.toString() : '*Bilinmiyor*', inline: true },
      { name: 'Süre', value: sure, inline: true },
      { name: 'Sebep', value: sebep || '*Belirtilmedi*' }
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp();
}

function timeoutKaldirildi(member, yetkili) {
  return new EmbedBuilder()
    .setColor('#00FF88')
    .setTitle('✅ Timeout Kaldırıldı')
    .addFields(
      { name: 'Kullanıcı', value: `${member.user} (${member.user.tag})`, inline: true },
      { name: 'Yetkili', value: yetkili ? yetkili.toString() : '*Bilinmiyor*', inline: true }
    )
    .setTimestamp();
}

// ─── Rol Logları ──────────────────────────────────────────────────

function rolOlusturuldu(rol, yetkili) {
  return new EmbedBuilder()
    .setColor('#00CC88')
    .setTitle('🎭 Rol Oluşturuldu')
    .addFields(
      { name: 'Rol', value: `${rol} (${rol.name})`, inline: true },
      { name: 'Yetkili', value: yetkili ? yetkili.toString() : '*Bilinmiyor*', inline: true }
    )
    .setTimestamp();
}

function rolSilindi(rol, yetkili) {
  return new EmbedBuilder()
    .setColor('#FF4444')
    .setTitle('🗑️ Rol Silindi')
    .addFields(
      { name: 'Rol Adı', value: rol.name, inline: true },
      { name: 'Yetkili', value: yetkili ? yetkili.toString() : '*Bilinmiyor*', inline: true }
    )
    .setTimestamp();
}

function rolGuncellendi(eskiRol, yeniRol, yetkili) {
  const degisiklikler = [];
  if (eskiRol.name !== yeniRol.name) degisiklikler.push(`Ad: **${eskiRol.name}** → **${yeniRol.name}**`);
  if (eskiRol.color !== yeniRol.color) degisiklikler.push(`Renk: **${eskiRol.hexColor}** → **${yeniRol.hexColor}**`);
  if (eskiRol.hoist !== yeniRol.hoist) degisiklikler.push(`Ayrı Görünsün: **${eskiRol.hoist}** → **${yeniRol.hoist}**`);
  if (degisiklikler.length === 0) return null;

  return new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle('✏️ Rol Güncellendi')
    .addFields(
      { name: 'Rol', value: `${yeniRol} (${yeniRol.name})`, inline: true },
      { name: 'Yetkili', value: yetkili ? yetkili.toString() : '*Bilinmiyor*', inline: true },
      { name: 'Değişiklikler', value: degisiklikler.join('\n') }
    )
    .setTimestamp();
}

function uyeRolEklendi(member, rol, yetkili) {
  return new EmbedBuilder()
    .setColor('#00FF88')
    .setTitle('➕ Üyeye Rol Eklendi')
    .addFields(
      { name: 'Üye', value: `${member.user} (${member.user.tag})`, inline: true },
      { name: 'Eklenen Rol', value: `${rol}`, inline: true },
      { name: 'Yetkili', value: yetkili ? yetkili.toString() : '*Bilinmiyor*', inline: true }
    )
    .setTimestamp();
}

function uyeRolAlindi(member, rol, yetkili) {
  return new EmbedBuilder()
    .setColor('#FF4444')
    .setTitle('➖ Üyeden Rol Alındı')
    .addFields(
      { name: 'Üye', value: `${member.user} (${member.user.tag})`, inline: true },
      { name: 'Alınan Rol', value: `${rol}`, inline: true },
      { name: 'Yetkili', value: yetkili ? yetkili.toString() : '*Bilinmiyor*', inline: true }
    )
    .setTimestamp();
}

// ─── Kanal Logları ────────────────────────────────────────────────

function kanalOlusturuldu(kanal, yetkili) {
  return new EmbedBuilder()
    .setColor('#00CC88')
    .setTitle('📁 Kanal Oluşturuldu')
    .addFields(
      { name: 'Kanal', value: `${kanal} (${kanal.name})`, inline: true },
      { name: 'Tür', value: kanal.type.toString(), inline: true },
      { name: 'Yetkili', value: yetkili ? yetkili.toString() : '*Bilinmiyor*', inline: true }
    )
    .setTimestamp();
}

function kanalSilindi(kanal, yetkili) {
  return new EmbedBuilder()
    .setColor('#FF4444')
    .setTitle('🗑️ Kanal Silindi')
    .addFields(
      { name: 'Kanal Adı', value: kanal.name, inline: true },
      { name: 'Tür', value: kanal.type.toString(), inline: true },
      { name: 'Yetkili', value: yetkili ? yetkili.toString() : '*Bilinmiyor*', inline: true }
    )
    .setTimestamp();
}

function kanalGuncellendi(eskiKanal, yeniKanal, yetkili) {
  const degisiklikler = [];
  if (eskiKanal.name !== yeniKanal.name) degisiklikler.push(`Ad: **${eskiKanal.name}** → **${yeniKanal.name}**`);
  if (eskiKanal.topic !== yeniKanal.topic) degisiklikler.push(`Konu: **${eskiKanal.topic || 'boş'}** → **${yeniKanal.topic || 'boş'}**`);
  if (degisiklikler.length === 0) return null;

  return new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle('✏️ Kanal Güncellendi')
    .addFields(
      { name: 'Kanal', value: `${yeniKanal} (${yeniKanal.name})`, inline: true },
      { name: 'Yetkili', value: yetkili ? yetkili.toString() : '*Bilinmiyor*', inline: true },
      { name: 'Değişiklikler', value: degisiklikler.join('\n') }
    )
    .setTimestamp();
}

// ─── Guard Logları ────────────────────────────────────────────────

function guardUyari(baslik, aciklama, yapan) {
  return new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle(`🛡️ GUARD — ${baslik}`)
    .setDescription(aciklama)
    .addFields({ name: 'Yapan Kişi', value: yapan ? yapan.toString() : '*Bilinmiyor*' })
    .setTimestamp();
}

module.exports = {
  logGonder,
  mesajSilindiEmbed,
  mesajDuzenlendi,
  uyeGirdi,
  uyeCikti,
  kicklendi,
  banEklendi,
  banKaldirildi,
  timeoutUygulandi,
  timeoutKaldirildi,
  rolOlusturuldu,
  rolSilindi,
  rolGuncellendi,
  uyeRolEklendi,
  uyeRolAlindi,
  kanalOlusturuldu,
  kanalSilindi,
  kanalGuncellendi,
  guardUyari
};