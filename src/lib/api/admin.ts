import { api } from "./client";
import type { components } from "./schema";

type AdminEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type AdminRow =
  | components["schemas"]["Anggota"]
  | components["schemas"]["Divisi"]
  | components["schemas"]["Proker"]
  | components["schemas"]["Berita"]
  | components["schemas"]["Galeri"]
  | components["schemas"]["Prestasi"]
  | components["schemas"]["StrukturOrganisasi"]
  | components["schemas"]["Aspirasi"];

type ResourcePath =
  | "/anggota"
  | "/divisi"
  | "/proker"
  | "/berita"
  | "/galeri"
  | "/prestasi"
  | "/struktur-organisasi"
  | "/aspirasi";

type ResourceItemPath =
  | "/anggota/{id}"
  | "/divisi/{id}"
  | "/proker/{id}"
  | "/berita/{id}"
  | "/galeri/{id}"
  | "/prestasi/{id}"
  | "/struktur-organisasi/{id}"
  | "/aspirasi/{id}";

type CreateResourceInput =
  | { resource: "/anggota"; body: components["schemas"]["AnggotaInput"] }
  | { resource: "/divisi"; body: components["schemas"]["DivisiInput"] }
  | { resource: "/proker"; body: components["schemas"]["ProkerInput"] }
  | { resource: "/berita"; body: components["schemas"]["BeritaInput"] }
  | { resource: "/galeri"; body: components["schemas"]["GaleriInput"] }
  | { resource: "/prestasi"; body: components["schemas"]["PrestasiInput"] }
  | {
      resource: "/struktur-organisasi";
      body: components["schemas"]["StrukturInput"];
    };

type UpdateResourceInput = CreateResourceInput & { id: number };

export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}

function getErrorMessage(error: unknown, status: number) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  if (status === 401) return "Sesi admin berakhir. Silakan login kembali.";
  if (status === 404) return "Data tidak ditemukan.";
  if (status === 422) return "Data belum valid. Periksa kembali isian.";
  if (status >= 500) return "Layanan API sedang mengalami gangguan.";
  return "Permintaan tidak berhasil.";
}

function requireEnvelope<T>(
  envelope: AdminEnvelope<T> | undefined,
  status: number,
): T {
  if (envelope?.success !== true) {
    throw new AdminApiError(
      envelope?.message ?? getErrorMessage(undefined, status),
      status,
    );
  }
  if (envelope.data === undefined) {
    throw new AdminApiError("Respons API tidak menyertakan data.", status);
  }
  return envelope.data;
}

export async function getAdminProfile() {
  const { data, error, response } = await api.GET("/profil");
  if (!response.ok) {
    throw new AdminApiError(getErrorMessage(error, response.status), response.status);
  }
  return requireEnvelope(data, response.status);
}

export async function saveAdminProfile(
  body: components["schemas"]["ProfilInput"],
) {
  const { data, error, response } = await api.PUT("/profil", { body });
  if (!response.ok) {
    throw new AdminApiError(getErrorMessage(error, response.status), response.status);
  }
  return requireEnvelope(data, response.status);
}

export async function getDashboardSummary() {
  const { data, error, response } = await api.GET("/dashboard/summary");
  if (!response.ok) {
    throw new AdminApiError(getErrorMessage(error, response.status), response.status);
  }
  return requireEnvelope(data, response.status);
}

export async function getAdminAspirations(status?: components["schemas"]["Aspirasi"]["status"]) {
  const { data, error, response } = await api.GET("/aspirasi", {
    params: { query: { page: 1, limit: 100, status } },
  });
  if (!response.ok) {
    throw new AdminApiError(getErrorMessage(error, response.status), response.status);
  }
  return requireEnvelope<components["schemas"]["Aspirasi"][]>(
    data,
    response.status,
  );
}

export async function updateAspirationStatus(
  id: number,
  status: NonNullable<components["schemas"]["Aspirasi"]["status"]>,
) {
  const { data, error, response } = await api.PATCH("/aspirasi/{id}/status", {
    params: { path: { id } },
    body: { status },
  });
  if (!response.ok) {
    throw new AdminApiError(getErrorMessage(error, response.status), response.status);
  }
  return requireEnvelope(data, response.status);
}

export async function removeAspiration(id: number) {
  const { data, error, response } = await api.DELETE("/aspirasi/{id}", {
    params: { path: { id } },
  });
  if (!response.ok) {
    throw new AdminApiError(getErrorMessage(error, response.status), response.status);
  }
  if (data?.success !== true) {
    throw new AdminApiError(data?.message ?? "Aspirasi gagal dihapus.", response.status);
  }
}

function queryResource(
  resource: ResourcePath,
  query: {
    page: number;
    limit: number;
    search?: string;
    kategori?: "berita" | "event";
  },
) {
  switch (resource) {
    case "/anggota":
      return api.GET(resource, { params: { query } });
    case "/divisi":
      return api.GET(resource, { params: { query } });
    case "/proker":
      return api.GET(resource, { params: { query: { page: query.page, limit: query.limit } } });
    case "/berita":
      return api.GET(resource, { params: { query } });
    case "/galeri":
      return api.GET(resource, { params: { query } });
    case "/prestasi":
      return api.GET(resource, { params: { query } });
    case "/struktur-organisasi":
      return api.GET(resource);
    case "/aspirasi":
      return api.GET(resource, { params: { query: { page: query.page, limit: query.limit } } });
  }
}

export async function listAdminResource(
  resource: ResourcePath,
  search = "",
  kategori?: "berita" | "event",
) {
  const result = await queryResource(resource, {
    page: 1,
    limit: 100,
    ...(search ? { search } : {}),
    ...(resource === "/berita" && kategori ? { kategori } : {}),
  });
  if (!result.response.ok) {
    throw new AdminApiError(
      getErrorMessage(result.error, result.response.status),
      result.response.status,
    );
  }
  return requireEnvelope<AdminRow[]>(result.data, result.response.status);
}

function itemPath(resource: ResourcePath): ResourceItemPath {
  switch (resource) {
    case "/anggota":
      return "/anggota/{id}";
    case "/divisi":
      return "/divisi/{id}";
    case "/proker":
      return "/proker/{id}";
    case "/berita":
      return "/berita/{id}";
    case "/galeri":
      return "/galeri/{id}";
    case "/prestasi":
      return "/prestasi/{id}";
    case "/struktur-organisasi":
      return "/struktur-organisasi/{id}";
    case "/aspirasi":
      return "/aspirasi/{id}";
  }
}

export async function createAdminResource(
  input: CreateResourceInput,
) {
  const result = await createResourceRequest(input);
  if (!result.response.ok) {
    throw new AdminApiError(
      getErrorMessage(result.error, result.response.status),
      result.response.status,
    );
  }
  return requireEnvelope(result.data, result.response.status);
}

function createResourceRequest(
  input: CreateResourceInput,
) {
  switch (input.resource) {
    case "/anggota":
      return api.POST(input.resource, { body: input.body });
    case "/divisi":
      return api.POST(input.resource, { body: input.body });
    case "/proker":
      return api.POST(input.resource, { body: input.body });
    case "/berita":
      return api.POST(input.resource, { body: input.body });
    case "/galeri":
      return api.POST(input.resource, { body: input.body });
    case "/prestasi":
      return api.POST(input.resource, { body: input.body });
    case "/struktur-organisasi":
      return api.POST(input.resource, { body: input.body });
  }
}

export async function updateAdminResource(
  input: UpdateResourceInput,
) {
  const result = await updateResourceRequest(input);
  if (!result.response.ok) {
    throw new AdminApiError(
      getErrorMessage(result.error, result.response.status),
      result.response.status,
    );
  }
  return requireEnvelope(result.data, result.response.status);
}

function updateResourceRequest(
  input: UpdateResourceInput,
) {
  switch (input.resource) {
    case "/anggota":
      return api.PUT("/anggota/{id}", { params: { path: { id: input.id } }, body: input.body });
    case "/divisi":
      return api.PUT("/divisi/{id}", { params: { path: { id: input.id } }, body: input.body });
    case "/proker":
      return api.PUT("/proker/{id}", { params: { path: { id: input.id } }, body: input.body });
    case "/berita":
      return api.PUT("/berita/{id}", { params: { path: { id: input.id } }, body: input.body });
    case "/galeri":
      return api.PUT("/galeri/{id}", { params: { path: { id: input.id } }, body: input.body });
    case "/prestasi":
      return api.PUT("/prestasi/{id}", { params: { path: { id: input.id } }, body: input.body });
    case "/struktur-organisasi":
      return api.PUT("/struktur-organisasi/{id}", { params: { path: { id: input.id } }, body: input.body });
  }
}

export async function deleteAdminResource(
  resource: Exclude<ResourcePath, "/aspirasi">,
  id: number,
) {
  const { data, error, response } = await api.DELETE(itemPath(resource), {
    params: { path: { id } },
  });
  if (!response.ok) {
    throw new AdminApiError(getErrorMessage(error, response.status), response.status);
  }
  if (data?.success !== true) {
    throw new AdminApiError(data?.message ?? "Data gagal dihapus.", response.status);
  }
}

export type {
  AdminRow,
  CreateResourceInput,
  ResourcePath,
  ResourceItemPath,
  UpdateResourceInput,
};
