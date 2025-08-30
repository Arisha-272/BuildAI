import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, CanvasElement, DatabaseTable, ChatMessage } from '../types';

interface AppContextType {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  selectedElement: CanvasElement | null;
  setSelectedElement: (element: CanvasElement | null) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  showCodeEditor: boolean;
  setShowCodeEditor: (show: boolean) => void;
  showDatabaseBuilder: boolean;
  setShowDatabaseBuilder: (show: boolean) => void;
  showAIAssistant: boolean;
  setShowAIAssistant: (show: boolean) => void;
  chatMessages: ChatMessage[];
  setChatMessages: (messages: ChatMessage[]) => void;
  isGeneratingCode: boolean;
  setIsGeneratingCode: (generating: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showDatabaseBuilder, setShowDatabaseBuilder] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);

  return (
    <AppContext.Provider
      value={{
        currentProject,
        setCurrentProject,
        selectedElement,
        setSelectedElement,
        isDragging,
        setIsDragging,
        showCodeEditor,
        setShowCodeEditor,
        showDatabaseBuilder,
        setShowDatabaseBuilder,
        showAIAssistant,
        setShowAIAssistant,
        chatMessages,
        setChatMessages,
        isGeneratingCode,
        setIsGeneratingCode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};