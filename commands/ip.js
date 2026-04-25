const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ip',
  description: 'Minecraft sunucu IP adresini gösterir.',
  async execute(message, args, config) {
    const embed = new EmbedBuilder()
      .setColor('#00FF88')
      .setTitle('🌐 Sunucu IP Adresi')
      .addFields(
        { name: 'Java Edition', value: `\`${config.minecraft.ip}\``, inline: true },
        { name: 'Port', value: `\`${config.minecraft.port}\``, inline: true }
      )
      .setFooter({ text: 'Bu mesaj 5 dakika sonra silinecektir. • Made by Batın • elbatin.com' })
      .setTimestamp();

    const msg = await message.reply({ embeds: [embed] });
    setTimeout(() => msg.delete().catch(() => {}), 300000);
    message.delete().catch(() => {});
  }
};
