"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { components } from "@/lib/api/schema";
import {
  formatRupiah,
  useTokrafDemoStore,
} from "./demo-store";

type Product = components["schemas"]["TokrafProduct"];
type PriceTier = components["schemas"]["TokrafPriceTier"];
type Variant = components["schemas"]["TokrafVariant"];
type VariantOption = components["schemas"]["TokrafVariantOption"];

type ProductForm = {
  nama: string;
  slug: string;
  id_kategori: string;
  deskripsi: string;
  foto: string;
  price_tiers: string;
  variants: string;
  status: "draf" | "terbit";
};

const emptyForm: ProductForm = {
  nama: "",
  slug: "",
  id_kategori: "",
  deskripsi: "",
  foto: "",
  price_tiers: JSON.stringify(
    [{ min_quantity: 1, max_quantity: null, unit_price: 0 }],
    null,
    2,
  ),
  variants: "[]",
  status: "draf",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parsePriceTiers(value: string): PriceTier[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Isi harga bertingkat minimal satu baris JSON.");
  }

  const tiers = parsed.map((item): PriceTier => {
    if (
      !isRecord(item) ||
      !Number.isSafeInteger(item.min_quantity) ||
      (item.max_quantity !== null &&
        !Number.isSafeInteger(item.max_quantity)) ||
      !Number.isSafeInteger(item.unit_price) ||
      Number(item.min_quantity) < 1 ||
      Number(item.unit_price) < 0 ||
      (item.max_quantity !== null &&
        Number(item.max_quantity) < Number(item.min_quantity))
    ) {
      throw new Error("Format harga tidak valid. Periksa min, max, dan harga.");
    }
    return {
      min_quantity: Number(item.min_quantity),
      max_quantity: item.max_quantity === null ? null : Number(item.max_quantity),
      unit_price: Number(item.unit_price),
    };
  });

  tiers.sort((left, right) => left.min_quantity - right.min_quantity);
  if (tiers[0].min_quantity !== 1) {
    throw new Error("Rentang harga pertama harus dimulai dari jumlah 1.");
  }
  for (let index = 0; index < tiers.length - 1; index += 1) {
    const current = tiers[index];
    const next = tiers[index + 1];
    if (
      current.max_quantity === null ||
      current.max_quantity === undefined ||
      current.max_quantity + 1 !== next.min_quantity
    ) {
      throw new Error("Rentang harga harus berurutan dan tidak tumpang tindih.");
    }
  }
  if (tiers[tiers.length - 1].max_quantity !== null) {
    throw new Error("Rentang harga terakhir harus menggunakan max_quantity: null.");
  }
  return tiers;
}

function parseVariants(value: string): Variant[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) {
    throw new Error("Varian harus berupa array JSON.");
  }
  return parsed.map((item): Variant => {
    if (
      !isRecord(item) ||
      typeof item.name !== "string" ||
      !Array.isArray(item.options) ||
      item.options.length === 0
    ) {
      throw new Error("Setiap varian harus memiliki name dan options.");
    }
    const options = item.options.map((option): VariantOption => {
      if (
        !isRecord(option) ||
        typeof option.value !== "string" ||
        typeof option.label !== "string" ||
        (option.price_adjustment !== undefined &&
          (!Number.isSafeInteger(option.price_adjustment) ||
            Number(option.price_adjustment) < 0))
      ) {
        throw new Error("Opsi varian memiliki format yang tidak valid.");
      }
      return {
        value: option.value,
        label: option.label,
        price_adjustment: Number(option.price_adjustment ?? 0),
      };
    });
    return {
      name: item.name,
      required: item.required !== false,
      options,
    };
  });
}

export default function TokrafProductManager() {
  const { data, ready, error: storageError, update } = useTokrafDemoStore();
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function startCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, id_kategori: String(data?.categories[0]?.id_kategori ?? "") });
    setError(null);
    setNotice(null);
    setFormOpen(true);
  }

  function startEdit(product: Product) {
    setEditingId(product.id_produk);
    setForm({
      nama: product.nama,
      slug: product.slug,
      id_kategori: String(product.id_kategori),
      deskripsi: product.deskripsi ?? "",
      foto: product.foto ?? "",
      price_tiers: JSON.stringify(product.price_tiers, null, 2),
      variants: JSON.stringify(product.variants, null, 2),
      status: product.status,
    });
    setError(null);
    setNotice(null);
    setFormOpen(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    try {
      if (!data) throw new Error("Data demo belum dimuat.");
      const categoryId = Number(form.id_kategori);
      const category = data.categories.find(
        (item) => item.id_kategori === categoryId,
      );
      if (!category) throw new Error("Pilih kategori yang tersedia.");
      const priceTiers = parsePriceTiers(form.price_tiers);
      const variants = parseVariants(form.variants);
      const timestamp = new Date().toISOString();
      const id =
        editingId ??
        Math.max(0, ...data.products.map((item) => item.id_produk)) + 1;
      const product: Product = {
        id_produk: id,
        nama: form.nama.trim(),
        slug: form.slug.trim(),
        id_kategori: categoryId,
        kategori: category,
        deskripsi: form.deskripsi.trim() || null,
        foto: form.foto.trim() || null,
        price_tiers: priceTiers,
        variants,
        status: form.status,
        created_at:
          data.products.find((item) => item.id_produk === id)?.created_at ??
          timestamp,
        updated_at: timestamp,
      };
      update((current) => ({
        ...current,
        products:
          editingId === null
            ? [...current.products, product]
            : current.products.map((item) =>
                item.id_produk === id ? product : item,
              ),
      }));
      setFormOpen(false);
      setNotice(editingId === null ? "Produk demo ditambahkan." : "Produk demo diperbarui.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Produk demo gagal disimpan.",
      );
    }
  }

  function handleDelete(product: Product) {
    if (!window.confirm(`Hapus produk "${product.nama}" dari data demo?`)) {
      return;
    }
    try {
      update((current) => ({
        ...current,
        products: current.products.filter(
          (item) => item.id_produk !== product.id_produk,
        ),
      }));
      setNotice("Produk demo dihapus.");
      setError(null);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Produk demo gagal dihapus.",
      );
    }
  }

  return (
    <section className="tokraf-admin-page">
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">TOKRAF · KATALOG</span>
          <h1>Produk.</h1>
          <p>Kelola produk, opsi varian, dan harga bertingkat demo.</p>
        </div>
        <button className="admin-primary-button" onClick={startCreate} type="button">
          ＋ Tambah produk
        </button>
      </header>
      {(storageError || error) && (
        <p className="admin-alert" role="alert">{error ?? storageError}</p>
      )}
      {notice && <p className="admin-success" role="status">{notice}</p>}

      {formOpen && (
        <form className="admin-form-card tokraf-product-form" onSubmit={handleSubmit}>
          <div className="admin-form-heading">
            <div>
              <span className="admin-eyebrow">FORM DATA DEMO</span>
              <h2>{editingId === null ? "Tambah produk" : "Edit produk"}</h2>
            </div>
            <button
              aria-label="Tutup form"
              className="admin-icon-button"
              onClick={() => setFormOpen(false)}
              type="button"
            >
              ×
            </button>
          </div>
          {!data?.categories.length ? (
            <p className="admin-alert">
              Buat kategori terlebih dahulu sebelum menambah produk.
            </p>
          ) : (
            <>
              <div className="admin-form-grid">
                <label className="admin-field">
                  Nama produk
                  <input
                    maxLength={150}
                    onChange={(event) => setForm({ ...form, nama: event.target.value })}
                    required
                    value={form.nama}
                  />
                </label>
                <label className="admin-field">
                  Slug
                  <input
                    maxLength={170}
                    onChange={(event) => setForm({ ...form, slug: event.target.value })}
                    required
                    value={form.slug}
                  />
                </label>
                <label className="admin-field">
                  Kategori
                  <select
                    onChange={(event) => setForm({ ...form, id_kategori: event.target.value })}
                    required
                    value={form.id_kategori}
                  >
                    {data.categories.map((category) => (
                      <option key={category.id_kategori} value={category.id_kategori}>
                        {category.nama}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="admin-field">
                  URL foto
                  <input
                    onChange={(event) => setForm({ ...form, foto: event.target.value })}
                    type="url"
                    value={form.foto}
                  />
                </label>
                <label className="admin-field is-wide">
                  Deskripsi
                  <textarea
                    onChange={(event) => setForm({ ...form, deskripsi: event.target.value })}
                    rows={3}
                    value={form.deskripsi}
                  />
                </label>
                <label className="admin-field">
                  Status publikasi
                  <select
                    onChange={(event) =>
                      setForm({
                        ...form,
                        status: event.target.value as ProductForm["status"],
                      })
                    }
                    value={form.status}
                  >
                    <option value="draf">Draf</option>
                    <option value="terbit">Terbit</option>
                  </select>
                </label>
                <label className="admin-field is-wide">
                  Harga bertingkat (JSON)
                  <textarea
                    className="tokraf-json-input"
                    onChange={(event) =>
                      setForm({ ...form, price_tiers: event.target.value })
                    }
                    required
                    rows={8}
                    value={form.price_tiers}
                  />
                  <small>
                    Gunakan min_quantity, max_quantity (null untuk tanpa batas),
                    dan unit_price dalam rupiah.
                  </small>
                </label>
                <label className="admin-field is-wide">
                  Varian dan opsi (JSON)
                  <textarea
                    className="tokraf-json-input"
                    onChange={(event) =>
                      setForm({ ...form, variants: event.target.value })
                    }
                    rows={10}
                    value={form.variants}
                  />
                  <small>
                    Setiap opsi dapat memiliki price_adjustment per unit.
                  </small>
                </label>
              </div>
              <div className="admin-form-actions">
                <button
                  className="admin-secondary-button"
                  onClick={() => setFormOpen(false)}
                  type="button"
                >
                  Batal
                </button>
                <button className="admin-primary-button" type="submit">
                  Simpan demo
                </button>
              </div>
            </>
          )}
        </form>
      )}

      <div className="admin-table-card">
        <div className="admin-table-toolbar">
          <div>
            <h2>Semua produk demo</h2>
            <span>{ready ? `${data?.products.length ?? 0} produk` : "Memuat…"}</span>
          </div>
          <Link className="admin-secondary-button" href="/tokraf/katalog">
            Lihat katalog publik ↗
          </Link>
        </div>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr><th>Nama</th><th>Kategori</th><th>Mulai dari</th><th>Status</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {!ready ? (
                <tr><td className="admin-empty-cell" colSpan={5}>Memuat data demo…</td></tr>
              ) : !data?.products.length ? (
                <tr><td className="admin-empty-cell" colSpan={5}>Belum ada produk demo.</td></tr>
              ) : data.products.map((product) => (
                <tr key={product.id_produk}>
                  <td>{product.nama}</td>
                  <td>{data.categories.find((item) => item.id_kategori === product.id_kategori)?.nama ?? "—"}</td>
                  <td>{formatRupiah(Math.min(...product.price_tiers.map((tier) => tier.unit_price)))}</td>
                  <td>{product.status}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button className="admin-text-button" onClick={() => startEdit(product)} type="button">Edit</button>
                      <button className="admin-text-button is-danger" onClick={() => handleDelete(product)} type="button">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
