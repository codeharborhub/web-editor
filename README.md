# CodeHarborHub - Web Code Editor

A production-ready, browser-based code editor built with React, TypeScript, and Monaco Editor. Features a VS Code-like interface with multi-language support, real-time preview, GitHub Gist integration, and modern development tools.

![CodeHarborHub Screenshot](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop)

## ✨ Features

### Core Functionality
- **Monaco Editor Integration** - Full VS Code editing experience with IntelliSense
- **Multi-language Support** - JavaScript, TypeScript, HTML, CSS, Python, Go, Rust, Java, and more
- **File Management** - Create, rename, delete files and folders with drag-and-drop
- **Tabbed Interface** - Open multiple files with unsaved indicators
- **Live Preview** - Real-time HTML/CSS/JS preview with console output
- **Terminal Integration** - Built-in terminal with xterm.js for logs and output

### Productivity Features
- **Dark/Light Themes** - Beautiful themes with Monaco editor synchronization  
- **GitHub Gist Integration** - Save and load workspaces to/from GitHub Gists
- **Workspace Persistence** - Auto-save to localStorage with export/import
- **Code Formatting** - Prettier integration with format-on-save
- **Keyboard Shortcuts** - Full keyboard navigation and VS Code-style shortcuts
- **Settings Panel** - Customizable editor preferences and behavior

### Modern Architecture
- **React + TypeScript** - Type-safe, component-based architecture
- **Vite** - Lightning-fast development and optimized builds
- **Tailwind CSS** - Utility-first styling with consistent design system
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern browser with ES2020 support

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/web-editor.git
cd web-editor

# Install dependencies
npm install

# Start development server
npm run dev
```

The editor will open at `http://localhost:5173`

## 📖 Usage Guide

### Basic Operations

**File Management:**
- Create files: Click the "+" button in the explorer
- Create folders: Click the folder icon in the explorer  
- Rename: Right-click file/folder → Rename
- Delete: Right-click file/folder → Delete

**Editing:**
- Open files by clicking in the explorer
- Multiple tabs support with unsaved indicators (•)
- Auto-completion and syntax highlighting
- Format code: `Ctrl/Cmd + Shift + F`

**Preview:**
- Click the play button to start live preview
- HTML/CSS/JS files are automatically combined
- Console output appears in the terminal panel
- Supports responsive preview and external links

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save current file |
| `Ctrl/Cmd + B` | Toggle file explorer |
| `Ctrl/Cmd + Shift + J` | Toggle terminal |
| `Ctrl/Cmd + P` | Quick file search (Monaco) |
| `Ctrl/Cmd + Shift + F` | Format code |
| `Ctrl/Cmd + /` | Toggle line comment |
| `Alt + Click` | Multi-cursor |

### GitHub Gist Integration

1. **Setup:**
   - Go to [GitHub Settings → Personal Access Tokens](https://github.com/settings/tokens)
   - Generate token with `gist` scope
   - Enter token in the GitHub Gist modal

2. **Save Workspace:**
   - Click GitHub icon in toolbar
   - Enter description and set visibility
   - Click "Save to Gist"

3. **Load Workspace:**
   - Get Gist ID from URL (e.g., `abc123def456`)
   - Enter ID in "Load from Gist" field
   - Click "Load"

## 🏗️ Architecture

### Project Structure
```
src/
├── components/           # React components
│   ├── EditorShell.tsx   # Main layout container
│   ├── FileExplorer.tsx  # File tree navigation
│   ├── MonacoEditor*.tsx # Editor integration
│   ├── PreviewPanel.tsx  # Live preview iframe
│   ├── TerminalPanel.tsx # Console/terminal
│   └── ...
├── lib/                 # Core utilities
│   ├── fileSystem.ts    # File operations
│   ├── gistApi.ts       # GitHub API client
│   ├── workspacePersistence.ts # localStorage
│   └── ...
├── types/               # TypeScript definitions
├── hooks/               # Custom React hooks
└── styles/              # Tailwind CSS
```

### Key Technologies

- **Monaco Editor** - VS Code's editor engine
- **xterm.js** - Terminal emulation  
- **Prettier** - Code formatting
- **JSZip** - Workspace export/import
- **GitHub API** - Gist integration

### State Management

Uses React hooks and context for state management:
- `EditorShell` - Main application state
- `ThemeProvider` - Theme context  
- `useLocalStorage` - Persistent preferences

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Build and deploy
npm run build
vercel --prod
```

### Netlify

```bash
# Build project
npm run build

# Deploy dist/ folder to Netlify
# Or connect GitHub repo for automatic deployments
```

### GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "gh-pages -d dist"

# Build and deploy
npm run build
npm run deploy
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]
```

## ⚙️ Configuration

### Environment Variables

```env
VITE_GITHUB_CLIENT_ID=your_github_client_id
VITE_APP_VERSION=1.0.0
```

### Customization

**Themes:** Modify `src/lib/themeManager.ts`
**Languages:** Add language definitions in `src/lib/fileSystem.ts`
**Shortcuts:** Update keyboard handlers in `src/components/EditorShell.tsx`

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

### Adding Languages

1. Add language to `getLanguageFromExtension()` in `fileSystem.ts`
2. Ensure Monaco supports the language (most are built-in)
3. For custom languages, register with Monaco editor

### Extending Features

- **Language Servers:** Implement `monaco-languageclient` integration
- **Extensions:** Create plugin system in `src/lib/extensions.ts`  
- **Collaboration:** Add real-time sync with WebSockets
- **AI Integration:** Connect to code completion APIs

## 🔐 Security

### Content Security Policy
- Sandboxed iframe for preview execution
- Sanitized HTML/CSS/JS content
- No arbitrary code execution on main thread

### GitHub Integration
- Tokens stored in localStorage (encrypt in production)
- Scoped permissions (gist access only)
- No server-side token storage

## 🐛 Known Limitations

1. **Language Servers:** Limited to Monaco's built-in IntelliSense
2. **File System:** Browser localStorage has size limits (~5-10MB)
3. **Preview:** Only supports front-end technologies
4. **Collaboration:** No real-time collaboration features
5. **Extensions:** No VS Code extension compatibility

## 🛣️ Roadmap

### Short Term
- [ ] Vim/Emacs key bindings
- [ ] Split editor views
- [ ] Advanced search and replace
- [ ] Project templates

### Medium Term  
- [ ] Language server protocol integration
- [ ] Real-time collaboration
- [ ] Plugin system architecture
- [ ] Git integration

### Long Term
- [ ] Container-based code execution
- [ ] AI-powered code completion
- [ ] Advanced debugging tools
- [ ] Team workspaces

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup
```bash
git clone https://github.com/your-username/web-editor.git
cd codeharbor-web-editor
npm install
npm run dev
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- **Monaco Editor** - Microsoft's excellent web editor
- **Tailwind CSS** - For the beautiful, utility-first styling
- **React Team** - For the amazing framework
- **Vite** - For the lightning-fast build tool

## 📞 Support

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/your-username/web-editor/issues)
- 💡 **Feature Requests:** [GitHub Discussions](https://github.com/your-username/web-editor/discussions)
- 📧 **Email:** support@codeharbor.dev
- 💬 **Discord:** [CodeHarborHub Community](#)

---

**Built with ❤️ by the CodeHarborHub team**
