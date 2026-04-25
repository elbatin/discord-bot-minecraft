# Discord Minecraft Bot

> Node.js + discord.js v14 | GitHub: [elbatin/discord-bot-minecraft](https://github.com/elbatin/discord-bot-minecraft)

---

## 🇹🇷 Türkçe

### Özellikler
- Minecraft sunucu durumu — bot presence + sesli kanal güncelleme
- Ticket sistemi — kategori seçimli, transcript ile kapanma
- Yetkili başvuru sistemi — modal form, onayla/reddet, mülakat kanalı
- Log sistemi — mesaj, üye, ban, **timeout, rol, kanal** logları (her biri ayrı kanala)
- Guard sistemi — toplu kanal/rol silme, yetkisiz ban/kick koruması
- Otorol — yeni üyelere ve botlara otomatik rol
- **Moderasyon komutları** — `.ban` `.kick` `.timeout` `.unban` `.temizle`
- **Dinamik yetki sistemi** — `.yetki ver/al/liste` komutuyla kullanıcı veya role moderasyon yetkisi
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

#### Genel Komutlar

| Komut | Açıklama |
|---|---|
| `.ip` | Sunucu IP adresini gösterir |
| `.site` | Web sitesini gösterir |
| `.oy` | Oy verme linkini gösterir |
| `.help` | Tüm komut listesini gösterir |

#### Moderasyon Komutları *(yetkili gerektirir)*

| Komut | Açıklama |
|---|---|
| `.ban @kullanıcı [sebep]` | Kullanıcıyı sunucudan banlar |
| `.kick @kullanıcı [sebep]` | Kullanıcıyı sunucudan atar |
| `.timeout @kullanıcı <süre> [sebep]` | Kullanıcıyı susturur (`60s` `5m` `10m` `30m` `1s` `1g` `1h`) |
| `.unban <kullanıcı-id> [sebep]` | Kullanıcının banını kaldırır |
| `.temizle <1-100> [@kullanıcı]` | Kanaldan toplu mesaj siler |

#### Yetki Komutları *(sadece Admin)*

| Komut | Açıklama |
|---|---|
| `.yetki ver @kullanıcı/rol` | Moderasyon yetkisi verir |
| `.yetki al @kullanıcı/rol` | Moderasyon yetkisini geri alır |
| `.yetki liste` | Yetkili kullanıcı ve rolleri listeler |

> Yetki hiyerarşisi: Sunucu Sahibi → Administrator izni → Admin rolü → Yetkili rolü → `.yetki ver` ile atananlar

### config.json Alanları

| Alan | Açıklama |
|---|---|
| `token` | Discord bot token'ı |
| `guildId` | Sunucu ID'si |
| `prefix` | Komut öneki (varsayılan: `.`) |
| `minecraft.ip` | Minecraft sunucu adresi |
| `minecraft.port` | Port numarası |
| `minecraft.updateInterval` | Güncelleme aralığı (ms) |
| `channels.log.genel` | Genel log kanalı ID |
| `channels.log.mesaj` | Mesaj silme/düzenleme log kanalı ID |
| `channels.log.uye` | Üye giriş/çıkış log kanalı ID |
| `channels.log.moderasyon` | Ban/Kick/Timeout log kanalı ID |
| `channels.log.rol` | Rol oluşturma/silme/güncelleme log kanalı ID |
| `channels.log.kanal` | Kanal oluşturma/silme/güncelleme log kanalı ID |
| `channels.hosgeldin` | Hoş geldin kanalı ID |
| `channels.ticket` | Ticket kanalı ID |
| `channels.basvuru` | Başvuru kanalı ID |
| `channels.yetkili` | Yetkili kanalı ID |
| `roles.otorol` | Yeni üyelere verilecek rol ID listesi |
| `roles.otorolBot` | Yeni botlara verilecek rol ID listesi |
| `roles.yetkili` | Moderasyon komutlarını kullanabilecek rol ID |
| `roles.admin` | `.yetki` komutunu kullanabilecek admin rol ID |
| `voiceChannels.oyuncuSayisi` | Oyuncu sayısını gösteren sesli kanal ID |
| `ticket.kategori` | Ticket kanallarının açılacağı kategori ID |
| `ticket.kategoriler` | Ticket kategori listesi (örn. `["Destek","Ödeme","Şikayet"]`) |
| `hosgeldin.baslik` | Hoş geldin embed başlığı |
| `hosgeldin.mesaj` | Hoş geldin mesajı (`{kullanici}` değişkeni desteklenir) |
| `hosgeldin.renk` | Embed rengi (hex) |
| `hosgeldin.resim` | Embed resim URL (opsiyonel) |
| `gorusuruz.aktif` | Ayrılma mesajını aç/kapat (`true`/`false`) |
| `gorusuruz.baslik` | Ayrılma embed başlığı |
| `gorusuruz.mesaj` | Ayrılma mesajı (`{kullanici}` desteklenir) |
| `gorusuruz.renk` | Embed rengi (hex) |
| `site.url` | Web sitesi |
| `oy.url` | Oy verme linki |

### Bot İzinleri
Discord Developer Portal'da şunları etkinleştirin:
- **Privileged Intents:** `Server Members Intent`, `Message Content Intent`
- **İzinler:** Administrator (veya Manage Channels, Manage Roles, Ban Members, Kick Members, Moderate Members, View Audit Log, Send Messages, Manage Messages, Attach Files)

---

## 🇬🇧 English

### Features
- Minecraft server status — bot presence + voice channel updates
- Ticket system — category select, transcript on close
- Staff application system — modal form, approve/reject, interview channel
- Log system — message, member, ban, **timeout, role, channel** logs (each to a separate channel)
- Guard system — mass channel/role deletion protection, unauthorized ban/kick
- Auto-role — automatically assign roles to new members and bots
- **Moderation commands** — `.ban` `.kick` `.timeout` `.unban` `.temizle`
- **Dynamic permission system** — grant/revoke mod access per user or role via `.yetki`
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

#### General Commands

| Command | Description |
|---|---|
| `.ip` | Shows the Minecraft server IP |
| `.site` | Shows the website link |
| `.oy` | Shows the vote link |
| `.help` | Lists all commands |

#### Moderation Commands *(requires permission)*

| Command | Description |
|---|---|
| `.ban @user [reason]` | Bans a user from the server |
| `.kick @user [reason]` | Kicks a user from the server |
| `.timeout @user <duration> [reason]` | Times out a user (`60s` `5m` `10m` `30m` `1s` `1g` `1h`) |
| `.unban <user-id> [reason]` | Removes a user's ban |
| `.temizle <1-100> [@user]` | Bulk deletes messages in a channel |

#### Permission Commands *(Admin only)*

| Command | Description |
|---|---|
| `.yetki ver @user/role` | Grants moderation permission |
| `.yetki al @user/role` | Revokes moderation permission |
| `.yetki liste` | Lists all authorized users and roles |

> Permission hierarchy: Server Owner → Administrator → Admin role → Yetkili role → manually granted via `.yetki ver`

### Bot Permissions
Enable the following in Discord Developer Portal:
- **Privileged Intents:** `Server Members Intent`, `Message Content Intent`
- **Permissions:** Administrator (or Manage Channels, Manage Roles, Ban Members, Kick Members, Moderate Members, View Audit Log, Send Messages, Manage Messages, Attach Files)

---

*Made by Batın • [elbatin.com](https://elbatin.com)*