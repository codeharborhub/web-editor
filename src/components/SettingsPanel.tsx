import React from 'react';
import { Settings, Palette, Type, Code, Eye, Save, Download } from 'lucide-react';
import { EditorSettings } from '../types';
import { useTheme } from '../hooks/useTheme';

interface SettingsPanelProps {
  settings: EditorSettings;
  onSettingsChange: (settings: EditorSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange
}) => {
  const { theme, toggleTheme, themeClasses } = useTheme();

  const handleSettingChange = (key: keyof EditorSettings, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const SettingGroup = ({ 
    icon: Icon, 
    title, 
    children 
  }: { 
    icon: React.ElementType; 
    title: string; 
    children: React.ReactNode;
  }) => (
    <div className={`${themeClasses.bgTertiary} rounded-lg p-4 mb-4`}>
      <div className="flex items-center mb-3">
        <Icon size={16} className="mr-2" />
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );

  const SettingItem = ({ 
    label, 
    children 
  }: { 
    label: string; 
    children: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between">
      <label className={`text-sm ${themeClasses.textSecondary}`}>{label}</label>
      {children}
    </div>
  );

  return (
    <div className={`${themeClasses.bg} h-full flex flex-col`}>
      <div className={`${themeClasses.bgSecondary} px-3 py-2 ${themeClasses.border} border-b flex items-center`}>
        <Settings size={14} className="mr-2" />
        <span className="text-sm font-semibold">Settings</span>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <SettingGroup icon={Palette} title="Appearance">
          <SettingItem label="Theme">
            <button
              onClick={toggleTheme}
              className={`px-3 py-1 rounded text-sm ${themeClasses.accent} text-white hover:opacity-90`}
            >
              {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </SettingItem>
        </SettingGroup>

        <SettingGroup icon={Type} title="Editor Font">
          <SettingItem label="Font Size">
            <select
              value={settings.fontSize}
              onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
              className={`${themeClasses.bgSecondary} ${themeClasses.border} border rounded px-2 py-1 text-sm`}
            >
              <option value={12}>12px</option>
              <option value={14}>14px</option>
              <option value={16}>16px</option>
              <option value={18}>18px</option>
              <option value={20}>20px</option>
            </select>
          </SettingItem>
        </SettingGroup>

        <SettingGroup icon={Code} title="Editor Behavior">
          <SettingItem label="Tab Size">
            <select
              value={settings.tabSize}
              onChange={(e) => handleSettingChange('tabSize', parseInt(e.target.value))}
              className={`${themeClasses.bgSecondary} ${themeClasses.border} border rounded px-2 py-1 text-sm`}
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={8}>8 spaces</option>
            </select>
          </SettingItem>

          <SettingItem label="Word Wrap">
            <input
              type="checkbox"
              checked={settings.wordWrap}
              onChange={(e) => handleSettingChange('wordWrap', e.target.checked)}
              className="w-4 h-4"
            />
          </SettingItem>

          <SettingItem label="Minimap">
            <input
              type="checkbox"
              checked={settings.minimap}
              onChange={(e) => handleSettingChange('minimap', e.target.checked)}
              className="w-4 h-4"
            />
          </SettingItem>
        </SettingGroup>

        <SettingGroup icon={Save} title="File Handling">
          <SettingItem label="Auto Save">
            <input
              type="checkbox"
              checked={settings.autoSave}
              onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              className="w-4 h-4"
            />
          </SettingItem>

          <SettingItem label="Format on Save">
            <input
              type="checkbox"
              checked={settings.formatOnSave}
              onChange={(e) => handleSettingChange('formatOnSave', e.target.checked)}
              className="w-4 h-4"
            />
          </SettingItem>
        </SettingGroup>

        <div className={`${themeClasses.bgTertiary} rounded-lg p-4 text-center`}>
          <h4 className="font-semibold text-sm mb-2">About CodeHarborHub</h4>
          <p className={`text-xs ${themeClasses.textMuted} mb-3`}>
            A modern web-based code editor built with Monaco Editor and React.
          </p>
          <div className="flex justify-center space-x-2 text-xs">
            <span className={`px-2 py-1 rounded ${themeClasses.bgSecondary}`}>v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};