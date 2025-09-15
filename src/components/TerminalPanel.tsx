import React, { useRef, useEffect, useState } from 'react';
import { Terminal as TerminalIcon, Trash2, Copy } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface ConsoleMessage {
  id: string;
  level: 'log' | 'error' | 'warn';
  args: string[];
  timestamp: Date;
}

interface TerminalPanelProps {
  messages: ConsoleMessage[];
  onClear: () => void;
}

export const TerminalPanel: React.FC<TerminalPanelProps> = ({
  messages,
  onClear
}) => {
  const { themeClasses } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-red-400';
      case 'warn': return 'text-yellow-400';
      default: return themeClasses.text;
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return '❌';
      case 'warn': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const copyToClipboard = () => {
    const content = messages.map(msg => 
      `[${formatTimestamp(msg.timestamp)}] ${msg.level.toUpperCase()}: ${msg.args.join(' ')}`
    ).join('\n');
    
    navigator.clipboard.writeText(content).then(() => {
      // Could show a toast notification here
    });
  };

  return (
    <div className={`${themeClasses.bg} h-full flex flex-col`}>
      <div className={`${themeClasses.bgSecondary} px-3 py-2 ${themeClasses.border} border-b flex items-center justify-between`}>
        <div className="flex items-center space-x-2">
          <TerminalIcon size={14} />
          <span className="text-sm font-semibold">Console</span>
          <span className={`text-xs ${themeClasses.textMuted}`}>
            ({messages.length} messages)
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={copyToClipboard}
            className={`p-1 rounded hover:${themeClasses.bgTertiary}`}
            title="Copy All Messages"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={onClear}
            className={`p-1 rounded hover:${themeClasses.bgTertiary}`}
            title="Clear Console"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className={`flex-1 overflow-auto ${themeClasses.bgTertiary} font-mono text-sm`}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className={`text-center ${themeClasses.textMuted}`}>
              <TerminalIcon size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Console output will appear here</p>
              <p className="text-xs">Run your HTML/JS preview to see logs</p>
            </div>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {messages.map(message => (
              <div key={message.id} className="flex items-start space-x-2">
                <span className={`text-xs ${themeClasses.textMuted} mt-0.5 whitespace-nowrap`}>
                  {formatTimestamp(message.timestamp)}
                </span>
                <span className="mt-0.5">{getLevelIcon(message.level)}</span>
                <div className={`flex-1 ${getLevelColor(message.level)}`}>
                  {message.args.map((arg, index) => (
                    <span key={index} className="mr-2">
                      {arg}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  );
};