"use client";

import Link from "next/link";
import { useTokrafDemoStore } from "./demo-store";

const pages = {
  "cara-pesan": {
    eyebrow: "Cara pesan",
    title: "Dari kalkulator ke konfirmasi.",
    intro:
      "TOKRAF menerima pertanyaan dan pesanan melalui WhatsApp. Website hanya membantu menyiapkan ringkasan permintaan.",
    steps: [
      "Pilih produk, varian, dan jumlah dari katalog.",
      "Lihat estimasi harga bertingkat pada kalkulator.",
      "Isi nama atau catatan tambahan jika diperlukan.",
      "Kirim ringkasan melalui WhatsApp dan tunggu konfirmasi admin.",
      "Pembayaran QRIS/transfer dibicarakan di WhatsApp; pengiriman hanya COD.",
    ],
  },
  tentang: {
    eyebrow: "Tentang TOKRAF",
    title: "Ruang kreatif Ekraf HIMATIKA.",
    intro: "",
    steps: [],
  },
  kontak: {
    eyebrow: "Kontak",
    title: "Mari bicarakan kebutuhanmu.",
    intro:
      "Hubungi TOKRAF untuk ketersediaan produk, konfirmasi harga, atau pesanan khusus.",
    steps: [],
  },
} as const;

export default function TokrafInfoPage({
  page,
}: {
  page: keyof typeof pages;
}) {
  const { data, ready } = useTokrafDemoStore();
  const content = pages[page];

  return (
    <main className="tokraf-page tokraf-interior">
      <header className="tokraf-page-heading">
        <p className="tokraf-eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p>
          {page === "tentang"
            ? data?.profile.deskripsi ?? "Karya kreatif dari Ekraf HIMATIKA."
            : content.intro}
        </p>
      </header>
      {page === "cara-pesan" && (
        <ol className="tokraf-steps">
          {content.steps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      )}
      {page === "kontak" && (
        <section className="tokraf-contact-card">
          <h2>{ready ? data?.profile.nama_toko : "TOKRAF HIMATIKA"}</h2>
          <p>{data?.profile.kontak || "Kontak toko belum diatur."}</p>
          {data?.profile.whatsapp_number ? (
            <a
              className="tokraf-button tokraf-button-dark"
              href={`https://wa.me/${data.profile.whatsapp_number}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Hubungi via WhatsApp <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <p className="tokraf-price-note">
              Nomor WhatsApp belum diatur pada profil toko demo.
            </p>
          )}
        </section>
      )}
      <Link className="tokraf-button tokraf-button-dark" href="/tokraf/katalog">
        Kembali ke katalog <span aria-hidden="true">↗</span>
      </Link>
      <p className="tokraf-demo-banner">
        Mode demo: perubahan profil toko disimpan pada browser ini saja.
      </p>
    </main>
  );
}
