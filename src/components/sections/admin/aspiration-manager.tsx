"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AdminApiError,
  getAdminAspirations,
  removeAspiration,
  updateAspirationStatus,
} from "@/lib/api/admin";
import type { components } from "@/lib/api/schema";

type Aspiration = components["schemas"]["Aspirasi"];
type AspirationStatus = NonNullable<Aspiration["status"]>;

const statuses: AspirationStatus[] = ["Baru", "Dibaca", "Diproses", "Selesai"];

function findAspirationStatus(value: string) {
  return statuses.find((status) => status === value);
}

function getErrorMessage(error: unknown) {
  if (error instanceof AdminApiError) return error.message;
  return error instanceof Error ? error.message : "Permintaan gagal.";
}

export default function AspirationManager() {
  const [items, setItems] = useState<Aspiration[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const loadItems = useCallback(async (status: string) => {
    try {
      const selectedStatus = status ? findAspirationStatus(status) : undefined;
      if (status && !selectedStatus) {
        throw new Error("Filter status aspirasi tidak valid.");
      }
      setItems(
        await getAdminAspirations(selectedStatus),
      );
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void getAdminAspirations()
      .then((aspirations) => {
        if (active) setItems(aspirations);
      })
      .catch((loadError: unknown) => {
        if (active) setError(getErrorMessage(loadError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function changeStatus(id: number, status: AspirationStatus) {
    setUpdatingId(id);
    setError(null);
    setNotice(null);
    try {
      await updateAspirationStatus(id, status);
      setNotice("Status aspirasi berhasil diperbarui.");
      await loadItems(statusFilter);
    } catch (updateError) {
      setError(getErrorMessage(updateError));
    } finally {
      setUpdatingId(null);
    }
  }

  function handleStatusChange(id: number | undefined, value: string) {
    const status = findAspirationStatus(value);
    if (id === undefined || !status) return;
    void changeStatus(id, status);
  }

  async function deleteItem(item: Aspiration) {
    if (item.id_aspirasi === undefined) {
      setError("ID aspirasi tidak tersedia.");
      return;
    }
    if (!window.confirm("Hapus aspirasi ini? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }
    setError(null);
    setNotice(null);
    try {
      await removeAspiration(item.id_aspirasi);
      setNotice("Aspirasi berhasil dihapus.");
      await loadItems(statusFilter);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  }

  return (
    <section>
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">PESAN PENGUNJUNG</span>
          <h1>Aspirasi</h1>
          <p>Baca, tindak lanjuti, dan perbarui status pesan yang masuk.</p>
        </div>
        <label className="admin-filter">
          Filter status
          <select
            onChange={(event) => {
              const status = event.target.value;
              setStatusFilter(status);
              setError(null);
              setLoading(true);
              void loadItems(status);
            }}
            value={statusFilter}
          >
            <option value="">Semua status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
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

      {loading ? (
        <div className="admin-loading">Memuat aspirasi dari API…</div>
      ) : items.length === 0 ? (
        <div className="admin-empty-state">
          <span>INBOX KOSONG</span>
          <h2>Belum ada aspirasi.</h2>
          <p>Pesan baru dari pengunjung akan muncul di halaman ini.</p>
        </div>
      ) : (
        <div className="aspiration-admin-list">
          {items.map((item) => (
            <article className="aspiration-admin-card" key={item.id_aspirasi}>
              <div className="aspiration-admin-topline">
                <span className="content-tag">{item.kategori ?? "Umum"}</span>
                <time dateTime={item.created_at}>
                  {item.created_at
                    ? new Intl.DateTimeFormat("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(item.created_at))
                    : "Tanggal tidak tersedia"}
                </time>
              </div>
              <p className="aspiration-admin-message">
                {item.pesan ?? "Pesan kosong."}
              </p>
              <div className="aspiration-admin-footer">
                <div>
                  <strong>{item.nama || "Tanpa nama"}</strong>
                  <span>{item.kontak || "Kontak tidak dicantumkan"}</span>
                </div>
                <div className="aspiration-admin-actions">
                  <label>
                    <span className="sr-only">Status aspirasi</span>
                    <select
                      disabled={updatingId === item.id_aspirasi}
                      onChange={(event) =>
                        handleStatusChange(
                          item.id_aspirasi,
                          event.target.value,
                        )
                      }
                      value={item.status ?? "Baru"}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="admin-text-button is-danger"
                    onClick={() => void deleteItem(item)}
                    type="button"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
