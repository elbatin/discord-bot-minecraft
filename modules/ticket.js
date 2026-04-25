const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ChannelType,
  PermissionFlagsBits,
  AttachmentBuilder
} = require('discord.js');
const fs = require('fs');
const path = require('path');

const SAYAC_PATH = path.join(__dirname, '../data/ticketSayac.json');

function sayacOku() {
  try {
    return JSON.parse(fs.readFileSync(SAYAC_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function sayacYaz(data) {
  fs.writeFileSync(SAYAC_PATH, JSON.stringify(data, null, 2));
}

function getTicketSayac(kategori) {
  const sayac = sayacOku();
  const anahtar = kategori.toLowerCase();
  sayac[anahtar] = (sayac[anahtar] || 0) + 1;
  sayacYaz(sayac);
  return sayac[anahtar];
}

async function ticketSetup(kanal, config) {
  const logoPath = path.join(__dirname, '../img/logo.png');
  const bannerPath = path.join(__dirname, '../img/banner.png');

  const logoVar = fs.existsSync(logoPath)
    ? new AttachmentBuilder(logoPath, { name: 'logo.png' })
    : null;
  const bannerVar = fs.existsSync(bannerPath)
    ? new AttachmentBuilder(bannerPath, { name: 'banner.png' })
    : null;

  const embed = new EmbedBuilder()
    .setColor('#FF6600')
    .setTitle('👑 LyxoraNetwork | Destek Paneli')
    .setDescription(
      '⚠️ **Uyarı:** Gereksiz ticket açmak / spam yapmak yaptırımla sonuçlanabilir.\n\n' +
      '📌 Lütfen sorunuz ile eşleşen başlığı seçerek destek talebi açınız.\n\n' +
      '🕐 **ÇALIŞMA SAATLERİ**\n' +
      '📅 Hafta içi:  `10:00 - 21:00`\n' +
      '📅 Hafta sonu: `12:00 - 18:00`\n\n' +
      'Aşağıdaki menüden destek türünü seçerek ticket açabilirsin.'
    )
    .setFooter({ text: 'Her kullanıcı aynı anda yalnızca 1 açık ticket oluşturabilir. • Made by Batın • elbatin.com' });

  if (logoVar) embed.setThumbnail('attachment://logo.png');
  if (bannerVar) embed.setImage('attachment://banner.png');

  const secenekler = config.ticket.kategoriler.map((k) => {
    const ikonMap = {
      'Destek': '🛠️',
      'Odeme': '💳',
      'Sikayet': '📢',
      'Genel': '💬',
    };
    return {
      label: k,
      value: k.toLowerCase().replace(/\s+/g, '_'),
      emoji: ikonMap[k] || '📋'
    };
  });

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('ticket_sec')
    .setPlaceholder('📌 Lütfen sorunuzla eşleşen başlığa göre açınız.')
    .addOptions(secenekler);

  const menuRow = new ActionRowBuilder().addComponents(selectMenu);

  const linkRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('YouTube')
      .setURL('https://www.youtube.com/@LyxoraNetwork')
      .setStyle(ButtonStyle.Link)
      .setEmoji('▶️'),
    new ButtonBuilder()
      .setLabel('Instagram')
      .setURL('https://www.instagram.com/zyroxbaba_?igsh=eThjbnhiN2F6cXlk')
      .setStyle(ButtonStyle.Link)
      .setEmoji('📸'),
    new ButtonBuilder()
      .setLabel('TikTok')
      .setURL('https://www.tiktok.com/@vernasnetwork0?_t=ZS-8xwB6rl6XQN&_r=1')
      .setStyle(ButtonStyle.Link)
      .setEmoji('🎵')
  );

  const dosyalar = [logoVar, bannerVar].filter(Boolean);
  await kanal.send({
    embeds: [embed],
    components: [menuRow, linkRow],
    files: dosyalar
  });
}

async function ticketSecMenuGoster(interaction, config) {
  const secenekler = config.ticket.kategoriler.map((k) => ({
    label: k,
    value: k.toLowerCase().replace(/\s+/g, '_'),
    emoji: k === 'Destek' ? '🛠️' : k === 'Odeme' ? '💳' : '📢'
  }));

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('ticket_sec')
    .setPlaceholder('Kategori seçin...')
    .addOptions(secenekler);

  const row = new ActionRowBuilder().addComponents(selectMenu);

  await interaction.reply({
    content: 'Lütfen destek kategorisini seçin:',
    components: [row],
    flags: 64
  });
}

async function ticketAc(interaction, config) {
  const guild = interaction.guild;
  const kategori = interaction.values[0];
  const kanalAdi = kategori.split('_')[0];

  // Kullanıcının zaten açık ticketi var mı?
  const mevcutKanal = guild.channels.cache.find(
    (c) =>
      c.topic === `ticket:${interaction.user.id}` &&
      c.parentId === config.ticket.kategori
  );
  if (mevcutKanal) {
    return interaction.reply({
      content: `Zaten açık bir ticketınız var: ${mevcutKanal}`,
      flags: 64
    });
  }

  const sayac = getTicketSayac(kanalAdi);
  const yeniKanalAdi = `${kanalAdi}-${sayac}`;

  const izinler = [
    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
    {
      id: interaction.user.id,
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

  const parentId = config.ticket.kategori !== 'KATEGORI_ID' ? config.ticket.kategori : undefined;

  const yeniKanal = await guild.channels.create({
    name: yeniKanalAdi,
    type: ChannelType.GuildText,
    parent: parentId,
    topic: `ticket:${interaction.user.id}`,
    permissionOverwrites: izinler
  });

  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle(`🎫 Ticket #${sayac} — ${kanalAdi.charAt(0).toUpperCase() + kanalAdi.slice(1)}`)
    .setDescription(
      `Merhaba ${interaction.user}, ticketınız oluşturuldu!\n\nYetkililerimiz en kısa sürede size yardımcı olacaktır.`
    )
    .setFooter({ text: 'Ticketı kapatmak için aşağıdaki butona tıklayın.' })
    .setTimestamp();

  const kapatRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('ticket_kapat')
      .setLabel('Ticketı Kapat')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🔒')
  );

  await yeniKanal.send({
    content: `${interaction.user} | <@&${config.roles.yetkili}>`,
    embeds: [embed],
    components: [kapatRow]
  });

  await interaction.reply({
    content: `Ticketınız oluşturuldu: ${yeniKanal}`,
    flags: 64
  });
}

async function ticketKapat(interaction, config) {
  const kanal = interaction.channel;
  const guild = interaction.guild;

  await interaction.reply({ content: 'Ticket kapatılıyor, transcript hazırlanıyor...', flags: 64 });

  // Kullanıcıyı topic'ten bul
  const topic = kanal.topic || '';
  const userId = topic.replace('ticket:', '');
  const sahibi = await guild.members.fetch(userId).catch(() => null);

  // Son 100 mesajı çek
  let mesajlar;
  try {
    mesajlar = await kanal.messages.fetch({ limit: 100 });
  } catch {
    mesajlar = new Map();
  }

  // Transcript metni oluştur
  const satirlar = [`=== TICKET TRANSCRIPT: #${kanal.name} ===\n`];
  const siralananMesajlar = [...mesajlar.values()].reverse();
  for (const msg of siralananMesajlar) {
    const tarih = msg.createdAt.toLocaleString('tr-TR');
    const yazar = msg.author.tag;
    const icerik = msg.content || '[medya/embed]';
    satirlar.push(`[${tarih}] ${yazar}: ${icerik}`);
  }
  const transcriptMetin = satirlar.join('\n');

  // Geçici dosyaya yaz
  const tmpPath = path.join(__dirname, `../data/transcript_${kanal.name}.txt`);
  fs.writeFileSync(tmpPath, transcriptMetin, 'utf8');

  const ek = new AttachmentBuilder(tmpPath, { name: `transcript_${kanal.name}.txt` });

  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('📄 Ticket Transcript')
    .addFields(
      { name: 'Kanal', value: kanal.name, inline: true },
      { name: 'Kapatan', value: interaction.user.toString(), inline: true },
      { name: 'Mesaj Sayısı', value: `${mesajlar.size}`, inline: true }
    )
    .setTimestamp();

  // Log kanalına gönder
  const logKanal = guild.channels.cache.get(config.channels.log);
  if (logKanal) {
    await logKanal.send({ embeds: [embed], files: [ek] }).catch(() => {});
  }

  // Ticket sahibine DM gönder
  if (sahibi) {
    const ek2 = new AttachmentBuilder(tmpPath, { name: `transcript_${kanal.name}.txt` });
    await sahibi.send({
      content: 'Ticketınız kapatıldı. Transcript dosyası ektedir.',
      embeds: [embed],
      files: [ek2]
    }).catch(() => {});
  }

  // Geçici dosyayı sil
  fs.unlink(tmpPath, () => {});

  // 3 saniye bekleyip kanalı sil
  setTimeout(() => kanal.delete().catch(() => {}), 3000);
}

module.exports = { ticketSetup, ticketSecMenuGoster, ticketAc, ticketKapat };
