import { useState } from "react";
import { Check, Copy, Mail, Terminal } from "lucide-react";
import { GithubMark, LinkedinMark } from "./BrandIcons";
import { contact, profile } from "@/data";

function PromptLine({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex flex-wrap items-center gap-2 text-[13px] sm:text-sm">
      <span className="text-str">ardinazer@portfolio</span>
      <span className="text-ink-faint">:</span>
      <span className="text-web">~</span>
      <span className="text-ink-faint">$</span>
      <span className="text-ink">{children}</span>
    </p>
  );
}

const linkClasses =
  "text-[13px] text-ink underline decoration-editor-line underline-offset-4 transition-colors hover:text-web hover:decoration-web sm:text-sm";

export function Contact() {
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked in this context — the mailto link below still works
    }
  }

  return (
    <section id="contact" className="scroll-mt-14 px-4 py-10 sm:px-8 sm:py-16 lg:px-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center gap-2 text-xs text-ink-faint">
          <span>src</span>
          <span>/</span>
          <span className="text-ink-muted">contact.md</span>
        </div>

        <div className="overflow-hidden rounded-md border border-editor-line bg-editor-surface">
          <div className="flex items-center gap-2 border-b border-editor-line px-4 py-2 text-xs text-ink-muted">
            <Terminal className="size-3.5" />
            contact.md
          </div>

          <div className="space-y-4 p-5 font-mono sm:p-8">
            <PromptLine>whoami</PromptLine>
            <p className="pl-1 text-[13px] text-ink-muted sm:text-sm">
              {profile.name} — {profile.roles.join(" & ")}
            </p>

            <PromptLine>contact --list</PromptLine>
            <div className="flex flex-col gap-3 pl-1">
              <div className="flex flex-wrap items-center gap-3">
                <Mail className="size-4 shrink-0 text-ink-faint" />
                <a href={`mailto:${contact.email}`} className={linkClasses}>
                  {contact.email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="flex items-center gap-1 text-[11px] text-ink-faint transition-colors hover:text-ink"
                >
                  {copied ? (
                    <>
                      <Check className="size-3" /> copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" /> copy
                    </>
                  )}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <GithubMark className="size-4 shrink-0 text-ink-faint" />
                <a href={`https://${contact.github}`} target="_blank" rel="noreferrer" className={linkClasses}>
                  {contact.github}
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <LinkedinMark className="size-4 shrink-0 text-ink-faint" />
                <a href={`https://${contact.linkedin}`} target="_blank" rel="noreferrer" className={linkClasses}>
                  {contact.linkedin}
                </a>
              </div>
            </div>

            <p className="flex items-center gap-2 pt-2 text-[13px] sm:text-sm">
              <span className="text-str">ardinazer@portfolio</span>
              <span className="text-ink-faint">:</span>
              <span className="text-web">~</span>
              <span className="text-ink-faint">$</span>
              <span className="inline-block h-[1.1em] w-[7px] animate-caret-blink bg-ink-muted" />
            </p>
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[11px] text-ink-faint">
          // built with React, TypeScript & Tailwind CSS
        </p>
      </div>
    </section>
  );
}
