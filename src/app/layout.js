import "./globals.css";
import PwaRegister from "./PwaRegister";

export const metadata = {
  title: "Ry Finans",
  description: "Kişisel borç & alacak takip uygulaması",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <PwaRegister />
        <div className="shell">
          <header className="topbar">
            <div className="brand">Ry Finans</div>
            <nav className="nav">
              <a href="/">Dashboard</a>
              <a href="/kisiler">Kişiler</a>
              <a href="/kasalar">Kasalar</a>
              <a href="/vadeli-odemeler">Vadeli Ödemeler</a>
              <a href="/siralama">Sıralama</a>
            </nav>
          </header>
          <main className="content">{children}</main>
          <footer className="footer">
            Milestone 1 — görüntüleme prototipi. Veri doğrudan Google Drive&apos;daki güncel tablodan okunur (canlı).
          </footer>
        </div>
      </body>
    </html>
  );
}
