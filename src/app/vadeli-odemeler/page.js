import { getVadeliOdemeler } from "@/lib/data";
import { formatTL } from "@/lib/format";

export const dynamic = "force-dynamic";

function kalanGun(vade) {
  const today = new Date();
  const d = new Date(vade);
  const diff = Math.round((d - today) / (1000 * 60 * 60 * 24));
  return diff;
}

export default async function VadeliOdemelerPage() {
  const hareketler = await getVadeliOdemeler();

  return (
    <div>
      <h1>Vadeli Ödemeler ({hareketler.length})</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Vade</th>
            <th>Kalan Gün</th>
            <th>Kişi</th>
            <th>İşlem Türü</th>
            <th>Tutar (TL)</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          {hareketler.map((h, i) => {
            const gun = kalanGun(h.vade);
            return (
              <tr key={i}>
                <td>{h.vade}</td>
                <td className={gun < 0 ? "negative" : ""}>{gun}</td>
                <td>{h.kisi}</td>
                <td>{h.islemTuru}</td>
                <td>{formatTL(h.tlTutar)}</td>
                <td>
                  <span className="pill">{h.durum}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
