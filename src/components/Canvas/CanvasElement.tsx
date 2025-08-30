import React, { useState, useRef } from 'react';
import { CanvasElement as CanvasElementType } from '../../types';

interface CanvasElementProps {
  element: CanvasElementType;
  isSelected: boolean;
  onSelect: (element: CanvasElementType) => void;
  onUpdate: (element: CanvasElementType) => void;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element);
    
    if (e.target === elementRef.current || (e.target as HTMLElement).closest('.element-content')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - element.x,
        y: e.clientY - element.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      onUpdate({
        ...element,
        x: Math.max(0, newX),
        y: Math.max(0, newY)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart]);

  const renderContent = () => {
    const { properties } = element;
    const baseStyle = {
      backgroundColor: properties.backgroundColor,
      color: properties.textColor,
      borderRadius: `${properties.borderRadius || 0}px`,
      padding: `${properties.padding || 0}px`,
      fontSize: `${properties.fontSize || 16}px`,
      fontWeight: properties.fontWeight,
      boxShadow: properties.boxShadow
    };

    switch (element.type) {
      case 'button':
        return (
          <button
            className="w-full h-full flex items-center justify-center font-medium transition-all duration-200 hover:opacity-90"
            style={baseStyle}
          >
            {properties.text || 'Button'}
          </button>
        );

      case 'text':
        return (
          <div
            className="w-full h-full flex items-center"
            style={baseStyle}
          >
            {properties.text || 'Text'}
          </div>
        );

      case 'input':
        return (
          <input
            type="text"
            placeholder={properties.placeholder || 'Enter text...'}
            className="w-full h-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            style={baseStyle}
          />
        );

      case 'container':
        return (
          <div
            className="w-full h-full border-2 border-dashed border-gray-300"
            style={baseStyle}
          >
            {element.children?.map(child => (
              <CanvasElement
                key={child.id}
                element={child}
                isSelected={false}
                onSelect={onSelect}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        );

      case 'card':
        return (
          <div
            className="w-full h-full border border-gray-200"
            style={baseStyle}
          >
            <div className="p-4">
              <h3 className="font-medium mb-2">Card Title</h3>
              <p className="text-sm text-gray-600">Card content goes here</p>
            </div>
          </div>
        );

      case 'image':
        return (
          <img
            src={properties.src || 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400'}
            alt={properties.alt || 'Image'}
            className="w-full h-full object-cover"
            style={{ borderRadius: `${properties.borderRadius || 0}px` }}
          />
        );

      default:
        return (
          <div
            className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500"
            style={baseStyle}
          >
            {element.type}
          </div>
        );
    }
  };

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      className={`absolute cursor-move transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      } ${isDragging ? 'z-50 opacity-75' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height
      }}
    >
      <div className="element-content w-full h-full">
        {renderContent()}
      </div>
      
      {isSelected && (
        <>
          {/* Resize handles */}
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize"></div>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nw-resize"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-ne-resize"></div>
        </>
      )}
    </div>
  );
};