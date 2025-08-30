import React from 'react';
import { 
  Code2, 
  Database, 
  MessageSquare, 
  Play, 
  Save, 
  Upload,
  Download,
  Settings,
  Zap
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

export const Header: React.FC = () => {
  const {
    currentProject,
    setShowCodeEditor,
    setShowDatabaseBuilder,
    setShowAIAssistant,
    showCodeEditor,
    showDatabaseBuilder,
    showAIAssistant,
    isGeneratingCode
  } = useAppContext();

  const handleSave = () => {
    if (currentProject) {
      localStorage.setItem('currentProject', JSON.stringify(currentProject));
      // Create a temporary notification
      const notification = document.createElement('div');
      notification.textContent = 'Project saved successfully!';
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 2000);
    }
  };

  const handlePreview = () => {
    if (!currentProject) return;
    
    // Generate preview HTML
    const previewContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${currentProject.name} - Preview</title>
        <style>
          body { 
            margin: 0; 
            padding: 20px; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f3f4f6;
          }
          .preview-container { 
            position: relative; 
            width: 100%; 
            min-height: 100vh; 
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
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
              border: ${el.type === 'input' ? '1px solid #d1d5db' : 'none'};
              cursor: ${el.type === 'button' ? 'pointer' : 'default'};
              transition: all 0.2s ease;
            }
            .element-${el.id}:hover {
              ${el.type === 'button' ? 'opacity: 0.9; transform: translateY(-1px);' : ''}
            }
          `).join('')}
        </style>
      </head>
      <body>
        <div class="preview-container">
          ${currentProject.elements.map(el => {
            switch (el.type) {
              case 'button':
                return `<button class="element-${el.id}" onclick="alert('Button clicked!')">${el.properties.text || 'Button'}</button>`;
              case 'text':
                return `<div class="element-${el.id}">${el.properties.text || 'Text'}</div>`;
              case 'input':
                return `<input type="text" placeholder="${el.properties.placeholder || ''}" class="element-${el.id}">`;
              case 'image':
                return `<img src="${el.properties.src || ''}" alt="${el.properties.alt || ''}" class="element-${el.id}" style="object-fit: cover;">`;
              case 'card':
                return `<div class="element-${el.id}">
                  <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">Card Title</h3>
                  <p style="margin: 0; color: #6b7280; font-size: 14px;">Card content goes here. This is a preview of your card component.</p>
                </div>`;
              case 'container':
                return `<div class="element-${el.id}" style="border: 2px dashed #d1d5db;">
                  <div style="text-align: center; color: #9ca3af; font-size: 14px;">Container</div>
                </div>`;
              default:
                return `<div class="element-${el.id}">${el.type}</div>`;
            }
          }).join('')}
        </div>
        <script>
          console.log('Preview loaded for: ${currentProject.name}');
          
          // Add some interactivity
          document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', function() {
              this.style.transform = 'scale(0.95)';
              setTimeout(() => {
                this.style.transform = '';
              }, 150);
            });
          });
        </script>
      </body>
      </html>
    `;
    
    // Open preview in new tab
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(previewContent);
      previewWindow.document.close();
    }
  };

  const handleDeploy = () => {
    if (!currentProject) {
      alert('Please create a project first before deploying.');
      return;
    }
    
    if (currentProject.elements.length === 0) {
      alert('Please add some components to your project before deploying.');
      return;
    }
    
    // Create deployment notification
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span>Preparing deployment...</span>
      </div>
    `;
    notification.className = 'fixed top-4 right-4 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg z-50';
    document.body.appendChild(notification);
    
    // Simulate deployment process
    setTimeout(() => {
      notification.innerHTML = `
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-green-400 rounded-full"></div>
          <span>Deployment ready! Click "Deploy" in the top menu to publish.</span>
        </div>
      `;
      notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-50';
      
      setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 4000);
    }, 2000);
  };

  return (
    <header className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Zap className="w-8 h-8 text-blue-400" />
          <h1 className="text-xl font-bold">BuilderAI</h1>
        </div>
        {currentProject && (
          <div className="text-sm text-gray-300">
            <span className="text-gray-500">Project:</span> {currentProject.name}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowAIAssistant(!showAIAssistant)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
            showAIAssistant
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>AI Assistant</span>
        </button>

        <button
          onClick={() => setShowCodeEditor(!showCodeEditor)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
            showCodeEditor
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Code</span>
        </button>

        <button
          onClick={() => setShowDatabaseBuilder(!showDatabaseBuilder)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
            showDatabaseBuilder
              ? 'bg-green-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Database</span>
        </button>

        <div className="w-px h-6 bg-gray-600"></div>

        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all duration-200"
        >
          <Save className="w-4 h-4" />
          <span>Save</span>
        </button>

        <button
          onClick={handlePreview}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
        >
          <Play className="w-4 h-4" />
          <span>Preview</span>
        </button>

        <button
          onClick={handleDeploy}
          className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium"
        >
          <Upload className="w-4 h-4" />
          <span>Deploy</span>
        </button>
      </div>
    </header>
  );
};