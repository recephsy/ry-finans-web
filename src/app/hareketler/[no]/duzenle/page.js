import { getHareketByNo, getAyarlar } from "@/lib/data";
import { updateHareketAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function HareketDuzenlePage({ params, searchParams }) {
  const no = params.no;
  const hareket = await getHareketByNo(no);
  const ayarlar = await getAyarlar();
  const hata = searchParams?.hata;
  const basarili = searchParams?.basarili;

  if (!hareket) {
    return (
      <div>
        <h1>İşlem bulunamadı</h1>
        <p>İşlem No {no} için kayıt bulunamadı.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>İşlem Düzenle — #{hareket.no}</h1>

      <div className="cards">
        <div className="card">
          <div className="cardLabel">Kişi</div>
          <div className="cardValue" style={{ fontSize: 16 }}>
            {hareket.kisi}
          </div>
        </div>
        <div className="card">
          <div className="cardLabel">İşlem Türü</div>
          <div className="cardValue" style={{ fontSize: 16 }}>
            {hareket.islemTuru}
          </div>
        </div>
        <div className="card">
          <div className="cardLabel">Tutar</div>
          <div className="cardValue" style={{ fontSize: 16 }}>
            {hareket.tutar} {hareket.paraBirimi}
          </div>
        </div>
      </div>

      <form action={updateHareketAction} className="formCard">
        <input type="hidden" name="no" value={hareket.no} />
        <div className="formRow">
          <label>Durum</label>
          <select name="durum" defaultValue={hareket.durum || ""}>
            <option value="">-</option>
            {ayarlar.durumlar.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div className="formActions">
          <button type="submit" className="btn">
            Güncelle
          </button>
        </div>
        {hata && <div className="formError">Hata: {hata}</div>}
        {basarili && <div className="formSuccess">Güncellendi.</div>}
      </form>
    </div>
  );
}
