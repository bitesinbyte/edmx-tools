# Edmx Tools

A collection of client-side tools for working with **EDMX** (Entity Data Model XML) and **OData metadata** files. All processing happens entirely in your browser via WebAssembly -- no data is ever sent to a server.

**Live site:** [edmx.bitesinbyte.com](https://edmx.bitesinbyte.com)

## Tools

| Tool | Description |
|------|-------------|
| **EDMX Trimmer** | Upload an EDMX file, select entities to keep (or exclude), and download a trimmed version with unused entities, navigation properties, and actions removed. |
| **EDMX Explorer** | Browse all EntityTypes and EnumTypes in your EDMX file with a filterable, sortable data grid. |
| **EDMX to OpenAPI JSON** | Convert an EDMX/CSDL file to an OpenAPI 3.0 specification in JSON format. |
| **EDMX to OpenAPI YAML** | Convert an EDMX/CSDL file to an OpenAPI 3.0 specification in YAML format. |

## Tech Stack

- **.NET 10** / Blazor WebAssembly (client-side)
- **Radzen Blazor** components for UI
- **Microsoft.OpenApi.OData** for EDMX-to-OpenAPI conversion
- **PWA** with offline support via service workers

## Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)

### Run Locally

```bash
dotnet restore src/EdmxTools.csproj
dotnet run --project src/EdmxTools.csproj
```

The app will be available at `https://localhost:7104` or `http://localhost:5079`.

### Build for Production

```bash
dotnet publish src/EdmxTools.csproj -c Release -o release
```

The output will be in `release/wwwroot/`.

## Deployment

The app is automatically deployed to GitHub Pages via GitHub Actions on every push to `main`. Pull requests trigger a build validation step.

## License

[MIT](LICENSE)

## Acknowledgements

Special thanks to [shashisadasivan](https://github.com/shashisadasivan) for the **EDMXTrimmer** code and inspiration.
