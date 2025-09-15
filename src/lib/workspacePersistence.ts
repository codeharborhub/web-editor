import JSZip from 'jszip';
import { WorkspaceState, FileNode } from '../types';

const WORKSPACE_KEY = 'codeharbor-workspace';
const SETTINGS_KEY = 'codeharbor-settings';

export const defaultSettings = {
  theme: 'dark' as const,
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  minimap: true,
  autoSave: true,
  formatOnSave: true
};

export const saveWorkspace = (workspace: WorkspaceState): void => {
  try {
    localStorage.setItem(WORKSPACE_KEY, JSON.stringify(workspace));
  } catch (error) {
    console.error('Failed to save workspace:', error);
  }
};

export const loadWorkspace = (): WorkspaceState | null => {
  try {
    const stored = localStorage.getItem(WORKSPACE_KEY);
    if (stored) {
      const workspace = JSON.parse(stored);
      return {
        ...workspace,
        settings: { ...defaultSettings, ...workspace.settings }
      };
    }
  } catch (error) {
    console.error('Failed to load workspace:', error);
  }
  return null;
};

export const saveSettings = (settings: WorkspaceState['settings']): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const loadSettings = (): WorkspaceState['settings'] => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return defaultSettings;
};

export const exportWorkspaceAsZip = async (files: FileNode[]): Promise<Blob> => {
  const zip = new JSZip();
  
  const addFilesToZip = (nodes: FileNode[], folder: JSZip | null = null) => {
    for (const node of nodes) {
      if (node.type === 'file' && node.content !== undefined) {
        if (folder) {
          folder.file(node.name, node.content);
        } else {
          zip.file(node.name, node.content);
        }
      } else if (node.type === 'folder' && node.children) {
        const newFolder = folder ? folder.folder(node.name) : zip.folder(node.name);
        if (newFolder) {
          addFilesToZip(node.children, newFolder);
        }
      }
    }
  };
  
  addFilesToZip(files);
  return await zip.generateAsync({ type: 'blob' });
};

export const createSampleProject = (): FileNode[] => [
  {
    id: 'sample-html',
    name: 'index.html',
    type: 'file',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeHarborHub Sample Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to CodeHarborHub!</h1>
        <p>This is a sample HTML project to get you started.</p>
        <button onclick="greet()">Click me!</button>
        <div id="output"></div>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
    isUnsaved: false
  },
  {
    id: 'sample-css',
    name: 'styles.css',
    type: 'file',
    content: `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    animation: fadeInUp 0.8s ease;
}

p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    opacity: 0.9;
}

button {
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 50px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    background: #ff5252;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
}

#output {
    margin-top: 2rem;
    font-size: 1.3rem;
    font-weight: bold;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}`,
    isUnsaved: false
  },
  {
    id: 'sample-js',
    name: 'script.js',
    type: 'file',
    content: `function greet() {
    const output = document.getElementById('output');
    const messages = [
        '🎉 Hello from CodeHarborHub!',
        '✨ You clicked the button!',
        '🚀 Ready to code something amazing?',
        '💡 Try editing the files and see the changes!',
        '🎨 Customize the styles in styles.css'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    output.innerHTML = randomMessage;
    
    // Add some fun animation
    output.style.animation = 'none';
    setTimeout(() => {
        output.style.animation = 'fadeInUp 0.5s ease';
    }, 10);
}

// Welcome message
console.log('🌟 Welcome to CodeHarborHub Web Editor!');
console.log('📝 Start editing files to see your changes live');
console.log('🎯 Use Ctrl/Cmd + S to save, Ctrl/Cmd + B to toggle file explorer');

// Sample interactive feature
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM loaded successfully!');
});`,
    isUnsaved: false
  },
  {
    id: 'sample-readme',
    name: 'README.md',
    type: 'file',
    content: `# CodeHarborHub Sample Project

Welcome to your first project in CodeHarborHub! 🎉

## What's included

- **index.html** - Main HTML structure
- **styles.css** - Beautiful CSS styling with animations
- **script.js** - Interactive JavaScript functionality

## Try these features

1. **Live Preview** - See your changes in real-time
2. **Code Formatting** - Use Ctrl/Cmd + Shift + F
3. **File Management** - Create, rename, and delete files
4. **Theme Toggle** - Switch between dark and light modes
5. **GitHub Gist** - Save and share your code

## Keyboard Shortcuts

- \`Ctrl/Cmd + S\` - Save file
- \`Ctrl/Cmd + B\` - Toggle file explorer
- \`Ctrl/Cmd + P\` - Quick file search
- \`Ctrl/Cmd + Shift + F\` - Format code

## Getting Started

1. Edit the files and watch the preview update
2. Try changing colors in \`styles.css\`
3. Add new interactive features in \`script.js\`
4. Save your work to a GitHub Gist

Happy coding! 🚀`,
    isUnsaved: false
  }
];