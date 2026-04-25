const { EmbedBuilder } = require('discord.js');
const { yetkiVer, yetkiAl, yetkiListesi, yetkiVarMi } = require('../modules/yetki');

module.exports = {
  name: 'yetki',
  description: 'Yetkilendirme sistemi. Kullanım: .yetki ver/al/liste [@kullanıcı|@rol]',
  async execute(message, args, config) {
    const adminRolId = config.roles?.admin;
    const isAdmin =
      message.member.guild.ownerId === message.member.id ||
      message.member.permissions.has('Administrator') ||
      (adminRolId && message.member.roles.cache.has(adminRolId));

    if (!isAdmin) {
      const uyari = await message.reply('❌ Bu komutu kullanmak için **Admin** yetkisi gereklidir.');
      setTimeout(() => uyari.delete().catch(() => {}), 8000);
      message.delete().catch(() => {});
      return;
    }

    const alt = args[0]?.toLowerCase();

    if (alt === 'liste') {
      const data = yetkiListesi();
      const kullaniciMentions = data.kullanicilar.map(id => `<@${id}>`).join(', ') || '*Yok*';
      const rolMentions = data.roller.map(id => `<@&${id}>`).join(', ') || '*Yok*';

      const embed = new EmbedBuilder()
        .setColor('#5865F2')
        .setTitle('🔑 Yetkilendirme Listesi')
        .addFields(
          { name: '👤 Yetkili Kullanıcılar', value: kullaniciMentions },
          { name: '🎭 Yetkili Roller', value: rolMentions }
        )
        .setFooter({ text: 'Made by Batın • elbatin.com' })
        .setTimestamp();

      const msg = await message.reply({ embeds: [embed] });
      setTimeout(() => msg.delete().catch(() => {}), 60000);
      message.delete().catch(() => {});
      return;
    }

    if (alt === 'ver' || alt === 'al') {
      const hedef = message.mentions.members.first() || message.mentions.roles.first();
      if (!hedef) {
        const uyari = await message.reply('❌ Lütfen bir kullanıcı veya rol etiketleyin. Örn: `.yetki ver @kullanıcı`');
        setTimeout(() => uyari.delete().catch(() => {}), 8000);
        message.delete().catch(() => {});
        return;
      }

      const isUye = hedef.constructor.name === 'GuildMember';
      const tip = isUye ? 'kullanici' : 'rol';
      const hedefId = isUye ? hedef.id : hedef.id;
      const hedefAd = isUye ? hedef.user.tag : hedef.name;

      if (alt === 'ver') {
        yetkiVer(hedefId, tip);
        const embed = new EmbedBuilder()
          .setColor('#00FF88')
          .setTitle('✅ Yetki Verildi')
          .setDescription(`**${hedefAd}** adlı ${isUye ? 'kullanıcıya' : 'role'} moderasyon yetkisi verildi.`)
          .setTimestamp();
        const msg = await message.reply({ embeds: [embed] });
        setTimeout(() => msg.delete().catch(() => {}), 15000);
      } else {
        yetkiAl(hedefId, tip);
        const embed = new EmbedBuilder()
          .setColor('#FF4444')
          .setTitle('🗑️ Yetki Alındı')
          .setDescription(`**${hedefAd}** adlı ${isUye ? 'kullanıcıdan' : 'rolden'} moderasyon yetkisi alındı.`)
          .setTimestamp();
        const msg = await message.reply({ embeds: [embed] });
        setTimeout(() => msg.delete().catch(() => {}), 15000);
      }

      message.delete().catch(() => {});
      return;
    }

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🔑 Yetki Komutu')
      .addFields(
        { name: 'Kullanım', value: '`.yetki ver @kullanıcı/rol`\n`.yetki al @kullanıcı/rol`\n`.yetki liste`' },
        { name: 'Açıklama', value: 'Belirtilen kullanıcı veya role tüm moderasyon komutlarını kullanma yetkisi verir/alır.' }
      )
      .setFooter({ text: 'Made by Batın • elbatin.com' })
      .setTimestamp();

    const msg = await message.reply({ embeds: [embed] });
    setTimeout(() => msg.delete().catch(() => {}), 30000);
    message.delete().catch(() => {});
  }
};