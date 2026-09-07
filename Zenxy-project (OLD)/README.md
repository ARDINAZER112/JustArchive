# ardinazer — portfolio

Portfolio satu halaman untuk web & game developer, bertema tampilan code editor
(sidebar file explorer, tab bar, status bar ala VSCode) dengan React + TypeScript
+ Vite + Tailwind CSS + shadcn/ui.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:5173

## Build untuk production

```bash
npm run build
```

Hasil build ada di folder `dist/` — upload ke Vercel, Netlify, GitHub Pages,
atau hosting statis apa saja.

## Mengedit konten

Semua teks (nama, bio, skill, daftar project, link kontak) ada di satu file:

```
src/data.ts
```

Ganti nilai di situ saja — tidak perlu menyentuh file komponen lain.
Beberapa yang masih placeholder dan perlu diisi ulang:

- `contact.email`, `contact.github`, `contact.linkedin`
- `href` di tiap project (masih `"#"`)
- Isi 4 project contoh (Aperture, Nimbus, Pixel Drift, Aetherfall) — ganti
  dengan project asli kamu

## Struktur project

```
src/
  data.ts                 # semua konten (edit di sini)
  sections.ts              # daftar section (README/about/skills/projects/contact)
  App.tsx                  # layout utama (sidebar, tab bar, status bar)
  hooks/
    useTypewriter.ts        # animasi ketik di Hero
    useScrollSpy.ts          # sinkronisasi section aktif saat scroll
  components/portfolio/
    TopBar.tsx / Sidebar.tsx / TabBar.tsx / StatusBar.tsx
    Hero.tsx / About.tsx / Skills.tsx / Projects.tsx / Contact.tsx
    Code.tsx                 # helper syntax-highlighting
    BrandIcons.tsx            # ikon GitHub & LinkedIn
```

## Stack

React 19 · TypeScript · Vite · Tailwind CSS · shadcn/ui · lucide-react ·
JetBrains Mono + IBM Plex Sans (self-hosted lewat @fontsource)
