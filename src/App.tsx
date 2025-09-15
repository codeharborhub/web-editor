import React from 'react';
import { ThemeProvider } from './components/ThemeProvider';
import { EditorShell } from './components/EditorShell';

function App() {
  return (
    <ThemeProvider>
      <EditorShell />
    </ThemeProvider>
  );
}

export default App;