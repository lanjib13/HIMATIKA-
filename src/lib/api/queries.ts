import { api } from "./client";
import type { components } from "./schema";

type Profil = components["schemas"]["Profil"];
type Divisi = components["schemas"]["Divisi"];
type Anggota = components["schemas"]["Anggota"];
type Berita = components["schemas"]["Berita"];
type Proker = components["schemas"]["Proker"];
type Galeri = components["schemas"]["Galeri"];
type Prestasi = components["schemas"]["Prestasi"];
type AspirasiInput = components["schemas"]["AspirasiInput"];

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

function statusMessage(status: number) {
  if (status === 404) return "Data yang diminta tidak ditemukan.";
  if (status === 422) return "Data yang dikirim belum valid.";
  if (status === 429) return "Terlalu banyak permintaan. Silakan coba lagi nanti.";
  if (status >= 500) return "Layanan HIMATIKA sedang mengalami gangguan.";
  return "Permintaan ke layanan HIMATIKA gagal.";
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

  return statusMessage(status);
}

function requireData<T>(
  envelope: ApiEnvelope<T> | undefined,
  status: number,
): T {
  if (envelope?.success !== true) {
    throw new ApiRequestError(
      envelope?.message ?? statusMessage(status),
      status,
    );
  }

  if (envelope.data === undefined) {
    throw new ApiRequestError(
      "Respons API tidak menyertakan data yang diperlukan.",
      status,
    );
  }

  return envelope.data;
}

function requireList<T>(
  list: T[] | undefined,
  status: number,
): T[] {
  if (!Array.isArray(list)) {
    throw new ApiRequestError(
      "Format daftar dari API tidak sesuai spesifikasi.",
      status,
    );
  }
  return list;
}

export async function getProfil() {
  const { data, error, response } = await api.GET("/profil");
  if (!response.ok) {
    throw new ApiRequestError(
      getErrorMessage(error, response.status),
      response.status,
    );
  }
  return requireData<Profil>(data, response.status);
}

export async function getDivisi(limit = 4) {
  const { data, error, response } = await api.GET("/divisi", {
    params: { query: { page: 1, limit } },
  });
  if (!response.ok) {
    throw new ApiRequestError(
      getErrorMessage(error, response.status),
      response.status,
    );
  }
  return requireList<Divisi>(
    requireData<Divisi[]>(data, response.status),
    response.status,
  );
}

export async function getProker(limit = 3) {
  const { data, error, response } = await api.GET("/proker", {
    params: { query: { page: 1, limit } },
  });
  if (!response.ok) {
    throw new ApiRequestError(
      getErrorMessage(error, response.status),
      response.status,
    );
  }
  return requireList<Proker>(
    requireData<Proker[]>(data, response.status),
    response.status,
  );
}

export async function getAnggota(limit = 6) {
  const { data, error, response } = await api.GET("/anggota", {
    params: { query: { page: 1, limit } },
  });
  if (!response.ok) {
    throw new ApiRequestError(
      getErrorMessage(error, response.status),
      response.status,
    );
  }
  return requireList<Anggota>(
    requireData<Anggota[]>(data, response.status),
    response.status,
  );
}

async function getPublishedContent(
  limit: number,
  kategori: "berita" | "event",
) {
  const { data, error, response } = await api.GET("/berita", {
    params: { query: { page: 1, limit, kategori } },
  });
  if (!response.ok) {
    throw new ApiRequestError(
      getErrorMessage(error, response.status),
      response.status,
    );
  }
  return requireList<Berita>(
    requireData<Berita[]>(data, response.status),
    response.status,
  );
}

export function getBerita(limit = 3) {
  return getPublishedContent(limit, "berita");
}

export function getEvents(limit = 3) {
  return getPublishedContent(limit, "event");
}

export async function getPublicResourceDetail(
    resource: "anggota",
    id: number,
  ): Promise<Anggota>;
export async function getPublicResourceDetail(
    resource: "divisi",
    id: number,
  ): Promise<Divisi>;
export async function getPublicResourceDetail(
    resource: "proker",
    id: number,
  ): Promise<Proker>;
export async function getPublicResourceDetail(
    resource: "berita",
    id: number,
  ): Promise<Berita>;
export async function getPublicResourceDetail(
    resource: "galeri",
    id: number,
  ): Promise<Galeri>;
export async function getPublicResourceDetail(
    resource: "prestasi",
    id: number,
  ): Promise<Prestasi>;
export async function getPublicResourceDetail(
    resource: "anggota" | "divisi" | "proker" | "berita" | "galeri" | "prestasi",
    id: number,
  ) {
    switch (resource) {
      case "anggota": {
        const { data, error, response } = await api.GET("/anggota/{id}", {
          params: { path: { id } },
        });
        if (!response.ok) {
          throw new ApiRequestError(
            getErrorMessage(error, response.status),
            response.status,
          );
        }
        return requireData<Anggota>(data, response.status);
      }
      case "divisi": {
        const { data, error, response } = await api.GET("/divisi/{id}", {
          params: { path: { id } },
        });
        if (!response.ok) {
          throw new ApiRequestError(
            getErrorMessage(error, response.status),
            response.status,
          );
        }
        return requireData<Divisi>(data, response.status);
      }
      case "proker": {
        const { data, error, response } = await api.GET("/proker/{id}", {
          params: { path: { id } },
        });
        if (!response.ok) {
          throw new ApiRequestError(
            getErrorMessage(error, response.status),
            response.status,
          );
        }
        return requireData<Proker>(data, response.status);
      }
      case "berita": {
        const { data, error, response } = await api.GET("/berita/{id}", {
          params: { path: { id } },
        });
        if (!response.ok) {
          throw new ApiRequestError(
            getErrorMessage(error, response.status),
            response.status,
          );
        }
        return requireData<Berita>(data, response.status);
      }
      case "galeri": {
        const { data, error, response } = await api.GET("/galeri/{id}", {
          params: { path: { id } },
        });
        if (!response.ok) {
          throw new ApiRequestError(
            getErrorMessage(error, response.status),
            response.status,
          );
        }
        return requireData<Galeri>(data, response.status);
      }
      case "prestasi": {
        const { data, error, response } = await api.GET("/prestasi/{id}", {
          params: { path: { id } },
        });
        if (!response.ok) {
          throw new ApiRequestError(
            getErrorMessage(error, response.status),
            response.status,
          );
        }
        return requireData<Prestasi>(data, response.status);
      }
    }
  }

export async function getGaleri(limit = 6) {
  const { data, error, response } = await api.GET("/galeri", {
    params: { query: { page: 1, limit } },
  });
  if (!response.ok) {
    throw new ApiRequestError(
      getErrorMessage(error, response.status),
      response.status,
    );
  }
  return requireList<Galeri>(
    requireData<Galeri[]>(data, response.status),
    response.status,
  );
}

export async function getPrestasi(limit = 3) {
  const { data, error, response } = await api.GET("/prestasi", {
    params: { query: { page: 1, limit } },
  });
  if (!response.ok) {
    throw new ApiRequestError(
      getErrorMessage(error, response.status),
      response.status,
    );
  }
  return requireList<Prestasi>(
    requireData<Prestasi[]>(data, response.status),
    response.status,
  );
}

export async function sendAspirasi(input: AspirasiInput) {
  const { data, error, response } = await api.POST("/aspirasi", {
    body: input,
  });
  if (!response.ok) {
    throw new ApiRequestError(
      getErrorMessage(error, response.status),
      response.status,
    );
  }
  return {
    ...requireData<{ id_aspirasi?: number; status?: string }>(
      data,
      response.status,
    ),
    message: data?.message,
  };
}

export type {
  AspirasiInput,
  Anggota,
  Berita,
  Divisi,
  Galeri,
  Prestasi,
  Profil,
  Proker,
};
