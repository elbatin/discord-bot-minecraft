const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'site',
  description: 'Sunucu web sitesini gösterir.',
  async execute(message, args, config) {
    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle('🌍 Sunucu Web Sitesi')
      .setDescription(`[Siteye git](${config.site.url})\n\n\`${config.site.url}\``)
      .setFooter({ text: 'Bu mesaj 5 dakika sonra silinecektir. • Made by Batın • elbatin.com' })
      .setTimestamp();

    const msg = await message.reply({ embeds: [embed] });
    setTimeout(() => msg.delete().catch(() => {}), 300000);
    message.delete().catch(() => {});
  }
};
