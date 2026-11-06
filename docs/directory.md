frontend/
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout and metadata
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   ├── robots.ts
│   │   ├── login/page.tsx
│   │   ├── (public)/
│   │   │   ├── layout.tsx                # Public navbar and footer
│   │   │   ├── page.tsx                  # /
│   │   │   ├── profil/page.tsx
│   │   │   ├── anggota/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── divisi/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── proker/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── berita/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── event/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── galeri/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── prestasi/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── aspirasi/page.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx                # Server-side auth guard and sidebar
│   │   │   └── dashboard/
│   │   │       ├── page.tsx
│   │   │       ├── profil/page.tsx
│   │   │       ├── anggota/page.tsx
│   │   │       ├── divisi/page.tsx
│   │   │       ├── proker/page.tsx
│   │   │       ├── berita/page.tsx
│   │   │       ├── event/page.tsx
│   │   │       ├── galeri/page.tsx
│   │   │       ├── prestasi/page.tsx
│   │   │       ├── struktur-organisasi/page.tsx
│   │   │       └── aspirasi/page.tsx
│   │   └── api/
│   │       ├── auth/login/route.ts
│   │       ├── auth/logout/route.ts
│   │       └── v1/[...path]/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── PublicLayout.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── ui/
│   │   │   ├── PageHeader.tsx
│   │   │   └── ResourceStatus.tsx
│   │   └── sections/
│   │       ├── AspirasiForm.tsx
│   │       ├── home/
│   │       ├── public/
│   │       └── admin/
│   ├── hooks/
│   │   └── use-api-resource.ts
│   └── lib/
│       ├── nav.ts
│       ├── admin/resources.ts
│       ├── api/
│       │   ├── admin.ts
│       │   ├── client.ts
│       │   ├── public-content.ts
│       │   ├── queries.ts
│       │   └── schema.d.ts              # Generated from OpenAPI
│       └── auth/session.ts
├── .env.example
├── package.json
├── next.config.ts
└── tsconfig.json

## Conventions and intentional differences

- Route groups `(public)` and `(admin)` organize pages without changing their
  public URLs. Login is outside the admin group so it remains accessible
  without an authenticated session.
- Berita and event have separate public sections, detail pages, admin pages,
  and navigation entries. The current OpenAPI contract still exposes them
  through `/berita`, distinguished by its `kategori` query and body fields.
- Public and admin API operations are split into focused modules under
  `src/lib/api/`; the generated OpenAPI types stay beside the client. This
  avoids combining unrelated endpoints in one large API module.
- Dashboard access is verified in the server layout via `getAuthenticatedAdmin`
  rather than middleware. The guard can call the backend session-verification
  endpoint before rendering protected pages.
- No image-upload helper is included because the current OpenAPI contract
  accepts image URLs and does not provide an upload endpoint.
- Generic empty/loading/error UI is consolidated in `ResourceStatus`; deletion
  confirmation currently uses the browser's native confirmation dialog.
