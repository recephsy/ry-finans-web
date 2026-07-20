import { getDashboard, getVadeliOdemeler } from "@/lib/data";
import { formatTL, formatSayi } from "@/lib/format";

export default function DashboardPage() {
  const d = getDashboard();
  const today = new Date().toISOString().slice(0, 10);
  const yaklasanlar = getVadeliOdemeler()
    .filter((h) => h.vade >= today)
    .slice(0, 5);

  return (
    <div>
      <h1>Kişisel Borç &amp; Alacak Takip Paneli</h1>

      <div className="cards">
        <div className="card">
          <div className="cardLabel">Toplam Alacağım</div>
          <div className="cardValue positive">{formatTL(d.toplamAlacak)}</div>
        </div>
        <div className="card">
          <div className="cardLabel">Toplam Borcum</div>
          <div className="cardValue negative">{formatTL(d.toplamBorc)}</div>
        </div>
        <div className="card">
          <div className="cardLabel">Net Durum</div>
          <div className={"cardValue " + (d.netDurum >= 0 ? "positive" : "negative")}>
            {formatTL(d.netDurum)}
          </div>
        </div>
      </div>

      <div className="cards">
        <div className="card">
          <div className="cardLabel">Bana Borçlu Kişi</div>
          <div className="cardValue">{formatSayi(d.banaBorcluSayisi)}</div>
        </div>
        <div className="card">
          <div className="cardLabel">Borçlu Olduğum Kişi</div>
          <div className="cardValue">{formatSayi(d.borcluOldugumSayisi)}</div>
        </div>
        <div className="card">
          <div className="cardLabel">Vadesi Geçen Açık İşlem</div>
          <div className="cardValue negative">{formatSayi(d.vadesiGecenAcikIslem)}</div>
        </div>
      </div>

      <h1>Yaklaşan Ödemeler</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Vade</th>
            <th>Kişi</th>
            <th>İşlem Türü</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          {yaklasanlar.map((h, i) => (
            <tr key={i}>
              <td>{h.vade}</td>
              <td>{h.kisi}</td>
              <td>{h.islemTuru}</td>
              <td>{h.durum}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
