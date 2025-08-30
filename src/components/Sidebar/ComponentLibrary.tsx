import React from 'react';
import { Square, Type, Donut as ButtonIcon, Image, Layout, FileText, Calendar, Mail, Phone, CreditCard } from 'lucide-react';
import { ComponentLibraryItem } from '../../types';

const componentLibrary: ComponentLibraryItem[] = [
  {
    id: 'button',
    name: 'Button',
    category: 'basic',
    icon: 'ButtonIcon',
    template: {
      type: 'button',
      width: 120,
      height: 40,
      properties: {
        text: 'Button',
        backgroundColor: '#3B82F6',
        textColor: '#FFFFFF',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        fontWeight: '500'
      }
    }
  },
  {
    id: 'text',
    name: 'Text',
    category: 'basic',
    icon: 'Type',
    template: {
      type: 'text',
      width: 200,
      height: 24,
      properties: {
        text: 'Your text here',
        textColor: '#1F2937',
        fontSize: 16,
        fontWeight: '400'
      }
    }
  },
  {
    id: 'input',
    name: 'Input',
    category: 'forms',
    icon: 'FileText',
    template: {
      type: 'input',
      width: 200,
      height: 40,
      properties: {
        placeholder: 'Enter text...',
        borderRadius: 6,
        padding: 12,
        fontSize: 14
      }
    }
  },
  {
    id: 'container',
    name: 'Container',
    category: 'layout',
    icon: 'Square',
    template: {
      type: 'container',
      width: 300,
      height: 200,
      properties: {
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 16
      }
    }
  },
  {
    id: 'card',
    name: 'Card',
    category: 'layout',
    icon: 'Layout',
    template: {
      type: 'card',
      width: 280,
      height: 160,
      properties: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }
    }
  },
  {
    id: 'image',
    name: 'Image',
    category: 'basic',
    icon: 'Image',
    template: {
      type: 'image',
      width: 200,
      height: 120,
      properties: {
        src: 'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&w=400',
        alt: 'Placeholder image',
        borderRadius: 8
      }
    }
  }
];

const iconMap = {
  ButtonIcon,
  Type,
  FileText,
  Square,
  Layout,
  Image,
  Calendar,
  Mail,
  Phone,
  CreditCard
};

export const ComponentLibrary: React.FC = () => {
  const categories = ['basic', 'forms', 'layout', 'data'] as const;

  const handleDragStart = (e: React.DragEvent, component: ComponentLibraryItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
  };

  return (
    <div className="bg-gray-800 text-white p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Components</h2>
      
      {categories.map(category => {
        const categoryComponents = componentLibrary.filter(comp => comp.category === category);
        if (categoryComponents.length === 0) return null;

        return (
          <div key={category} className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
              {category}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categoryComponents.map(component => {
                const IconComponent = iconMap[component.icon as keyof typeof iconMap];
                return (
                  <div
                    key={component.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, component)}
                    className="flex flex-col items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105"
                  >
                    <IconComponent className="w-6 h-6 mb-2 text-blue-400" />
                    <span className="text-xs text-center">{component.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};