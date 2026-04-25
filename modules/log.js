const { EmbedBuilder } = require('discord.js');

async function logGonder(guild, config, embed) {
  try {
    const kanal = guild.channels.cache.get(config.channels.log);
    if (!kanal) return;
    await kanal.send({ embeds: [embed] });
  } catch (err) {
    console.error('[LOG] Log gönderilemedi:', err.message);
  }
}

function mesajSilindiEmbed(message) {
  return new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('🗑️ Mesaj Silindi')
    .addFields(
      { name: 'Kullanıcı', value: message.author ? message.author.toString() : '*Bilinmiyor*', inline: true },
      { name: 'Kanal', value: message.channel.toString(), inline: true },
      { name: 'İçerik', value: message.content ? message.content.slice(0, 1024) : '*[medya/embed]*' }
    )
    .setTimestamp();
}

function mesajDuzenlendi(eskiMesaj, yeniMesaj) {
  return new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle('✏️ Mesaj Düzenlendi')
    .addFields(
      { name: 'Kullanıcı', value: eskiMesaj.author ? eskiMesaj.author.toString() : '*Bilinmiyor*', inline: true },
      { name: 'Kanal', value: eskiMesaj.channel.toString(), inline: true },
      { name: 'Eski İçerik', value: eskiMesaj.content ? eskiMesaj.content.slice(0, 512) : '*[boş]*' },
      { name: 'Yeni İçerik', value: yeniMesaj.content ? yeniMesaj.content.slice(0, 512) : '*[boş]*' }
    )
    .setTimestamp();
}

function uyeGirdi(member) {
  return new EmbedBuilder()
    .setColor('#00FF88')
    .setTitle('➕ Üye Sunucuya Katıldı')
    .addFields(
      { name: 'Kullanıcı', value: member.user.toString(), inline: true },
      { name: 'Hesap Oluşturulma', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: `Toplam üye: ${member.guild.memberCount}` })
    .setTimestamp();
}

function uyeCikti(member) {
  return new EmbedBuilder()
    .setColor('#FFA500')
    .setTitle('➖ Üye Sunucudan Ayrıldı')
    .addFields(
      { name: 'Kullanıcı', value: member.user.toString(), inline: true },
      { name: 'Kullanıcı Adı', value: member.user.tag, inline: true }
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setFooter({ text: `Toplam üye: ${member.guild.memberCount}` })
    .setTimestamp();
}

function banEklendi(ban) {
  return new EmbedBuilder()
    .setColor('#8B0000')
    .setTitle('🔨 Kullanıcı Banlandı')
    .addFields(
      { name: 'Kullanıcı', value: ban.user.toString(), inline: true },
      { name: 'Kullanıcı Adı', value: ban.user.tag, inline: true },
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
      { name: 'Kullanıcı', value: ban.user.toString(), inline: true },
      { name: 'Kullanıcı Adı', value: ban.user.tag, inline: true }
    )
    .setThumbnail(ban.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp();
}

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
  banEklendi,
  banKaldirildi,
  guardUyari
};
