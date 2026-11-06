import {
  getAnggota,
  getBerita,
  getDivisi,
  getEvents,
  getGaleri,
  getPrestasi,
  getProker,
  getPublicResourceDetail,
  type Anggota,
  type Berita,
  type Divisi,
  type Galeri,
  type Prestasi,
  type Proker,
} from "./queries";

export type PublicCollectionKind =
  | "anggota"
  | "divisi"
  | "proker"
  | "berita"
  | "event"
  | "galeri"
  | "prestasi";

export type PublicCollectionItem = {
  id: number;
  title: string;
  href: string;
  category?: string | null;
  date?: string | null;
  image?: string | null;
  description?: string | null;
  meta?: string | null;
};

export type PublicDetail = {
  title: string;
  category: string;
  description?: string | null;
  image?: string | null;
  date?: string | null;
  facts: { label: string; value: string }[];
};

function memberItem(member: Anggota): PublicCollectionItem {
  return {
    id: member.id_anggota ?? 0,
    title: member.nama ?? "Anggota HIMATIKA",
    href: `/anggota/${member.id_anggota}`,
    image: member.foto,
  };
}

function divisionItem(division: Divisi): PublicCollectionItem {
  return {
    id: division.id_divisi ?? 0,
    title: division.nama_divisi ?? "Divisi HIMATIKA",
    href: `/divisi/${division.id_divisi}`,
    description: division.deskripsi,
  };
}

function programItem(program: Proker): PublicCollectionItem {
  return {
    id: program.id_proker ?? 0,
    title: program.nama_proker ?? "Program kerja HIMATIKA",
    href: `/proker/${program.id_proker}`,
    category: program.status,
    description: program.deskripsi,
  };
}

function newsItem(news: Berita): PublicCollectionItem {
  const route = news.kategori === "event" ? "event" : "berita";
  return {
    id: news.id_berita ?? 0,
    title: news.judul ?? "Informasi HIMATIKA",
    href: `/${route}/${news.id_berita}`,
    category: news.kategori,
    date: news.tanggal,
    image: news.gambar_sampul,
    description: news.isi,
  };
}

function galleryItem(photo: Galeri): PublicCollectionItem {
  return {
    id: photo.id_galeri ?? 0,
    title: photo.judul ?? "Foto kegiatan HIMATIKA",
    href: `/galeri/${photo.id_galeri}`,
    image: photo.gambar,
    date: photo.tanggal_kegiatan,
    description: photo.deskripsi,
  };
}

function achievementItem(achievement: Prestasi): PublicCollectionItem {
  return {
    id: achievement.id_prestasi ?? 0,
    title: achievement.nama_prestasi ?? "Prestasi HIMATIKA",
    href: `/prestasi/${achievement.id_prestasi}`,
    date: achievement.tanggal,
    image: achievement.foto,
    description: achievement.deskripsi,
    meta: [achievement.tingkat, achievement.penyelenggara]
      .filter(Boolean)
      .join(" · "),
  };
}

export async function getPublicCollection(
  kind: PublicCollectionKind,
): Promise<PublicCollectionItem[]> {
  switch (kind) {
    case "anggota":
      return (await getAnggota(100)).map(memberItem);
    case "divisi":
      return (await getDivisi(100)).map(divisionItem);
    case "proker":
      return (await getProker(100)).map(programItem);
    case "berita":
      return (await getBerita(100)).map(newsItem);
    case "event":
      return (await getEvents(100)).map(newsItem);
    case "galeri":
      return (await getGaleri(100)).map(galleryItem);
    case "prestasi":
      return (await getPrestasi(100)).map(achievementItem);
  }
}

export async function getPublicDetail(
  kind: PublicCollectionKind,
  id: number,
): Promise<PublicDetail> {
  switch (kind) {
    case "anggota": {
      const item = await getPublicResourceDetail("anggota", id);
      return {
        title: item.nama ?? "Anggota HIMATIKA",
        category: "Anggota HIMATIKA",
        image: item.foto,
        facts: [
          ...(item.id_divisi
            ? [{ label: "ID divisi", value: String(item.id_divisi) }]
            : []),
        ],
      };
    }
    case "divisi": {
      const item = await getPublicResourceDetail("divisi", id);
      return {
        title: item.nama_divisi ?? "Divisi HIMATIKA",
        category: "Divisi",
        description: item.deskripsi,
        facts: item.slug ? [{ label: "Halaman", value: item.slug }] : [],
      };
    }
    case "proker": {
      const item = await getPublicResourceDetail("proker", id);
      return {
        title: item.nama_proker ?? "Program kerja HIMATIKA",
        category: "Program kerja",
        description: item.deskripsi,
        facts: [
          ...(item.status ? [{ label: "Status", value: item.status }] : []),
          ...(item.tanggal_mulai
            ? [{ label: "Mulai", value: item.tanggal_mulai }]
            : []),
          ...(item.tanggal_selesai
            ? [{ label: "Selesai", value: item.tanggal_selesai }]
            : []),
          ...(item.id_divisi !== undefined
            ? [{ label: "ID divisi", value: String(item.id_divisi) }]
            : []),
        ],
      };
    }
    case "berita":
    case "event": {
      const item = await getPublicResourceDetail("berita", id);
      if (item.kategori !== kind) {
        throw new Error(
          `${kind === "event" ? "Event" : "Berita"} tidak ditemukan.`,
        );
      }
      return {
        title: item.judul ?? "Informasi HIMATIKA",
        category: kind === "event" ? "Event" : "Berita",
        description: item.isi,
        image: item.gambar_sampul,
        date: item.tanggal,
        facts: [],
      };
    }
    case "galeri": {
      const item = await getPublicResourceDetail("galeri", id);
      return {
        title: item.judul ?? "Galeri HIMATIKA",
        category: "Galeri",
        description: item.deskripsi,
        image: item.gambar,
        date: item.tanggal_kegiatan,
        facts: [],
      };
    }
    case "prestasi": {
      const item = await getPublicResourceDetail("prestasi", id);
      return {
        title: item.nama_prestasi ?? "Prestasi HIMATIKA",
        category: "Prestasi",
        description: item.deskripsi,
        image: item.foto,
        date: item.tanggal,
        facts: [
          ...(item.tingkat ? [{ label: "Tingkat", value: item.tingkat }] : []),
          ...(item.penyelenggara
            ? [{ label: "Penyelenggara", value: item.penyelenggara }]
            : []),
        ],
      };
    }
  }
}
