const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'oy',
  description: 'Sunucuya oy vermek için linki gösterir.',
  async execute(message, args, config) {
    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🗳️ Sunucuya Oy Ver!')
      .setDescription(
        `Sunucumuza oy vererek büyümemize yardımcı ol!\n\n[Oy vermek için tıkla](${config.oy.url})`
      )
      .setFooter({ text: 'Her oy sunucumuz için çok değerlidir! • Made by Batın • elbatin.com' })
      .setTimestamp();

    const msg = await message.reply({ embeds: [embed] });
    setTimeout(() => msg.delete().catch(() => {}), 300000);
    message.delete().catch(() => {});
  }
};
