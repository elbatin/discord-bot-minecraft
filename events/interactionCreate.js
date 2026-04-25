const { ticketAc, ticketModalOnayla, ticketKapat } = require('../modules/ticket');
const { basvuruModalAc, basvuruGonder, basvuruOnayla, basvuruReddet } = require('../modules/basvuru');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, config) {
    try {
      // ── BUTONLAR ──
      if (interaction.isButton()) {
        // Ticket kapat
        if (interaction.customId === 'ticket_kapat') {
          return await ticketKapat(interaction, config);
        }

        // Başvuru aç → modal göster
        if (interaction.customId === 'basvuru_ac') {
          return await basvuruModalAc(interaction);
        }

        // Başvuru onayla
        if (interaction.customId.startsWith('onayla_')) {
          const hedefId = interaction.customId.replace('onayla_', '');
          return await basvuruOnayla(interaction, config, hedefId);
        }

        // Başvuru reddet
        if (interaction.customId.startsWith('reddet_')) {
          const hedefId = interaction.customId.replace('reddet_', '');
          return await basvuruReddet(interaction, hedefId);
        }
      }

      // ── SELECT MENU ──
      if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'ticket_sec') {
          return await ticketAc(interaction, config);
        }
      }

      // ── MODAL SUBMIT ──
      if (interaction.isModalSubmit()) {
        if (interaction.customId === 'basvuru_modal') {
          return await basvuruGonder(interaction, config);
        }
        if (interaction.customId.startsWith('ticket_modal:')) {
          return await ticketModalOnayla(interaction, config);
        }
      }
    } catch (err) {
      console.error('[INTERACTION] İşlenemedi:', err);
      const mesaj = { content: 'Bir hata oluştu. Lütfen tekrar deneyin.', flags: 64 };
      if (interaction.replied || interaction.deferred) {
        interaction.followUp(mesaj).catch(() => {});
      } else {
        interaction.reply(mesaj).catch(() => {});
      }
    }
  }
};
