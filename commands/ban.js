const { EmbedBuilder } = require('discord.js');
const { yetkiVarMi } = require('../modules/yetki');

module.exports = {
  name: 'ban',
  description: 'Bir kullanıcıyı sunucudan banlar. Kullanım: .ban @kullanıcı [sebep]',
  async execute(message, args, config) {
    if (!yetkiVarMi(message.member, config)) {
      const uyari = await message.reply('❌ Bu komutu kullanmak için yetkiniz bulunmamaktadır.');
      setTimeout(() => uyari.delete().catch(() => {}), 8000);
      message.delete().catch(() => {});
      return;
    }

    const hedef = message.mentions.members.first();
    if (!hedef) {
      const uyari = await message.reply('❌ Banlanacak kullanıcıyı etiketleyin. Örn: `.ban @kullanıcı sebep`');
      setTimeout(() => uyari.delete().catch(() => {}), 8000);
      message.delete().catch(() => {});
      return;
    }

    if (!hedef.bannable) {
      const uyari = await message.reply('❌ Bu kullanıcı banlanamıyor (yetki hiyerarşisi).');
      setTimeout(() => uyari.delete().catch(() => {}), 8000);
      message.delete().catch(() => {});
      return;
    }

    const sebep = args.slice(1).join(' ') || 'Sebep belirtilmedi';

    await hedef.ban({ reason: `${message.author.tag} tarafından: ${sebep}` });

    const embed = new EmbedBuilder()
      .setColor('#8B0000')
      .setTitle('🔨 Kullanıcı Banlandı')
      .addFields(
        { name: 'Kullanıcı', value: hedef.user.toString(), inline: true },
        { name: 'Yetkili', value: message.author.toString(), inline: true },
        { name: 'Sebep', value: sebep }
      )
      .setThumbnail(hedef.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    const msg = await message.reply({ embeds: [embed] });
    setTimeout(() => msg.delete().catch(() => {}), 30000);
    message.delete().catch(() => {});
  }
};