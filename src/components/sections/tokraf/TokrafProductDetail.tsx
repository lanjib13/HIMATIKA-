"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, use } from "react";
import { useTokrafDemoStore, formatRupiah } from "./demo-store";

export default function TokrafProductRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="tokraf-empty">Memuat produk…</p>}>
      <ResolvedTokrafProduct params={params} />
    </Suspense>
  );
}

function ResolvedTokrafProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, ready, error } = useTokrafDemoStore();
  const product = data?.products.find(
    (item) => item.slug === id && item.status === "terbit",
  );

  if (ready && !product) notFound();

  if (error) {
    return <p className="tokraf-alert" role="alert">{error}</p>;
  }
  if (!ready || !product) {
    return <p className="tokraf-empty">Memuat produk…</p>;
  }

  const category =
    data?.categories.find(
      (item) => item.id_kategori === product.id_kategori,
    )?.nama ?? "TOKRAF";
  const minPrice = Math.min(
    ...product.price_tiers.map((tier) => tier.unit_price),
  );

  return (
    <main className="tokraf-page tokraf-interior">
      <Link className="tokraf-back-link" href="/tokraf/katalog">
        ← Kembali ke katalog
      </Link>
      <article className="tokraf-product-detail">
        <div className="tokraf-detail-art">
          {product.foto ? (
            <Image
              alt={product.nama}
              fill
              priority
              sizes="(max-width: 800px) 100vw, 50vw"
              src={product.foto}
              unoptimized
            />
          ) : (
            <span aria-hidden="true">{product.nama.slice(0, 2).toUpperCase()}</span>
          )}
          <span className="tokraf-demo-tag">DEMO</span>
        </div>
        <div className="tokraf-detail-copy">
          <p className="tokraf-eyebrow">{category}</p>
          <h1>{product.nama}</h1>
          <p>{product.deskripsi ?? "Produk kreatif dari Ekraf HIMATIKA."}</p>
          <div className="tokraf-detail-price">
            <span>Harga contoh mulai dari</span>
            <strong>{formatRupiah(minPrice)}</strong>
          </div>
          <div className="tokraf-variant-list">
            <h2>Varian tersedia</h2>
            {product.variants.length ? (
              product.variants.map((variant) => (
                <div className="tokraf-variant-row" key={variant.name}>
                  <strong>{variant.name}</strong>
                  <span>
                    {variant.options
                      .map(
                        (option) =>
                          `${option.label}${
                            option.price_adjustment
                              ? ` (+${formatRupiah(option.price_adjustment)})`
                              : ""
                          }`,
                      )
                      .join(" · ")}
                  </span>
                </div>
              ))
            ) : (
              <p>Produk ini tidak memiliki pilihan varian.</p>
            )}
          </div>
          <p className="tokraf-price-note">
            Harga dan pilihan di halaman demo hanya ilustrasi. Harga akhir
            dikonfirmasi oleh admin TOKRAF.
          </p>
          <Link
            className="tokraf-button tokraf-button-dark"
            href={`/tokraf/kalkulator?produk=${encodeURIComponent(product.slug)}`}
          >
            Hitung estimasi <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </article>
    </main>
  );
}
