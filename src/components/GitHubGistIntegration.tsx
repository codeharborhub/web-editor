import React, { useState } from 'react';
import { Github, Save, Upload, Download, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { GitHubGistAPI } from '../lib/gistApi';
import { FileNode } from '../types';

interface GitHubGistIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileNode[];
  onLoadFiles: (files: FileNode[]) => void;
}

export const GitHubGistIntegration: React.FC<GitHubGistIntegrationProps> = ({
  isOpen,
  onClose,
  files,
  onLoadFiles
}) => {
  const { themeClasses } = useTheme();
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [gistDescription, setGistDescription] = useState('CodeHarborHub Workspace');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [gistUrl, setGistUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveToGist = async () => {
    if (!token.trim()) {
      setError('GitHub token is required');
      return;
    }

    if (files.length === 0) {
      setError('No files to save');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const gistApi = new GitHubGistAPI(token.trim());
      const result = await gistApi.createGist(files, gistDescription, isPublic);
      
      setGistUrl(result.html_url);
      setSuccess(`Gist created successfully! ID: ${result.id}`);
      
      // Store token for future use (you might want to encrypt this)
      localStorage.setItem('github-token', token.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create gist');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadFromGist = async (gistId: string) => {
    if (!token.trim()) {
      setError('GitHub token is required');
      return;
    }

    if (!gistId.trim()) {
      setError('Gist ID is required');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const gistApi = new GitHubGistAPI(token.trim());
      const gist = await gistApi.getGist(gistId.trim());
      const fileNodes = gistApi.gistToFileNodes(gist);
      
      onLoadFiles(fileNodes);
      setSuccess(`Loaded gist: ${gist.description || 'Untitled'}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gist');
    } finally {
      setLoading(false);
    }
  };

  // Load saved token on mount
  React.useEffect(() => {
    const savedToken = localStorage.getItem('github-token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`${themeClasses.bg} ${themeClasses.text} ${themeClasses.border} border rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-auto`}>
        <div className={`${themeClasses.bgSecondary} px-4 py-3 border-b ${themeClasses.border} flex items-center justify-between`}>
          <div className="flex items-center">
            <Github size={20} className="mr-2" />
            <h3 className="font-semibold">GitHub Gist Integration</h3>
          </div>
          <button 
            onClick={onClose}
            className={`p-1 rounded hover:${themeClasses.bgTertiary}`}
          >
            ×
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Token Input */}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.textSecondary} mb-2`}>
              GitHub Personal Access Token
            </label>
            <div className="relative">
              <input
                type={showToken ? 'text' : 'password'}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className={`${themeClasses.bgSecondary} ${themeClasses.border} border rounded w-full px-3 py-2 text-sm pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className={`absolute right-2 top-2 ${themeClasses.textMuted} hover:${themeClasses.text}`}
              >
                {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className={`text-xs ${themeClasses.textMuted} mt-1`}>
              Create a token at{' '}
              <a 
                href="https://github.com/settings/tokens" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                GitHub Settings
              </a>
              {' '}with 'gist\' scope
            </p>
          </div>

          {/* Save to Gist */}
          <div className={`${themeClasses.bgTertiary} p-3 rounded`}>
            <h4 className="font-medium mb-2 flex items-center">
              <Save size={16} className="mr-2" />
              Save Workspace to Gist
            </h4>
            
            <div className="space-y-2">
              <input
                type="text"
                value={gistDescription}
                onChange={(e) => setGistDescription(e.target.value)}
                placeholder="Gist description"
                className={`${themeClasses.bgSecondary} ${themeClasses.border} border rounded w-full px-3 py-2 text-sm`}
              />
              
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="mr-2"
                />
                Make public (anyone can see this gist)
              </label>
              
              <button
                onClick={handleSaveToGist}
                disabled={loading || !token.trim() || files.length === 0}
                className={`w-full py-2 px-4 rounded text-sm font-medium ${themeClasses.accent} text-white hover:opacity-90 disabled:opacity-50`}
              >
                {loading ? 'Saving...' : 'Save to Gist'}
              </button>
            </div>
          </div>

          {/* Load from Gist */}
          <div className={`${themeClasses.bgTertiary} p-3 rounded`}>
            <h4 className="font-medium mb-2 flex items-center">
              <Download size={16} className="mr-2" />
              Load Workspace from Gist
            </h4>
            
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Gist ID (e.g., abc123def456)"
                className={`${themeClasses.bgSecondary} ${themeClasses.border} border rounded flex-1 px-3 py-2 text-sm`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLoadFromGist((e.target as HTMLInputElement).value);
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = (e.target as HTMLElement).parentElement?.querySelector('input') as HTMLInputElement;
                  handleLoadFromGist(input?.value || '');
                }}
                disabled={loading || !token.trim()}
                className={`py-2 px-4 rounded text-sm font-medium ${themeClasses.accent} text-white hover:opacity-90 disabled:opacity-50`}
              >
                Load
              </button>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="flex items-center text-red-400 text-sm">
              <AlertCircle size={16} className="mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="flex items-center text-green-400 text-sm">
              <Check size={16} className="mr-2" />
              {success}
            </div>
          )}

          {gistUrl && (
            <div className={`${themeClasses.bgSecondary} p-3 rounded`}>
              <p className="text-sm font-medium mb-2">Gist URL:</p>
              <a 
                href={gistUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline text-sm break-all"
              >
                {gistUrl}
              </a>
            </div>
          )}

          {/* Instructions */}
          <div className={`${themeClasses.bgSecondary} p-3 rounded text-xs ${themeClasses.textMuted}`}>
            <h5 className="font-medium mb-1">Setup Instructions:</h5>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to GitHub Settings → Developer settings → Personal access tokens</li>
              <li>Generate a new token with 'gist' scope</li>
              <li>Copy the token and paste it above</li>
              <li>Use "Save to Gist" to backup your workspace</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};