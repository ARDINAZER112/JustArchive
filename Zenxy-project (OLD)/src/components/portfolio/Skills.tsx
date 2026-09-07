import { Braces } from "lucide-react";
import { cn } from "@/lib/utils";
import { webSkills, gameSkills, toolSkills, type SkillGroup } from "@/data";

function SkillBlock({ group }: { group: SkillGroup }) {
  const isWeb = group.accent === "web";
  const accentText = isWeb ? "text-web" : "text-game";
  const accentBorder = isWeb ? "border-web/30" : "border-game/30";
  const accentBg = isWeb ? "bg-web/10" : "bg-game/10";

  return (
    <div>
      <p className="font-mono text-[13px] sm:text-sm">
        <span className="text-kw">export const </span>
        <span className={accentText}>{group.label}Skills</span>
        <span className="text-ink-faint"> = [</span>
      </p>
      <div className="flex flex-wrap gap-2 py-3 pl-3 sm:pl-5">
        {group.items.map((item) => (
          <span
            key={item}
            className={cn(
              "rounded-full border px-3 py-1 text-[13px] transition-colors",
              accentBorder,
              accentBg,
              accentText,
            )}
          >
            {item}
          </span>
        ))}
      </div>
      <p className="font-mono text-[13px] text-ink-faint sm:text-sm">] as const;</p>
    </div>
  );
}

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-14 border-b border-editor-line px-4 py-10 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center gap-2 text-xs text-ink-faint">
          <span>src</span>
          <span>/</span>
          <span className="text-ink-muted">skills.config.ts</span>
        </div>
        <div className="overflow-hidden rounded-md border border-editor-line bg-editor-surface">
          <div className="flex items-center gap-2 border-b border-editor-line px-4 py-2 text-xs text-ink-muted">
            <Braces className="size-3.5" />
            skills.config.ts
          </div>
          <div className="grid gap-8 p-4 sm:p-6 md:grid-cols-2 md:gap-10">
            <SkillBlock group={webSkills} />
            <SkillBlock group={gameSkills} />
          </div>
          <div className="border-t border-editor-line px-4 pb-5 pt-4 sm:px-6">
            <p className="font-mono text-[13px] text-ink-faint sm:text-sm">// tooling</p>
            <div className="flex flex-wrap gap-2 pt-3">
              {toolSkills.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-editor-line bg-editor-bg px-3 py-1 text-[13px] text-ink-muted"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
