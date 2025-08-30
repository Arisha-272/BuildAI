import React, { useState } from 'react';
import { X, Smartphone, Tablet, Monitor, RefreshCw } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { generateCode } from '../../utils/codeGenerator';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose }) => {
  const { currentProject } = useAppContext();
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !currentProject) return null;

  const deviceSizes = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await generateCode(currentProject.elements);
    } catch (error) {
      console.error('Error refreshing preview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const previewContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${currentProject.name} - Preview</title>
      <style>
        body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        .preview-container { position: relative; width: 100%; height: 100vh; }
        ${currentProject.elements.map(el => `
          .element-${el.id} {
            position: absolute;
            left: ${el.x}px;
            top: ${el.y}px;
            width: ${el.width}px;
            height: ${el.height}px;
            background-color: ${el.properties.backgroundColor || 'transparent'};
            color: ${el.properties.textColor || '#000'};
            border-radius: ${el.properties.borderRadius || 0}px;
            padding: ${el.properties.padding || 0}px;
            font-size: ${el.properties.fontSize || 16}px;
            font-weight: ${el.properties.fontWeight || 'normal'};
            box-shadow: ${el.properties.boxShadow || 'none'};
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `).join('')}
      </style>
    </head>
    <body>
      <div class="preview-container">
        ${currentProject.elements.map(el => {
          switch (el.type) {
            case 'button':
              return `<button class="element-${el.id}">${el.properties.text || 'Button'}</button>`;
            case 'text':
              return `<div class="element-${el.id}">${el.properties.text || 'Text'}</div>`;
            case 'input':
              return `<input type="text" placeholder="${el.properties.placeholder || ''}" class="element-${el.id}">`;
            case 'image':
              return `<img src="${el.properties.src || ''}" alt="${el.properties.alt || ''}" class="element-${el.id}">`;
            default:
              return `<div class="element-${el.id}">${el.type}</div>`;
          }
        }).join('')}
      </div>
    </body>
    </html>
  `;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 h-5/6 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold">Preview: {currentProject.name}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setDeviceType('desktop')}
                className={`p-2 rounded ${deviceType === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceType('tablet')}
                className={`p-2 rounded ${deviceType === 'tablet' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceType('mobile')}
                className={`p-2 rounded ${deviceType === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 bg-gray-50">
          <div 
            className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
            style={{
              width: deviceSizes[deviceType].width,
              height: deviceSizes[deviceType].height,
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            <iframe
              srcDoc={previewContent}
              className="w-full h-full border-0"
              title="Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
};