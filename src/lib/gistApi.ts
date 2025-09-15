import { FileNode } from '../types';

export interface GistFile {
  filename: string;
  content: string;
}

export interface CreateGistRequest {
  description: string;
  public: boolean;
  files: { [filename: string]: { content: string } };
}

export interface GistResponse {
  id: string;
  html_url: string;
  description: string;
  created_at: string;
  updated_at: string;
  files: { [filename: string]: { content: string; filename: string } };
}

export class GitHubGistAPI {
  private token: string;
  
  constructor(token: string) {
    this.token = token;
  }
  
  async createGist(files: FileNode[], description: string, isPublic = false): Promise<GistResponse> {
    const gistFiles: { [filename: string]: { content: string } } = {};
    
    this.flattenFiles(files, gistFiles);
    
    const response = await fetch('https://api.github.com/gists', {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        public: isPublic,
        files: gistFiles
      })
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async updateGist(gistId: string, files: FileNode[], description?: string): Promise<GistResponse> {
    const gistFiles: { [filename: string]: { content: string } } = {};
    
    this.flattenFiles(files, gistFiles);
    
    const updateData: any = { files: gistFiles };
    if (description) {
      updateData.description = description;
    }
    
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async getGist(gistId: string): Promise<GistResponse> {
    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        'Authorization': `token ${this.token}`,
      }
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async listGists(): Promise<GistResponse[]> {
    const response = await fetch('https://api.github.com/gists', {
      headers: {
        'Authorization': `token ${this.token}`,
      }
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
  
  private flattenFiles(files: FileNode[], gistFiles: { [filename: string]: { content: string } }, prefix = '') {
    for (const file of files) {
      if (file.type === 'file' && file.content !== undefined) {
        const filename = prefix ? `${prefix}/${file.name}` : file.name;
        gistFiles[filename] = { content: file.content };
      } else if (file.type === 'folder' && file.children) {
        const folderPrefix = prefix ? `${prefix}/${file.name}` : file.name;
        this.flattenFiles(file.children, gistFiles, folderPrefix);
      }
    }
  }
  
  gistToFileNodes(gist: GistResponse): FileNode[] {
    const files: FileNode[] = [];
    const folders: { [path: string]: FileNode } = {};
    
    for (const [filename, file] of Object.entries(gist.files)) {
      const parts = filename.split('/');
      const fileName = parts.pop()!;
      
      let currentPath = '';
      let currentLevel = files;
      
      // Create folder structure
      for (const part of parts) {
        const newPath = currentPath ? `${currentPath}/${part}` : part;
        
        if (!folders[newPath]) {
          const folderNode: FileNode = {
            id: `folder-${newPath}`,
            name: part,
            type: 'folder',
            children: [],
            isOpen: true
          };
          
          folders[newPath] = folderNode;
          currentLevel.push(folderNode);
        }
        
        currentLevel = folders[newPath].children!;
        currentPath = newPath;
      }
      
      // Add file
      currentLevel.push({
        id: `file-${filename}`,
        name: fileName,
        type: 'file',
        content: file.content,
        isUnsaved: false
      });
    }
    
    return files;
  }
}