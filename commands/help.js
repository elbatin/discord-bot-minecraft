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
          name: '🖥️ Prefix Komutları (`' + config.prefix + '`)',
          value: [
            '`' + config.prefix + 'ip` — Minecraft sunucu IP adresini gösterir',
            '`' + config.prefix + 'site` — Web sitesi linkini gösterir',
            '`' + config.prefix + 'oy` — Oy verme linkini gösterir',
            '`' + config.prefix + 'help` — Bu menüyü açar',
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
          value: `Sunucu IP: \`${config.minecraft.ip}\`\nBotun durumu anlık oyuncu sayısını gösterir.`
        },
        {
          name: '⏱️ Cooldown & Otomatik Silme',
          value: "Komutlar **10 saniye** cooldown'a tabidir.\nBot yanıtları **5 dakika** sonra otomatik silinir."
        }
      )
      .setFooter({ text: 'Made by Batın • elbatin.com' })
      .setTimestamp();

    const msg = await message.reply({ embeds: [embed] });
    setTimeout(() => msg.delete().catch(() => {}), 300000);
    message.delete().catch(() => {});
  }
};
