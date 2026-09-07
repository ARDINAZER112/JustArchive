import type { ReactNode } from "react";

export type TokenKind = "kw" | "type" | "str" | "comment" | "punct" | "ink" | "web" | "game";

export interface Token {
  t: string;
  k?: TokenKind;
}

export const tokenColor: Record<TokenKind, string> = {
  kw: "text-kw",
  type: "text-web",
  str: "text-str",
  comment: "text-ink-muted italic",
  punct: "text-ink-faint",
  ink: "text-ink",
  web: "text-web",
  game: "text-game",
};

/** Flattens a token list into plain text (used to drive the typewriter hook). */
export function flatTokensToString(tokens: Token[]): string {
  return tokens.map((tok) => tok.t).join("");
}

/** Renders tokens, optionally clipped to the first `maxChars` characters. */
export function renderFlatTokens(tokens: Token[], maxChars?: number): ReactNode[] {
  const limit = maxChars ?? Number.POSITIVE_INFINITY;
  let consumed = 0;
  const nodes: ReactNode[] = [];
  tokens.forEach((tok, i) => {
    if (consumed >= limit) return;
    const remaining = limit - consumed;
    const text = tok.t.length <= remaining ? tok.t : tok.t.slice(0, remaining);
    consumed += text.length;
    if (!text) return;
    nodes.push(
      <span key={i} className={tokenColor[tok.k ?? "ink"]}>
        {text}
      </span>,
    );
  });
  return nodes;
}

/** Static (non-animated) multi-line code block with a line-number gutter. */
export function CodeLines({ lines, startAt = 1 }: { lines: Token[][]; startAt?: number }) {
  return (
    <div className="font-mono text-[13px] leading-6 sm:text-[13.5px]">
      {lines.map((line, i) => (
        <div key={i} className="flex">
          <span className="mr-4 w-5 shrink-0 select-none text-right text-ink-faint sm:w-6">{startAt + i}</span>
          <span className="min-w-0 whitespace-pre-wrap break-words">
            {line.length === 0
              ? "\u00A0"
              : line.map((tok, j) => (
                  <span key={j} className={tokenColor[tok.k ?? "ink"]}>
                    {tok.t}
                  </span>
                ))}
          </span>
        </div>
      ))}
    </div>
  );
}
