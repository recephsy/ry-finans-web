"use server";

import { appendKisi } from "@/lib/sheetsWrite";
import { redirect } from "next/navigation";

export async function createKisiAction(formData) {
  const input = {
    ad: formData.get("ad"),
    telefon: formData.get("telefon"),
    tur: formData.get("tur"),
    kategori: formData.get("kategori"),
    not_: formData.get("not_"),
  };

  if (!input.ad) {
    redirect("/kisiler/yeni?hata=" + encodeURIComponent("Ad Soyad zorunludur."));
    return;
  }

  let hata = null;
  try {
    await appendKisi(input);
  } catch (e) {
    hata = (e && e.message) || "Bilinmeyen hata";
  }

  if (hata) {
    redirect("/kisiler/yeni?hata=" + encodeURIComponent(hata));
  }
  redirect("/kisiler/yeni?basarili=1");
}
