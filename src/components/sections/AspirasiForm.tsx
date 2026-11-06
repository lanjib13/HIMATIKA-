"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { ApiRequestError, sendAspirasi } from "@/lib/api/queries";

export default function AspirationSection() {
  const [formStatus, setFormStatus] = useState({
    pending: false,
    message: null as string | null,
    error: null as string | null,
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const kategori = String(formData.get("kategori") ?? "").trim();
    const pesan = String(formData.get("pesan") ?? "").trim();
    const nama = String(formData.get("nama") ?? "").trim();
    const kontak = String(formData.get("kontak") ?? "").trim();

    if (!kategori) {
      setFormStatus({
        pending: false,
        message: null,
        error: "Kategori wajib diisi.",
      });
      return;
    }
    if (pesan.length < 5) {
      setFormStatus({
        pending: false,
        message: null,
        error: "Pesan harus berisi minimal 5 karakter.",
      });
      return;
    }

    setFormStatus({ pending: true, message: null, error: null });
    try {
      const result = await sendAspirasi({
        kategori,
        pesan,
        nama: nama || null,
        kontak: kontak || null,
      });
      setFormStatus({
        pending: false,
        message: result.message ?? "Aspirasi berhasil dikirim.",
        error: null,
      });
      form.reset();
    } catch (error) {
      setFormStatus({
        pending: false,
        message: null,
        error:
          error instanceof ApiRequestError
            ? error.message
            : error instanceof Error
              ? `Tidak dapat terhubung ke API HIMATIKA: ${error.message}`
              : "Tidak dapat terhubung ke API HIMATIKA.",
      });
    }
  }

  return (
    <section
      aria-labelledby="aspiration-title"
      className="aspiration-section"
      id="aspirasi"
    >
      <div className="aspiration-heading">
        <p className="eyebrow">Ruang untuk suaramu</p>
        <h2 id="aspiration-title">
          Punya ide?
          <br />
          <span>Kami ingin mendengarnya.</span>
        </h2>
        <p className="aspiration-description">
          Sampaikan ide, masukan, atau pertanyaan kepada pengurus HIMATIKA.
        </p>
      </div>

      <form className="aspiration-form" onSubmit={handleSubmit}>
        <label>
          Nama <span>(opsional)</span>
          <input autoComplete="name" maxLength={100} name="nama" />
        </label>
        <label>
          Kontak <span>(opsional)</span>
          <input maxLength={100} name="kontak" type="text" />
        </label>
        <label>
          Kategori
          <input
            maxLength={50}
            name="kategori"
            placeholder="Contoh: akademik, kegiatan"
            required
          />
        </label>
        <label>
          Pesan
          <textarea minLength={5} name="pesan" required rows={4} />
        </label>
        <button
          className="button button-light"
          disabled={formStatus.pending}
          type="submit"
        >
          {formStatus.pending ? "Mengirim…" : "Kirim aspirasi"}
          <span aria-hidden="true">↗</span>
        </button>
        {formStatus.message && (
          <p className="form-feedback" role="status">
            {formStatus.message}
          </p>
        )}
        {formStatus.error && (
          <p className="form-feedback form-error" role="alert">
            {formStatus.error}
          </p>
        )}
        <p className="form-note">
          Nama dan kontak tidak wajib diisi. Kiriman diproses sesuai kebijakan
          layanan HIMATIKA.
        </p>
      </form>
    </section>
  );
}
