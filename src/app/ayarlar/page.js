import { getAyarlar } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AyarlarPage() {
  const ayarlar = await getAyarlar();

  return (
    <div>
      <h1>Ayarlar</h1>
      <p style={{ color: "#94a3b8", marginBottom: 20 }}>
        Bu listeler Google Sheet&apos;teki &quot;Ayarlar&quot; sekmesinden
        okunur. Yeni işlem / kişi eklerken kullanılan seçenekler buradan gelir.
        Listeyi değiştirmek için doğrudan Sheet&apos;teki Ayarlar sekmesini
        düzenle.
      </p>

      <h1 style={{ fontSize: 16 }}>İşlem Türleri ve Bakiye Etkisi Çarpanı</h1>
      <table className="table" style={{ marginBottom: 24 }}>
        <thead>
          <tr>
            <th>İşlem Türü</th>
            <th className="num">Çarpan</th>
          </tr>
        </thead>
        <tbody>
          {ayarlar.islemTurleri.map((it) => (
            <tr key={it.ad}>
              <td>{it.ad}</td>
              <td className="num">{it.carpan}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid2">
        <div>
          <h1 style={{ fontSize: 16 }}>Kategoriler</h1>
          <ul>
            {ayarlar.kategoriler.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </div>
        <div>
          <h1 style={{ fontSize: 16 }}>Ödeme Yöntemleri</h1>
          <ul>
            {ayarlar.odemeYontemleri.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid2">
        <div>
          <h1 style={{ fontSize: 16 }}>Durumlar</h1>
          <ul>
            {ayarlar.durumlar.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
        <div>
          <h1 style={{ fontSize: 16 }}>Kart / Banka</h1>
          <ul>
            {ayarlar.kartlar.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
