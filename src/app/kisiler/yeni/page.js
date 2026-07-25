import { getAyarlar } from "@/lib/data";
import { createKisiAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function YeniKisiPage({ searchParams }) {
  const ayarlar = await getAyarlar();
  const hata = searchParams?.hata;
  const basarili = searchParams?.basarili;

  return (
    <div>
      <h1>Yeni Kişi Ekle</h1>
      <form action={createKisiAction} className="formCard">
        <div className="formRow">
          <label>Ad Soyad *</label>
          <input type="text" name="ad" required />
        </div>

        <div className="formRow">
          <label>Telefon</label>
          <input type="text" name="telefon" />
        </div>

        <div className="formRow">
          <label>Kişi Türü</label>
          <select name="tur" defaultValue="">
            <option value="">-</option>
            {ayarlar.kisiTurleri.map((t) => (
              <option key={t} value={t}>
                {t}
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
          <label>Not</label>
          <textarea name="not_" rows={2} />
        </div>

        <div className="formActions">
          <button type="submit" className="btn">
            Kaydet
          </button>
        </div>

        {hata && <div className="formError">Hata: {hata}</div>}
        {basarili && <div className="formSuccess">Kişi eklendi.</div>}
      </form>
    </div>
  );
}
