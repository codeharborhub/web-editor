import { FileNode } from '../types';

export const createFileNode = (name: string, type: 'file' | 'folder', content = ''): FileNode => ({
  id: generateId(),
  name,
  type,
  content: type === 'file' ? content : undefined,
  children: type === 'folder' ? [] : undefined,
  isOpen: false,
  isUnsaved: false
});

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const findNodeById = (nodes: FileNode[], id: string): FileNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const findNodeByPath = (nodes: FileNode[], path: string): FileNode | null => {
  const parts = path.split('/').filter(Boolean);
  let current = nodes;
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const node = current.find(n => n.name === part);
    if (!node) return null;
    
    if (i === parts.length - 1) return node;
    if (node.type === 'folder' && node.children) {
      current = node.children;
    } else {
      return null;
    }
  }
  
  return null;
};

export const getNodePath = (nodes: FileNode[], targetId: string, currentPath = ''): string | null => {
  for (const node of nodes) {
    const newPath = currentPath ? `${currentPath}/${node.name}` : node.name;
    
    if (node.id === targetId) {
      return newPath;
    }
    
    if (node.children) {
      const found = getNodePath(node.children, targetId, newPath);
      if (found) return found;
    }
  }
  
  return null;
};

export const deleteNode = (nodes: FileNode[], id: string): FileNode[] => {
  return nodes.filter(node => {
    if (node.id === id) return false;
    if (node.children) {
      node.children = deleteNode(node.children, id);
    }
    return true;
  });
};

export const addNode = (nodes: FileNode[], parentId: string | null, newNode: FileNode): FileNode[] => {
  if (parentId === null) {
    return [...nodes, newNode];
  }
  
  return nodes.map(node => {
    if (node.id === parentId && node.type === 'folder') {
      return {
        ...node,
        children: [...(node.children || []), newNode]
      };
    }
    if (node.children) {
      return {
        ...node,
        children: addNode(node.children, parentId, newNode)
      };
    }
    return node;
  });
};

export const updateNodeContent = (nodes: FileNode[], id: string, content: string): FileNode[] => {
  return nodes.map(node => {
    if (node.id === id) {
      return { ...node, content, isUnsaved: true };
    }
    if (node.children) {
      return {
        ...node,
        children: updateNodeContent(node.children, id, content)
      };
    }
    return node;
  });
};

export const getLanguageFromExtension = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  
  const languageMap: { [key: string]: string } = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    sass: 'sass',
    json: 'json',
    py: 'python',
    go: 'go',
    rs: 'rust',
    c: 'c',
    cpp: 'cpp',
    cc: 'cpp',
    cxx: 'cpp',
    java: 'java',
    md: 'markdown',
    markdown: 'markdown',
    sh: 'shell',
    bash: 'shell',
    zsh: 'shell',
    yml: 'yaml',
    yaml: 'yaml',
    xml: 'xml',
    php: 'php',
    rb: 'ruby',
    swift: 'swift',
    kt: 'kotlin',
    dart: 'dart'
  };
  
  return languageMap[ext || ''] || 'plaintext';
};