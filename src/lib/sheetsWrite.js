import { google } from "googleapis";

const SHEET_ID = "1vOzs_Z5hG2akYYHZIjojumpm5GHNuPNl";

// Sekmelerin sayisal sheetId'leri (batchUpdate icin gerekli, gid ile ayni deger).
const HAREKETLER_SHEET_NUM = 844274764;
const HAREKETLER_COLS = 22; // A..V
const KISILER_SHEET_NUM = 2076031649;
const KISILER_COLS = 8; // A..H

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !rawKey) {
    throw new Error(
      "GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY tanımlı değil. Vercel ortam değişkenlerini kontrol et."
    );
  }
  const key = rawKey.replace(/\\n/g, "\n");
  return new google.auth.JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheets() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

// Bir sekmenin toplam dolu satir sayisini (header dahil) dondurur.
async function getRowCount(sheets, sheetName) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${sheetName}!A:A`,
  });
  return (res.data.values || []).length;
}

// Son satirin altina, formulleri (varsa) son satirdan kopyalayarak yeni bos bir satir ekler.
// Donen deger: yeni satirin 1-tabanli sheet satir numarasi (A1 notasyonunda kullanilir).
async function insertRowInheritingFormulas(sheets, sheetName, sheetIdNum, colCount) {
  const rowCount = await getRowCount(sheets, sheetName); // header + veri satiri sayisi
  const newRow0 = rowCount; // 0-tabanli index (yeni satir bunun uzerine gelecek)

  const requests = [
    {
      insertDimension: {
        range: {
          sheetId: sheetIdNum,
          dimension: "ROWS",
          startIndex: newRow0,
          endIndex: newRow0 + 1,
        },
        inheritFromBefore: true,
      },
    },
  ];

  // Kopyalayacak bir onceki (mevcut son) veri satiri varsa formulleri oradan kopyala.
  if (rowCount > 1) {
    requests.push({
      copyPaste: {
        source: {
          sheetId: sheetIdNum,
          startRowIndex: newRow0 - 1,
          endRowIndex: newRow0,
          startColumnIndex: 0,
          endColumnIndex: colCount,
        },
        destination: {
          sheetId: sheetIdNum,
          startRowIndex: newRow0,
          endRowIndex: newRow0 + 1,
          startColumnIndex: 0,
          endColumnIndex: colCount,
        },
        pasteType: "PASTE_FORMULA",
      },
    });
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: { requests },
  });

  return newRow0 + 1; // 1-tabanli satir numarasi
}

async function writeCells(sheets, sheetName, rowA1, cellMap) {
  const data = Object.entries(cellMap)
    .filter(([, v]) => v !== undefined)
    .map(([col, v]) => ({
      range: `${sheetName}!${col}${rowA1}`,
      values: [[v]],
    }));
  if (!data.length) return;
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      valueInputOption: "USER_ENTERED",
      data,
    },
  });
}

function trDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}.${m}.${y}`;
}

// Yeni bir Hareket (islem) satiri ekler. TL Tutar / Bakiye Etkisi / Karsi Kisi Etkisi
// gibi formul kolonlarina dokunulmaz; son satirdan kopyalanan formuller yeni girilen
// Tutar/Kur/Islem Turu degerlerine gore kendiliginden hesaplanir.
export async function appendHareket(input) {
  const sheets = getSheets();
  const rowA1 = await insertRowInheritingFormulas(
    sheets,
    "Hareketler",
    HAREKETLER_SHEET_NUM,
    HAREKETLER_COLS
  );

  // Sonraki Islem No: mevcut en buyuk numara + 1.
  const colA = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `Hareketler!A2:A${rowA1 - 1}`,
  });
  const nums = (colA.data.values || [])
    .map((r) => Number(r[0]))
    .filter((n) => !Number.isNaN(n));
  const nextNo = nums.length ? Math.max(...nums) + 1 : 1;

  await writeCells(sheets, "Hareketler", rowA1, {
    A: nextNo,
    B: trDate(input.tarih),
    C: input.kisi || "",
    D: input.islemTuru || "",
    E: input.paraBirimi || "TRY",
    F: input.tutar ?? "",
    G: input.kur ?? 1,
    I: input.odemeYontemi || "",
    J: input.kartBanka || "",
    K: input.kategori || "",
    L: trDate(input.vade),
    M: input.durum || "",
    O: input.aciklama || "",
    P: input.belgeLink || "",
    T: input.ilgiliCari || "",
  });

  return nextNo;
}

// Yeni bir Kisi satiri ekler (Ad Soyad, Telefon, Kisi Turu, Kategori, Not).
export async function appendKisi(input) {
  const sheets = getSheets();
  const rowA1 = await insertRowInheritingFormulas(
    sheets,
    "Kişiler",
    KISILER_SHEET_NUM,
    KISILER_COLS
  );

  const colA = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `Kişiler!A2:A${rowA1 - 1}`,
  });
  const nums = (colA.data.values || [])
    .map((r) => Number(r[0]))
    .filter((n) => !Number.isNaN(n));
  const nextId = nums.length ? Math.max(...nums) + 1 : 1;

  await writeCells(sheets, "Kişiler", rowA1, {
    A: nextId,
    B: input.ad || "",
    C: input.telefon || "",
    D: input.tur || "",
    E: input.kategori || "",
    F: input.not_ || "",
  });

  return nextId;
}

// Bir Hareket satirinin Durum hucresini gunceller (Islem No ile bulur).
export async function updateHareketDurum(islemNo, yeniDurum) {
  const sheets = getSheets();
  const rowCount = await getRowCount(sheets, "Hareketler");
  const colA = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `Hareketler!A2:A${rowCount}`,
  });
  const rows = colA.data.values || [];
  const idx = rows.findIndex((r) => Number(r[0]) === Number(islemNo));
  if (idx === -1) {
    throw new Error(`İşlem No ${islemNo} bulunamadı.`);
  }
  const rowA1 = idx + 2; // +2: A2'den basladigi ve 1-tabanli oldugu icin
  await writeCells(sheets, "Hareketler", rowA1, { M: yeniDurum });
}
