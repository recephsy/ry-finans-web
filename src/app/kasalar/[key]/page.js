import Link from "next/link";
import { getKasaByAnahtar, getKasaHareketleri } from "@/lib/data";
import { formatTL } from "@/lib/format";

export default function KasaDetayPage({ params }) {
  const anahtar = decodeURIComponent(params.key);
  const kasa = getKasaByAnahtar(anahtar);
  const hareketler = getKasaHareketleri(anahtar);

  return (
    <div>
      <Link href="/kasalar" className="backlink">&larr; Kasalar listesine dön</Link>
      <h1>{kasa ? kasa.ad : anahtar}</h1>

      {kasa && (
        <div className="cards">
          <div className="card">
            <div className="cardLabel">Güncel Bakiye</div>
            <div className={"cardValue " + ((kasa.guncelBakiye ?? 0) >= 0 ? "positive" : "negative")}>
              {formatTL(kasa.guncelBakiye)}
            </div>
          </div>
          <div className="card">
            <div className="cardLabel">Para Birimi</div>
            <div className="cardValue">{kasa.paraBirimi || "-"}</div>
          </div>
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Tarih</th>
            <th>Kişi / Karşı Kasa</th>
            <th>İşlem Türü</th>
            <th>Yön</th>
            <th>Kasa Etkisi</th>
            <th>Bakiye</th>
            <th>Açıklama</th>
          </tr>
        </thead>
        <tbody>
          {hareketler.map((h, i) => (
            <tr key={i}>
              <td>{h.tarih}</td>
              <td>{h.kisi || h.girisKasasi || "-"}</td>
              <td>{h.islemTuru}</td>
              <td>{h.yon}</td>
              <td className={(h.etki ?? 0) >= 0 ? "positive" : "negative"}>
                {formatTL(h.etki)}
              </td>
              <td className={(h.bakiye ?? 0) >= 0 ? "positive" : "negative"}>
                {formatTL(h.bakiye)}
              </td>
              <td>{h.aciklama}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
