import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Copy, Download, RefreshCw } from 'lucide-react';
import { generateCode } from '../../utils/codeGenerator';

export const CodeEditor: React.FC = () => {
  const { currentProject, setCurrentProject, isGeneratingCode, setIsGeneratingCode } = useAppContext();
  const [activeTab, setActiveTab] = useState<'react' | 'html' | 'css' | 'js'>('react');

  const handleGenerateCode = async () => {
    if (!currentProject) return;

    setIsGeneratingCode(true);
    
    try {
      const generatedCode = await generateCode(currentProject.elements);
      
      const updatedProject = {
        ...currentProject,
        generatedCode
      };

      setCurrentProject(updatedProject);
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleCopyCode = () => {
    if (!currentProject?.generatedCode) return;
    
    const code = currentProject.generatedCode[activeTab];
    navigator.clipboard.writeText(code);
  };

  const handleDownloadCode = () => {
    if (!currentProject?.generatedCode) return;
    
    const code = currentProject.generatedCode[activeTab];
    const fileExtension = activeTab === 'react' ? 'tsx' : activeTab;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `component.${fileExtension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!currentProject) {
    return (
      <div className="bg-gray-900 text-white p-6 h-full flex items-center justify-center">
        <p className="text-gray-400">No project selected</p>
      </div>
    );
  }

  const tabs = [
    { id: 'react', label: 'React' },
    { id: 'html', label: 'HTML' },
    { id: 'css', label: 'CSS' },
    { id: 'js', label: 'JavaScript' }
  ] as const;

  return (
    <div className="bg-gray-900 text-white h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Generated Code</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleGenerateCode}
            disabled={isGeneratingCode}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isGeneratingCode ? 'animate-spin' : ''}`} />
            <span>Generate</span>
          </button>
          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>Copy</span>
          </button>
          <button
            onClick={handleDownloadCode}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        <pre className="h-full overflow-auto p-4 text-sm bg-gray-900">
          <code className="text-gray-300">
            {currentProject.generatedCode?.[activeTab] || `// Click "Generate" to create ${activeTab.toUpperCase()} code`}
          </code>
        </pre>
      </div>
    </div>
  );
};