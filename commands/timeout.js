const { EmbedBuilder } = require('discord.js');
const { yetkiVarMi } = require('../modules/yetki');

const SURELER = {
  '60s': 60,
  '5m': 300,
  '10m': 600,
  '30m': 1800,
  '1s': 3600,
  '1g': 86400,
  '1h': 604800
};

module.exports = {
  name: 'timeout',
  description: 'Kullanıcıyı susturur. Kullanım: .timeout @kullanıcı 10m [sebep]',
  async execute(message, args, config) {
    if (!yetkiVarMi(message.member, config)) {
      const uyari = await message.reply('❌ Bu komutu kullanmak için yetkiniz bulunmamaktadır.');
      setTimeout(() => uyari.delete().catch(() => {}), 8000);
      message.delete().catch(() => {});
      return;
    }

    const hedef = message.mentions.members.first();
    const sureArg = args[1]?.toLowerCase();

    if (!hedef || !sureArg) {
      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('⏱️ Timeout Komutu')
        .addFields({
          name: 'Kullanım',
          value: '`.timeout @kullanıcı <süre> [sebep]`'
        }, {
          name: 'Süre Seçenekleri',
          value: '`60s` · `5m` · `10m` · `30m` · `1s` (saat) · `1g` (gün) · `1h` (hafta)'
        });
      const msg = await message.reply({ embeds: [embed] });
      setTimeout(() => msg.delete().catch(() => {}), 20000);
      message.delete().catch(() => {});
      return;
    }

    const saniye = SURELER[sureArg];
    if (!saniye) {
      const uyari = await message.reply(`❌ Geçersiz süre. Geçerli seçenekler: ${Object.keys(SURELER).join(', ')}`);
      setTimeout(() => uyari.delete().catch(() => {}), 8000);
      message.delete().catch(() => {});
      return;
    }

    if (!hedef.moderatable) {
      const uyari = await message.reply('❌ Bu kullanıcıya timeout uygulanamıyor.');
      setTimeout(() => uyari.delete().catch(() => {}), 8000);
      message.delete().catch(() => {});
      return;
    }

    const sebep = args.slice(2).join(' ') || 'Sebep belirtilmedi';
    await hedef.timeout(saniye * 1000, `${message.author.tag} tarafından: ${sebep}`);

    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('⏱️ Timeout Uygulandı')
      .addFields(
        { name: 'Kullanıcı', value: hedef.user.toString(), inline: true },
        { name: 'Yetkili', value: message.author.toString(), inline: true },
        { name: 'Süre', value: sureArg, inline: true },
        { name: 'Sebep', value: sebep }
      )
      .setThumbnail(hedef.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    const msg = await message.reply({ embeds: [embed] });
    setTimeout(() => msg.delete().catch(() => {}), 30000);
    message.delete().catch(() => {});
  }
};