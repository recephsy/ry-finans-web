import Link from "next/link";
import { getKisiler } from "@/lib/data";
import { formatTL } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function KisilerPage() {
  const kisiler = await getKisiler();

  return (
    <div>
      <h1>Kişiler ({kisiler.length})</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Ad</th>
            <th>Tür</th>
            <th>Kategori</th>
            <th className="num">Bakiye (TL)</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          {kisiler.map((k) => (
            <tr key={k.ad}>
              <td>
                <Link href={`/kisiler/${encodeURIComponent(k.ad)}`}>{k.ad}</Link>
              </td>
              <td>{k.tur}</td>
              <td>{k.kategori}</td>
              <td className={"num " + ((k.bakiye ?? 0) >= 0 ? "positive" : "negative")}>
                {formatTL(k.bakiye)}
              </td>
              <td>
                <span className="pill">{k.durum}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
