const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection
} = require('discord.js');
const fs = require('fs');
const path = require('path');

function configOku() {
  return JSON.parse(fs.readFileSync('./config.json', 'utf8').replace(/^\uFEFF/, ''));
}

let config = configOku();
fs.watchFile(path.resolve('./config.json'), { interval: 5000 }, () => {
  try {
    config = configOku();
    console.log('[CONFIG] config.json yeniden yüklendi.');
  } catch (err) {
    console.error('[CONFIG] config.json okunamadı:', err.message);
  }
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User]
});

client.commands = new Collection();

// ── Komutları yükle ───────────────────────────────────────────────
const komutDizini = path.join(__dirname, 'commands');
for (const dosya of fs.readdirSync(komutDizini).filter(f => f.endsWith('.js'))) {
  const komut = require(path.join(komutDizini, dosya));
  client.commands.set(komut.name, komut);
  console.log(`[KOMUT] Yüklendi: ${komut.name}`);
}

// ── Event'leri yükle (interactionCreate hariç) ────────────────────
const eventDizini = path.join(__dirname, 'events');
for (const dosya of fs.readdirSync(eventDizini).filter(f => f.endsWith('.js'))) {
  const event = require(path.join(eventDizini, dosya));
  if (event.name === 'interactionCreate') continue;
  client.on(event.name, (...args) => event.execute(...args, config));
  console.log(`[EVENT] Yüklendi: ${event.name}`);
}

// ── interactionCreate ayrıca yüklenir ────────────────────────────
const interactionHandler = require('./events/interactionCreate');
client.on('interactionCreate', (interaction) => interactionHandler.execute(interaction, config));

// ── Prefix komut işleyici ─────────────────────────────────────────
const cooldowns = new Map();
const COOLDOWN_SURE = 10000;

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;
  if (!message.content.startsWith(config.prefix)) return;

  const arglar = message.content.slice(config.prefix.length).trim().split(/\s+/);
  const komutAdi = arglar.shift().toLowerCase();

  const komut = client.commands.get(komutAdi);
  if (!komut) return;

  const kullaniciKey = `${message.author.id}_${komutAdi}`;
  const sonKullanim = cooldowns.get(kullaniciKey);
  if (sonKullanim) {
    const kalan = COOLDOWN_SURE - (Date.now() - sonKullanim);
    if (kalan > 0) {
      const uyari = await message.reply(
        `⏱️ Bu komutu tekrar kullanabilmek için **${(kalan / 1000).toFixed(1)} saniye** beklemelisiniz.`
      );
      setTimeout(() => uyari.delete().catch(() => {}), 5000);
      return;
    }
  }
  cooldowns.set(kullaniciKey, Date.now());
  setTimeout(() => cooldowns.delete(kullaniciKey), COOLDOWN_SURE);

  try {
    await komut.execute(message, arglar, config);
  } catch (err) {
    console.error(`[KOMUT HATA] ${komutAdi}:`, err);
    message.reply('Komut çalıştırılırken bir hata oluştu.').catch(() => {});
  }
});

// ── Bot hazır ─────────────────────────────────────────────────────
client.once('clientReady', async () => {
  console.log(`[BOT] ${client.user.tag} olarak giriş yapıldı!`);
  console.log(`[BOT] Sunucu: ${config.guildId}`);

  const guard = require('./modules/guard');
  guard.baslat(client, config);

  const minecraft = require('./modules/minecraft');
  minecraft.baslat(client, config);

  const { ticketSetup } = require('./modules/ticket');
  const ticketKanalId = config.channels.ticket;
  if (ticketKanalId && ticketKanalId !== 'TICKET_KANAL_ID') {
    const guild = client.guilds.cache.get(config.guildId);
    if (guild) {
      const kanal = guild.channels.cache.get(ticketKanalId);
      if (kanal) {
        const mesajlar = await kanal.messages.fetch({ limit: 20 }).catch(() => null);
        const setupMesaji = mesajlar?.find(
          m => m.author.id === client.user.id &&
               m.components?.[0]?.components?.[0]?.customId === 'ticket_sec'
        );
        if (!setupMesaji) {
          await ticketSetup(kanal, config);
          console.log('[TICKET] Setup mesajı gönderildi.');
        } else {
          console.log('[TICKET] Setup mesajı zaten mevcut, atlandı.');
        }
      }
    }
  }

  const { basvuruSetup } = require('./modules/basvuru');
  const basvuruKanalId = config.channels.basvuru;
  if (basvuruKanalId && basvuruKanalId !== 'BASVURU_KANAL_ID') {
    const guild = client.guilds.cache.get(config.guildId);
    if (guild) {
      const kanal = guild.channels.cache.get(basvuruKanalId);
      if (kanal) {
        const mesajlar = await kanal.messages.fetch({ limit: 20 }).catch(() => null);
        const setupMesaji = mesajlar?.find(
          m => m.author.id === client.user.id &&
               m.components?.[0]?.components?.[0]?.customId === 'basvuru_ac'
        );
        if (!setupMesaji) {
          await basvuruSetup(kanal, config);
          console.log('[BASVURU] Setup mesajı gönderildi.');
        } else {
          console.log('[BASVURU] Setup mesajı zaten mevcut, atlandı.');
        }
      }
    }
  }

  console.log('[BOT] Tüm sistemler hazır!');
});

process.on('unhandledRejection', (err) => {
  console.error('[HATA] İşlenmeyen Promise reddi:', err);
});
process.on('uncaughtException', (err) => {
  console.error('[HATA] Yakalanmamış istisna:', err);
});

client.login(config.token);