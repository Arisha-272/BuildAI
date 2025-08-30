import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Trash2, Copy } from 'lucide-react';

export const PropertiesPanel: React.FC = () => {
  const { selectedElement, setSelectedElement, currentProject, setCurrentProject } = useAppContext();

  if (!selectedElement) {
    return (
      <div className="bg-gray-800 text-white p-4 h-full">
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        <p className="text-gray-400 text-sm">Select an element to edit its properties</p>
      </div>
    );
  }

  const updateProperty = (key: string, value: any) => {
    if (!currentProject) return;

    const updateElement = (elements: any[]): any[] => {
      return elements.map(el => {
        if (el.id === selectedElement.id) {
          return {
            ...el,
            properties: { ...el.properties, [key]: value }
          };
        }
        if (el.children) {
          return { ...el, children: updateElement(el.children) };
        }
        return el;
      });
    };

    const updatedProject = {
      ...currentProject,
      elements: updateElement(currentProject.elements)
    };

    setCurrentProject(updatedProject);
    setSelectedElement({
      ...selectedElement,
      properties: { ...selectedElement.properties, [key]: value }
    });
  };

  const deleteElement = () => {
    if (!currentProject) return;

    const removeElement = (elements: any[]): any[] => {
      return elements.filter(el => el.id !== selectedElement.id).map(el => {
        if (el.children) {
          return { ...el, children: removeElement(el.children) };
        }
        return el;
      });
    };

    const updatedProject = {
      ...currentProject,
      elements: removeElement(currentProject.elements)
    };

    setCurrentProject(updatedProject);
    setSelectedElement(null);
  };

  return (
    <div className="bg-gray-800 text-white p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Properties</h2>
        <div className="flex space-x-2">
          <button
            onClick={deleteElement}
            className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Element Type
          </label>
          <div className="px-3 py-2 bg-gray-700 rounded-lg text-sm text-gray-400 capitalize">
            {selectedElement.type}
          </div>
        </div>

        {selectedElement.properties.text !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Text
            </label>
            <input
              type="text"
              value={selectedElement.properties.text || ''}
              onChange={(e) => updateProperty('text', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {selectedElement.properties.placeholder !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Placeholder
            </label>
            <input
              type="text"
              value={selectedElement.properties.placeholder || ''}
              onChange={(e) => updateProperty('placeholder', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Background Color
          </label>
          <div className="flex space-x-2">
            <input
              type="color"
              value={selectedElement.properties.backgroundColor || '#FFFFFF'}
              onChange={(e) => updateProperty('backgroundColor', e.target.value)}
              className="w-12 h-10 bg-gray-700 border border-gray-600 rounded cursor-pointer"
            />
            <input
              type="text"
              value={selectedElement.properties.backgroundColor || '#FFFFFF'}
              onChange={(e) => updateProperty('backgroundColor', e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Border Radius
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={selectedElement.properties.borderRadius || 0}
            onChange={(e) => updateProperty('borderRadius', parseInt(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="text-xs text-gray-400 mt-1">
            {selectedElement.properties.borderRadius || 0}px
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Padding
          </label>
          <input
            type="range"
            min="0"
            max="50"
            value={selectedElement.properties.padding || 0}
            onChange={(e) => updateProperty('padding', parseInt(e.target.value))}
            className="w-full accent-blue-500"
          />
          <div className="text-xs text-gray-400 mt-1">
            {selectedElement.properties.padding || 0}px
          </div>
        </div>

        {selectedElement.properties.fontSize !== undefined && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Font Size
            </label>
            <input
              type="range"
              min="8"
              max="72"
              value={selectedElement.properties.fontSize || 16}
              onChange={(e) => updateProperty('fontSize', parseInt(e.target.value))}
              className="w-full accent-blue-500"
            />
            <div className="text-xs text-gray-400 mt-1">
              {selectedElement.properties.fontSize || 16}px
            </div>
          </div>
        )}
      </div>
    </div>
  );
};