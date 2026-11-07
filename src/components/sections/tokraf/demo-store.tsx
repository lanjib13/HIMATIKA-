"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { components } from "@/lib/api/schema";

type TokrafProduct = components["schemas"]["TokrafProduct"];
type TokrafCategory = components["schemas"]["TokrafCategory"];
type TokrafStoreProfile = components["schemas"]["TokrafStoreProfile"];

export type TokrafDemoState = {
  products: TokrafProduct[];
  categories: TokrafCategory[];
  profile: TokrafStoreProfile;
};

type TokrafDemoContextValue = {
  data: TokrafDemoState | null;
  ready: boolean;
  error: string | null;
  update: (updater: (current: TokrafDemoState) => TokrafDemoState) => void;
};

const STORAGE_KEY = "himatika-tokraf-demo-v1";
const createdAt = "2026-01-01T00:00:00.000Z";

const initialData: TokrafDemoState = {
  categories: [
    { id_kategori: 1, nama: "Pakaian", slug: "pakaian", urutan: 1 },
    { id_kategori: 2, nama: "Aksesori", slug: "aksesori", urutan: 2 },
  ],
  profile: {
    nama_toko: "TOKRAF HIMATIKA",
    deskripsi:
      "Ruang karya kreatif HIMATIKA. Pilih produk, sesuaikan opsi, lalu minta konfirmasi melalui WhatsApp.",
    whatsapp_number: "",
    kontak: "Nomor WhatsApp belum diatur pada demo ini.",
    updated_at: createdAt,
  },
  products: [
    {
      id_produk: 1,
      nama: "Kaos Ekraf HIMATIKA",
      slug: "kaos-ekraf-himatika",
      deskripsi:
        "Kaos merchandise HIMATIKA. Harga pada katalog ini hanya contoh untuk demo kalkulator.",
      foto: null,
      id_kategori: 1,
      kategori: { id_kategori: 1, nama: "Pakaian", slug: "pakaian", urutan: 1 },
      price_tiers: [
        { min_quantity: 1, max_quantity: 4, unit_price: 95000 },
        { min_quantity: 5, max_quantity: 9, unit_price: 85000 },
        { min_quantity: 10, max_quantity: null, unit_price: 75000 },
      ],
      variants: [
        {
          name: "Ukuran",
          required: true,
          options: [
            { value: "S", label: "S", price_adjustment: 0 },
            { value: "M", label: "M", price_adjustment: 0 },
            { value: "L", label: "L", price_adjustment: 0 },
            { value: "XL", label: "XL", price_adjustment: 10000 },
          ],
        },
        {
          name: "Sablon",
          required: true,
          options: [
            { value: "depan", label: "Satu sisi", price_adjustment: 0 },
            {
              value: "depan-belakang",
              label: "Depan-belakang",
              price_adjustment: 15000,
            },
          ],
        },
      ],
      status: "terbit",
      created_at: createdAt,
      updated_at: createdAt,
    },
    {
      id_produk: 2,
      nama: "Totebag Kanvas",
      slug: "totebag-kanvas",
      deskripsi:
        "Totebag serbaguna dengan desain karya Ekraf. Harga contoh demo.",
      foto: null,
      id_kategori: 2,
      kategori: { id_kategori: 2, nama: "Aksesori", slug: "aksesori", urutan: 2 },
      price_tiers: [
        { min_quantity: 1, max_quantity: 4, unit_price: 45000 },
        { min_quantity: 5, max_quantity: 9, unit_price: 40000 },
        { min_quantity: 10, max_quantity: null, unit_price: 35000 },
      ],
      variants: [
        {
          name: "Warna",
          required: true,
          options: [
            { value: "natural", label: "Natural", price_adjustment: 0 },
            { value: "hitam", label: "Hitam", price_adjustment: 0 },
          ],
        },
      ],
      status: "terbit",
      created_at: createdAt,
      updated_at: createdAt,
    },
    {
      id_produk: 3,
      nama: "Paket Stiker",
      slug: "paket-stiker",
      deskripsi: "Paket stiker bertema Informatika. Harga contoh demo.",
      foto: null,
      id_kategori: 2,
      kategori: { id_kategori: 2, nama: "Aksesori", slug: "aksesori", urutan: 2 },
      price_tiers: [
        { min_quantity: 1, max_quantity: 9, unit_price: 15000 },
        { min_quantity: 10, max_quantity: 29, unit_price: 12000 },
        { min_quantity: 30, max_quantity: null, unit_price: 10000 },
      ],
      variants: [
        {
          name: "Isi paket",
          required: true,
          options: [
            { value: "5", label: "5 stiker", price_adjustment: 0 },
            { value: "10", label: "10 stiker", price_adjustment: 10000 },
          ],
        },
      ],
      status: "terbit",
      created_at: createdAt,
      updated_at: createdAt,
    },
  ],
};

type TokrafDemoSnapshot = {
  data: TokrafDemoState | null;
  ready: boolean;
  error: string | null;
};

const serverSnapshot: TokrafDemoSnapshot = {
  data: null,
  ready: false,
  error: null,
};
let clientSnapshot = serverSnapshot;
let initialized = false;
const listeners = new Set<() => void>();

const TokrafDemoContext = createContext<TokrafDemoContextValue | null>(null);

function isDemoState(value: unknown): value is TokrafDemoState {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    Array.isArray(record.products) &&
    record.products.every(
      (item) =>
        isRecord(item) &&
        typeof item.id_produk === "number" &&
        typeof item.nama === "string" &&
        typeof item.slug === "string" &&
        typeof item.id_kategori === "number" &&
        Array.isArray(item.price_tiers) &&
        Array.isArray(item.variants),
    ) &&
    Array.isArray(record.categories) &&
    record.categories.every(
      (item) =>
        isRecord(item) &&
        typeof item.id_kategori === "number" &&
        typeof item.nama === "string" &&
        typeof item.slug === "string",
    ) &&
    isRecord(record.profile) &&
    typeof record.profile.nama_toko === "string" &&
    typeof record.profile.deskripsi === "string"
  );
}

function notify() {
  listeners.forEach((listener) => listener());
}

function readSnapshot(): TokrafDemoSnapshot {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === null) return { data: initialData, ready: true, error: null };
    const parsed: unknown = JSON.parse(saved);
    if (!isDemoState(parsed)) {
      throw new Error("Data TOKRAF demo di browser tidak valid.");
    }
    return { data: parsed, ready: true, error: null };
  } catch (loadError) {
    return {
      data: null,
      ready: true,
      error:
        loadError instanceof Error
          ? loadError.message
          : "Data TOKRAF demo tidak dapat dibaca.",
    };
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!initialized) {
    initialized = true;
    clientSnapshot = readSnapshot();
    listener();
  }

  function handleStorage(event: StorageEvent) {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    try {
      clientSnapshot = readSnapshot();
      notify();
    } catch (loadError) {
      clientSnapshot = {
        data: null,
        ready: true,
        error:
          loadError instanceof Error
            ? loadError.message
            : "Data TOKRAF demo tidak dapat dibaca.",
      };
      notify();
    }
  }

  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function getSnapshot() {
  return clientSnapshot;
}

function getServerSnapshot() {
  return serverSnapshot;
}

function updateDemoState(
  updater: (current: TokrafDemoState) => TokrafDemoState,
) {
  if (!clientSnapshot.data) throw new Error("Data demo TOKRAF belum siap.");
  const next = updater(clientSnapshot.data);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    clientSnapshot = { data: next, ready: true, error: null };
  } catch (saveError) {
    const message =
      saveError instanceof Error
        ? saveError.message
        : "Data TOKRAF demo gagal disimpan di browser.";
    clientSnapshot = { ...clientSnapshot, error: message };
    notify();
    throw new Error(message);
  }
  notify();
}

export function TokrafDemoStore({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const update = useCallback(
    (updater: (current: TokrafDemoState) => TokrafDemoState) =>
      updateDemoState(updater),
    [],
  );
  const value = useMemo(
    () => ({ ...snapshot, update }),
    [snapshot, update],
  );

  return (
    <TokrafDemoContext.Provider value={value}>
      {children}
    </TokrafDemoContext.Provider>
  );
}

export function useTokrafDemoStore() {
  const value = useContext(TokrafDemoContext);
  if (!value) {
    throw new Error("TokrafDemoStore harus membungkus halaman TOKRAF.");
  }
  return value;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function getUnitPrice(
  product: TokrafProduct,
  quantity: number,
  optionValues: Record<string, string>,
) {
  const tier = [...product.price_tiers]
    .sort((left, right) => right.min_quantity - left.min_quantity)
    .find(
      (candidate) =>
        quantity >= candidate.min_quantity &&
        (candidate.max_quantity === null ||
          candidate.max_quantity === undefined ||
          quantity <= candidate.max_quantity),
    );

  if (!tier) return null;

  const adjustments = product.variants.reduce((total, variant) => {
    const option = variant.options.find(
      (candidate) => candidate.value === optionValues[variant.name],
    );
    return total + (option?.price_adjustment ?? 0);
  }, 0);

  return tier.unit_price + adjustments;
}
