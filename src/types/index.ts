export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
  isUnsaved?: boolean;
}

export interface Tab {
  id: string;
  name: string;
  content: string;
  language: string;
  isUnsaved: boolean;
  filePath: string;
}

export interface WorkspaceState {
  files: FileNode[];
  openTabs: Tab[];
  activeTabId: string | null;
  settings: EditorSettings;
}

export interface EditorSettings {
  theme: 'dark' | 'light';
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  autoSave: boolean;
  formatOnSave: boolean;
}

export interface GitHubGist {
  id: string;
  description: string;
  files: { [filename: string]: { content: string } };
  created_at: string;
  updated_at: string;
}

export type PanelType = 'explorer' | 'settings' | 'preview' | 'terminal';