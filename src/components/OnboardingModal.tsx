import React from 'react';
import { X, Code2, Palette, Save, Play, Settings } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { themeClasses } = useTheme();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`${themeClasses.bg} ${themeClasses.text} ${themeClasses.border} border rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto`}>
        <div className={`${themeClasses.bgSecondary} px-6 py-4 border-b ${themeClasses.border} flex items-center justify-between`}>
          <h2 className="text-xl font-semibold">Welcome to CodeHarborHub Editor</h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded ${themeClasses.accentHover} transition-colors`}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className={`${themeClasses.textSecondary} mb-6 text-lg`}>
            A lightweight, browser-based code editor with Monaco (VS Code engine), dark & light themes, 
            and workspace persistence. Save to GitHub Gist, run front-end previews, and format code with Prettier.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className={`${themeClasses.bgTertiary} p-4 rounded-lg`}>
              <div className="flex items-center mb-2">
                <Code2 size={20} className="mr-2 text-blue-400" />
                <h3 className="font-semibold">Monaco Editor</h3>
              </div>
              <p className={`${themeClasses.textMuted} text-sm`}>
                Full VS Code editing experience with IntelliSense, syntax highlighting, and multi-language support.
              </p>
            </div>
            
            <div className={`${themeClasses.bgTertiary} p-4 rounded-lg`}>
              <div className="flex items-center mb-2">
                <Palette size={20} className="mr-2 text-purple-400" />
                <h3 className="font-semibold">Themes & Settings</h3>
              </div>
              <p className={`${themeClasses.textMuted} text-sm`}>
                Dark/light themes, customizable editor settings, and persistent preferences.
              </p>
            </div>
            
            <div className={`${themeClasses.bgTertiary} p-4 rounded-lg`}>
              <div className="flex items-center mb-2">
                <Save size={20} className="mr-2 text-green-400" />
                <h3 className="font-semibold">GitHub Gist Integration</h3>
              </div>
              <p className={`${themeClasses.textMuted} text-sm`}>
                Save and share your code with GitHub Gist integration and workspace export.
              </p>
            </div>
            
            <div className={`${themeClasses.bgTertiary} p-4 rounded-lg`}>
              <div className="flex items-center mb-2">
                <Play size={20} className="mr-2 text-orange-400" />
                <h3 className="font-semibold">Live Preview</h3>
              </div>
              <p className={`${themeClasses.textMuted} text-sm`}>
                Real-time preview for HTML/CSS/JS projects with console output and error handling.
              </p>
            </div>
          </div>
          
          <div className={`${themeClasses.bgSecondary} p-4 rounded-lg mb-6`}>
            <h3 className="font-semibold mb-2 flex items-center">
              <Settings size={16} className="mr-2" />
              Quick Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div><code className="bg-gray-600 px-1 rounded">Ctrl/Cmd + S</code> - Save file</div>
              <div><code className="bg-gray-600 px-1 rounded">Ctrl/Cmd + B</code> - Toggle file explorer</div>
              <div><code className="bg-gray-600 px-1 rounded">Ctrl/Cmd + P</code> - Quick file search</div>
              <div><code className="bg-gray-600 px-1 rounded">Ctrl/Cmd + Shift + F</code> - Format code</div>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={onClose}
              className={`${themeClasses.accent} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity`}
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};