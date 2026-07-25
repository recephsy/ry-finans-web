import { getAyarlar, getKisiler } from "@/lib/data";
import { createHareketAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function YeniHareketPage({ searchParams }) {
  const ayarlar = await getAyarlar();
  const kisiler = await getKisiler();
  const hata = searchParams?.hata;
  const basarili = searchParams?.basarili;

  return (
    <div>
      <h1>Yeni İşlem Ekle</h1>
      <form action={createHareketAction} className="formCard">
        <div className="formRow">
          <label>Kişi *</label>
          <input list="kisi-list" name="kisi" required />
          <datalist id="kisi-list">
            {kisiler.map((k) => (
              <option key={k.ad} value={k.ad} />
            ))}
          </datalist>
        </div>

        <div className="formRow">
          <label>İşlem Türü *</label>
          <select name="islemTuru" required defaultValue="">
            <option value="" disabled>
              Seçiniz
            </option>
            {ayarlar.islemTurleri.map((it) => (
              <option key={it.ad} value={it.ad}>
                {it.ad}
              </option>
            ))}
          </select>
        </div>

        <div className="formRow">
          <label>Tarih</label>
          <input type="date" name="tarih" />
        </div>

        <div className="formRow">
          <label>Tutar *</label>
          <input type="number" step="0.01" name="tutar" required />
        </div>

        <div className="formRow">
          <label>Para Birimi</label>
          <select name="paraBirimi" defaultValue="TRY">
            {ayarlar.paraBirimleri.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="formRow">
          <label>Kur (TRY değilse)</label>
          <input type="number" step="0.0001" name="kur" defaultValue="1" />
        </div>

        <div className="formRow">
          <label>Ödeme Yöntemi</label>
          <select name="odemeYontemi" defaultValue="">
            <option value="">-</option>
            {ayarlar.odemeYontemleri.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="formRow">
          <label>Kart / Banka</label>
          <select name="kartBanka" defaultValue="">
            <option value="">-</option>
            {ayarlar.kartlar.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div className="formRow">
          <label>Kategori</label>
          <select name="kategori" defaultValue="">
            <option value="">-</option>
            {ayarlar.kategoriler.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div className="formRow">
          <label>Vade</label>
          <input type="date" name="vade" />
        </div>

        <div className="formRow">
          <label>Durum</label>
          <select name="durum" defaultValue="">
            <option value="">-</option>
            {ayarlar.durumlar.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="formRow">
          <label>İlişkili Cari (Virman ise karşı kişi)</label>
          <input list="kisi-list" name="ilgiliCari" />
        </div>

        <div className="formRow">
          <label>Açıklama</label>
          <textarea name="aciklama" rows={2} />
        </div>

        <div className="formRow">
          <label>Belge Linki</label>
          <input type="text" name="belgeLink" />
        </div>

        <div className="formActions">
          <button type="submit" className="btn">
            Kaydet
          </button>
        </div>

        {hata && <div className="formError">Hata: {hata}</div>}
        {basarili && (
          <div className="formSuccess">Kaydedildi — İşlem No: {basarili}</div>
        )}
      </form>
    </div>
  );
}
