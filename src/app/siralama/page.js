import Link from "next/link";
import { getSiralama } from "@/lib/data";
import { formatTL } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function SiralamaPage() {
  const { alacaklar, borclar } = await getSiralama();

  return (
    <div>
      <h1>Alacak / Borç Sıralaması</h1>
      <div className="grid2">
        <div>
          <h1 style={{ fontSize: 16 }}>Bana Borçlu Olanlar ({alacaklar.length})</h1>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Kişi</th>
                <th>Bakiye (TL)</th>
              </tr>
            </thead>
            <tbody>
              {alacaklar.map((k, i) => (
                <tr key={k.ad}>
                  <td>{i + 1}</td>
                  <td>
                    <Link href={`/kisiler/${encodeURIComponent(k.ad)}`}>{k.ad}</Link>
                  </td>
                  <td className="positive">{formatTL(k.bakiye)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h1 style={{ fontSize: 16 }}>Borçlu Olduklarım ({borclar.length})</h1>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Kişi</th>
                <th>Bakiye (TL)</th>
              </tr>
            </thead>
            <tbody>
              {borclar.map((k, i) => (
                <tr key={k.ad}>
                  <td>{i + 1}</td>
                  <td>
                    <Link href={`/kisiler/${encodeURIComponent(k.ad)}`}>{k.ad}</Link>
                  </td>
                  <td className="negative">{formatTL(k.bakiye)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
