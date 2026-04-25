const { EmbedBuilder } = require('discord.js');
const { otorolVer } = require('../modules/otorol');
const { logGonder, uyeGirdi } = require('../modules/log');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, config) {
    await otorolVer(member, config);

    if (member.user.bot) {
      await logGonder(member.guild, config, uyeGirdi(member), 'uye');
      return;
    }

    const hosgeldinKanalId = config.channels.hosgeldin;
    if (hosgeldinKanalId && hosgeldinKanalId !== 'HOSGELDIN_KANAL_ID') {
      const kanal = member.guild.channels.cache.get(hosgeldinKanalId);
      if (kanal) {
        const mesaj = config.hosgeldin?.mesaj
          ? config.hosgeldin.mesaj
              .replace('{kullanici}', member.toString())
              .replace('{sunucu}', member.guild.name)
              .replace('{uye_sayisi}', member.guild.memberCount)
          : `${member} sunucumuza hoş geldin!\n\nKuralları okumayı unutma. İyi oyunlar! 🎮`;

        const embed = new EmbedBuilder()
          .setColor(config.hosgeldin?.renk || '#00FF88')
          .setTitle(config.hosgeldin?.baslik || '👋 Hoş Geldin!')
          .setDescription(mesaj)
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setFooter({ text: `Toplam üye: ${member.guild.memberCount}` })
          .setTimestamp();

        if (config.hosgeldin?.resim) embed.setImage(config.hosgeldin.resim);

        kanal.send({ embeds: [embed] }).catch(() => {});
      }
    }

    await logGonder(member.guild, config, uyeGirdi(member), 'uye');
  }
};