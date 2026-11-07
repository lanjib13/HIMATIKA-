"use client";

import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import { useTokrafDemoStore } from "./demo-store";

export default function TokrafCatalogPage() {
  const { data, ready, error } = useTokrafDemoStore();
  const [categoryId, setCategoryId] = useState("all");
  const [search, setSearch] = useState("");

  const products = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("id-ID");
    return (data?.products ?? []).filter((product) => {
      if (product.status !== "terbit") return false;
      if (categoryId !== "all" && String(product.id_kategori) !== categoryId) {
        return false;
      }
      return (
        !query ||
        product.nama.toLocaleLowerCase("id-ID").includes(query) ||
        (product.deskripsi ?? "").toLocaleLowerCase("id-ID").includes(query)
      );
    });
  }, [categoryId, data?.products, search]);

  return (
    <main className="tokraf-page tokraf-interior">
      <header className="tokraf-page-heading">
        <p className="tokraf-eyebrow">Katalog TOKRAF</p>
        <h1>Temukan karya favoritmu.</h1>
        <p>Pilih produk untuk melihat varian dan menghitung estimasi pesanan.</p>
      </header>
      <div className="tokraf-demo-banner">
        MODE DEMO — katalog ini belum tersambung ke database backend.
      </div>
      {error && <p className="tokraf-alert" role="alert">{error}</p>}
      <div className="tokraf-catalog-toolbar">
        <label>
          <span>Cari produk</span>
          <input
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nama atau deskripsi produk"
            value={search}
          />
        </label>
        <label>
          <span>Kategori</span>
          <select
            onChange={(event) => setCategoryId(event.target.value)}
            value={categoryId}
          >
            <option value="all">Semua kategori</option>
            {data?.categories.map((category) => (
              <option key={category.id_kategori} value={category.id_kategori}>
                {category.nama}
              </option>
            ))}
          </select>
        </label>
      </div>
      {!ready ? (
        <p className="tokraf-empty">Memuat katalog…</p>
      ) : products.length ? (
        <div className="tokraf-product-grid">
          {products.map((product) => (
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
        <p className="tokraf-empty">Produk tidak ditemukan.</p>
      )}
    </main>
  );
}
