"use client";

import { useState, type FormEvent } from "react";
import { useTokrafDemoStore } from "./demo-store";

export default function TokrafCategoryManager() {
  const { data, ready, error: storageError, update } = useTokrafDemoStore();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function resetForm() {
    setName("");
    setSlug("");
    setEditingId(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    try {
      if (!data) throw new Error("Data demo belum dimuat.");
      const timestamp = new Date().toISOString();
      const id =
        editingId ??
        Math.max(0, ...data.categories.map((category) => category.id_kategori)) + 1;
      update((current) => ({
        ...current,
        categories:
          editingId === null
            ? [
                ...current.categories,
                {
                  id_kategori: id,
                  nama: name.trim(),
                  slug: slug.trim(),
                  urutan: current.categories.length + 1,
                },
              ]
            : current.categories.map((category) =>
                category.id_kategori === id
                  ? { ...category, nama: name.trim(), slug: slug.trim() }
                  : category,
              ),
        products: current.products.map((product) =>
          product.id_kategori === id
            ? {
                ...product,
                kategori: {
                  id_kategori: id,
                  nama: name.trim(),
                  slug: slug.trim(),
                  urutan:
                    current.categories.find((category) => category.id_kategori === id)
                      ?.urutan ?? 0,
                },
                updated_at: timestamp,
              }
            : product,
        ),
      }));
      setNotice(editingId === null ? "Kategori demo ditambahkan." : "Kategori demo diperbarui.");
      resetForm();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Kategori demo gagal disimpan.",
      );
    }
  }

  function handleDelete(id: number, categoryName: string) {
    if (!data) return;
    if (
      data.products.some((product) => product.id_kategori === id)
    ) {
      setError("Kategori masih dipakai produk. Pindahkan produk sebelum menghapus.");
      return;
    }
    if (!window.confirm(`Hapus kategori "${categoryName}" dari demo?`)) return;
    try {
      update((current) => ({
        ...current,
        categories: current.categories.filter(
          (category) => category.id_kategori !== id,
        ),
      }));
      setError(null);
      setNotice("Kategori demo dihapus.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Kategori demo gagal dihapus.",
      );
    }
  }

  return (
    <section className="tokraf-admin-page">
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">TOKRAF · KATALOG</span>
          <h1>Kategori produk.</h1>
          <p>Kategori demo dipakai untuk filter katalog publik.</p>
        </div>
      </header>
      {(storageError || error) && <p className="admin-alert" role="alert">{error ?? storageError}</p>}
      {notice && <p className="admin-success" role="status">{notice}</p>}
      <form className="admin-form-card tokraf-category-form" onSubmit={handleSubmit}>
        <h2>{editingId === null ? "Tambah kategori" : "Edit kategori"}</h2>
        <div className="admin-form-grid">
          <label className="admin-field">
            Nama kategori
            <input maxLength={100} onChange={(event) => setName(event.target.value)} required value={name} />
          </label>
          <label className="admin-field">
            Slug
            <input maxLength={120} onChange={(event) => setSlug(event.target.value)} required value={slug} />
          </label>
        </div>
        <div className="admin-form-actions">
          {editingId !== null && (
            <button className="admin-secondary-button" onClick={resetForm} type="button">Batal edit</button>
          )}
          <button className="admin-primary-button" type="submit">
            {editingId === null ? "Tambah demo" : "Simpan demo"}
          </button>
        </div>
      </form>
      <div className="admin-table-card">
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead><tr><th>Nama</th><th>Slug</th><th>Produk terkait</th><th>Aksi</th></tr></thead>
            <tbody>
              {!ready ? (
                <tr><td className="admin-empty-cell" colSpan={4}>Memuat data demo…</td></tr>
              ) : data?.categories.map((category) => (
                <tr key={category.id_kategori}>
                  <td>{category.nama}</td>
                  <td>{category.slug}</td>
                  <td>{data.products.filter((product) => product.id_kategori === category.id_kategori).length}</td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        className="admin-text-button"
                        onClick={() => {
                          setEditingId(category.id_kategori);
                          setName(category.nama);
                          setSlug(category.slug);
                          setError(null);
                          setNotice(null);
                        }}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="admin-text-button is-danger"
                        onClick={() => handleDelete(category.id_kategori, category.nama)}
                        type="button"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {ready && !data?.categories.length && (
                <tr><td className="admin-empty-cell" colSpan={4}>Belum ada kategori demo.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
