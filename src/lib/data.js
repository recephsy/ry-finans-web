import fs from "fs";
import path from "path";

let cached = null;

function loadData() {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "data", "ry_finans_data.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  cached = JSON.parse(raw);
  return cached;
}

export function getDashboard() {
  return loadData().dashboard;
}

export function getKisiler() {
  const { kisiler } = loadData();
  return [...kisiler].sort((a, b) => (b.bakiye ?? 0) - (a.bakiye ?? 0));
}

export function getKisiByAd(ad) {
  const { kisiler } = loadData();
  return kisiler.find((k) => k.ad === ad);
}

// Bir kişinin kronolojik ekstresi + koşan bakiye.
// Virman işlemlerinde karşı tarafa yansıyan etki de (ilgiliCari alanı üzerinden) dahil edilir.
export function getKisiEkstresi(ad) {
  const { hareketler } = loadData();
  const rows = hareketler.filter((h) => h.kisi === ad || h.ilgiliCari === ad);

  rows.sort((a, b) => {
    if (!a.tarih) return 1;
    if (!b.tarih) return -1;
    return a.tarih.localeCompare(b.tarih);
  });

  let running = 0;
  return rows.map((h) => {
    const karsiTaraf = h.kisi !== ad && h.ilgiliCari === ad;
    const etki = karsiTaraf ? h.karsiKisiEtkisi ?? 0 : h.bakiyeEtkisi ?? 0;
    running += etki || 0;
    return { ...h, etki, bakiye: running, karsiTaraf };
  });
}

export function getKasalar() {
  return loadData().kasalar;
}

export function getKasaByAnahtar(anahtar) {
  return loadData().kasalar.find((k) => k.anahtar === anahtar);
}

// Bir kasanın kronolojik hareket dökümü + koşan bakiye.
// Kasa Virmanı işlemlerinde giriş kasası bu kasaysa "Gelen" olarak işaretlenir.
export function getKasaHareketleri(anahtar) {
  const { hareketler } = loadData();
  const rows = hareketler.filter(
    (h) => h.kasa === anahtar || h.girisKasasi === anahtar
  );

  rows.sort((a, b) => {
    if (!a.tarih) return 1;
    if (!b.tarih) return -1;
    return a.tarih.localeCompare(b.tarih);
  });

  let running = 0;
  return rows.map((h) => {
    const gelen = h.kasa !== anahtar && h.girisKasasi === anahtar;
    const etki = gelen ? h.girisKasaEtkisi ?? 0 : h.kasaEtkisi ?? 0;
    running += etki || 0;
    return { ...h, etki, bakiye: running, yon: gelen ? "Gelen" : "Giden" };
  });
}

export function getVadeliOdemeler() {
  const { hareketler } = loadData();
  return hareketler
    .filter(
      (h) => (h.durum === "Açık" || h.durum === "Kısmi Ödendi") && h.vade
    )
    .sort((a, b) => a.vade.localeCompare(b.vade));
}

export function getSiralama() {
  const kisiler = getKisiler();
  const alacaklar = kisiler.filter((k) => (k.bakiye ?? 0) > 0.005);
  const borclar = [...kisiler]
    .filter((k) => (k.bakiye ?? 0) < -0.005)
    .sort((a, b) => a.bakiye - b.bakiye);
  return { alacaklar, borclar };
}
