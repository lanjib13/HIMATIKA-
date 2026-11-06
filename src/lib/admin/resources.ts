import type { components } from "@/lib/api/schema";
import type { AdminRow } from "@/lib/api/admin";
import type {
  CreateResourceInput,
  UpdateResourceInput,
} from "@/lib/api/admin";

export type AdminResourceKey =
  | "anggota"
  | "divisi"
  | "proker"
  | "berita"
  | "event"
  | "galeri"
  | "prestasi"
  | "struktur-organisasi";

export type AdminField = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select";
  required?: boolean;
  maxLength?: number;
  options?: { label: string; value: string }[];
};

export type AdminResourceDefinition = {
  key: AdminResourceKey;
  title: string;
  description: string;
  path: AdminResourceKeyPath;
  apiCategory?: "berita" | "event";
  idField: string;
  columns: { key: string; label: string }[];
  fields: AdminField[];
  toCreate: (values: Record<string, string>) => CreateResourceInput;
  toUpdate: (id: number, values: Record<string, string>) => UpdateResourceInput;
};

type AdminResourceConfig = Omit<
  AdminResourceDefinition,
  "toCreate" | "toUpdate"
>;

type AdminResourceKeyPath =
  | "/anggota"
  | "/divisi"
  | "/proker"
  | "/berita"
  | "/galeri"
  | "/prestasi"
  | "/struktur-organisasi";

const optionalText = (value: string) => value.trim() || null;
const optionalNumber = (value: string) => (value ? Number(value) : null);
const optionalDate = (value: string) => value || null;

function prokerStatus(value: string): components["schemas"]["ProkerInput"]["status"] {
  if (value === "berjalan" || value === "selesai") return value;
  return "rencana";
}

function beritaStatus(value: string): components["schemas"]["BeritaInput"]["status"] {
  return value === "terbit" ? "terbit" : "draf";
}

function mutationInput(
  key: AdminResourceKey,
  values: Record<string, string>,
): CreateResourceInput {
  switch (key) {
    case "anggota":
      return {
        resource: "/anggota",
        body: {
          nama: values.nama.trim(),
          id_divisi: optionalNumber(values.id_divisi),
          nim: optionalText(values.nim),
          foto: optionalText(values.foto),
        },
      };
    case "divisi":
      return {
        resource: "/divisi",
        body: {
          nama_divisi: values.nama_divisi.trim(),
          slug: values.slug.trim(),
          deskripsi: optionalText(values.deskripsi),
        },
      };
    case "proker":
      return {
        resource: "/proker",
        body: {
          id_divisi: Number(values.id_divisi),
          nama_proker: values.nama_proker.trim(),
          deskripsi: optionalText(values.deskripsi),
          tanggal_mulai: optionalDate(values.tanggal_mulai),
          tanggal_selesai: optionalDate(values.tanggal_selesai),
          status: prokerStatus(values.status),
        },
      };
    case "berita":
    case "event":
      return {
        resource: "/berita",
        body: {
          judul: values.judul.trim(),
          slug: values.slug.trim(),
          kategori: key === "event" ? "event" : "berita",
          isi: values.isi.trim(),
          gambar_sampul: optionalText(values.gambar_sampul),
          tanggal: optionalDate(values.tanggal),
          status: beritaStatus(values.status),
        },
      };
    case "galeri":
      return {
        resource: "/galeri",
        body: {
          judul: values.judul.trim(),
          deskripsi: optionalText(values.deskripsi),
          gambar: values.gambar.trim(),
          tanggal_kegiatan: optionalDate(values.tanggal_kegiatan),
        },
      };
    case "prestasi":
      return {
        resource: "/prestasi",
        body: {
          nama_prestasi: values.nama_prestasi.trim(),
          tingkat: optionalText(values.tingkat),
          penyelenggara: optionalText(values.penyelenggara),
          tanggal: optionalDate(values.tanggal),
          deskripsi: optionalText(values.deskripsi),
          foto: optionalText(values.foto),
        },
      };
    case "struktur-organisasi":
      return {
        resource: "/struktur-organisasi",
        body: {
          id_anggota: Number(values.id_anggota),
          jabatan: values.jabatan.trim(),
          urutan: values.urutan ? Number(values.urutan) : 0,
          periode: values.periode.trim(),
        },
      };
  }
}

function getId(row: AdminRow, field: string) {
  const value = Object.entries(row).find(([key]) => key === field)?.[1];
  return typeof value === "number" ? value : undefined;
}

const definitions: Record<AdminResourceKey, AdminResourceConfig> = {
  anggota: {
    key: "anggota",
    title: "Anggota",
    description: "Kelola direktori anggota dan data divisi.",
    path: "/anggota",
    idField: "id_anggota",
    columns: [
      { key: "nama", label: "Nama" },
      { key: "nim", label: "NIM" },
      { key: "id_divisi", label: "ID Divisi" },
    ],
    fields: [
      { name: "nama", label: "Nama", required: true, maxLength: 100 },
      { name: "nim", label: "NIM", maxLength: 30 },
      { name: "id_divisi", label: "ID Divisi", type: "number" },
      { name: "foto", label: "URL Foto" },
    ],
  },
  divisi: {
    key: "divisi",
    title: "Divisi",
    description: "Kelola daftar divisi dan slug halaman publik.",
    path: "/divisi",
    idField: "id_divisi",
    columns: [
      { key: "nama_divisi", label: "Nama divisi" },
      { key: "slug", label: "Slug" },
      { key: "deskripsi", label: "Deskripsi" },
    ],
    fields: [
      { name: "nama_divisi", label: "Nama divisi", required: true, maxLength: 100 },
      { name: "slug", label: "Slug", required: true, maxLength: 120 },
      { name: "deskripsi", label: "Deskripsi", type: "textarea" },
    ],
  },
  proker: {
    key: "proker",
    title: "Program kerja",
    description: "Kelola program kerja untuk setiap divisi.",
    path: "/proker",
    idField: "id_proker",
    columns: [
      { key: "nama_proker", label: "Program" },
      { key: "id_divisi", label: "ID Divisi" },
      { key: "status", label: "Status" },
      { key: "tanggal_mulai", label: "Mulai" },
    ],
    fields: [
      { name: "nama_proker", label: "Nama program", required: true, maxLength: 150 },
      { name: "id_divisi", label: "ID Divisi", type: "number", required: true },
      { name: "deskripsi", label: "Deskripsi", type: "textarea" },
      { name: "tanggal_mulai", label: "Tanggal mulai", type: "date" },
      { name: "tanggal_selesai", label: "Tanggal selesai", type: "date" },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: [
          { label: "Rencana", value: "rencana" },
          { label: "Berjalan", value: "berjalan" },
          { label: "Selesai", value: "selesai" },
        ],
      },
    ],
  },
  berita: {
    key: "berita",
    title: "Berita",
    description: "Kelola artikel dan informasi HIMATIKA.",
    path: "/berita",
    apiCategory: "berita",
    idField: "id_berita",
    columns: [
      { key: "judul", label: "Judul" },
      { key: "tanggal", label: "Tanggal" },
      { key: "status", label: "Status" },
    ],
    fields: [
      { name: "judul", label: "Judul", required: true, maxLength: 200 },
      { name: "slug", label: "Slug", required: true, maxLength: 220 },
      { name: "isi", label: "Isi", type: "textarea", required: true },
      { name: "gambar_sampul", label: "URL gambar sampul" },
      { name: "tanggal", label: "Tanggal", type: "date" },
      {
        name: "status",
        label: "Status publikasi",
        type: "select",
        options: [
          { label: "Draf", value: "draf" },
          { label: "Terbit", value: "terbit" },
        ],
      },
    ],
  },
  event: {
    key: "event",
    title: "Event",
    description: "Kelola agenda dan informasi event HIMATIKA.",
    path: "/berita",
    apiCategory: "event",
    idField: "id_berita",
    columns: [
      { key: "judul", label: "Nama event" },
      { key: "tanggal", label: "Tanggal" },
      { key: "status", label: "Status" },
    ],
    fields: [
      { name: "judul", label: "Nama event", required: true, maxLength: 200 },
      { name: "slug", label: "Slug", required: true, maxLength: 220 },
      { name: "isi", label: "Deskripsi", type: "textarea", required: true },
      { name: "gambar_sampul", label: "URL gambar sampul" },
      { name: "tanggal", label: "Tanggal", type: "date" },
      {
        name: "status",
        label: "Status publikasi",
        type: "select",
        options: [
          { label: "Draf", value: "draf" },
          { label: "Terbit", value: "terbit" },
        ],
      },
    ],
  },
  galeri: {
    key: "galeri",
    title: "Galeri",
    description: "Kelola foto galeri menggunakan URL gambar sesuai API.",
    path: "/galeri",
    idField: "id_galeri",
    columns: [
      { key: "judul", label: "Judul" },
      { key: "gambar", label: "URL gambar" },
      { key: "tanggal_kegiatan", label: "Tanggal kegiatan" },
    ],
    fields: [
      { name: "judul", label: "Judul", required: true, maxLength: 150 },
      { name: "gambar", label: "URL gambar", required: true },
      { name: "deskripsi", label: "Deskripsi", type: "textarea" },
      { name: "tanggal_kegiatan", label: "Tanggal kegiatan", type: "date" },
    ],
  },
  prestasi: {
    key: "prestasi",
    title: "Prestasi",
    description: "Kelola pencapaian dan prestasi HIMATIKA.",
    path: "/prestasi",
    idField: "id_prestasi",
    columns: [
      { key: "nama_prestasi", label: "Prestasi" },
      { key: "tingkat", label: "Tingkat" },
      { key: "penyelenggara", label: "Penyelenggara" },
      { key: "tanggal", label: "Tanggal" },
    ],
    fields: [
      { name: "nama_prestasi", label: "Nama prestasi", required: true, maxLength: 200 },
      { name: "tingkat", label: "Tingkat", maxLength: 50 },
      { name: "penyelenggara", label: "Penyelenggara", maxLength: 150 },
      { name: "tanggal", label: "Tanggal", type: "date" },
      { name: "deskripsi", label: "Deskripsi", type: "textarea" },
      { name: "foto", label: "URL foto" },
    ],
  },
  "struktur-organisasi": {
    key: "struktur-organisasi",
    title: "Struktur organisasi",
    description: "Atur jabatan dan periode kepengurusan anggota.",
    path: "/struktur-organisasi",
    idField: "id_struktur",
    columns: [
      { key: "id_anggota", label: "ID Anggota" },
      { key: "jabatan", label: "Jabatan" },
      { key: "urutan", label: "Urutan" },
      { key: "periode", label: "Periode" },
    ],
    fields: [
      { name: "id_anggota", label: "ID Anggota", type: "number", required: true },
      { name: "jabatan", label: "Jabatan", required: true, maxLength: 100 },
      { name: "urutan", label: "Urutan", type: "number" },
      { name: "periode", label: "Periode", required: true, maxLength: 20 },
    ],
  },
};

export function getAdminResourceDefinition(key: AdminResourceKey) {
  const definition = definitions[key];
  return {
    ...definition,
    toCreate: (values: Record<string, string>) => mutationInput(key, values),
    toUpdate: (id: number, values: Record<string, string>) => ({
      ...mutationInput(key, values),
      id,
    }),
  };
}

export function readAdminRowField(row: AdminRow, field: string) {
  const value = Object.entries(row).find(([key]) => key === field)?.[1];
  if (value === undefined || value === null || value === "") return "—";
  return String(value);
}

export function readAdminRowId(row: AdminRow, key: AdminResourceKey) {
  return getId(row, definitions[key].idField);
}

export function adminRowToForm(row: AdminRow, fields: AdminField[]) {
  return Object.fromEntries(
    fields.map((field) => {
      const value = Object.entries(row).find(([key]) => key === field.name)?.[1];
      return [field.name, value === null || value === undefined ? "" : String(value)];
    }),
  );
}

export type { AdminRow };
