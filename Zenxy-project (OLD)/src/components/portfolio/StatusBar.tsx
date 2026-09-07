import { Check, Mail } from "lucide-react";
import { GithubMark, LinkedinMark } from "./BrandIcons";
import { contact } from "@/data";
import { sections, type SectionId } from "@/sections";

interface StatusBarProps {
  activeSection: SectionId;
  scrollProgress: number;
}

const TOTAL_LINES = 486;

export function StatusBar({ activeSection, scrollProgress }: StatusBarProps) {
  const meta = sections.find((s) => s.id === activeSection) ?? sections[0];
  const line = Math.min(TOTAL_LINES, Math.max(1, Math.round(scrollProgress * TOTAL_LINES) + 1));
  const col = meta.fileName.length + 1;

  return (
    <footer className="flex h-7 shrink-0 items-center justify-between gap-2 border-t border-editor-line bg-editor-sidebar px-3 text-[11px] text-ink-muted">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex items-center gap-1.5 truncate">
          <span className="size-1.5 shrink-0 rounded-full bg-str" aria-hidden="true" />
          {meta.fileName}
        </span>
        <span className="hidden shrink-0 tabular-nums sm:inline">
          Ln {line}, Col {col}
        </span>
      </div>

      <div className="hidden shrink-0 items-center gap-3 md:flex">
        <span>{meta.language}</span>
        <span>Spaces: 2</span>
        <span>UTF-8</span>
        <span className="flex items-center gap-1">
          <Check className="size-3" /> Prettier
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2.5">
        <a href={`mailto:${contact.email}`} aria-label="Kirim email" className="transition-colors hover:text-ink">
          <Mail className="size-3.5" />
        </a>
        <a
          href={`https://${contact.github}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Buka GitHub"
          className="transition-colors hover:text-ink"
        >
          <GithubMark className="size-3.5" />
        </a>
        <a
          href={`https://${contact.linkedin}`}
          target="_blank"
          rel="noreferrer"
          aria-label="Buka LinkedIn"
          className="transition-colors hover:text-ink"
        >
          <LinkedinMark className="size-3.5" />
        </a>
        <span className="hidden pl-1 sm:inline">© 2026</span>
      </div>
    </footer>
  );
}
