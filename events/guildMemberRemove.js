const { EmbedBuilder, AuditLogEvent } = require('discord.js');
const { logGonder, uyeCikti, kicklendi } = require('../modules/log');

module.exports = {
  name: 'guildMemberRemove',
  async execute(member, config) {
    if (member.user.bot) {
      await logGonder(member.guild, config, uyeCikti(member), 'uye');
      return;
    }

    // Kick mi yoksa normal çıkış mı?
    try {
      const logs = await member.guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick, limit: 1 });
      const entry = logs.entries.first();
      if (entry && entry.target.id === member.id && Date.now() - entry.createdTimestamp < 5000) {
        await logGonder(member.guild, config, kicklendi(member, entry.executor, entry.reason), 'moderasyon');
        // Kick durumunda görüşürüz mesajı gösterme
        return;
      }
    } catch {
      // kick değil
    }

    // Normal çıkış — görüşürüz mesajı
    const gorusuruzKanalId = config.channels.hosgeldin;
    if (gorusuruzKanalId && gorusuruzKanalId !== 'HOSGELDIN_KANAL_ID') {
      const kanal = member.guild.channels.cache.get(gorusuruzKanalId);
      if (kanal && config.gorusuruz?.aktif !== false) {
        const mesaj = config.gorusuruz?.mesaj
          ? config.gorusuruz.mesaj
              .replace('{kullanici}', member.user.tag)
              .replace('{sunucu}', member.guild.name)
              .replace('{uye_sayisi}', member.guild.memberCount)
          : `**${member.user.tag}** sunucudan ayrıldı. Görüşürüz! 👋`;

        const embed = new EmbedBuilder()
          .setColor(config.gorusuruz?.renk || '#FFA500')
          .setTitle(config.gorusuruz?.baslik || '👋 Görüşürüz!')
          .setDescription(mesaj)
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setFooter({ text: `Toplam üye: ${member.guild.memberCount}` })
          .setTimestamp();

        kanal.send({ embeds: [embed] }).catch(() => {});
      }
    }

    await logGonder(member.guild, config, uyeCikti(member), 'uye');
  }
};