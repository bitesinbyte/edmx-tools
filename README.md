# EDMX Tools

A collection of client-side tools for working with **EDMX** (Entity Data Model XML) and **OData metadata** files. All processing happens entirely in your browser -- no data is ever sent to a server.

**Live site:** [edmx.bitesinbyte.com](https://edmx.bitesinbyte.com)

## Tools

| Tool | Description |
|------|-------------|
| **EDMX Trimmer** | Upload an EDMX file, select entities to keep (or exclude), and download a trimmed version with unused entities, navigation properties, and actions removed. |
| **EDMX Explorer** | Browse all EntityTypes and EnumTypes in your EDMX file with a filterable, sortable data table. |
| **EDMX to OpenAPI JSON** | Convert an EDMX/CSDL file to an OpenAPI 3.0 specification in JSON format. |
| **EDMX to OpenAPI YAML** | Convert an EDMX/CSDL file to an OpenAPI 3.0 specification in YAML format. |

## Tech Stack

- **React 19** with TypeScript
- **Vite 8** for bundling and dev server
- **Tailwind CSS v4** for styling
- **shadcn/ui** component library
- **fast-xml-parser** for XML parsing
- **js-yaml** for YAML generation

## Getting Started

### Prerequisites

- [Node.js 22+](https://nodejs.org/)

### Run Locally

```bash
cd web
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
cd web
npm run build
```

The output will be in `web/dist/`.

## Deployment

The app is automatically deployed to GitHub Pages via GitHub Actions on every push to `main`. Pull requests trigger a build validation step.

## License

[MIT](LICENSE)

## Acknowledgements

Special thanks to [shashisadasivan](https://github.com/shashisadasivan) for the **EDMXTrimmer** code and inspiration.
