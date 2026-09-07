import { FileCode2, Folder, Gamepad2, Play } from "lucide-react";
import { projects, type Project } from "@/data";

function WebMockup() {
  const bars = [40, 68, 32, 82, 55, 70, 45];
  return (
    <div className="h-36 overflow-hidden rounded border border-web/20 bg-editor-bg sm:h-40">
      <div className="flex items-center gap-1.5 border-b border-editor-line bg-editor-sidebar/60 px-2.5 py-1.5">
        <span className="size-1.5 rounded-full bg-ink-faint/70" />
        <span className="size-1.5 rounded-full bg-ink-faint/70" />
        <span className="size-1.5 rounded-full bg-ink-faint/70" />
        <span className="ml-1.5 h-2.5 w-24 rounded-full bg-editor-line" />
      </div>
      <div className="flex h-[calc(100%-26px)] gap-2 p-2">
        <div className="w-1/4 rounded bg-web/10" />
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex gap-1.5">
            <div className="h-6 flex-1 rounded bg-web/15" />
            <div className="h-6 flex-1 rounded bg-web/10" />
            <div className="h-6 flex-1 rounded bg-web/15" />
          </div>
          <div className="flex flex-1 items-end gap-1 rounded bg-editor-surface2 p-1.5">
            {bars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-gradient-to-t from-web/70 to-web/20"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GameMockup() {
  return (
    <div className="relative h-36 overflow-hidden rounded border border-game/20 bg-gradient-to-b from-[#2a1f14] via-[#1d1712] to-editor-bg sm:h-40">
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-game/25 to-transparent" />
      <div className="absolute -left-4 bottom-2 h-14 w-24 rotate-3 rounded-t-full bg-game/10" />
      <div className="absolute bottom-0 right-6 h-16 w-20 rounded-t-full bg-game/15" />
      <div className="absolute left-2.5 top-2.5 flex items-center gap-1">
        <span className="size-2 rounded-sm bg-pop/80" />
        <span className="size-2 rounded-sm bg-pop/80" />
        <span className="size-2 rounded-sm bg-pop/40" />
      </div>
      <div className="absolute right-2.5 top-2.5 rounded bg-black/30 px-1.5 py-0.5 text-[10px] tabular-nums text-game/90">
        00420
      </div>
      <div className="absolute bottom-2.5 left-2.5 size-7 rounded-full border border-game/40" />
      <div className="absolute bottom-2.5 right-2.5 size-6 rounded-full border border-game/40 bg-game/10" />
    </div>
  );
}

function ProjectImage({ project }: { project: Project }) {
  const isWeb = project.category === "web";

  if (!project.image) {
    return isWeb ? <WebMockup /> : <GameMockup />;
  }

  return (
    <div
      className={
        isWeb
          ? "h-36 overflow-hidden rounded border border-web/20 bg-editor-bg sm:h-40"
          : "h-36 overflow-hidden rounded border border-game/20 bg-editor-bg sm:h-40"
      }
    >
      <img src={project.image} alt={project.title} className="h-full w-full object-cover" loading="lazy" />
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const isWeb = project.category === "web";

  return (
    <div
      id={`project-${project.id}`}
      className="scroll-mt-14 flex flex-col overflow-hidden rounded-md border border-editor-line bg-editor-surface"
    >
      <div className="flex items-center justify-between gap-2 border-b border-editor-line px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2 text-xs text-ink-muted">
          {isWeb ? (
            <FileCode2 className="size-3.5 shrink-0 text-web" />
          ) : (
            <Gamepad2 className="size-3.5 shrink-0 text-game" />
          )}
          <span className="truncate">{project.fileName}</span>
        </div>
        <a
          href={project.href ?? "#"}
          target="_blank"
          rel="noreferrer"
          className={
            isWeb
              ? "flex shrink-0 items-center gap-1.5 rounded-md border border-web/30 bg-web/10 px-2.5 py-1 text-xs font-medium text-web transition-colors hover:bg-web/20"
              : "flex shrink-0 items-center gap-1.5 rounded-md border border-game/30 bg-game/10 px-2.5 py-1 text-xs font-medium text-game transition-colors hover:bg-game/20"
          }
        >
          <Play className="size-3" />
          {project.cta}
        </a>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 p-4 sm:p-5">
        <h3 className="font-mono text-[14.5px] font-medium leading-snug text-ink sm:text-[15px]">{project.title}</h3>

        <ProjectImage project={project} />

        <p className="font-mono text-[13px] italic leading-relaxed text-ink-muted sm:text-sm">
          /* {project.description} */
        </p>

        <p className="font-mono text-[13px] sm:text-sm">
          <span className="text-kw">import </span>
          <span className="text-ink-faint">{"{ "}</span>
          {project.stack.map((s, i) => (
            <span key={s}>
              <span className={isWeb ? "text-web" : "text-game"}>{s}</span>
              {i < project.stack.length - 1 && <span className="text-ink-faint">, </span>}
            </span>
          ))}
          <span className="text-ink-faint">{" }"}</span>
          <span className="text-kw"> from </span>
          <span className="text-str">"stack"</span>
          <span className="text-ink-faint">;</span>
        </p>

        <ul className="mt-auto space-y-1.5 pt-1">
          {project.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-[13px] leading-snug text-ink-muted sm:text-sm">
              <span className={isWeb ? "mt-0.5 shrink-0 text-web" : "mt-0.5 shrink-0 text-game"}>▸</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Projects() {
  const webProjects = projects.filter((p) => p.category === "web");
  const gameProjects = projects.filter((p) => p.category === "game");

  return (
    <section id="projects" className="scroll-mt-14 border-b border-editor-line px-4 py-10 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-2 text-xs text-ink-faint">
          <span>src</span>
          <span>/</span>
          <span className="text-ink-muted">projects/</span>
        </div>

        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-web">
          <Folder className="size-4" />
          web/
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {webProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>

        <div className="mb-3 mt-10 flex items-center gap-2 text-sm font-medium text-game">
          <Folder className="size-4" />
          game/
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {gameProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
