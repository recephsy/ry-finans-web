import Link from "next/link";
import { getKasalar } from "@/lib/data";
import { formatTL } from "@/lib/format";

export default function KasalarPage() {
  const kasalar = getKasalar();

  return (
    <div>
      <h1>Kasalar / Hesaplar ({kasalar.length})</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Kasa</th>
            <th>Banka</th>
            <th>Para Birimi</th>
            <th>Açılış Bakiyesi</th>
            <th>Güncel Bakiye</th>
          </tr>
        </thead>
        <tbody>
          {kasalar.map((k) => (
            <tr key={k.anahtar}>
              <td>
                <Link href={`/kasalar/${encodeURIComponent(k.anahtar)}`}>{k.ad}</Link>
              </td>
              <td>{k.banka || "-"}</td>
              <td>{k.paraBirimi || "-"}</td>
              <td>{formatTL(k.acilisBakiyesi)}</td>
              <td className={(k.guncelBakiye ?? 0) >= 0 ? "positive" : "negative"}>
                {formatTL(k.guncelBakiye)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
