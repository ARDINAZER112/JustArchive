import { useState } from "react";
import {
  Braces,
  ChevronDown,
  ChevronRight,
  FileCode2,
  FileText,
  Folder,
  FolderOpen,
  Gamepad2,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { projects } from "@/data";
import type { SectionId } from "@/sections";

interface SidebarProps {
  activeSection: SectionId;
  onNavigate: (id: string) => void;
}

const indent = ["pl-3", "pl-7", "pl-11", "pl-[3.75rem]"];

function Row({
  depth,
  icon,
  label,
  active,
  accentClass,
  onClick,
}: {
  depth: number;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  accentClass?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 py-1.5 pr-3 text-left text-[13px] leading-tight transition-colors",
        indent[depth],
        active ? "bg-editor-surface text-ink" : "text-ink-muted hover:bg-editor-surface/60 hover:text-ink",
      )}
    >
      <span className={cn("shrink-0", accentClass)}>{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

function FolderRow({
  depth,
  label,
  open,
  onToggle,
  accentClass,
}: {
  depth: number;
  label: string;
  open: boolean;
  onToggle: () => void;
  accentClass?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-center gap-1 py-1.5 pr-3 text-left text-[13px] font-medium text-ink-muted hover:bg-editor-surface/60 hover:text-ink",
        indent[depth],
      )}
    >
      {open ? <ChevronDown className="size-3.5 shrink-0" /> : <ChevronRight className="size-3.5 shrink-0" />}
      <span className={cn("shrink-0", accentClass)}>{open ? <FolderOpen className="size-4" /> : <Folder className="size-4" />}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [webOpen, setWebOpen] = useState(true);
  const [gameOpen, setGameOpen] = useState(true);

  const webProjects = projects.filter((p) => p.category === "web");
  const gameProjects = projects.filter((p) => p.category === "game");

  return (
    <nav className="flex h-full flex-col overflow-y-auto scrollbar-thin bg-editor-sidebar py-2 text-ink">
      <div className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
        Explorer
      </div>
      <div className="flex items-center gap-1.5 px-3 pb-1 text-[13px] font-semibold text-ink">
        <FolderOpen className="size-4 text-ink-muted" />
        portfolio
      </div>

      <div className="flex flex-col">
        <Row
          depth={1}
          icon={<FileText className="size-4" />}
          label="README.md"
          active={activeSection === "readme"}
          onClick={() => onNavigate("readme")}
        />
        <Row
          depth={1}
          icon={<FileCode2 className="size-4" />}
          label="about.tsx"
          active={activeSection === "about"}
          onClick={() => onNavigate("about")}
        />
        <Row
          depth={1}
          icon={<Braces className="size-4" />}
          label="skills.config.ts"
          active={activeSection === "skills"}
          onClick={() => onNavigate("skills")}
        />

        <FolderRow depth={1} label="projects" open={projectsOpen} onToggle={() => setProjectsOpen((v) => !v)} />
        {projectsOpen && (
          <>
            <FolderRow
              depth={2}
              label="web"
              open={webOpen}
              onToggle={() => setWebOpen((v) => !v)}
              accentClass="text-web"
            />
            {webOpen &&
              webProjects.map((p) => (
                <Row
                  key={p.id}
                  depth={3}
                  icon={<FileCode2 className="size-4" />}
                  label={p.fileName}
                  accentClass="text-web"
                  onClick={() => onNavigate(`project-${p.id}`)}
                />
              ))}

            <FolderRow
              depth={2}
              label="game"
              open={gameOpen}
              onToggle={() => setGameOpen((v) => !v)}
              accentClass="text-game"
            />
            {gameOpen &&
              gameProjects.map((p) => (
                <Row
                  key={p.id}
                  depth={3}
                  icon={<Gamepad2 className="size-4" />}
                  label={p.fileName}
                  accentClass="text-game"
                  onClick={() => onNavigate(`project-${p.id}`)}
                />
              ))}
          </>
        )}

        <Row
          depth={1}
          icon={<Terminal className="size-4" />}
          label="contact.md"
          active={activeSection === "contact"}
          onClick={() => onNavigate("contact")}
        />
      </div>
    </nav>
  );
}
