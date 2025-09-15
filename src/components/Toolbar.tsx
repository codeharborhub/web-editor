import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  Save, 
  FolderOpen, 
  Settings, 
  Sun, 
  Moon, 
  Search,
  Palette,
  Github,
  Download,
  Upload
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { GitHubGistIntegration } from './GitHubGistIntegration';
import { FileNode } from '../types';

interface ToolbarProps {
  onSave: () => void;
  onToggleExplorer: () => void;
  onToggleSettings: () => void;
  onToggleRun: () => void;
  onExportWorkspace: () => void;
  onImportWorkspace: (files: FileNode[]) => void;
  isRunning: boolean;
  files: FileNode[];
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onSave,
  onToggleExplorer,
  onToggleSettings,
  onToggleRun,
  onExportWorkspace,
  onImportWorkspace,
  isRunning,
  files
}) => {
  const { theme, toggleTheme, themeClasses } = useTheme();
  const [showGistModal, setShowGistModal] = useState(false);

  const ToolbarButton = ({ 
    icon: Icon, 
    onClick, 
    title, 
    active = false,
    variant = 'default'
  }: {
    icon: React.ElementType;
    onClick: () => void;
    title: string;
    active?: boolean;
    variant?: 'default' | 'success' | 'danger';
  }) => {
    const baseClasses = `p-2 rounded transition-colors`;
    const variantClasses = {
      default: active ? themeClasses.bgTertiary : `hover:${themeClasses.bgTertiary}`,
      success: 'text-green-400 hover:bg-green-400/10',
      danger: 'text-red-400 hover:bg-red-400/10'
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]}`}
        title={title}
      >
        <Icon size={16} />
      </button>
    );
  };

  return (
    <>
      <div className={`${themeClasses.bgSecondary} ${themeClasses.border} border-b px-4 py-2 flex items-center justify-between`}>
        <div className="flex items-center space-x-1">
          <div className="flex items-center space-x-2 mr-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="font-semibold text-sm">CodeHarborHub</span>
          </div>

          <ToolbarButton
            icon={FolderOpen}
            onClick={onToggleExplorer}
            title="Toggle File Explorer (Cmd/Ctrl+B)"
          />

          <div className="w-px h-6 bg-gray-600 mx-2"></div>

          <ToolbarButton
            icon={isRunning ? Square : Play}
            onClick={onToggleRun}
            title={isRunning ? 'Stop Preview' : 'Start Preview'}
            variant={isRunning ? 'danger' : 'success'}
          />

          <ToolbarButton
            icon={Save}
            onClick={onSave}
            title="Save Current File (Cmd/Ctrl+S)"
          />
        </div>

        <div className="flex items-center space-x-1">
          <ToolbarButton
            icon={Github}
            onClick={() => setShowGistModal(true)}
            title="GitHub Gist Integration"
          />

          <ToolbarButton
            icon={Download}
            onClick={onExportWorkspace}
            title="Export Workspace as ZIP"
          />

          <div className="w-px h-6 bg-gray-600 mx-2"></div>

          <ToolbarButton
            icon={theme === 'dark' ? Sun : Moon}
            onClick={toggleTheme}
            title="Toggle Theme"
          />

          <ToolbarButton
            icon={Settings}
            onClick={onToggleSettings}
            title="Settings"
          />
        </div>
      </div>

      <GitHubGistIntegration
        isOpen={showGistModal}
        onClose={() => setShowGistModal(false)}
        files={files}
        onLoadFiles={onImportWorkspace}
      />
    </>
  );
};