const fetch = require('node-fetch');
const { ActivityType } = require('discord.js');

async function getSunucuDurumu(ip, port) {
  try {
    const res = await fetch(`https://api.mcsrvstat.us/2/${ip}:${port}`, {
      timeout: 10000
    });
    if (!res.ok) return { online: false };
    return await res.json();
  } catch (err) {
    console.error('[MC] API isteği başarısız:', err.message);
    return { online: false };
  }
}

async function presenceGuncelle(client, config) {
  try {
    const durum = await getSunucuDurumu(config.minecraft.ip, config.minecraft.port);
    if (durum.online) {
      client.user.setPresence({
        activities: [
          {
            name: 'custom',
            type: ActivityType.Custom,
            state: `🎮 ${config.minecraft.ip} | ${durum.players.online}/${durum.players.max} oyuncu`
          }
        ],
        status: 'online'
      });
    } else {
      client.user.setPresence({
        activities: [
          {
            name: 'custom',
            type: ActivityType.Custom,
            state: `🔴 ${config.minecraft.ip} | Sunucu Offline`
          }
        ],
        status: 'dnd'
      });
    }
  } catch (err) {
    console.error('[MC] Presence güncellenemedi:', err.message);
  }
}

async function kanalGuncelle(client, config) {
  try {
    const kanalId = config.voiceChannels?.oyuncuSayisi;
    if (!kanalId || kanalId === 'SESLI_KANAL_ID') return;

    const durum = await getSunucuDurumu(config.minecraft.ip, config.minecraft.port);
    const guild = client.guilds.cache.get(config.guildId);
    if (!guild) return;

    const kanal = await guild.channels.fetch(kanalId).catch(() => null);
    if (!kanal) return;

    const yeniAd = durum.online
      ? `🎮 Online: ${durum.players.online}`
      : '🔴 Sunucu Offline';

    await kanal.setName(yeniAd);
    console.log(`[MC] Kanal adı güncellendi: ${yeniAd}`);
  } catch (err) {
    console.error('[MC] Kanal güncellenemedi:', err.message);
  }
}

function baslat(client, config) {
  // Presence her 30 saniyede bir güncellenir
  presenceGuncelle(client, config);
  setInterval(() => presenceGuncelle(client, config), config.minecraft.updateInterval || 30000);

  // Sesli kanal adı her 5 dakikada bir güncellenir (Discord rate limit)
  kanalGuncelle(client, config);
  setInterval(() => kanalGuncelle(client, config), 5 * 60 * 1000);
}

module.exports = { getSunucuDurumu, presenceGuncelle, kanalGuncelle, baslat };
