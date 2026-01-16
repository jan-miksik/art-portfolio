# Art Portfolio Website

This is a Nuxt 3 Vue.js portfolio website with Web3 integration, drag-and-drop functionality, and Contentful CMS for management of images. The website lives on [https://janmiksik.ooo/](https://janmiksik.ooo/)

### Preview
<img width="1917" height="1031" alt="Screenshot 2025-11-14 at 9 15 51" src="https://github.com/user-attachments/assets/5a8c2158-83e7-4e7e-b05a-34c454c90bae" />

## Features

- **Interactive Art Gallery**: Pinch-to-zoom and drag-and-drop interface for exploring artwork
- **Web3 Integration**: Wallet connection, NFT collection viewing, and minting of new NFTs
- **Contentful CMS**: Secure server-side API routes for managing artwork (upload, update, publish, delete)
- **Admin Panel**: Full CRUD operations for managing art pieces
- **Responsive Design**: Optimized for desktop and mobile devices
- **Image Caching**: IndexedDB caching for improved performance

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

