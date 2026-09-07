export type SectionId = "readme" | "about" | "skills" | "projects" | "contact";

export interface SectionMeta {
  id: SectionId;
  fileName: string;
  language: string;
}

export const sections: SectionMeta[] = [
  { id: "readme", fileName: "README.md", language: "Markdown" },
  { id: "about", fileName: "about.tsx", language: "TypeScript JSX" },
  { id: "skills", fileName: "skills.config.ts", language: "TypeScript" },
  { id: "projects", fileName: "projects.tsx", language: "TypeScript JSX" },
  { id: "contact", fileName: "contact.md", language: "Markdown" },
];

export const sectionIds = sections.map((s) => s.id);
