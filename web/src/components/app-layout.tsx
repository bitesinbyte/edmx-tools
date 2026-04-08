import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Moon, Sun, Menu, X, Heart, Globe, BookOpen, Share2 } from "lucide-react";
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
  { path: "/trim", label: "Trim" },
  { path: "/explore", label: "Explore" },
  { path: "/convert?type=open-api-json", label: "JSON" },
  { path: "/convert?type=open-api-yml", label: "YAML" },
];

function NavLink({ path, label, isActive, onClick }: {
  path: string; label: string; isActive: boolean; onClick?: () => void;
}) {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={cn(
        "relative px-3 py-2 text-sm font-medium transition-colors",
        "after:absolute after:bottom-0 after:left-1 after:h-[2px] after:bg-foreground after:transition-all after:duration-300",
        isActive
          ? "text-foreground after:w-[calc(100%-8px)]"
          : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-[calc(100%-8px)]"
      )}
    >
      {label}
    </Link>
  );
}

function IconLink({ href, tooltip, children }: {
  href: string; tooltip: string; children: React.ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <a href={href} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md h-10 w-10 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentPath = location.pathname + location.search;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed top navbar */}
      <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-sm transition-all duration-300">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <img src="/favicons/android-chrome-192x192.png" alt="Logo" className="h-7 w-7 dark:invert dark:brightness-90" />
            <span className="font-semibold text-sm tracking-tight">EDMX Tools</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                {...item}
                isActive={currentPath === item.path}
              />
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger render={
                <button
                  onClick={toggle}
                  className="relative inline-flex items-center justify-center rounded-md h-10 w-10 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                />
              }>
                <Sun className={cn("h-4 w-4 transition-all", isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0 absolute")} />
                <Moon className={cn("h-4 w-4 transition-all", isDark ? "rotate-90 scale-0 absolute" : "rotate-0 scale-100")} />
              </TooltipTrigger>
              <TooltipContent>Toggle theme</TooltipContent>
            </Tooltip>

            {/* Mobile hamburger */}
            <button
              className="md:hidden rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-sm">
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    currentPath === item.path
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 pt-14">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {/* Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img src="/favicons/android-chrome-192x192.png" alt="Logo" className="h-7 w-7 dark:invert dark:brightness-90" />
                <span className="font-semibold text-sm">EDMX Tools</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Client-side tools for EDMX &amp; OData metadata. No data leaves your browser.
              </p>
            </div>

            {/* Navigation */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Navigation</h4>
              <nav className="flex flex-col gap-2">
                {[{ path: "/trim", label: "Trimmer" }, { path: "/explore", label: "Explorer" }, { path: "/convert?type=open-api-json", label: "OpenAPI JSON" }, { path: "/convert?type=open-api-yml", label: "OpenAPI YAML" }].map((item) => (
                  <Link key={item.path} to={item.path} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Connect */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Connect</h4>
              <div className="flex items-center gap-1">
                <IconLink href="https://github.com/bitesinbyte/edmx-tools" tooltip="GitHub"><GitHubIcon className="h-4 w-4" /></IconLink>
                <IconLink href="https://www.bitesinbyte.com" tooltip="Website"><Globe className="h-4 w-4" /></IconLink>
                <IconLink href="https://blogs.bitesinbyte.com" tooltip="Blog"><BookOpen className="h-4 w-4" /></IconLink>
                <IconLink href="https://links.bitesinbyte.com" tooltip="Links"><Share2 className="h-4 w-4" /></IconLink>
                <IconLink href="https://ko-fi.com/bitesinbyte" tooltip="Support"><Heart className="h-4 w-4" /></IconLink>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-border/50 pt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>&copy; {new Date().getFullYear()} <strong className="text-foreground/70">bitesinbyte.com</strong> | <a href="https://github.com/bitesinbyte/edmx-tools/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">MIT License</a></span>
            <span>Thanks to <a href="https://github.com/shashisadasivan" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-foreground transition-colors">shashisadasivan</a> for EDMXTrimmer inspiration</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
