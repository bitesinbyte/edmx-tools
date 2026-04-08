import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Moon, Sun, Menu, Home, Scissors, Search, FileJson, FileText, Heart, Globe, BookOpen, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/trim", label: "Trim", icon: Scissors },
  { path: "/explore", label: "Explore", icon: Search },
  { path: "/convert?type=open-api-json", label: "OpenApi - JSON", icon: FileJson },
  { path: "/convert?type=open-api-yml", label: "OpenApi - YML", icon: FileText },
];

function NavLink({ path, label, icon: Icon, isActive, onClick }: {
  path: string; label: string; icon: React.ComponentType<{ className?: string }>;
  isActive: boolean; onClick?: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            to={path}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          />
        }
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span>{label}</span>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function HeaderIconLink({ href, tooltip, children }: {
  href: string; tooltip: string; children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <a href={href} target="_blank" rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-all outline-none select-none hover:bg-muted hover:text-foreground size-8"
          />
        }
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  );
}

export function AppLayout() {
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const [sheetOpen, setSheetOpen] = useState(false);
  const currentPath = location.pathname + location.search;

  const sidebarContent = (
    <nav className="flex flex-col gap-1 p-2">
      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</div>
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          {...item}
          isActive={currentPath === item.path || (item.path === "/" && currentPath === "/")}
          onClick={() => setSheetOpen(false)}
        />
      ))}
    </nav>
  );

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-56 flex-col border-r bg-sidebar">
        <div className="flex items-center gap-2 px-4 py-3 border-b">
          <img src="/favicons/android-chrome-192x192.png" alt="Logo" className="h-6 w-6" />
          <span className="font-semibold text-sm">Edmx Tools</span>
        </div>
        <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
        <Separator />
        <div className="p-3 text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} bitesinbyte.com
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between border-b px-4 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2">
            {/* Mobile hamburger */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger render={
                <Button variant="ghost" size="icon" className="md:hidden" />
              }>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-56 p-0">
                <SheetTitle className="flex items-center gap-2 px-4 py-3 border-b">
                  <img src="/favicons/android-chrome-192x192.png" alt="Logo" className="h-6 w-6" />
                  <span className="font-semibold text-sm">Edmx Tools</span>
                </SheetTitle>
                {sidebarContent}
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2 md:hidden">
              <img src="/favicons/android-chrome-192x192.png" alt="Logo" className="h-5 w-5" />
              <span className="font-semibold text-sm">Edmx Tools</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger render={
                <Button variant="ghost" size="icon" onClick={toggle} />
              }>
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </TooltipTrigger>
              <TooltipContent>Toggle theme</TooltipContent>
            </Tooltip>
            <HeaderIconLink href="https://www.bitesinbyte.com" tooltip="Website">
              <Globe className="h-4 w-4" />
            </HeaderIconLink>
            <HeaderIconLink href="https://github.com/bitesinbyte/edmx-tools" tooltip="GitHub">
              <GitHubIcon className="h-4 w-4" />
            </HeaderIconLink>
            <HeaderIconLink href="https://blogs.bitesinbyte.com" tooltip="Blog">
              <BookOpen className="h-4 w-4" />
            </HeaderIconLink>
            <HeaderIconLink href="https://links.bitesinbyte.com" tooltip="Links">
              <Share2 className="h-4 w-4" />
            </HeaderIconLink>
            <HeaderIconLink href="https://ko-fi.com/bitesinbyte" tooltip="Support">
              <Heart className="h-4 w-4" />
            </HeaderIconLink>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="border-t px-4 py-3 text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} <strong>bitesinbyte.com</strong> | <a href="https://github.com/bitesinbyte/edmx-tools/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="underline">MIT License</a></span>
          <span>Thanks to <a href="https://github.com/shashisadasivan" target="_blank" rel="noopener noreferrer" className="underline font-medium">shashisadasivan</a> for EDMXTrimmer inspiration</span>
        </footer>
      </div>
    </div>
  );
}
