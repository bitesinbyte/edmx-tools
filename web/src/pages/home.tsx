import { Link } from "react-router-dom";
import { Scissors, Search, FileJson, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const tools = [
  {
    path: "/trim",
    title: "EDMX Trimmer",
    description: "Remove unused entities from your EDMX file. Select what to keep or exclude, and download a clean trimmed version.",
    icon: Scissors,
  },
  {
    path: "/explore",
    title: "EDMX Explorer",
    description: "Browse all EntityTypes and EnumTypes in your EDMX file with a filterable, sortable data table.",
    icon: Search,
  },
  {
    path: "/convert?type=open-api-json",
    title: "EDMX to OpenAPI JSON",
    description: "Convert your EDMX metadata file to an OpenAPI 3.0 specification in JSON format.",
    icon: FileJson,
  },
  {
    path: "/convert?type=open-api-yml",
    title: "EDMX to OpenAPI YAML",
    description: "Convert your EDMX metadata file to an OpenAPI 3.0 specification in YAML format.",
    icon: FileText,
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
            <span>Client-side tools</span>
            <span className="text-muted-foreground/50">|</span>
            <span>No data leaves your browser</span>
          </div>

          <img src="/favicons/android-chrome-512x512.png" alt="EDMX Tools" className="w-20 h-20 mx-auto dark:invert dark:brightness-90" />

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-r from-foreground/70 via-foreground to-foreground/70 bg-clip-text text-transparent">
              EDMX Tools
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-lg text-muted-foreground leading-relaxed">
            A suite of tools to help you work with EDMX and OData metadata files.
            Trim, explore, and convert -- all directly in your browser.
          </p>
        </div>
      </section>

      {/* Tools */}
      <section className="border-t border-border/50 px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-4">
              Tools
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Everything you need</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {tools.map((tool, i) => (
              <Link
                key={tool.path}
                to={tool.path}
                className={cn(
                  "group relative rounded-xl border bg-card p-6 transition-all duration-300",
                  "hover:border-foreground/10 hover:shadow-md hover:scale-[1.02]"
                )}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="mb-4 inline-flex rounded-lg bg-muted p-2.5 transition-colors group-hover:bg-foreground/10">
                  <tool.icon className="h-5 w-5 text-foreground/70" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
