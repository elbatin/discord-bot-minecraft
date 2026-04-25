const { EmbedBuilder } = require('discord.js');
const { yetkiVarMi } = require('../modules/yetki');

module.exports = {
  name: 'kick',
  description: 'Bir kullanıcıyı sunucudan atar. Kullanım: .kick @kullanıcı [sebep]',
  async execute(message, args, config) {
    if (!yetkiVarMi(message.member, config)) {
      const uyari = await message.reply('❌ Bu komutu kullanmak için yetkiniz bulunmamaktadır.');
      setTimeout(() => uyari.delete().catch(() => {}), 8000);
      message.delete().catch(() => {});
      return;
    }

    const hedef = message.mentions.members.first();
    if (!hedef) {
      const uyari = await message.reply('❌ Atılacak kullanıcıyı etiketleyin. Örn: `.kick @kullanıcı sebep`');
      setTimeout(() => uyari.delete().catch(() => {}), 8000);
      message.delete().catch(() => {});
      return;
    }

    if (!hedef.kickable) {
      const uyari = await message.reply('❌ Bu kullanıcı atılamıyor (yetki hiyerarşisi).');
      setTimeout(() => uyari.delete().catch(() => {}), 8000);
      message.delete().catch(() => {});
      return;
    }

    const sebep = args.slice(1).join(' ') || 'Sebep belirtilmedi';

    await hedef.kick(`${message.author.tag} tarafından: ${sebep}`);

    const embed = new EmbedBuilder()
      .setColor('#FF6600')
      .setTitle('👢 Kullanıcı Atıldı')
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