const SHEET_ID = "1vOzs_Z5hG2akYYHZIjojumpm5GHNuPNl";
const HAREKETLER_GID = "844274764";
const KISILER_GID = "2076031649";

function csvUrl(gid) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c === "\r") {
      // skip
    } else {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || (r[0] ?? "").trim() !== "");
}

function parseNumber(raw) {
  if (raw === null || raw === undefined) return null;
  let s = String(raw).trim();
  if (!s) return null;
  const neg = s.startsWith("-") || (s.startsWith("(") && s.endsWith(")"));
  s = s.replace(/[()]/g, "").replace(/[^0-9.,-]/g, "");
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  let normalized;
  if (lastComma === -1 && lastDot === -1) {
    normalized = s;
  } else if (lastComma > lastDot) {
    normalized =
      s.slice(0, lastComma).replace(/[.,]/g, "") + "." + s.slice(lastComma + 1).replace(/[.,]/g, "");
  } else {
    normalized =
      s.slice(0, lastDot).replace(/[.,]/g, "") + "." + s.slice(lastDot + 1).replace(/[.,]/g, "");
  }
  const n = parseFloat(normalized);
  if (Number.isNaN(n)) return null;
  return neg ? -Math.abs(n) : n;
}

function parseTrDateToIso(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  const m = s.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (!m) return null;
  const [, d, mo, y] = m;
  if (d === "00" || mo === "00") return null;
  return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function cleanText(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === "" ? null : s;
}

function cleanDurum(v) {
  const s = cleanText(v);
  if (!s || s === "0") return null;
  return s;
}

async function fetchCsvRows(gid) {
  const res = await fetch(csvUrl(gid), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Google Sheet okunamadi (gid=${gid}): HTTP ${res.status}`);
  }
  const text = await res.text();
  const rows = parseCsv(text);
  const header = rows[0].map((h) => h.trim());
  const idx = (name) => header.indexOf(name);
  return { rows: rows.slice(1), idx };
}

let cache = null;
let cacheAt = 0;
const CACHE_MS = 60 * 1000;

async function loadData() {
  const now = Date.now();
  if (cache && now - cacheAt < CACHE_MS) return cache;

  const [hareketlerCsv, kisilerCsv] = await Promise.all([
    fetchCsvRows(HAREKETLER_GID),
    fetchCsvRows(KISILER_GID),
  ]);

  const hCol = {
    no: hareketlerCsv.idx("İşlem No"),
    tarih: hareketlerCsv.idx("Tarih"),
    kisi: hareketlerCsv.idx("Kişi"),
    islemTuru: hareketlerCsv.idx("İşlem Türü"),
    paraBirimi: hareketlerCsv.idx("Para Birimi"),
    tutar: hareketlerCsv.idx("Tutar"),
    kur: hareketlerCsv.idx("Kur"),
    tlTutar: hareketlerCsv.idx("TL Tutar"),
    odemeYontemi: hareketlerCsv.idx("Ödeme Yöntemi"),
    kartBanka: hareketlerCsv.idx("Kart / Banka"),
    kategori: hareketlerCsv.idx("Kategori"),
    vade: hareketlerCsv.idx("Vade"),
    durum: hareketlerCsv.idx("Durum"),
    bakiyeEtkisi: hareketlerCsv.idx("Bakiye Etkisi (TL)"),
    aciklama: hareketlerCsv.idx("Açıklama"),
    belgeLink: hareketlerCsv.idx("Belge Linki"),
    ilgiliCari: hareketlerCsv.idx("İlişkili Cari (Kime)"),
    karsiKisiEtkisi: hareketlerCsv.idx("Karşı Kişi Etkisi (TL)"),
  };

  const hareketler = hareketlerCsv.rows
    .filter((r) => cleanText(r[hCol.kisi]))
    .map((r) => ({
      no: parseNumber(r[hCol.no]),
      tarih: parseTrDateToIso(r[hCol.tarih]),
      kisi: cleanText(r[hCol.kisi]),
      islemTuru: cleanText(r[hCol.islemTuru]),
      paraBirimi: cleanText(r[hCol.paraBirimi]),
      tutar: parseNumber(r[hCol.tutar]),
      kur: parseNumber(r[hCol.kur]),
      tlTutar: parseNumber(r[hCol.tlTutar]),
      odemeYontemi: cleanText(r[hCol.odemeYontemi]),
      kartBanka: cleanText(r[hCol.kartBanka]),
      kategori: cleanText(r[hCol.kategori]),
      vade: parseTrDateToIso(r[hCol.vade]),
      durum: cleanDurum(r[hCol.durum]),
      bakiyeEtkisi: parseNumber(r[hCol.bakiyeEtkisi]),
      aciklama: cleanText(r[hCol.aciklama]),
      belgeLink: cleanText(r[hCol.belgeLink]),
      ilgiliCari: cleanText(r[hCol.ilgiliCari]),
      karsiKisiEtkisi: parseNumber(r[hCol.karsiKisiEtkisi]),
      kasa: null,
      kasaEtkisi: null,
      girisKasasi: null,
      girisKasaEtkisi: null,
    }));

  const kCol = {
    id: kisilerCsv.idx("Kişi ID"),
    ad: kisilerCsv.idx("Ad Soyad"),
    telefon: kisilerCsv.idx("Telefon"),
    tur: kisilerCsv.idx("Kişi Türü"),
    kategori: kisilerCsv.idx("Kategori"),
    not_: kisilerCsv.idx("Not"),
  };

  const meta = new Map();
  for (const r of kisilerCsv.rows) {
    const ad = cleanText(r[kCol.ad]);
    if (!ad) continue;
    meta.set(ad, {
      id: parseNumber(r[kCol.id]),
      telefon: cleanText(r[kCol.telefon]),
      tur: cleanText(r[kCol.tur]),
      kategori: cleanText(r[kCol.kategori]),
      not_: cleanText(r[kCol.not_]),
    });
  }

  const bakiyeMap = new Map();
  const bump = (ad, etki) => {
    if (!ad || etki === null) return;
    bakiyeMap.set(ad, (bakiyeMap.get(ad) || 0) + etki);
  };
  for (const h of hareketler) {
    bump(h.kisi, h.bakiyeEtkisi);
    if (h.ilgiliCari) bump(h.ilgiliCari, h.karsiKisiEtkisi);
  }

  const allNames = new Set([...bakiyeMap.keys(), ...meta.keys()]);
  let nextId = 1;
  const kisiler = Array.from(allNames).map((ad) => {
    const bakiye = Math.round((bakiyeMap.get(ad) || 0) * 100) / 100;
    const m = meta.get(ad) || {};
    return {
      id: m.id ?? nextId++,
      ad,
      telefon: m.telefon ?? null,
      tur: m.tur ?? null,
      kategori: m.kategori ?? null,
      not_: m.not_ ?? null,
      bakiye,
      durum: bakiye > 0.005 ? "Bana Borçlu" : bakiye < -0.005 ? "Ben Borçluyum" : "Kapalı",
    };
  });

  cache = { kisiler, hareketler };
  cacheAt = now;
  return cache;
}

export async function getDashboard() {
  const { kisiler, hareketler } = await loadData();
  let toplamAlacak = 0;
  let toplamBorc = 0;
  let banaBorcluSayisi = 0;
  let borcluOldugumSayisi = 0;
  for (const k of kisiler) {
    if (k.bakiye > 0.005) {
      toplamAlacak += k.bakiye;
      banaBorcluSayisi++;
    } else if (k.bakiye < -0.005) {
      toplamBorc += -k.bakiye;
      borcluOldugumSayisi++;
    }
  }
  const today = new Date().toISOString().slice(0, 10);
  const vadesiGecenAcikIslem = hareketler.filter(
    (h) => h.durum === "Açık" && h.vade && h.vade < today
  ).length;
  return {
    toplamAlacak,
    toplamBorc,
    netDurum: toplamAlacak - toplamBorc,
    banaBorcluSayisi,
    borcluOldugumSayisi,
    vadesiGecenAcikIslem,
  };
}

export async function getKisiler() {
  const { kisiler } = await loadData();
  return [...kisiler].sort((a, b) => (b.bakiye ?? 0) - (a.bakiye ?? 0));
}

export async function getKisiByAd(ad) {
  const { kisiler } = await loadData();
  return kisiler.find((k) => k.ad === ad);
}

// Bir kişinin kronolojik ekstresi + koşan bakiye.
// Virman işlemlerinde karşı tarafa yansıyan etki de (ilgiliCari alanı üzerinden) dahil edilir.
export async function getKisiEkstresi(ad) {
  const { hareketler } = await loadData();
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
  return [];
}

export function getKasaByAnahtar() {
  return null;
}

export function getKasaHareketleri() {
  return [];
}

export async function getVadeliOdemeler() {
  const { hareketler } = await loadData();
  return hareketler
    .filter((h) => (h.durum === "Açık" || h.durum === "Kısmi Ödendi") && h.vade)
    .sort((a, b) => a.vade.localeCompare(b.vade));
}

export async function getSiralama() {
  const kisiler = await getKisiler();
  const alacaklar = kisiler.filter((k) => (k.bakiye ?? 0) > 0.005);
  const borclar = [...kisiler]
    .filter((k) => (k.bakiye ?? 0) < -0.005)
    .sort((a, b) => a.bakiye - b.bakiye);
  return { alacaklar, borclar };
}
