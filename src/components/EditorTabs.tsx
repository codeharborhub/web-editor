import React from 'react';
import { X, Circle } from 'lucide-react';
import { Tab } from '../types';
import { useTheme } from '../hooks/useTheme';

interface EditorTabsProps {
  tabs: Tab[];
  activeTabId: string | null;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

export const EditorTabs: React.FC<EditorTabsProps> = ({
  tabs,
  activeTabId,
  onTabClick,
  onTabClose
}) => {
  const { themeClasses } = useTheme();

  return (
    <div className={`${themeClasses.bgSecondary} ${themeClasses.border} border-b flex overflow-x-auto`}>
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`flex items-center px-3 py-2 border-r ${themeClasses.border} cursor-pointer min-w-0 group
            ${tab.id === activeTabId ? 
              `${themeClasses.bg} ${themeClasses.text}` : 
              `${themeClasses.bgSecondary} ${themeClasses.textSecondary} hover:${themeClasses.bgTertiary}`
            }
          `}
          onClick={() => onTabClick(tab.id)}
        >
          <span className="text-sm truncate mr-2 min-w-0">
            {tab.name}
          </span>
          {tab.isUnsaved && (
            <Circle size={8} className="fill-current text-orange-400 mr-1" />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            className={`ml-1 opacity-0 group-hover:opacity-100 hover:${themeClasses.bgTertiary} rounded p-0.5 transition-opacity`}
          >
            <X size={12} />
          </button>
        </div>
      ))}
      
      {tabs.length === 0 && (
        <div className={`flex items-center justify-center flex-1 ${themeClasses.textMuted} text-sm`}>
          Open a file to start editing
        </div>
      )}
    </div>
  );
};