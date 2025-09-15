import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useTheme } from '../hooks/useTheme';

interface MonacoEditorWrapperProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  onSave: () => void;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
}

export const MonacoEditorWrapper: React.FC<MonacoEditorWrapperProps> = ({
  value,
  language,
  onChange,
  onSave,
  fontSize,
  tabSize,
  wordWrap,
  minimap
}) => {
  const { theme, themeClasses } = useTheme();
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, onSave);
    
    // Configure editor
    editor.updateOptions({
      fontSize,
      tabSize,
      wordWrap: wordWrap ? 'on' : 'off',
      minimap: { enabled: minimap },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      renderWhitespace: 'selection',
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
      fontLigatures: true,
    });

    // Add custom themes
    monaco.editor.defineTheme('codeharbor-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#1f2937',
        'editor.foreground': '#f9fafb',
        'editorLineNumber.foreground': '#6b7280',
        'editor.selectionBackground': '#374151',
        'editor.inactiveSelectionBackground': '#374151',
      }
    });

    monaco.editor.defineTheme('codeharbor-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#1f2937',
        'editorLineNumber.foreground': '#6b7280',
        'editor.selectionBackground': '#e5e7eb',
        'editor.inactiveSelectionBackground': '#e5e7eb',
      }
    });
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({
        fontSize,
        tabSize,
        wordWrap: wordWrap ? 'on' : 'off',
        minimap: { enabled: minimap },
      });
    }
  }, [fontSize, tabSize, wordWrap, minimap]);

  return (
    <div className={`flex-1 ${themeClasses.bg}`}>
      <Editor
        height="400px"
        language={language}
        value={value}
        onChange={(newValue) => onChange(newValue || '')}
        onMount={handleEditorDidMount}
        theme={theme === 'dark' ? 'codeharbor-dark' : 'codeharbor-light'}
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          readOnly: false,
          cursorStyle: 'line',
          automaticLayout: true,
          folding: true,
          foldingHighlight: true,
          showFoldingControls: 'mouseover',
          unfoldOnClickAfterEndOfLine: false,
          dragAndDrop: true,
          formatOnType: true,
          formatOnPaste: true,
        }}
      />
    </div>
  );
};