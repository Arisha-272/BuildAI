import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import { Header } from './components/Header/Header';
import { ComponentLibrary } from './components/Sidebar/ComponentLibrary';
import { PropertiesPanel } from './components/Sidebar/PropertiesPanel';
import { Canvas } from './components/Canvas/Canvas';
import { CodeEditor } from './components/CodeEditor/CodeEditor';
import { ChatBot } from './components/AIAssistant/ChatBot';
import { SchemaBuilder } from './components/DatabaseBuilder/SchemaBuilder';
import { ProjectManager } from './components/ProjectManager/ProjectManager';
import { PreviewModal } from './components/PreviewModal/PreviewModal';
import { useAppContext } from './contexts/AppContext';

const AppContent: React.FC = () => {
  const { 
    showCodeEditor, 
    showDatabaseBuilder, 
    showAIAssistant,
    currentProject 
  } = useAppContext();
  
  const [showPreview, setShowPreview] = useState(false);

  // Show project manager if no current project
  if (!currentProject) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex-1">
          <ProjectManager />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Component Library */}
        <div className="w-64 flex-shrink-0">
          <ComponentLibrary />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Canvas */}
          <div className="flex-1">
            <Canvas />
          </div>

          {/* Right Panel - Conditional Content */}
          <div className="w-80 flex-shrink-0 border-l border-gray-700">
            {showCodeEditor && <CodeEditor />}
            {showDatabaseBuilder && <SchemaBuilder />}
            {showAIAssistant && <ChatBot />}
            {!showCodeEditor && !showDatabaseBuilder && !showAIAssistant && <PropertiesPanel />}
          </div>
        </div>
      </div>

      <PreviewModal 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
      />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;