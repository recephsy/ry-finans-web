"use server";

import { appendHareket } from "@/lib/sheetsWrite";
import { redirect } from "next/navigation";

export async function createHareketAction(formData) {
  const input = {
    tarih: formData.get("tarih"),
    kisi: formData.get("kisi"),
    islemTuru: formData.get("islemTuru"),
    paraBirimi: formData.get("paraBirimi"),
    tutar: formData.get("tutar"),
    kur: formData.get("kur") || 1,
    odemeYontemi: formData.get("odemeYontemi"),
    kartBanka: formData.get("kartBanka"),
    kategori: formData.get("kategori"),
    vade: formData.get("vade"),
    durum: formData.get("durum"),
    aciklama: formData.get("aciklama"),
    belgeLink: formData.get("belgeLink"),
    ilgiliCari: formData.get("ilgiliCari"),
  };

  if (!input.kisi || !input.islemTuru || !input.tutar) {
    redirect(
      "/hareketler/yeni?hata=" +
        encodeURIComponent("Kişi, İşlem Türü ve Tutar zorunludur.")
    );
    return;
  }

  let no;
  let hata = null;
  try {
    no = await appendHareket(input);
  } catch (e) {
    hata = (e && e.message) || "Bilinmeyen hata";
  }

  if (hata) {
    redirect("/hareketler/yeni?hata=" + encodeURIComponent(hata));
  }
  redirect("/hareketler/yeni?basarili=" + no);
}
