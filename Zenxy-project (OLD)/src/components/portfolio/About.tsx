import { FileCode2 } from "lucide-react";
import { bio, highlights } from "@/data";
import { CodeLines, type Token } from "./Code";

function wrap(text: string, width: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > width && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function buildLines(): Token[][] {
  const lines: Token[][] = [];
  lines.push([{ t: "/**", k: "comment" }]);
  for (const l of wrap(bio, 72)) {
    lines.push([{ t: ` * ${l}`, k: "comment" }]);
  }
  lines.push([{ t: " */", k: "comment" }]);
  lines.push([]);
  lines.push([
    { t: "function ", k: "kw" },
    { t: "highlights", k: "ink" },
    { t: "() {", k: "punct" },
  ]);
  lines.push([{ t: "  return [", k: "punct" }]);
  highlights.forEach((h, i) => {
    lines.push([
      { t: "    ", k: "punct" },
      { t: `"${h}"`, k: "str" },
      { t: i === highlights.length - 1 ? "" : ",", k: "punct" },
    ]);
  });
  lines.push([{ t: "  ];", k: "punct" }]);
  lines.push([{ t: "}", k: "punct" }]);
  return lines;
}

export function About() {
  const lines = buildLines();

  return (
    <section id="about" className="scroll-mt-14 border-b border-editor-line px-4 py-10 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-4 flex items-center gap-2 text-xs text-ink-faint">
          <span>src</span>
          <span>/</span>
          <span className="text-ink-muted">about.tsx</span>
        </div>
        <div className="overflow-hidden rounded-md border border-editor-line bg-editor-surface">
          <div className="flex items-center gap-2 border-b border-editor-line px-4 py-2 text-xs text-ink-muted">
            <FileCode2 className="size-3.5" />
            about.tsx
          </div>
          <div className="overflow-x-auto p-4 sm:p-6">
            <CodeLines lines={lines} />
          </div>
        </div>
      </div>
    </section>
  );
}
