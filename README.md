# Ry Finans — Web (Milestone 1: Görüntüleme Prototipi)

Bu proje, `RECEP_FINANS_v4_6_1.xlsx` dosyasındaki kişisel borç/alacak takip panelinin Next.js (React) tabanlı, PWA (yüklenebilir web uygulaması) olarak yeniden inşasının ilk adımıdır.

**Bu aşamada uygulama salt-okunurdur.** Veri, Excel'den tek seferlik alınmış bir anlık görüntü olarak `data/ry_finans_data.json` içine gömülüdür. Amaç, hesaplama mantığının (bakiye, kur dönüşümü, Virman/Kasa Virmanı, vade takibi, sıralamalar) Excel'dekiyle birebir eşleştiğini görmek. Veri girişi ekranları bir sonraki milestone'da eklenecek.

## Sayfalar

- `/` — Dashboard (özet kartlar)
- `/kisiler` — Kişi listesi ve bakiyeler
- `/kisiler/[isim]` — Kişi ekstresi (koşan bakiye ile)
- `/kasalar` — Kasa/hesap listesi ve bakiyeler
- `/kasalar/[anahtar]` — Kasa hareket dökümü
- `/vadeli-odemeler` — Açık/kısmi ödenmiş, vadesi olan işlemler
- `/siralama` — Alacaklı/borçlu sıralaması

## Çalıştırma

Bu kod, geliştirmenin yapıldığı sandbox ortamında internet erişimi kısıtlı olduğu için `npm install` burada çalıştırılamadı — yani paketler henüz indirilmedi. Kodun kendisi eksiksiz ve gözden geçirildi, ama ilk çalıştırmayı iki yoldan biriyle siz (ya da bu projeye erişimi olan bir sonraki oturum) yapmalı:

### Yöntem A — Kendi bilgisayarınızda (Node.js kuruluysa)

```
npm install
npm run dev
```

Tarayıcıda `http://localhost:3000` açılır.

### Yöntem B — Vercel'e deploy (önerilen, hosting derdi yok)

1. Bu klasörü bir GitHub deposuna yükleyin.
2. vercel.com'da ücretsiz hesapla "Import Project" ile bu depoyu seçin.
3. Vercel otomatik olarak `npm install` + `npm run build` yapar ve size çalışan bir web adresi verir.
4. Bu adres, telefonunuzda "Ana Ekrana Ekle" ile PWA olarak yüklenebilir.

Sonraki milestone'larda (veri girişi, paralel çalıştırma) bu proje üzerine eklemeler yapılacak; mevcut sayfa yapısı ve veri katmanı (`src/lib/data.js`) korunacak.
