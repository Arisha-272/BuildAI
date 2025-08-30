import React, { useRef, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { CanvasElement as CanvasElementType, ComponentLibraryItem } from '../../types';
import { CanvasElement } from './CanvasElement';

export const Canvas: React.FC = () => {
  const { 
    currentProject, 
    setCurrentProject, 
    selectedElement, 
    setSelectedElement,
    isDragging,
    setIsDragging 
  } = useAppContext();
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggedElement, setDraggedElement] = useState<CanvasElementType | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!canvasRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!currentProject || !canvasRef.current) return;

    try {
      const componentData = JSON.parse(e.dataTransfer.getData('application/json')) as ComponentLibraryItem;
      const rect = canvasRef.current.getBoundingClientRect();
      
      const newElement: CanvasElementType = {
        id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: componentData.template.type!,
        x: e.clientX - rect.left - (componentData.template.width || 100) / 2,
        y: e.clientY - rect.top - (componentData.template.height || 50) / 2,
        width: componentData.template.width || 100,
        height: componentData.template.height || 50,
        properties: { ...componentData.template.properties } || {},
        children: []
      };

      const updatedProject = {
        ...currentProject,
        elements: [...currentProject.elements, newElement]
      };

      setCurrentProject(updatedProject);
      setSelectedElement(newElement);
    } catch (error) {
      console.error('Error parsing dropped component:', error);
    }
  };

  const handleElementSelect = (element: CanvasElementType) => {
    setSelectedElement(element);
  };

  const handleElementUpdate = (updatedElement: CanvasElementType) => {
    if (!currentProject) return;

    const updateElements = (elements: CanvasElementType[]): CanvasElementType[] => {
      return elements.map(el => {
        if (el.id === updatedElement.id) {
          return updatedElement;
        }
        if (el.children) {
          return { ...el, children: updateElements(el.children) };
        }
        return el;
      });
    };

    const updatedProject = {
      ...currentProject,
      elements: updateElements(currentProject.elements)
    };

    setCurrentProject(updatedProject);
    if (selectedElement?.id === updatedElement.id) {
      setSelectedElement(updatedElement);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setSelectedElement(null);
    }
  };

  return (
    <div className="flex-1 bg-gray-100 relative overflow-hidden">
      <div
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleCanvasClick}
        className={`w-full h-full relative transition-all duration-200 ${
          isDragging ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''
        }`}
        style={{ minHeight: '800px' }}
      >
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-blue-500 text-lg font-medium">
              Drop component here
            </div>
          </div>
        )}
        
        {currentProject?.elements.map(element => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={selectedElement?.id === element.id}
            onSelect={handleElementSelect}
            onUpdate={handleElementUpdate}
          />
        ))}

        {!currentProject && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <h3 className="text-xl font-medium mb-2">Welcome to BuilderAI</h3>
              <p className="text-sm">Create a new project to start building</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};