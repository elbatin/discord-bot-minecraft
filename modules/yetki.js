const fs = require('fs');
const path = require('path');

const DOSYA = path.join(__dirname, '../data/yetkiData.json');

function oku() {
  try {
    return JSON.parse(fs.readFileSync(DOSYA, 'utf8'));
  } catch {
    return { kullanicilar: [], roller: [] };
  }
}

function yaz(data) {
  fs.writeFileSync(DOSYA, JSON.stringify(data, null, 2), 'utf8');
}

function yetkiVer(hedef, tip) {
  const data = oku();
  if (tip === 'kullanici') {
    if (!data.kullanicilar.includes(hedef)) data.kullanicilar.push(hedef);
  } else {
    if (!data.roller.includes(hedef)) data.roller.push(hedef);
  }
  yaz(data);
}

function yetkiAl(hedef, tip) {
  const data = oku();
  if (tip === 'kullanici') {
    data.kullanicilar = data.kullanicilar.filter(id => id !== hedef);
  } else {
    data.roller = data.roller.filter(id => id !== hedef);
  }
  yaz(data);
}

function yetkiListesi() {
  return oku();
}

/**
 * Bir üyenin moderasyon yetkisi olup olmadığını kontrol eder.
 * Sıra: sunucu sahibi → Administrator izni → admin rolü → yetkili rolü → yetki verilmiş rol → yetki verilmiş kullanıcı
 */
function yetkiVarMi(member, config) {
  if (!member) return false;
  if (member.guild.ownerId === member.id) return true;
  if (member.permissions.has('Administrator')) return true;
  if (config.roles?.admin && member.roles.cache.has(config.roles.admin)) return true;
  if (config.roles?.yetkili && member.roles.cache.has(config.roles.yetkili)) return true;

  const data = oku();
  if (data.kullanicilar.includes(member.id)) return true;
  for (const rolId of data.roller) {
    if (member.roles.cache.has(rolId)) return true;
  }
  return false;
}

module.exports = { yetkiVer, yetkiAl, yetkiListesi, yetkiVarMi };