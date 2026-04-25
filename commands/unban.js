const { EmbedBuilder } = require('discord.js');
const { yetkiVarMi } = require('../modules/yetki');

module.exports = {
  name: 'unban',
  description: 'Banı kaldırır. Kullanım: .unban <kullanıcı-id> [sebep]',
  async execute(message, args, config) {
    if (!yetkiVarMi(message.member, config)) {
      const uyari = await message.reply('❌ Bu komutu kullanmak için yetkiniz bulunmamaktadır.');
      setTimeout(() => uyari.delete().catch(() => {}), 8000);
      message.delete().catch(() => {});
      return;
    }

    const hedefId = args[0];
    if (!hedefId || !/^\d{17,19}$/.test(hedefId)) {
      const uyari = await message.reply('❌ Geçerli bir kullanıcı ID\'si girin. Örn: `.unban 123456789012345678`');
      setTimeout(() => uyari.delete().catch(() => {}), 8000);
      message.delete().catch(() => {});
      return;
    }

    const banKaydi = await message.guild.bans.fetch(hedefId).catch(() => null);
    if (!banKaydi) {
      const uyari = await message.reply('❌ Bu kullanıcı banlanmış değil veya ID hatalı.');
      setTimeout(() => uyari.delete().catch(() => {}), 8000);
      message.delete().catch(() => {});
      return;
    }

    const sebep = args.slice(1).join(' ') || 'Sebep belirtilmedi';
    await message.guild.members.unban(hedefId, `${message.author.tag} tarafından: ${sebep}`);

    const embed = new EmbedBuilder()
      .setColor('#00FF88')
      .setTitle('🔓 Ban Kaldırıldı')
      .addFields(
        { name: 'Kullanıcı', value: `${banKaydi.user.tag} (${hedefId})`, inline: true },
        { name: 'Yetkili', value: message.author.toString(), inline: true },
        { name: 'Sebep', value: sebep }
      )
      .setThumbnail(banKaydi.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    const msg = await message.reply({ embeds: [embed] });
    setTimeout(() => msg.delete().catch(() => {}), 30000);
    message.delete().catch(() => {});
  }
};