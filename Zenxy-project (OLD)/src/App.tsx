import { useCallback, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TopBar } from "@/components/portfolio/TopBar";
import { Sidebar } from "@/components/portfolio/Sidebar";
import { TabBar } from "@/components/portfolio/TabBar";
import { StatusBar } from "@/components/portfolio/StatusBar";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { Projects } from "@/components/portfolio/Projects";
import { Contact } from "@/components/portfolio/Contact";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { sectionIds, type SectionId } from "@/sections";

function App() {
  const mainRef = useRef<HTMLElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const activeSection = useScrollSpy(sectionIds, mainRef) as SectionId;

  const handleNavigate = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const reduceMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    setMobileOpen(false);
  }, []);

  const handleScroll = useCallback(() => {
    const el = mainRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setScrollProgress(max > 0 ? el.scrollTop / max : 0);
  }, []);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-editor-bg text-ink">
      <TopBar onMenuClick={() => setMobileOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-60 shrink-0 border-r border-editor-line md:block lg:w-64">
          <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 max-w-[80vw] border-editor-line bg-editor-sidebar p-0">
            <SheetHeader className="border-b border-editor-line px-4 py-3 text-left">
              <SheetTitle className="text-sm font-medium text-ink">Explorer</SheetTitle>
            </SheetHeader>
            <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />
          </SheetContent>
        </Sheet>

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <TabBar activeSection={activeSection} onNavigate={handleNavigate} />
          <main
            ref={mainRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto scroll-smooth scrollbar-thin"
          >
            <Hero onNavigate={handleNavigate} />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </main>
        </div>
      </div>

      <StatusBar activeSection={activeSection} scrollProgress={scrollProgress} />
    </div>
  );
}

export default App;
