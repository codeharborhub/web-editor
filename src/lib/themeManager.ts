export const themes = {
  dark: {
    bg: 'bg-gray-900',
    bgSecondary: 'bg-gray-800',
    bgTertiary: 'bg-gray-700',
    text: 'text-gray-100',
    textSecondary: 'text-gray-300',
    textMuted: 'text-gray-400',
    border: 'border-gray-600',
    accent: 'bg-blue-600',
    accentHover: 'hover:bg-blue-700',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
    monaco: 'vs-dark'
  },
  light: {
    bg: 'bg-white',
    bgSecondary: 'bg-gray-50',
    bgTertiary: 'bg-gray-100',
    text: 'text-gray-900',
    textSecondary: 'text-gray-700',
    textMuted: 'text-gray-500',
    border: 'border-gray-300',
    accent: 'bg-blue-500',
    accentHover: 'hover:bg-blue-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
    monaco: 'vs'
  }
};

export const getTheme = (themeName: 'dark' | 'light') => themes[themeName];