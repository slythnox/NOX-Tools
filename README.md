<div align="center">

  <br />

  <img src="public/logo.png" width="120" alt="OnyxUi Logo" style="border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);" />

  <h1 align="center" style="font-family: 'Inter', sans-serif; font-weight: 800; font-size: 2.5rem; letter-spacing: -0.05em; color: #ffffff; margin-top: 1.5rem; margin-bottom: 0.5rem;">OnyxUi</h1>

  <p align="center" style="font-family: 'Inter', sans-serif; font-size: 1.1rem; color: #a1a1aa; max-width: 600px; margin-bottom: 1.5rem;">
    An elegant, high-retina developer asset generator designed for fast, local workflow customization. Create snippets, optimize icons, and configure uniform color systems.
  </p>

  <div>
    <a href="https://github.com/slythnox/OnyxUi/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-7c3aed?style=flat-square" alt="License MIT" />
    </a>
    <a href="https://react.dev">
      <img src="https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react&logoColor=black" alt="React" />
    </a>
    <a href="https://www.typescriptlang.org">
      <img src="https://img.shields.io/badge/TypeScript-5.5-3178c6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    </a>
    <a href="https://tailwindcss.com">
      <img src="https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
    </a>
    <a href="https://vitejs.dev">
      <img src="https://img.shields.io/badge/Vite-5.4-646cff?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    </a>
  </div>

</div>

<hr style="border: 0; height: 1px; background: #27272a; margin: 2rem 0;" />

<h2 align="center" style="font-family: 'Inter', sans-serif; color: #ffffff;">Core Workspace Tools</h2>

<p align="center" style="font-family: 'Inter', sans-serif; color: #a1a1aa; margin-bottom: 2rem;">
  OnyxUi runs entirely in the browser, providing three specialized tools with zero external API dependencies.
</p>

<table width="100%" style="border-collapse: collapse; border: 1px solid #27272a; font-family: 'Inter', sans-serif; background: #09090b;">
  <thead>
    <tr style="background: #18181b; border-bottom: 1px solid #27272a;">
      <th align="left" width="25%" style="padding: 12px; color: #7c3aed; font-size: 0.95rem;">Code Snippet Generator</th>
      <th align="left" width="25%" style="padding: 12px; color: #db2777; font-size: 0.95rem;">Lucide Icon Customizer</th>
      <th align="left" width="25%" style="padding: 12px; color: #059669; font-size: 0.95rem;">OKLCH Color Architect</th>
      <th align="left" width="25%" style="padding: 12px; color: #3b82f6; font-size: 0.95rem;">WebGL Background Studio</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td valign="top" style="padding: 16px; border-right: 1px solid #27272a; line-height: 1.6; color: #d4d4d8; font-size: 0.85rem;">
        Paste source code and format it into professional visual captures. Features direct text editing inside the layout block.
        <br /><br />
        <strong>Capabilities:</strong>
        <ul>
          <li>6 built-in IDE syntax themes</li>
          <li>6 designer gradient layouts</li>
          <li>Retina-ready 2x PNG rendering</li>
          <li>Mac-style window headers</li>
          <li>Copy to clipboard / download</li>
        </ul>
      </td>
      <td valign="top" style="padding: 16px; border-right: 1px solid #27272a; line-height: 1.6; color: #d4d4d8; font-size: 0.85rem;">
        Search and configure customizable vector icons locally. Built to export customized icon packages.
        <br /><br />
        <strong>Capabilities:</strong>
        <ul>
          <li>Full index of 1,400+ Lucide icons</li>
          <li>8 quick-filter category sections</li>
          <li>Adjustable stroke width / sizing</li>
          <li>Custom background colors</li>
          <li>Export to clipboard / PNG</li>
        </ul>
      </td>
      <td valign="top" style="padding: 16px; border-right: 1px solid #27272a; line-height: 1.6; color: #d4d4d8; font-size: 0.85rem;">
        Construct perceptually-uniform color systems based on the modern OKLCH color space.
        <br /><br />
        <strong>Capabilities:</strong>
        <ul>
          <li>Hue and saturation adjustment loops</li>
          <li>14 generated semantic tokens</li>
          <li>CSS variables clipboard copy</li>
          <li>Contrast previews, shadows & gradients</li>
        </ul>
      </td>
      <td valign="top" style="padding: 16px; line-height: 1.6; color: #d4d4d8; font-size: 0.85rem;">
        Design, customize, and export interactive WebGL/HTML5 animated backgrounds.
        <br /><br />
        <strong>Capabilities:</strong>
        <ul>
          <li>7 visual presets (Laser Flow, Light Rays, Floating Lines, Color Bends, Blinds, Dot Field, Particle Burst)</li>
          <li>Full parameter setting control panels</li>
          <li>Dynamic CLI copy / component usage codes</li>
          <li>Source code (.tsx) & style (.css) exports</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

<hr style="border: 0; height: 1px; background: #27272a; margin: 2rem 0;" />

<h2 style="font-family: 'Inter', sans-serif; color: #ffffff;">Technical Architecture</h2>

<table width="100%" style="border-collapse: collapse; border: 1px solid #27272a; font-family: 'Inter', sans-serif; background: #09090b; font-size: 0.9rem;">
  <thead>
    <tr style="background: #18181b; border-bottom: 1px solid #27272a; color: #ffffff;">
      <th align="left" style="padding: 10px;">Layer</th>
      <th align="left" style="padding: 10px;">Dependency</th>
      <th align="left" style="padding: 10px;">Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr style="border-bottom: 1px solid #27272a;">
      <td style="padding: 10px; color: #a1a1aa; font-weight: bold;">Framework</td>
      <td style="padding: 10px; color: #ffffff;">React 18 & TypeScript 5</td>
      <td style="padding: 10px; color: #a1a1aa;">Type-safe UI component updates and application state</td>
    </tr>
    <tr style="border-bottom: 1px solid #27272a;">
      <td style="padding: 10px; color: #a1a1aa; font-weight: bold;">Bundler</td>
      <td style="padding: 10px; color: #ffffff;">Vite 5</td>
      <td style="padding: 10px; color: #a1a1aa;">Production asset packaging and hot development reload</td>
    </tr>
    <tr style="border-bottom: 1px solid #27272a;">
      <td style="padding: 10px; color: #a1a1aa; font-weight: bold;">Graphics Engine</td>
      <td style="padding: 10px; color: #ffffff;">Three.js & OGL</td>
      <td style="padding: 10px; color: #a1a1aa;">Accelerated WebGL/Shaders for premium background animations</td>
    </tr>
    <tr style="border-bottom: 1px solid #27272a;">
      <td style="padding: 10px; color: #a1a1aa; font-weight: bold;">Styling</td>
      <td style="padding: 10px; color: #ffffff;">Tailwind CSS 3</td>
      <td style="padding: 10px; color: #a1a1aa;">Fast layout layouts integrated with OKLCH variables</td>
    </tr>
    <tr style="border-bottom: 1px solid #27272a;">
      <td style="padding: 10px; color: #a1a1aa; font-weight: bold;">Image Engine</td>
      <td style="padding: 10px; color: #ffffff;">html-to-image</td>
      <td style="padding: 10px; color: #a1a1aa;">Compiles client DOM trees into clean PNG bitmap buffers</td>
    </tr>
    <tr style="border-bottom: 1px solid #27272a;">
      <td style="padding: 10px; color: #a1a1aa; font-weight: bold;">Compression</td>
      <td style="padding: 10px; color: #ffffff;">JSZip</td>
      <td style="padding: 10px; color: #a1a1aa;">Handles multi-asset package zipping for download convenience</td>
    </tr>
  </tbody>
</table>

<hr style="border: 0; height: 1px; background: #27272a; margin: 2rem 0;" />

<h2 style="font-family: 'Inter', sans-serif; color: #ffffff;">Installation and Development</h2>

<p style="font-family: 'Inter', sans-serif; color: #a1a1aa; font-size: 0.95rem; line-height: 1.6;">
  To run the OnyxUi workspace locally, follow these standard commands:
</p>

```bash
# Clone the repository
git clone https://github.com/slythnox/OnyxUi.git
cd OnyxUi

# Install dependencies
npm install

# Run the local development server
npm run dev
```

<p style="font-family: 'Inter', sans-serif; color: #a1a1aa; font-size: 0.95rem; line-height: 1.6; margin-top: 1.5rem;">
  Build management and verification utilities:
</p>

```bash
# Compile and check TypeScript types
npm run type-check

# Perform static linting checks
npm run lint

# Build optimized production bundle
npm run build

# Preview the built production assets locally
npm run preview
```

<hr style="border: 0; height: 1px; background: #27272a; margin: 2rem 0;" />

<div align="center" style="font-family: 'Inter', sans-serif; color: #71717a; font-size: 0.85rem;">
  <p>OnyxUi and all associated assets are licensed under the MIT License.</p>
  <p>Maintained by slythnox</p>
</div>