import { GitBranch, Menu } from "lucide-react";

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="flex h-11 shrink-0 items-center gap-3 border-b border-editor-line bg-editor-sidebar px-3 text-ink-muted">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Buka daftar file"
          className="-ml-1 rounded p-1 text-ink-muted hover:bg-editor-surface hover:text-ink md:hidden"
        >
          <Menu className="size-4" />
        </button>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-pop/80" />
          <span className="size-2.5 rounded-full bg-game/80" />
          <span className="size-2.5 rounded-full bg-str/80" />
        </div>
      </div>

      <div className="flex-1 truncate text-center text-[11px] tracking-wide text-ink-muted sm:text-xs">
        <span className="hidden sm:inline">~/</span>ardinazer/portfolio<span className="hidden sm:inline"> — main.tsx</span>
      </div>

      <div className="hidden shrink-0 items-center gap-1.5 text-[11px] sm:flex">
        <GitBranch className="size-3.5 text-game" />
        <span>main</span>
      </div>
    </header>
  );
}
