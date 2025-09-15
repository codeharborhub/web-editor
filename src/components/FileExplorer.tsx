import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, MoreHorizontal, Trash2, Edit3, Download } from 'lucide-react';
import { FileNode } from '../types';
import { useTheme } from '../hooks/useTheme';

interface FileExplorerProps {
  files: FileNode[];
  onFileClick: (file: FileNode) => void;
  onCreateFile: (parentId: string | null, name: string) => void;
  onCreateFolder: (parentId: string | null, name: string) => void;
  onDeleteNode: (id: string) => void;
  onRenameNode: (id: string, newName: string) => void;
  onExportWorkspace: () => void;
  activeFileId: string | null;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  onFileClick,
  onCreateFile,
  onCreateFolder,
  onDeleteNode,
  onRenameNode,
  onExportWorkspace,
  activeFileId
}) => {
  const { themeClasses } = useTheme();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null);
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleRightClick = (e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, nodeId });
  };

  const handleRename = (nodeId: string, currentName: string) => {
    setIsRenaming(nodeId);
    setNewName(currentName);
    setContextMenu(null);
  };

  const confirmRename = () => {
    if (isRenaming && newName.trim()) {
      onRenameNode(isRenaming, newName.trim());
    }
    setIsRenaming(null);
    setNewName('');
  };

  const FileIcon = ({ node }: { node: FileNode }) => {
    if (node.type === 'folder') {
      return expandedFolders.has(node.id) ? 
        <FolderOpen size={16} className="text-blue-400" /> : 
        <Folder size={16} className="text-blue-400" />;
    }
    return <File size={16} className="text-gray-400" />;
  };

  const renderNode = (node: FileNode, depth = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const isActive = node.id === activeFileId;
    
    return (
      <div key={node.id}>
        <div
          className={`flex items-center py-1 px-2 hover:${themeClasses.bgTertiary} cursor-pointer relative group
            ${isActive ? themeClasses.bgTertiary : ''}
          `}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id);
            } else {
              onFileClick(node);
            }
          }}
          onContextMenu={(e) => handleRightClick(e, node.id)}
        >
          {node.type === 'folder' && (
            isExpanded ? 
              <ChevronDown size={14} className="mr-1" /> : 
              <ChevronRight size={14} className="mr-1" />
          )}
          <FileIcon node={node} />
          {isRenaming === node.id ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={confirmRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmRename();
                if (e.key === 'Escape') {
                  setIsRenaming(null);
                  setNewName('');
                }
              }}
              className={`ml-2 bg-transparent border-b ${themeClasses.border} text-sm flex-1 focus:outline-none`}
              autoFocus
            />
          ) : (
            <span className={`ml-2 text-sm ${node.isUnsaved ? 'font-semibold' : ''} ${themeClasses.text}`}>
              {node.name}
              {node.isUnsaved && <span className="text-orange-400 ml-1">•</span>}
            </span>
          )}
        </div>
        
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${themeClasses.bg} ${themeClasses.border} border-r h-full flex flex-col`}>
      <div className={`${themeClasses.bgSecondary} px-3 py-2 ${themeClasses.border} border-b flex items-center justify-between`}>
        <span className="text-sm font-semibold">Explorer</span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onCreateFile(null, 'untitled.js')}
            className={`p-1 rounded hover:${themeClasses.bgTertiary}`}
            title="New File"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={() => onCreateFolder(null, 'new-folder')}
            className={`p-1 rounded hover:${themeClasses.bgTertiary}`}
            title="New Folder"
          >
            <Folder size={14} />
          </button>
          <button
            onClick={onExportWorkspace}
            className={`p-1 rounded hover:${themeClasses.bgTertiary}`}
            title="Export Workspace"
          >
            <Download size={14} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {files.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            No files yet. Create your first file!
          </div>
        ) : (
          files.map(node => renderNode(node))
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className={`fixed z-50 ${themeClasses.bg} ${themeClasses.border} border rounded shadow-lg py-1`}
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <button
            onClick={() => {
              const node = findNodeById(files, contextMenu.nodeId);
              if (node) handleRename(node.id, node.name);
            }}
            className={`w-full text-left px-3 py-1 text-sm hover:${themeClasses.bgSecondary} flex items-center`}
          >
            <Edit3 size={14} className="mr-2" />
            Rename
          </button>
          <button
            onClick={() => {
              onDeleteNode(contextMenu.nodeId);
              setContextMenu(null);
            }}
            className={`w-full text-left px-3 py-1 text-sm hover:${themeClasses.bgSecondary} flex items-center text-red-400`}
          >
            <Trash2 size={14} className="mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

const findNodeById = (nodes: FileNode[], id: string): FileNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
};