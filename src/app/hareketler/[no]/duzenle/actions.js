"use server";

import { updateHareketDurum } from "@/lib/sheetsWrite";
import { redirect } from "next/navigation";

export async function updateHareketAction(formData) {
  const no = formData.get("no");
  const durum = formData.get("durum");

  let hata = null;
  try {
    await updateHareketDurum(no, durum);
  } catch (e) {
    hata = (e && e.message) || "Bilinmeyen hata";
  }

  if (hata) {
    redirect(`/hareketler/${no}/duzenle?hata=` + encodeURIComponent(hata));
  }
  redirect(`/hareketler/${no}/duzenle?basarili=1`);
}
