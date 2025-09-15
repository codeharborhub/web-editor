import React, { useState, useEffect, useCallback } from 'react';
import { PanelLeftClose, PanelLeftOpen, Terminal } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { FileExplorer } from './FileExplorer';
import { EditorTabs } from './EditorTabs';
import { MonacoEditorWrapper } from './MonacoEditorWrapper';
import { PreviewPanel } from './PreviewPanel';
import { TerminalPanel } from './TerminalPanel';
import { SettingsPanel } from './SettingsPanel';
import { Toolbar } from './Toolbar';
import { OnboardingModal } from './OnboardingModal';
import { 
  FileNode, 
  Tab, 
  WorkspaceState, 
  EditorSettings,
  PanelType 
} from '../types';
import { 
  saveWorkspace, 
  loadWorkspace, 
  createSampleProject,
  exportWorkspaceAsZip,
  defaultSettings
} from '../lib/workspacePersistence';
import { 
  createFileNode, 
  generateId, 
  findNodeById, 
  deleteNode, 
  addNode, 
  updateNodeContent, 
  getLanguageFromExtension,
  getNodePath
} from '../lib/fileSystem';

interface ConsoleMessage {
  id: string;
  level: 'log' | 'error' | 'warn';
  args: string[];
  timestamp: Date;
}

export const EditorShell: React.FC = () => {
  const { themeClasses } = useTheme();
  
  // Core state
  const [files, setFiles] = useState<FileNode[]>([]);
  const [openTabs, setOpenTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings);
  
  // UI state
  const [showExplorer, setShowExplorer] = useState(true);
  const [showTerminal, setShowTerminal] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>('preview');
  const [isRunning, setIsRunning] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Console state
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);

  // Load workspace on mount
  useEffect(() => {
    const saved = loadWorkspace();
    if (saved) {
      setFiles(saved.files);
      setOpenTabs(saved.openTabs);
      setActiveTabId(saved.activeTabId);
      setSettings(saved.settings);
    } else {
      // First time user - show sample project and onboarding
      const sampleFiles = createSampleProject();
      setFiles(sampleFiles);
      setShowOnboarding(true);
      
      // Open the HTML file by default
      const htmlFile = sampleFiles.find(f => f.name === 'index.html');
      if (htmlFile) {
        handleFileClick(htmlFile);
      }
    }
  }, []);

  // Auto-save workspace
  useEffect(() => {
    const workspace: WorkspaceState = {
      files,
      openTabs,
      activeTabId,
      settings
    };
    saveWorkspace(workspace);
  }, [files, openTabs, activeTabId, settings]);

  // File operations
  const handleFileClick = (file: FileNode) => {
    if (file.type === 'folder') return;

    // Check if already open
    const existingTab = openTabs.find(tab => tab.id === file.id);
    if (existingTab) {
      setActiveTabId(file.id);
      return;
    }

    // Create new tab
    const newTab: Tab = {
      id: file.id,
      name: file.name,
      content: file.content || '',
      language: getLanguageFromExtension(file.name),
      isUnsaved: file.isUnsaved || false,
      filePath: getNodePath(files, file.id) || file.name
    };

    setOpenTabs(prev => [...prev, newTab]);
    setActiveTabId(file.id);
  };

  const handleTabClose = (tabId: string) => {
    const tab = openTabs.find(t => t.id === tabId);
    if (tab?.isUnsaved) {
      if (!confirm('File has unsaved changes. Close anyway?')) {
        return;
      }
    }

    setOpenTabs(prev => prev.filter(tab => tab.id !== tabId));
    
    if (activeTabId === tabId) {
      const remainingTabs = openTabs.filter(tab => tab.id !== tabId);
      setActiveTabId(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : null);
    }
  };

  const handleEditorChange = useCallback((value: string) => {
    if (!activeTabId) return;

    // Update tab
    setOpenTabs(prev => prev.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, content: value, isUnsaved: true }
        : tab
    ));

    // Update file
    setFiles(prev => updateNodeContent(prev, activeTabId, value));
  }, [activeTabId]);

  const handleSave = useCallback(() => {
    if (!activeTabId) return;

    setOpenTabs(prev => prev.map(tab =>
      tab.id === activeTabId
        ? { ...tab, isUnsaved: false }
        : tab
    ));

    setFiles(prev => prev.map(function updateNode(node): FileNode {
      if (node.id === activeTabId) {
        return { ...node, isUnsaved: false };
      }
      if (node.children) {
        return { ...node, children: node.children.map(updateNode) };
      }
      return node;
    }));
  }, [activeTabId]);

  // File management
  const handleCreateFile = (parentId: string | null, name: string) => {
    const newFile = createFileNode(name, 'file', '// New file\n');
    setFiles(prev => addNode(prev, parentId, newFile));
  };

  const handleCreateFolder = (parentId: string | null, name: string) => {
    const newFolder = createFileNode(name, 'folder');
    setFiles(prev => addNode(prev, parentId, newFolder));
  };

  const handleDeleteNode = (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    // Close any open tabs for deleted files
    const findAllFileIds = (nodes: FileNode[]): string[] => {
      let ids: string[] = [];
      for (const node of nodes) {
        if (node.id === id) {
          if (node.type === 'file') {
            ids.push(node.id);
          } else if (node.children) {
            ids = ids.concat(findAllFileIds(node.children));
          }
        } else if (node.children) {
          ids = ids.concat(findAllFileIds(node.children));
        }
      }
      return ids;
    };

    const idsToClose = findAllFileIds(files);
    setOpenTabs(prev => prev.filter(tab => !idsToClose.includes(tab.id)));
    
    if (activeTabId && idsToClose.includes(activeTabId)) {
      const remainingTabs = openTabs.filter(tab => !idsToClose.includes(tab.id));
      setActiveTabId(remainingTabs.length > 0 ? remainingTabs[0].id : null);
    }

    setFiles(prev => deleteNode(prev, id));
  };

  const handleRenameNode = (id: string, newName: string) => {
    setFiles(prev => prev.map(function renameNode(node): FileNode {
      if (node.id === id) {
        return { ...node, name: newName };
      }
      if (node.children) {
        return { ...node, children: node.children.map(renameNode) };
      }
      return node;
    }));

    // Update tab name if open
    setOpenTabs(prev => prev.map(tab =>
      tab.id === id ? { ...tab, name: newName } : tab
    ));
  };

  // Export/Import
  const handleExportWorkspace = async () => {
    try {
      const blob = await exportWorkspaceAsZip(files);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'codeharbor-workspace.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export workspace');
    }
  };

  const handleImportWorkspace = (newFiles: FileNode[]) => {
    if (files.length > 0 && !confirm('This will replace your current workspace. Continue?')) {
      return;
    }
    
    setFiles(newFiles);
    setOpenTabs([]);
    setActiveTabId(null);
  };

  // Preview and console
  const handleToggleRun = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      setActivePanel('preview');
    }
  };

  const handleConsoleMessage = (message: { level: string; args: string[] }) => {
    const newMessage: ConsoleMessage = {
      id: generateId(),
      level: message.level as 'log' | 'error' | 'warn',
      args: message.args,
      timestamp: new Date()
    };
    
    setConsoleMessages(prev => [...prev, newMessage]);
    
    // Auto-show terminal for errors
    if (message.level === 'error') {
      setShowTerminal(true);
      setActivePanel('terminal');
    }
  };

  const handleClearConsole = () => {
    setConsoleMessages([]);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey)) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'b':
            e.preventDefault();
            setShowExplorer(!showExplorer);
            break;
          case 'j':
            if (e.shiftKey) {
              e.preventDefault();
              setShowTerminal(!showTerminal);
              setActivePanel('terminal');
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, showExplorer, showTerminal]);

  const activeTab = openTabs.find(tab => tab.id === activeTabId);
  const showRightPanel = activePanel === 'preview' || activePanel === 'settings';

  return (
    <div className={`${themeClasses.bg} ${themeClasses.text} h-screen flex flex-col`}>
      <Toolbar
        onSave={handleSave}
        onToggleExplorer={() => setShowExplorer(!showExplorer)}
        onToggleSettings={() => {
          setActivePanel(activePanel === 'settings' ? 'preview' : 'settings');
        }}
        onToggleRun={handleToggleRun}
        onExportWorkspace={handleExportWorkspace}
        onImportWorkspace={handleImportWorkspace}
        isRunning={isRunning}
        files={files}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - File Explorer */}
        {showExplorer && (
          <div className="w-64 flex-shrink-0">
            <FileExplorer
              files={files}
              onFileClick={handleFileClick}
              onCreateFile={handleCreateFile}
              onCreateFolder={handleCreateFolder}
              onDeleteNode={handleDeleteNode}
              onRenameNode={handleRenameNode}
              onExportWorkspace={handleExportWorkspace}
              activeFileId={activeTabId}
            />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <EditorTabs
            tabs={openTabs}
            activeTabId={activeTabId}
            onTabClick={setActiveTabId}
            onTabClose={handleTabClose}
          />

          <div className="flex flex-1">
            {/* Editor */}
            <div className={`flex-1 ${showRightPanel ? 'border-r border-gray-600' : ''}`}>
              {activeTab ? (
                <MonacoEditorWrapper
                  value={activeTab.content}
                  language={activeTab.language}
                  onChange={handleEditorChange}
                  onSave={handleSave}
                  fontSize={settings.fontSize}
                  tabSize={settings.tabSize}
                  wordWrap={settings.wordWrap}
                  minimap={settings.minimap}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className={`text-center ${themeClasses.textMuted}`}>
                    <div className="text-4xl mb-4">📝</div>
                    <p className="text-lg font-medium mb-2">Welcome to CodeHarborHub</p>
                    <p className="text-sm">Select a file from the explorer to start editing</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel */}
            {showRightPanel && (
              <div className="w-96 flex-shrink-0">
                {activePanel === 'preview' ? (
                  <PreviewPanel
                    files={files}
                    isRunning={isRunning}
                    onToggleRun={handleToggleRun}
                    onConsoleMessage={handleConsoleMessage}
                  />
                ) : (
                  <SettingsPanel
                    settings={settings}
                    onSettingsChange={setSettings}
                  />
                )}
              </div>
            )}
          </div>

          {/* Bottom Panel - Terminal */}
          {showTerminal && (
            <div className="h-64 border-t border-gray-600">
              <TerminalPanel
                messages={consoleMessages}
                onClear={handleClearConsole}
              />
            </div>
          )}
        </div>
      </div>

      {/* Toggle buttons for collapsed panels */}
      {!showExplorer && (
        <button
          onClick={() => setShowExplorer(true)}
          className={`fixed left-2 top-1/2 transform -translate-y-1/2 ${themeClasses.bgSecondary} ${themeClasses.border} border p-2 rounded shadow-lg hover:${themeClasses.bgTertiary}`}
        >
          <PanelLeftOpen size={16} />
        </button>
      )}

      {!showTerminal && (
        <button
          onClick={() => {
            setShowTerminal(true);
            setActivePanel('terminal');
          }}
          className={`fixed left-4 bottom-4 ${themeClasses.bgSecondary} ${themeClasses.border} border p-2 rounded shadow-lg hover:${themeClasses.bgTertiary}`}
        >
          <Terminal size={16} />
        </button>
      )}

      <OnboardingModal 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </div>
  );
};