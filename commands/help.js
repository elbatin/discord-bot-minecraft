const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Bot komutlarını ve sistemleri listeler.',
  async execute(message, args, config) {
    const embed = new EmbedBuilder()
      .setColor('#FF6600')
      .setTitle('📖 Komut Listesi')
      .setDescription('Kullanılabilir tüm komutlar ve sistemler:')
      .addFields(
        {
          name: '🖥️ Genel Komutlar',
          value: [
            `\`${config.prefix}ip\` — Minecraft sunucu IP adresini gösterir`,
            `\`${config.prefix}site\` — Web sitesi linkini gösterir`,
            `\`${config.prefix}oy\` — Oy verme linkini gösterir`,
            `\`${config.prefix}help\` — Bu menüyü açar`,
          ].join('\n')
        },
        {
          name: '🔨 Moderasyon Komutları',
          value: [
            `\`${config.prefix}ban @kullanıcı [sebep]\` — Kullanıcıyı banlar`,
            `\`${config.prefix}kick @kullanıcı [sebep]\` — Kullanıcıyı atar`,
            `\`${config.prefix}timeout @kullanıcı <süre> [sebep]\` — Timeout uygular (60s/5m/10m/30m/1s/1g/1h)`,
            `\`${config.prefix}unban <id> [sebep]\` — Banı kaldırır`,
            `\`${config.prefix}temizle <1-100> [@kullanıcı]\` — Mesajları temizler`,
          ].join('\n')
        },
        {
          name: '🔑 Yetkilendirme',
          value: [
            `\`${config.prefix}yetki ver @kullanıcı/rol\` — Moderasyon yetkisi verir`,
            `\`${config.prefix}yetki al @kullanıcı/rol\` — Moderasyon yetkisini alır`,
            `\`${config.prefix}yetki liste\` — Yetkili kullanıcı/rol listesi`,
          ].join('\n')
        },
        {
          name: '🎫 Ticket Sistemi',
          value: 'Destek kanalındaki menüden kategori seçerek ticket açabilirsiniz.\nYetkili olmayan kişiler ticket kanalını göremez.'
        },
        {
          name: '📋 Yetkili Başvurusu',
          value: 'Başvuru kanalındaki butona tıklayarak form doldurun.\nYetkililerin onay/red kararı size DM ile iletilir.'
        },
        {
          name: '📊 Minecraft Entegrasyonu',
          value: `Sunucu IP: \`${config.minecraft.ip}\`\nBotun durumu ve sesli kanal anlık oyuncu sayısını gösterir.`
        },
        {
          name: '📋 Log Sistemi',
          value: 'Mesaj silme/düzenleme · Üye giriş/çıkış · Rol işlemleri · Kanal işlemleri · Ban/Kick/Timeout — Hepsi ayrı kanallara embedli olarak iletilir.'
        }
      )
      .setFooter({ text: 'Made by Batın • elbatin.com' })
      .setTimestamp();

    const msg = await message.reply({ embeds: [embed] });
    setTimeout(() => msg.delete().catch(() => {}), 300000);
    message.delete().catch(() => {});
  }
};