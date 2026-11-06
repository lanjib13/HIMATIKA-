"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  AdminApiError,
  getAdminProfile,
  saveAdminProfile,
} from "@/lib/api/admin";
import type { components } from "@/lib/api/schema";

type ProfileInput = components["schemas"]["ProfilInput"];

const emptyProfile: ProfileInput = {
  nama_organisasi: "",
  deskripsi: "",
  sejarah: "",
  visi: "",
  misi: "",
  logo: "",
};

export default function ProfileManager() {
  const [values, setValues] = useState<ProfileInput>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void getAdminProfile()
      .then((profile) => {
        if (!active) return;
        setValues({
          nama_organisasi: profile.nama_organisasi ?? "",
          deskripsi: profile.deskripsi ?? "",
          sejarah: profile.sejarah ?? "",
          visi: profile.visi ?? "",
          misi: profile.misi ?? "",
          logo: profile.logo ?? "",
        });
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        setError(
          loadError instanceof AdminApiError
            ? loadError.message
            : loadError instanceof Error
              ? loadError.message
              : "Profil gagal dimuat.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      await saveAdminProfile({
        ...values,
        nama_organisasi: values.nama_organisasi.trim(),
      });
      setNotice("Profil berhasil diperbarui.");
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Profil gagal disimpan.",
      );
    } finally {
      setSaving(false);
    }
  }

  function updateField(
    key: Exclude<keyof ProfileInput, "nama_organisasi">,
    value: string,
  ) {
    setValues((current) => ({ ...current, [key]: value || null }));
  }

  return (
    <section>
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">IDENTITAS ORGANISASI</span>
          <h1>Profil HIMATIKA</h1>
          <p>Perbarui informasi utama yang tampil pada website publik.</p>
        </div>
      </div>
      {error && (
        <p className="admin-alert" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="admin-success" role="status">
          {notice}
        </p>
      )}

      <form className="admin-form-card profile-form" onSubmit={handleSubmit}>
        <div className="admin-form-heading">
          <div>
            <span className="admin-eyebrow">INFORMASI PUBLIK</span>
            <h2>Data organisasi</h2>
          </div>
          <span className="admin-form-hint">
            {loading ? "Memuat profil…" : "Terhubung dengan GET/PUT /profil"}
          </span>
        </div>
        <div className="admin-form-grid">
          <label className="admin-field is-wide" htmlFor="profile-name">
            Nama organisasi <span aria-hidden="true">*</span>
            <input
              id="profile-name"
              maxLength={150}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  nama_organisasi: event.target.value,
                }))
              }
              required
              value={values.nama_organisasi}
            />
          </label>
          <label className="admin-field is-wide" htmlFor="profile-description">
            Deskripsi singkat
            <textarea
              id="profile-description"
              onChange={(event) => updateField("deskripsi", event.target.value)}
              rows={3}
              value={values.deskripsi ?? ""}
            />
          </label>
          <label className="admin-field is-wide" htmlFor="profile-history">
            Sejarah
            <textarea
              id="profile-history"
              onChange={(event) => updateField("sejarah", event.target.value)}
              rows={4}
              value={values.sejarah ?? ""}
            />
          </label>
          <label className="admin-field" htmlFor="profile-vision">
            Visi
            <textarea
              id="profile-vision"
              onChange={(event) => updateField("visi", event.target.value)}
              rows={4}
              value={values.visi ?? ""}
            />
          </label>
          <label className="admin-field" htmlFor="profile-mission">
            Misi
            <textarea
              id="profile-mission"
              onChange={(event) => updateField("misi", event.target.value)}
              rows={4}
              value={values.misi ?? ""}
            />
          </label>
          <label className="admin-field is-wide" htmlFor="profile-logo">
            URL logo
            <input
              id="profile-logo"
              onChange={(event) => updateField("logo", event.target.value)}
              type="url"
              value={values.logo ?? ""}
            />
          </label>
        </div>
        <div className="admin-form-actions">
          <button
            className="admin-primary-button"
            disabled={loading || saving}
            type="submit"
          >
            {saving ? "Menyimpan…" : "Simpan profil"}
          </button>
        </div>
      </form>
    </section>
  );
}
