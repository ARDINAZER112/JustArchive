/**
 * ============================================================
 *  PORTFOLIO CONTENT
 * ------------------------------------------------------------
 *  Semua teks yang tampil di portfolio ada di file ini.
 *  Ganti nilai-nilai di bawah untuk mengisi dengan data asli —
 *  tidak perlu menyentuh file komponen lain.
 * ============================================================
 */

export interface Profile {
  name: string;
  handle: string;
  roles: string[];
  tagline: string;
  status: "available" | "Masih Kosong";
}

export const profile: Profile = {
  name: "Ardinazer",
  handle: "@ardinazer",
  roles: ["Web Developer", "Game Developer"],
  tagline: "Membuat aplikasi web yang cepat dan pengalaman interaktif yang menarik dengan memperhatikan detail dan kepuasan pengguna.",
  status: "available",
};

export const bio =
  "Saya adalah seorang pengembang web full-stack yang senang mengubah ide menjadi aplikasi yang fungsional dan rapi — baik itu dasbor lengkap, alat kecil, maupun sesuatu yang interaktif di antaranya. Saya menangani proyek dengan memperhatikan detail dan kenyamanan, dengan tujuan menghadirkan pengalaman pengguna yang lancar serta kode yang mudah dipelihara. Saat ini, saya berfokus pada pengembangan solusi web yang praktis sambil terus mempelajari pola dan teknologi baru.";

export const highlights = [
  "Mengubah desain Figma menjadi antarmuka responsif yang presisi hingga tingkat piksel",
  "Meluncurkan dasbor, alat, dan eksperimen web interaktif",
  "Menyeimbangkan kode yang rapi dengan pengalaman pengguna yang apik",
  "Menikmati proses membangun sesuatu yang terasa dirancang dengan sengaja dan berfungsi dengan baik",
];

export interface SkillGroup {
  label: string;
  accent: "web" | "game";
  items: string[];
}

export const webSkills: SkillGroup = {
  label: "web",
  accent: "web",
  items: ["React", "TypeScript", "Vite", "Node.js", "Tailwind CSS", "PostgreSQL", "HTML/CSS/JavaScript"],
};

export const gameSkills: SkillGroup = {
  label: "game",
  accent: "game",
  items: ["Godot", "GDScript", "2D/3D Animation"],
};

export const toolSkills: string[] = ["Git", "Figma", "VS Code/Antigravity/VS Codium", "Linux/Windows", "Blender"];

export interface Project {
  id: string;
  fileName: string;
  category: "web" | "game";
  title: string;
  description: string;
  stack: string[];
  highlights: string[];
  cta: string;
  href?: string;
  image?: string;
}

export const projects: Project[] = [
  {
    id: "novelku",
    fileName: "novelku.tsx",
    category: "web",
    title: "NovelKu",
    description:
      "Sebuah web baca novel, membuat atau menulis novel",
    stack: ["ReactJS + Vite", "PostgreSQL", "NodeJS", "Tailwind CSS"],
    highlights: ["Baca Novel", "Menulis Novel", "NovelKu"],
    cta: "Open App",
    href: "#",
    image: "./projects/novelku.png"
  },
  {
    id: "jadwalramadhan",
    fileName: "jadwal-ramadhan.tsx",
    category: "web",
    title: "Jadwal Ramadhan",
    description:
      "Website untuk mengetahui jadwal sahur, sholat dan buka puasa",
    stack: ["HTML", "CSS", "JavaScript"],
    highlights: ["Jadwal Sholat", "Jadwal Sahur", "Jadwal Puasa"],
    cta: "Open App",
    href: "#",
    image: "./projects/jadwal-ramadhan.png"
  },
  {
    id: "comingsoon",
    fileName: "comingsoon.tsx",
    category: "web",
    title: "Coming Soon",
    description:
      "Nantikan project-project lainnya!",
    stack: ["Unknown", "Unknown"],
    highlights: ["Coming Soon", "Nantikan Projectnya"],
    cta: "Coming Soon",
    href: "#",
    image: "./projects/coming.jpg"
  },
  {
    id: "pixeldrift",
    fileName: "pixel-drift.gd",
    category: "game",
    title: "Pixel Drift",
    description:
      "Racer pixel-art top-down soal drifting di kota yang terus menyusun ulang dirinya sendiri. Dibuat solo untuk game jam 72 jam.",
    stack: ["Godot", "GDScript", "Aseprite"],
    highlights: ["Track digenerate secara prosedural", "Fisika drift custom", "1.200+ jam plays"],
    cta: "Play Now",
    href: "#",
  },
  {
    id: "aetherfall",
    fileName: "aetherfall.cs",
    category: "game",
    title: "Aetherfall",
    description:
      "Platformer fisika 2D di mana tiap lompatan membengkokkan gravitasi di sekitar pemain. Puzzle design ketemu movement berbasis momentum.",
    stack: ["Unity", "C#", "Cinemachine"],
    highlights: ["Engine gravity-warp custom", "40 level buatan tangan", "Dukung controller & keyboard"],
    cta: "Play Now",
    href: "#",
  },
];

export const contact = {
  email: "ardinazer@example.com",
  github: "github.com/ardinazer",
  linkedin: "linkedin.com/in/ardinazer",
};
