const { EmbedBuilder } = require('discord.js');
const { otorolVer } = require('../modules/otorol');
const { logGonder, uyeGirdi } = require('../modules/log');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, config) {
    if (member.user.bot) return;

    // Otorol ver
    await otorolVer(member, config);

    // Hoş geldin mesajı
    const hosgeldinKanalId = config.channels.hosgeldin;
    if (hosgeldinKanalId && hosgeldinKanalId !== 'HOSGELDIN_KANAL_ID') {
      const kanal = member.guild.channels.cache.get(hosgeldinKanalId);
      if (kanal) {
        const embed = new EmbedBuilder()
          .setColor('#00FF88')
          .setTitle('👋 Hoş Geldin!')
          .setDescription(`${member} sunucumuza hoş geldin!\n\nKuralları okumayı unutma. İyi oyunlar! 🎮`)
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setFooter({ text: `Toplam üye: ${member.guild.memberCount}` })
          .setTimestamp();

        kanal.send({ embeds: [embed] }).catch(() => {});
      }
    }

    // Log
    await logGonder(member.guild, config, uyeGirdi(member));
  }
};
