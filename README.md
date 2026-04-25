# Discord Minecraft Bot

> Node.js + discord.js v14 | GitHub: [elbatin/discord-bot-minecraft](https://github.com/elbatin/discord-bot-minecraft)

---

## 🇹🇷 Türkçe

### Özellikler
- Minecraft sunucu durumu — bot presence + sesli kanal güncelleme
- Ticket sistemi — kategori seçimli, transcript ile kapanma
- Yetkili başvuru sistemi — modal form, onayla/reddet, mülakat kanalı
- Log sistemi — mesaj, üye, ban logları
- Guard sistemi — toplu kanal/rol silme, yetkisiz ban/kick koruması
- Otorol — yeni üyelere otomatik rol
- Prefix komutlar — `.ip` `.site` `.oy` `.help`
- config.json hot-reload — restart gerekmez

### Kurulum

```bash
git clone https://github.com/elbatin/discord-bot-minecraft.git
cd discord-bot-minecraft
npm install
# config.json dosyasını düzenle
node index.js
```

### PM2 ile Arka Planda Çalıştırma

```bash
npm install -g pm2
pm2 start index.js --name discord-bot
pm2 save && pm2 startup
```

### Komutlar

| Komut | Açıklama |
|---|---|
| `.ip` | Sunucu IP adresini gösterir |
| `.site` | Web sitesini gösterir |
| `.oy` | Oy verme linkini gösterir |
| `.help` | Komut listesini gösterir |

### config.json Alanları

| Alan | Açıklama |
|---|---|
| `token` | Discord bot token'ı |
| `guildId` | Sunucu ID'si |
| `prefix` | Komut öneki (varsayılan: `.`) |
| `minecraft.ip` | Minecraft sunucu adresi |
| `minecraft.port` | Port numarası |
| `channels.log` | Log kanalı ID |
| `channels.hosgeldin` | Hoş geldin kanalı ID |
| `channels.ticket` | Ticket kanalı ID |
| `channels.basvuru` | Başvuru kanalı ID |
| `channels.yetkili` | Yetkili kanalı ID |
| `roles.otorol` | Otorol ID listesi |
| `roles.yetkili` | Yetkili rol ID |
| `roles.admin` | Admin rol ID |
| `voiceChannels.oyuncuSayisi` | Oyuncu sayısı sesli kanalı |
| `ticket.kategoriler` | Ticket kategori listesi |
| `site.url` | Web sitesi |
| `oy.url` | Oy verme linki |

### Bot İzinleri
Discord Developer Portal'da şunları etkinleştirin:
- **Privileged Intents:** `Server Members Intent`, `Message Content Intent`
- **İzinler:** Administrator (veya Manage Channels, Manage Roles, Ban Members, View Audit Log, Send Messages, Manage Messages, Attach Files)

---

## 🇬🇧 English

### Features
- Minecraft server status — bot presence + voice channel updates
- Ticket system — category select, transcript on close
- Staff application system — modal form, approve/reject, interview channel
- Log system — message, member, ban logs
- Guard system — mass channel/role deletion protection, unauthorized ban/kick
- Auto-role — automatically assign roles to new members
- Prefix commands — `.ip` `.site` `.oy` `.help`
- config.json hot-reload — no restart needed

### Installation

```bash
git clone https://github.com/elbatin/discord-bot-minecraft.git
cd discord-bot-minecraft
npm install
# Edit config.json with your token and IDs
node index.js
```

### Running in Background (PM2)

```bash
npm install -g pm2
pm2 start index.js --name discord-bot
pm2 save && pm2 startup
```

### Commands

| Command | Description |
|---|---|
| `.ip` | Shows the Minecraft server IP |
| `.site` | Shows the website link |
| `.oy` | Shows the vote link |
| `.help` | Lists all commands |

### Bot Permissions
Enable the following in Discord Developer Portal:
- **Privileged Intents:** `Server Members Intent`, `Message Content Intent`
- **Permissions:** Administrator (or Manage Channels, Manage Roles, Ban Members, View Audit Log, Send Messages, Manage Messages, Attach Files)

---

*Made by Batın • [elbatin.com](https://elbatin.com)*
