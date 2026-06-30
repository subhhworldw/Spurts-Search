# 🧬 Spurt Search

**Live Demo:** [https://spurt-search.vercel.app/](https://spurt-search.vercel.app/)

> **Unified biological databases search engine (GenBank, UniProt, PDB) with AI-powered summarizations & structured bookmarking.**

Spurt Search is a highly optimized, professional-grade bioinformatician's portal. It integrates live API synchronization across key biological data structures including genomics (**GenBank**), proteomics (**UniProt**), and structural biology (**Protein Data Bank - PDB**). Powered by **Gemini 3.5 Flash**, the system instantly generates scientifically accurate biological annotations, cellular functions, and research significance for any query, alongside a local bookmarks panel and interactive query tracking.

---

## ✨ Features

- **🔍 Unified Bio-Database Queries**: Query across genomic sequences, high-fidelity protein chains, and complex crystallography structures instantly under one interface.
- **🤖 AI-Powered Research Annotations**: Generates professional-grade summaries with **Gemini 3.5 Flash** to identify taxon origins, physiological processes, cellular pathways, and clinical or clinical applications.
- **🟢 Real-Time Feed sync trackers**: Dynamic status visualizers monitoring connection endpoints with animated state changes.
- **📊 Save & Organize Journals**: Full bookmark storage allowing researchers to store structural files (PDB), sequence maps (GenBank), and functional logs (UniProt) alongside active query history.
- **🔑 Dual API Engine**: Seamlessly falls back, with support for server-side `GEMINI_API_KEY` configuration or secure client-side override tokens.
- **💫 Fluid Responsive Dynamics**: Polished transition states built with **Motion**, an Inter / JetBrains Mono typography hierarchy, and a customized high-contrast modern slate palette.

---

## 🛠️ Technology Stack

- **Frontend**: React 19 (SPAs) + Vite 6
- **Backend Service**: Express.js proxying requests & securing API keys
- **AI Integrations**: `@google/genai` (utilizing Gemini 3.5 Flash)
- **Styling**: Tailwind CSS v4 with specialized glassmorphism layout classes
- **Animations**: `motion` layout and micro-interactions
- **Icons**: `lucide-react`
- **Compiler**: TypeScript (type-safe type engines), compiled via `esbuild` and run with `tsx`

---

## 🚀 Setting up Locally

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed on your workstation.

### 2. Copy your own unique Gemini API key (ensure you use your own key)
Get or create your biological annotation API key from [Google AI Studio](https://aistudio.google.com/).

### 3. Install Dependencies
Clone your exported repository and run:
```bash
npm install
```

### 4. Configure Secrets
Create a `.env` file in the root folder of the project:
```env
# .env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 5. Run Development Server
Spurt Search utilizes a unified Express + Vite server architecture. Begin local development with hot reloading via:
```bash
npm run dev
```
Navigate to `http://localhost:3000` inside your browser to start searching!

### 6. Production Build & Execution
Build both Vite assets and bundle the backend TypeScript server into a high-performance single file using:
```bash
npm run build
npm start
```

---

## 📂 Project Architecture

```
├── .env.example              # Template for environment variables and secrets
├── server.ts                 # Fullstack Express API router & static assets middleware
├── src/
│   ├── App.tsx               # Primary interface orchestrator with state machine
│   ├── index.css             # Global @import "tailwindcss" styling sheet & theme tokens
│   ├── main.tsx              # React mounting root
│   ├── types.ts              # Bioinformatic search structures, history maps, & status shapes
│   └── components/           # Self-contained layout modules
│       ├── Header.tsx        # Title bar with system repositories & social profiles
│       ├── SearchBox.tsx     # Fully typed database input filters & action buttons
│       ├── ResultCard.tsx    # Biology info display with AI Summarize prompts
│       ├── SavedPanel.tsx    # Bookmark history & session summaries
│       ├── StatusBadge.tsx   # Real-time state trackers (GenBank, UniProt, PDB, etc.)
│       └── GeminiKeyModal.tsx# Custom overlay managing user API secure tokens
```

---

*This portal has been customized to deliver a pristine research workflow. Export, fork or download straight to your workstation, and begin analyzing genomic structures instantly!*
