import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Search, FileJson, FileText } from "lucide-react";

const tools = [
  { path: "/trim", title: "Edmx Trimmer", description: "Remove unused Entities from your Edmx file.", icon: Scissors },
  { path: "/explore", title: "Edmx Explorer", description: "Explore all Entities and their Properties in your Edmx file.", icon: Search },
  { path: "/convert?type=open-api-json", title: "Edmx to OpenApi JSON", description: "Convert your Edmx file to OpenApi JSON format.", icon: FileJson },
  { path: "/convert?type=open-api-yml", title: "Edmx to OpenApi YML", description: "Convert your Edmx file to OpenApi YML format.", icon: FileText },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <div className="text-center space-y-2">
        <img src="/favicons/android-chrome-512x512.png" alt="Edmx Tools" className="w-24 h-24 mx-auto" />
        <h1 className="text-3xl font-bold tracking-tight">Edmx Tools</h1>
        <p className="text-muted-foreground max-w-md">
          A set of tools to help you work with EDMX and OData metadata files. All processing happens in your browser.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
        {tools.map((tool) => (
          <Card key={tool.path} className="flex flex-col hover:shadow-md transition-shadow">
            <CardHeader className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <tool.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">{tool.title}</CardTitle>
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" size="sm" render={<Link to={tool.path} className="w-full" />}>
                Open
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
