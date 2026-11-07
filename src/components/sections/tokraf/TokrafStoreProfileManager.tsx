"use client";

import { useState, type FormEvent } from "react";
import { useTokrafDemoStore } from "./demo-store";

export default function TokrafStoreProfileManager() {
  const { data, ready, error: storageError, update } = useTokrafDemoStore();
  const [form, setForm] = useState<{
    namaToko: string;
    deskripsi: string;
    whatsappNumber: string;
    kontak: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const values = form ?? {
    namaToko: data?.profile.nama_toko ?? "",
    deskripsi: data?.profile.deskripsi ?? "",
    whatsappNumber: data?.profile.whatsapp_number ?? "",
    kontak: data?.profile.kontak ?? "",
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    const phone = values.whatsappNumber.replace(/\D/g, "");
    if (!/^[1-9]\d{7,14}$/.test(phone)) {
      setError("Masukkan nomor WhatsApp internasional, hanya angka (8–15 digit).");
      return;
    }
    try {
      update((current) => ({
        ...current,
        profile: {
          ...current.profile,
          nama_toko: values.namaToko.trim(),
          deskripsi: values.deskripsi.trim(),
          whatsapp_number: phone,
          kontak: values.kontak.trim() || null,
          updated_at: new Date().toISOString(),
        },
      }));
      setForm({ ...values, whatsappNumber: phone });
      setNotice("Profil toko demo tersimpan di browser ini.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Profil toko demo gagal disimpan.",
      );
    }
  }

  return (
    <section className="tokraf-admin-page">
      <header className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">TOKRAF · PENGATURAN PUBLIK</span>
          <h1>Profil toko.</h1>
          <p>Kontak dan deskripsi yang ditampilkan pada halaman TOKRAF.</p>
        </div>
      </header>
      {(storageError || error) && <p className="admin-alert" role="alert">{error ?? storageError}</p>}
      {notice && <p className="admin-success" role="status">{notice}</p>}
      {!ready ? (
        <p>Memuat profil demo…</p>
      ) : (
        <form className="admin-form-card tokraf-store-form" onSubmit={handleSubmit}>
          <label className="admin-field">
            Nama toko
            <input maxLength={150} onChange={(event) => setForm({ ...values, namaToko: event.target.value })} required value={values.namaToko} />
          </label>
          <label className="admin-field">
            Deskripsi
            <textarea maxLength={2000} onChange={(event) => setForm({ ...values, deskripsi: event.target.value })} required rows={5} value={values.deskripsi} />
          </label>
          <label className="admin-field">
            Nomor WhatsApp admin
            <input
              autoComplete="tel"
              inputMode="numeric"
              maxLength={15}
              onChange={(event) => setForm({ ...values, whatsappNumber: event.target.value })}
              placeholder="6281234567890"
              required
              value={values.whatsappNumber}
            />
            <small>Gunakan kode negara, tanpa tanda + atau spasi. Nomor tersimpan lokal dan hanya untuk demo.</small>
          </label>
          <label className="admin-field">
            Kontak tambahan
            <input maxLength={200} onChange={(event) => setForm({ ...values, kontak: event.target.value })} value={values.kontak} />
          </label>
          <div className="admin-form-actions">
            <button className="admin-primary-button" type="submit">Simpan profil demo</button>
          </div>
        </form>
      )}
    </section>
  );
}
