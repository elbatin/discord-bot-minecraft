const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  PermissionFlagsBits
} = require('discord.js');

async function basvuruSetup(kanal, config) {
  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('📋 Yetkili Başvurusu')
    .setDescription(
      'Sunucumuzda yetkili olmak mı istiyorsunuz?\nAşağıdaki butona tıklayarak başvuru formunu doldurun.'
    )
    .addFields(
      { name: '📌 Gereksinimler', value: '• En az 15 yaşında olmalısın\n• Mikrofon sahibi olmalısın\n• Aktif olmalısın' }
    )
    .setFooter({ text: 'Başvurular yetkili ekibimiz tarafından değerlendirilecektir. • Made by Batın • elbatin.com' })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('basvuru_ac')
      .setLabel('Başvuru Yap')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('📋')
  );

  await kanal.send({ embeds: [embed], components: [row] });
}

async function basvuruModalAc(interaction) {
  const modal = new ModalBuilder()
    .setCustomId('basvuru_modal')
    .setTitle('Yetkili Başvuru Formu');

  const yas = new TextInputBuilder()
    .setCustomId('yas')
    .setLabel('Kaç yaşındasınız?')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Örnek: 18')
    .setRequired(true)
    .setMaxLength(3);

  const oyunSuresi = new TextInputBuilder()
    .setCustomId('oyun_suresi')
    .setLabel('Minecraft oyun süreniz ne kadar?')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Örnek: 3 yıl')
    .setRequired(true)
    .setMaxLength(50);

  const tecrube = new TextInputBuilder()
    .setCustomId('tecrube')
    .setLabel('Önceki yetkili deneyiminiz var mı?')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('Deneyimlerinizi anlatın...')
    .setRequired(true)
    .setMaxLength(500);

  const mikrofon = new TextInputBuilder()
    .setCustomId('mikrofon')
    .setLabel('Mikrofonunuz var mı? Sesli katılıyor musun?')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Evet / Hayır')
    .setRequired(true)
    .setMaxLength(50);

  const neden = new TextInputBuilder()
    .setCustomId('neden')
    .setLabel('Neden yetkili olmak istiyorsunuz?')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('Kendinizi tanıtın ve motivasyonunuzu paylaşın...')
    .setRequired(true)
    .setMaxLength(1000);

  modal.addComponents(
    new ActionRowBuilder().addComponents(yas),
    new ActionRowBuilder().addComponents(oyunSuresi),
    new ActionRowBuilder().addComponents(tecrube),
    new ActionRowBuilder().addComponents(mikrofon),
    new ActionRowBuilder().addComponents(neden)
  );

  await interaction.showModal(modal);
}

async function basvuruGonder(interaction, config) {
  const yas = interaction.fields.getTextInputValue('yas');
  const oyunSuresi = interaction.fields.getTextInputValue('oyun_suresi');
  const tecrube = interaction.fields.getTextInputValue('tecrube');
  const mikrofon = interaction.fields.getTextInputValue('mikrofon');
  const neden = interaction.fields.getTextInputValue('neden');

  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('📋 Yeni Yetkili Başvurusu')
    .addFields(
      { name: '👤 Kullanıcı', value: `${interaction.user} (${interaction.user.tag})`, inline: true },
      { name: '🆔 ID', value: interaction.user.id, inline: true },
      { name: '🎂 Yaş', value: yas, inline: true },
      { name: '🎮 Oyun Süresi', value: oyunSuresi, inline: true },
      { name: '🎤 Mikrofon', value: mikrofon, inline: true },
      { name: '🏆 Önceki Tecrübe', value: tecrube },
      { name: '💬 Başvuru Nedeni', value: neden }
    )
    .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`onayla_${interaction.user.id}`)
      .setLabel('Onayla')
      .setStyle(ButtonStyle.Success)
      .setEmoji('✅'),
    new ButtonBuilder()
      .setCustomId(`reddet_${interaction.user.id}`)
      .setLabel('Reddet')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('❌')
  );

  const yetkiliKanalId = config.channels.yetkili;
  if (!yetkiliKanalId || yetkiliKanalId === 'YETKILI_KANAL_ID') {
    return interaction.reply({
      content: 'Başvurunuz alındı ancak yetkili kanalı ayarlanmamış. Lütfen yöneticiyle iletişime geçin.',
      flags: 64
    });
  }

  const yetkiliKanal = interaction.guild.channels.cache.get(yetkiliKanalId);
  if (!yetkiliKanal) {
    return interaction.reply({ content: 'Yetkili kanalı bulunamadı.', flags: 64 });
  }

  await yetkiliKanal.send({ embeds: [embed], components: [row] });
  await interaction.reply({
    content: '✅ Başvurunuz başarıyla iletildi! Yetkililerimiz inceleyecektir.',
    flags: 64
  });
}

async function basvuruOnayla(interaction, config, hedefId) {
  const guild = interaction.guild;
  const hedef = await guild.members.fetch(hedefId).catch(() => null);

  // Orijinal mesajı güncelle
  const guncelEmbed = EmbedBuilder.from(interaction.message.embeds[0])
    .setColor('#00FF88')
    .setTitle('✅ Onaylanan Yetkili Başvurusu')
    .setFooter({ text: `Onaylayan: ${interaction.user.tag}` });

  await interaction.message.edit({ embeds: [guncelEmbed], components: [] });

  if (!hedef) {
    return interaction.reply({ content: 'Kullanıcı sunucuda bulunamadı.', flags: 64 });
  }

  // Mülakat kanalı aç
  const izinler = [
    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
    {
      id: hedefId,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory
      ]
    }
  ];

  if (config.roles.yetkili && config.roles.yetkili !== 'YETKILI_ROL_ID') {
    izinler.push({
      id: config.roles.yetkili,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory
      ]
    });
  }

  const mulakatKanal = await guild.channels.create({
    name: `mulakat-${hedef.user.username}`,
    type: ChannelType.GuildText,
    permissionOverwrites: izinler
  });

  const kanalEmbed = new EmbedBuilder()
    .setColor('#00FF88')
    .setTitle('🎉 Başvurunuz Onaylandı!')
    .setDescription(
      `Merhaba ${hedef}, başvurunuz onaylandı!\n\nBu kanalda yetkililerimizle mülakat gerçekleştireceksiniz.`
    )
    .setTimestamp();

  await mulakatKanal.send({ content: `${hedef}`, embeds: [kanalEmbed] });

  // DM gönder
  await hedef.send({
    embeds: [
      new EmbedBuilder()
        .setColor('#00FF88')
        .setTitle('✅ Başvurunuz Onaylandı!')
        .setDescription(
          `Merhaba! Yetkili başvurunuz onaylandı.\n\n${mulakatKanal} kanalında mülakat gerçekleştirilecek.`
        )
        .setTimestamp()
    ]
  }).catch(() => {});

  await interaction.reply({ content: `${hedef.user.tag} onaylandı ve mülakat kanalı açıldı.`, flags: 64 });
}

async function basvuruReddet(interaction, hedefId) {
  const guild = interaction.guild;
  const hedef = await guild.members.fetch(hedefId).catch(() => null);

  // Orijinal mesajı güncelle
  const guncelEmbed = EmbedBuilder.from(interaction.message.embeds[0])
    .setColor('#FF0000')
    .setTitle('❌ Reddedilen Yetkili Başvurusu')
    .setFooter({ text: `Reddeden: ${interaction.user.tag}` });

  await interaction.message.edit({ embeds: [guncelEmbed], components: [] });

  if (hedef) {
    await hedef.send({
      embeds: [
        new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('❌ Başvurunuz Reddedildi')
          .setDescription(
            'Üzgünüz, yetkili başvurunuz şu an için uygun görülmedi.\n\nBelirli bir süre sonra tekrar başvurabilirsiniz.'
          )
          .setTimestamp()
      ]
    }).catch(() => {});
  }

  await interaction.reply({ content: `${hedefId} kullanıcısının başvurusu reddedildi.`, flags: 64 });
}

module.exports = { basvuruSetup, basvuruModalAc, basvuruGonder, basvuruOnayla, basvuruReddet };
