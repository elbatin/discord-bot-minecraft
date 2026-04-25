const { EmbedBuilder } = require('discord.js');
const { yetkiVarMi } = require('../modules/yetki');

module.exports = {
  name: 'temizle',
  description: 'Kanaldan mesaj siler. Kullanım: .temizle <1-100> [@kullanıcı]',
  async execute(message, args, config) {
    if (!yetkiVarMi(message.member, config)) {
      const uyari = await message.reply('❌ Bu komutu kullanmak için yetkiniz bulunmamaktadır.');
      setTimeout(() => uyari.delete().catch(() => {}), 8000);
      message.delete().catch(() => {});
      return;
    }

    const adet = parseInt(args[0]);
    if (isNaN(adet) || adet < 1 || adet > 100) {
      const uyari = await message.reply('❌ 1 ile 100 arasında bir sayı girin. Örn: `.temizle 10`');
      setTimeout(() => uyari.delete().catch(() => {}), 8000);
      message.delete().catch(() => {});
      return;
    }

    const hedef = message.mentions.members.first();

    let silinen;
    if (hedef) {
      const mesajlar = await message.channel.messages.fetch({ limit: 100 });
      const filtrelendi = mesajlar
        .filter(m => m.author.id === hedef.id)
        .first(adet);
      silinen = await message.channel.bulkDelete(filtrelendi, true);
    } else {
      silinen = await message.channel.bulkDelete(adet + 1, true);
    }

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🧹 Mesajlar Temizlendi')
      .addFields(
        { name: 'Silinen Mesaj', value: `${silinen.size} adet`, inline: true },
        { name: 'Yetkili', value: message.author.toString(), inline: true },
        { name: 'Kanal', value: message.channel.toString(), inline: true }
      )
      .setTimestamp();

    const bilgi = await message.channel.send({ embeds: [embed] });
    setTimeout(() => bilgi.delete().catch(() => {}), 5000);
  }
};