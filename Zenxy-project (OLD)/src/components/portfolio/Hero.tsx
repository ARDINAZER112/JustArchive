import { FileText } from "lucide-react";
import { useMemo } from "react";
import { useTypewriter } from "@/hooks/useTypewriter";
import { profile } from "@/data";
import { flatTokensToString, renderFlatTokens, type Token } from "./Code";

const codeTokens: Token[] = [
  { t: "// README.md\n\n", k: "comment" },
  { t: "interface ", k: "kw" },
  { t: "Developer", k: "type" },
  { t: " {\n", k: "punct" },
  { t: "  roles", k: "ink" },
  { t: ": ", k: "punct" },
  { t: "string[]", k: "type" },
  { t: ";\n", k: "punct" },
  { t: "  focus", k: "ink" },
  { t: ": ", k: "punct" },
  { t: "string", k: "type" },
  { t: ";\n", k: "punct" },
  { t: "  status", k: "ink" },
  { t: ": ", k: "punct" },
  { t: '"available"', k: "str" },
  { t: " | ", k: "punct" },
  { t: '"booked"', k: "str" },
  { t: ";\n", k: "punct" },
  { t: "}\n\n", k: "punct" },
  { t: "const ", k: "kw" },
  { t: "me", k: "ink" },
  { t: ": ", k: "punct" },
  { t: "Developer", k: "type" },
  { t: " = {\n", k: "punct" },
  { t: "  roles", k: "ink" },
  { t: ": [", k: "punct" },
  { t: '"Web Developer"', k: "str" },
  { t: ", ", k: "punct" },
  { t: '"Game Developer"', k: "str" },
  { t: "],\n", k: "punct" },
  { t: "  focus", k: "ink" },
  { t: ": ", k: "punct" },
  { t: '"fast apps, playable worlds"', k: "str" },
  { t: ",\n", k: "punct" },
  { t: "  status", k: "ink" },
  { t: ": ", k: "punct" },
  { t: '"available"', k: "str" },
  { t: ",\n", k: "punct" },
  { t: "};\n\n", k: "punct" },
  { t: "export ", k: "kw" },
  { t: "default ", k: "kw" },
  { t: "me", k: "ink" },
  { t: ";", k: "punct" },
];

interface HeroProps {
  onNavigate: (id: string) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  const fullText = useMemo(() => flatTokensToString(codeTokens), []);
  const { output, done } = useTypewriter(fullText, { charsPerTick: 2, tickMs: 14, startDelay: 250 });

  return (
    <section id="readme" className="scroll-mt-14 border-b border-editor-line px-4 py-10 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2 lg:gap-6">
        {/* code pane */}
        <div className="order-2 flex flex-col overflow-hidden rounded-md border border-editor-line bg-editor-surface lg:order-1">
          <div className="flex items-center gap-2 border-b border-editor-line px-4 py-2 text-xs text-ink-muted">
            <FileText className="size-3.5" />
            README.md
          </div>
          <pre className="min-h-[300px] flex-1 overflow-x-auto whitespace-pre-wrap break-words p-4 text-[13px] leading-6 sm:min-h-[360px] sm:text-sm">
            <code>
              {renderFlatTokens(codeTokens, output.length)}
              {!done && (
                <span className="ml-[1px] inline-block h-[1.05em] w-[2px] translate-y-[3px] animate-caret-blink bg-pop align-text-bottom" />
              )}
            </code>
          </pre>
        </div>

        {/* rendered preview pane */}
        <div className="order-1 flex flex-col overflow-hidden rounded-md border border-editor-line bg-editor-surface lg:order-2">
          <div className="flex items-center gap-1.5 border-b border-editor-line px-4 py-2">
            <span className="size-2 rounded-full bg-pop/70" />
            <span className="size-2 rounded-full bg-game/70" />
            <span className="size-2 rounded-full bg-str/70" />
            <span className="ml-2 truncate text-[11px] text-ink-faint">preview — localhost:3000</span>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-5 px-6 py-10 sm:px-10">
            {profile.status === "available" && (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-str/30 bg-str/10 px-2.5 py-1 text-xs text-str">
                <span className="size-1.5 rounded-full bg-str" />
                Available for freelance
              </span>
            )}
            <div>
              <h1 className="font-mono text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {profile.name}
              </h1>
              <p className="mt-2 font-mono text-base text-ink-muted sm:text-lg">
                <span className="text-web">{profile.roles[0]}</span>
                <span className="text-ink-faint"> × </span>
                <span className="text-game">{profile.roles[1]}</span>
              </p>
            </div>
            <p className="max-w-md font-sans text-[15px] leading-relaxed text-ink-muted">{profile.tagline}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate("projects")}
                className="rounded-md bg-pop px-4 py-2 text-sm font-medium text-editor-sidebar transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                View Projects
              </button>
              <button
                type="button"
                onClick={() => onNavigate("contact")}
                className="rounded-md border border-editor-line px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-editor-bg"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
