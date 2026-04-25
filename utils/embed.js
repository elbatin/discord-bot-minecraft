const { EmbedBuilder } = require('discord.js');

function basariliEmbed(baslik, aciklama) {
  return new EmbedBuilder()
    .setColor('#00FF88')
    .setTitle(baslik)
    .setDescription(aciklama)
    .setTimestamp();
}

function hataliEmbed(baslik, aciklama) {
  return new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle(baslik)
    .setDescription(aciklama)
    .setTimestamp();
}

function bilgiEmbed(baslik, aciklama) {
  return new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle(baslik)
    .setDescription(aciklama)
    .setTimestamp();
}

function uyariEmbed(baslik, aciklama) {
  return new EmbedBuilder()
    .setColor('#FFA500')
    .setTitle(baslik)
    .setDescription(aciklama)
    .setTimestamp();
}

module.exports = { basariliEmbed, hataliEmbed, bilgiEmbed, uyariEmbed };
