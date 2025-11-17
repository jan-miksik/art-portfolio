# Art Portfolio Website

This is a Nuxt 3 Vue.js portfolio website with Web3 integration, drag-and-drop functionality, and Contentful CMS for management of images. The website lives on [https://janmiksik.ooo/](https://janmiksik.ooo/)

### Preview
<img width="1917" height="1031" alt="Screenshot 2025-11-14 at 9 15 51" src="https://github.com/user-attachments/assets/5a8c2158-83e7-4e7e-b05a-34c454c90bae" />

## Features

- **Interactive Art Gallery**: Pinch-to-zoom and drag-and-drop interface for exploring artwork
- **Web3 Integration**: Wallet connection, NFT collection viewing, and minting of new NFTs
- **Contentful CMS**: Secure server-side API routes for managing artwork (upload, update, publish, delete)
- **Admin Panel**: Full CRUD operations for managing art pieces
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for desktop and mobile devices
- **Image Caching**: IndexedDB caching for improved performance
- **Archive Management**: Toggle visibility of archived pieces

## Tech Stack

### Core
- **Nuxt 3** - Vue.js framework with SSR capabilities
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe development
- **Stylus** - CSS preprocessor

### Web3 & Blockchain
- **Wagmi** - React Hooks for Ethereum
- **Viem** - TypeScript Ethereum library
- **Reown AppKit** (formerly Web3Modal) - Wallet connection UI
- **Optimism Network** - Layer 2 Ethereum scaling solution

### CMS & Data
- **Contentful** - Headless CMS for content management
- **GraphQL** - Contentful Content Delivery API
- **Dexie.js** - IndexedDB wrapper for image caching

### UI & Interactions
- **Interact.js** - Drag and drop, resizing, and multi-touch gestures
- **Vue Pinch Scroll Zoom** - Pinch-to-zoom functionality
- **Swiper** - Touch slider component
- **Three.js** - 3D graphics (for interactive elements)


## Getting Started

### Prerequisites

- **Node.js** (see `.nvmrc` for version)
- **Yarn** 3.6.1+ (package manager)
- **Contentful Account** with:
  - Space ID
  - Content Delivery API token (read-only)
  - Content Management API token (write access)
- **Reown/Web3Modal Project ID** (for wallet connections)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd art-portfolio
```

2. Install dependencies:
```bash
yarn install
```

3. Create `.env` file (copy from `example.env`):
```bash
cp example.env .env
```

4. Configure environment variables (see [Environment Variables](#-environment-variables))

5. Start development server:
```bash
yarn dev
# or
yarn d
```

The app will be available at `http://localhost:3000`
