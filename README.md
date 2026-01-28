# Mart van Enckevort Portfolio

A cinematic, interactive portfolio built with **Svelte 5 (Runes)**, **Three.js**, and **MapLibre GL**. This project showcases creative engineering through high-performance animations, 3D visualizations, and a sleek modern aesthetic.

![Tech Stack](https://img.shields.io/badge/Svelte-5-FF3E00?style=flat-square&logo=svelte)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwind-css)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-000000?style=flat-square&logo=bun)

## ✨ Features

- **Interactive 3D Globe**: Built with `three-globe` to visualize travels and locations.
- **Dynamic 2D Maps**: Integrated `MapLibre GL` for detailed geographic exploration.
- **Generative Background**: A high-performance 2D Canvas interactive background.
- **Svelte 5 Runes**: Leveraging the latest reactivity model for optimal performance.
- **Admin Dashboard**: A secure back-end interface to manage projects, travels, and images dynamic updates.
- **Tailwind CSS 4**: Modern styling using the next generation of Tailwind.
- **Project Showcase**: A grid-based layout for main projects and an archived list for previous works.

## 🛠 Tech Stack

- **Framework**: [Svelte 5](https://svelte.dev) (Runes)
- **Visuals**: [Three.js](https://threejs.org), [Three-Globe](https://github.com/vasturiano/three-globe), [MapLibre GL](https://maplibre.org)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com)
- **Runtime/Package Manager**: [Bun](https://bun.sh)
- **Build Tool**: [Vite](https://vitejs.dev)

## 🚀 Getting Started

### Prerequisites

You will need [Bun](https://bun.sh) installed on your machine.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Mart100/portfolio.git
   cd portfolio
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Run the development server:
   ```bash
   bun run dev
   ```

### Building for Production

To create an optimized build:

```bash
bun run build
```

## 📂 Project Structure

- `src/lib/components/`: Modular Svelte components.
  - `travel/`: Complex 3D/2D mapping components.
- `src/lib/data/`: JSON source of truth for projects, travels, and archives.
- `src/lib/constants.ts`: Global configuration and social links.
- `static/`: Assets and GeoJSON data.

---

Built with ⚡ by [Mart van Enckevort](https://github.com/Mart100)
