"use client";

import Link from "next/link";
import { useTokrafDemoStore, formatRupiah } from "./demo-store";

export default function TokrafVariantsPage() {
  const { data, ready, error } = useTokrafDemoStore();

  return (
    <section className="tokraf-admin-page">
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">TOKRAF · HARGA</span>
          <h1>Varian dan harga bertingkat.</h1>
          <p>Varian dan rentang harga diedit bersama produk yang memilikinya.</p>
        </div>
      </header>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      {!ready ? (
        <p>Memuat data demo…</p>
      ) : (
        <div className="tokraf-admin-product-list">
          {data?.products.map((product) => (
            <article className="tokraf-admin-product-card" key={product.id_produk}>
              <div>
                <span className="admin-eyebrow">{product.status}</span>
                <h2>{product.nama}</h2>
              </div>
              <div className="tokraf-admin-product-details">
                <div>
                  <h3>Varian</h3>
                  {product.variants.length ? (
                    product.variants.map((variant) => (
                      <p key={variant.name}>
                        <strong>{variant.name}:</strong>{" "}
                        {variant.options
                          .map(
                            (option) =>
                              `${option.label}${
                                option.price_adjustment
                                  ? ` (+${formatRupiah(option.price_adjustment)})`
                                  : ""
                              }`,
                          )
                          .join(", ")}
                      </p>
                    ))
                  ) : <p>Tanpa varian.</p>}
                </div>
                <div>
                  <h3>Harga demo</h3>
                  {product.price_tiers.map((tier) => (
                    <p key={tier.min_quantity}>
                      {tier.min_quantity}–{tier.max_quantity ?? "∞"} unit · {formatRupiah(tier.unit_price)}/unit
                    </p>
                  ))}
                </div>
              </div>
              <Link className="admin-secondary-button" href="/dashboard/tokraf/produk">
                Edit data produk ↗
              </Link>
            </article>
          ))}
          {!data?.products.length && <p className="admin-empty-cell">Belum ada produk demo.</p>}
        </div>
      )}
    </section>
  );
}
