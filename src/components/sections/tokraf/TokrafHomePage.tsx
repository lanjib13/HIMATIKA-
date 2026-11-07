"use client";

import Link from "next/link";
import { useTokrafDemoStore } from "./demo-store";
import ProductCard from "./ProductCard";

export default function TokrafHomePage() {
  const { data, ready, error } = useTokrafDemoStore();
  const featured = data?.products.filter((product) => product.status === "terbit").slice(0, 3) ?? [];

  return (
    <main className="tokraf-page">
      <section className="tokraf-hero">
        <div className="tokraf-hero-copy">
          <p className="tokraf-eyebrow">Karya kreatif · Ekraf HIMATIKA</p>
          <h1>
            Ide tumbuh,
            <br />
            <span>karya terwujud.</span>
          </h1>
          <p>
            Temukan merchandise dan karya kreatif dari keluarga besar
            HIMATIKA. Pilih produk, atur varian, lalu konsultasikan pesanan
            langsung dengan tim Ekraf.
          </p>
          <div className="tokraf-actions">
            <Link className="tokraf-button tokraf-button-dark" href="/tokraf/katalog">
              Jelajahi katalog <span aria-hidden="true">↗</span>
            </Link>
            <Link className="tokraf-text-link" href="/tokraf/cara-pesan">
              Cara memesan
            </Link>
          </div>
        </div>
        <div aria-hidden="true" className="tokraf-hero-art">
          <div className="tokraf-orbit tokraf-orbit-one" />
          <div className="tokraf-orbit tokraf-orbit-two" />
          <div className="tokraf-hero-mark">T</div>
          <span className="tokraf-hero-caption">CREATE · MAKE · SHARE</span>
        </div>
        <span className="tokraf-demo-banner">
          MODE DEMO — produk dan harga contoh, tersimpan di browser ini
        </span>
      </section>

      <section className="tokraf-section">
        <header className="tokraf-section-heading">
          <div>
            <p className="tokraf-eyebrow">Pilihan dari Ekraf</p>
            <h2>Karya untuk dibawa pulang.</h2>
          </div>
          <Link href="/tokraf/katalog">Semua produk ↗</Link>
        </header>
        {error && <p className="tokraf-alert" role="alert">{error}</p>}
        {!ready ? (
          <p className="tokraf-empty">Memuat katalog demo…</p>
        ) : featured.length ? (
          <div className="tokraf-product-grid">
            {featured.map((product) => (
              <ProductCard
                categoryName={
                  data?.categories.find(
                    (category) => category.id_kategori === product.id_kategori,
                  )?.nama ?? "TOKRAF"
                }
                key={product.id_produk}
                product={product}
              />
            ))}
          </div>
        ) : (
          <p className="tokraf-empty">Belum ada produk yang dipublikasikan.</p>
        )}
      </section>

      <section className="tokraf-promo">
        <div>
          <p className="tokraf-eyebrow">Pesanan khusus</p>
          <h2>Butuh jumlah banyak atau desain khusus?</h2>
          <p>
            Gunakan kalkulator untuk melihat perkiraan awal. Tim Ekraf akan
            mengonfirmasi ketersediaan dan harga akhir melalui WhatsApp.
          </p>
        </div>
        <Link className="tokraf-button tokraf-button-light" href="/tokraf/kalkulator">
          Hitung estimasi <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </main>
  );
}
