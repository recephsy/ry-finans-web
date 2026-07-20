import Link from "next/link";
import { getKisiByAd, getKisiEkstresi } from "@/lib/data";
import { formatTL } from "@/lib/format";

export default function KisiDetayPage({ params }) {
  const ad = decodeURIComponent(params.id);
  const kisi = getKisiByAd(ad);
  const ekstre = getKisiEkstresi(ad);

  return (
    <div>
      <Link href="/kisiler" className="backlink">&larr; Kişiler listesine dön</Link>
      <h1>{ad}</h1>

      {kisi && (
        <div className="cards">
          <div className="card">
            <div className="cardLabel">Güncel Bakiye</div>
            <div className={"cardValue " + ((kisi.bakiye ?? 0) >= 0 ? "positive" : "negative")}>
              {formatTL(kisi.bakiye)}
            </div>
          </div>
          <div className="card">
            <div className="cardLabel">Durum</div>
            <div className="cardValue">{kisi.durum}</div>
          </div>
          <div className="card">
            <div className="cardLabel">Tür / Kategori</div>
            <div className="cardValue" style={{ fontSize: 16 }}>
              {kisi.tur} — {kisi.kategori}
            </div>
          </div>
        </div>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Tarih</th>
            <th>İşlem Türü</th>
            <th>Tutar</th>
            <th>TL Etki</th>
            <th>Bakiye</th>
            <th>Vade</th>
            <th>Durum</th>
            <th>Açıklama</th>
          </tr>
        </thead>
        <tbody>
          {ekstre.map((h, i) => (
            <tr key={i}>
              <td>{h.tarih}</td>
              <td>
                {h.islemTuru}
                {h.karsiTaraf ? " (Virman — karşı etki)" : ""}
              </td>
              <td>
                {h.tutar} {h.paraBirimi}
              </td>
              <td className={(h.etki ?? 0) >= 0 ? "positive" : "negative"}>
                {formatTL(h.etki)}
              </td>
              <td className={(h.bakiye ?? 0) >= 0 ? "positive" : "negative"}>
                {formatTL(h.bakiye)}
              </td>
              <td>{h.vade || "-"}</td>
              <td>{h.durum}</td>
              <td>{h.aciklama}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
