import { Braces, FileCode2, FileText, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { sections, type SectionId } from "@/sections";

const icons: Record<SectionId, React.ReactNode> = {
  readme: <FileText className="size-3.5" />,
  about: <FileCode2 className="size-3.5" />,
  skills: <Braces className="size-3.5" />,
  projects: <FileCode2 className="size-3.5" />,
  contact: <Terminal className="size-3.5" />,
};

interface TabBarProps {
  activeSection: SectionId;
  onNavigate: (id: SectionId) => void;
}

export function TabBar({ activeSection, onNavigate }: TabBarProps) {
  return (
    <div className="flex h-10 shrink-0 items-stretch overflow-x-auto border-b border-editor-line bg-editor-sidebar no-scrollbar">
      {sections.map((s) => {
        const active = activeSection === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onNavigate(s.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 border-r border-editor-line px-3.5 text-[13px] transition-colors",
              active
                ? "border-t-2 border-t-pop bg-editor-bg text-ink"
                : "border-t-2 border-t-transparent text-ink-muted hover:bg-editor-surface/50 hover:text-ink",
            )}
          >
            <span className={active ? "text-ink-muted" : "text-ink-faint"}>{icons[s.id]}</span>
            <span className="whitespace-nowrap">{s.fileName}</span>
          </button>
        );
      })}
    </div>
  );
}
