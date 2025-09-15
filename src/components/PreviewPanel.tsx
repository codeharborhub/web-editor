import React, { useRef, useEffect, useState } from 'react';
import { Play, Square, RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { createSandboxedPreview } from '../lib/previewSandbox';
import { FileNode } from '../types';

interface PreviewPanelProps {
  files: FileNode[];
  isRunning: boolean;
  onToggleRun: () => void;
  onConsoleMessage: (message: { level: string; args: string[] }) => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  files,
  isRunning,
  onToggleRun,
  onConsoleMessage
}) => {
  const { themeClasses } = useTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isRunning) {
      updatePreview();
    }
  }, [isRunning, files]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'console') {
        onConsoleMessage(event.data);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleMessage]);

  const updatePreview = () => {
    try {
      setError(null);
      
      // Find HTML, CSS, and JS files
      const htmlFile = findFile(files, ['.html', '.htm']) || { content: '<div>No HTML file found</div>' };
      const cssFile = findFile(files, ['.css']) || { content: '' };
      const jsFile = findFile(files, ['.js', '.jsx']) || { content: '' };

      const previewContent = createSandboxedPreview(
        htmlFile.content || '',
        cssFile.content || '',
        jsFile.content || ''
      );

      // Create blob URL for iframe
      const blob = new Blob([previewContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);

      // Cleanup previous URL
      return () => URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Preview generation failed');
    }
  };

  const findFile = (nodes: FileNode[], extensions: string[]): FileNode | null => {
    for (const node of nodes) {
      if (node.type === 'file') {
        const ext = '.' + node.name.split('.').pop()?.toLowerCase();
        if (extensions.includes(ext)) {
          return node;
        }
      }
      if (node.children) {
        const found = findFile(node.children, extensions);
        if (found) return found;
      }
    }
    return null;
  };

  const openInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  return (
    <div className={`${themeClasses.bg} h-full flex flex-col`}>
      <div className={`${themeClasses.bgSecondary} px-3 py-2 ${themeClasses.border} border-b flex items-center justify-between`}>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold">Preview</span>
          {error && <AlertCircle size={16} className="text-red-400" />}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={updatePreview}
            className={`p-1 rounded hover:${themeClasses.bgTertiary}`}
            title="Refresh Preview"
            disabled={!isRunning}
          >
            <RefreshCw size={14} />
          </button>
          <button
            onClick={openInNewTab}
            className={`p-1 rounded hover:${themeClasses.bgTertiary}`}
            title="Open in New Tab"
            disabled={!isRunning || !previewUrl}
          >
            <ExternalLink size={14} />
          </button>
          <button
            onClick={onToggleRun}
            className={`p-1 rounded ${isRunning ? 'text-red-400' : 'text-green-400'} hover:${themeClasses.bgTertiary}`}
            title={isRunning ? 'Stop Preview' : 'Start Preview'}
          >
            {isRunning ? <Square size={14} /> : <Play size={14} />}
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        {error ? (
          <div className="flex items-center justify-center h-full">
            <div className={`text-center ${themeClasses.textMuted}`}>
              <AlertCircle size={32} className="mx-auto mb-2 text-red-400" />
              <p className="text-sm">Preview Error</p>
              <p className="text-xs">{error}</p>
            </div>
          </div>
        ) : !isRunning ? (
          <div className="flex items-center justify-center h-full">
            <div className={`text-center ${themeClasses.textMuted}`}>
              <Play size={32} className="mx-auto mb-2" />
              <p className="text-sm">Click the play button to start preview</p>
              <p className="text-xs">HTML, CSS, and JS files will be combined</p>
            </div>
          </div>
        ) : previewUrl ? (
          <iframe
            ref={iframeRef}
            src={previewUrl}
            className="w-full h-full border-0"
            title="Preview"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className={`text-center ${themeClasses.textMuted}`}>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
              <p className="text-sm">Loading preview...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};