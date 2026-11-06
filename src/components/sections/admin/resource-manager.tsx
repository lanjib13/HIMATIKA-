"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  createAdminResource,
  deleteAdminResource,
  listAdminResource,
  updateAdminResource,
} from "@/lib/api/admin";
import {
  adminRowToForm,
  getAdminResourceDefinition,
  readAdminRowField,
  readAdminRowId,
  type AdminField,
  type AdminResourceKey,
  type AdminRow,
} from "@/lib/admin/resources";

function ResourceInput({
  field,
  value,
  onChange,
}: {
  field: AdminField;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = `resource-${field.name}`;
  if (field.type === "textarea") {
    return (
      <textarea
        id={id}
        maxLength={field.maxLength}
        onChange={(event) => onChange(event.target.value)}
        required={field.required}
        rows={4}
        value={value}
      />
    );
  }
  if (field.type === "select") {
    return (
      <select
        id={id}
        onChange={(event) => onChange(event.target.value)}
        required={field.required}
        value={value}
      >
        <option value="">Pilih opsi</option>
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
  return (
    <input
      id={id}
      maxLength={field.maxLength}
      min={field.type === "number" ? 0 : undefined}
      onChange={(event) => onChange(event.target.value)}
      required={field.required}
      type={field.type ?? "text"}
      value={value}
    />
  );
}

export default function ResourceManager({
  resourceKey,
}: {
  resourceKey: AdminResourceKey;
}) {
  const definition = getAdminResourceDefinition(resourceKey);
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  const loadRows = useCallback(async (query: string) => {
    try {
      setRows(
        await listAdminResource(
          definition.path,
          query,
          definition.apiCategory,
        ),
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Data tidak dapat dimuat.",
      );
    } finally {
      setLoading(false);
    }
  }, [definition.apiCategory, definition.path]);

  useEffect(() => {
    let active = true;
    void listAdminResource(
      definition.path,
      "",
      definition.apiCategory,
    )
      .then((initialRows) => {
        if (active) setRows(initialRows);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Data tidak dapat dimuat.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [definition.apiCategory, definition.path]);

  function startCreate() {
    setEditingId(null);
    setValues({});
    setNotice(null);
    setEditorOpen(true);
  }

  function startEdit(row: AdminRow) {
    const id = readAdminRowId(row, resourceKey);
    if (id === undefined) {
      setError("ID data tidak ditemukan; data ini tidak dapat diedit.");
      return;
    }
    setEditingId(id);
    setValues(adminRowToForm(row, definition.fields));
    setNotice(null);
    setEditorOpen(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      if (editingId === null) {
        await createAdminResource(definition.toCreate(values));
        setNotice("Data berhasil ditambahkan.");
      } else {
        await updateAdminResource(definition.toUpdate(editingId, values));
        setNotice("Perubahan berhasil disimpan.");
      }
      setEditorOpen(false);
      setLoading(true);
      await loadRows(search);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Data gagal disimpan.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(row: AdminRow) {
    const id = readAdminRowId(row, resourceKey);
    if (id === undefined) {
      setError("ID data tidak ditemukan; data ini tidak dapat dihapus.");
      return;
    }
    const name = definition.columns
      .map((column) => readAdminRowField(row, column.key))
      .find((value) => value !== "—");
    if (!window.confirm(`Hapus ${name ?? "data ini"}? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setError(null);
    setNotice(null);
    try {
      await deleteAdminResource(definition.path, id);
      setNotice("Data berhasil dihapus.");
      setLoading(true);
      await loadRows(search);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Data gagal dihapus.",
      );
    }
  }

  return (
    <section className="resource-manager">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">MANAJEMEN KONTEN</span>
          <h1>{definition.title}</h1>
          <p>{definition.description}</p>
        </div>
        <button className="admin-primary-button" onClick={startCreate} type="button">
          <span aria-hidden="true">＋</span> Tambah data
        </button>
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

      {editorOpen && (
        <form className="admin-form-card" onSubmit={handleSubmit}>
          <div className="admin-form-heading">
            <div>
              <span className="admin-eyebrow">
                {editingId === null ? "DATA BARU" : `ID DATA ${editingId}`}
              </span>
              <h2>{editingId === null ? "Tambah data" : "Edit data"}</h2>
            </div>
            <button
              aria-label="Tutup form"
              className="admin-icon-button"
              onClick={() => setEditorOpen(false)}
              type="button"
            >
              ×
            </button>
          </div>
          <div className="admin-form-grid">
            {definition.fields.map((field) => (
              <label
                className={`admin-field${field.type === "textarea" ? " is-wide" : ""}`}
                htmlFor={`resource-${field.name}`}
                key={field.name}
              >
                {field.label}
                {field.required && <span aria-hidden="true"> *</span>}
                <ResourceInput
                  field={field}
                  onChange={(value) =>
                    setValues((current) => ({ ...current, [field.name]: value }))
                  }
                  value={values[field.name] ?? ""}
                />
              </label>
            ))}
          </div>
          <div className="admin-form-actions">
            <button
              className="admin-secondary-button"
              onClick={() => setEditorOpen(false)}
              type="button"
            >
              Batal
            </button>
            <button className="admin-primary-button" disabled={saving} type="submit">
              {saving ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-card">
        <form
          className="admin-table-toolbar"
          onSubmit={(event) => {
            event.preventDefault();
            setError(null);
            setLoading(true);
            void loadRows(search);
          }}
        >
          <div>
            <h2>Semua data</h2>
            <span>{loading ? "Memuat…" : `${rows.length} item ditampilkan`}</span>
          </div>
          <div className="admin-search">
            <input
              aria-label={`Cari ${definition.title.toLowerCase()}`}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari data"
              value={search}
            />
            <button className="admin-secondary-button" type="submit">
              Cari
            </button>
          </div>
        </form>

        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                {definition.columns.map((column) => (
                  <th key={column.key} scope="col">
                    {column.label}
                  </th>
                ))}
                <th scope="col">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {!loading && rows.length === 0 && (
                <tr>
                  <td className="admin-empty-cell" colSpan={definition.columns.length + 1}>
                    Belum ada data untuk ditampilkan.
                  </td>
                </tr>
              )}
              {rows.map((row, index) => (
                <tr key={readAdminRowId(row, resourceKey) ?? index}>
                  {definition.columns.map((column) => (
                    <td key={column.key}>
                      {readAdminRowField(row, column.key)}
                    </td>
                  ))}
                  <td>
                    <div className="admin-row-actions">
                      <button
                        className="admin-text-button"
                        onClick={() => startEdit(row)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="admin-text-button is-danger"
                        onClick={() => void handleDelete(row)}
                        type="button"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {loading && (
                <tr>
                  <td className="admin-empty-cell" colSpan={definition.columns.length + 1}>
                    Memuat data dari API…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {resourceKey === "galeri" && (
          <p className="admin-footnote">
            Kontrak API menerima URL gambar. Upload file langsung belum didukung
            oleh spesifikasi backend.
          </p>
        )}
      </div>
    </section>
  );
}
