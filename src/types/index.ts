export interface CanvasElement {
  id: string;
  type: 'button' | 'text' | 'input' | 'card' | 'container' | 'image' | 'form';
  x: number;
  y: number;
  width: number;
  height: number;
  properties: {
    text?: string;
    placeholder?: string;
    src?: string;
    alt?: string;
    backgroundColor?: string;
    textColor?: string;
    borderRadius?: number;
    padding?: number;
    fontSize?: number;
    fontWeight?: string;
    [key: string]: any;
  };
  children?: CanvasElement[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  elements: CanvasElement[];
  generatedCode: {
    html: string;
    css: string;
    js: string;
    react: string;
  };
  backendSchema: DatabaseTable[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseTable {
  id: string;
  name: string;
  fields: DatabaseField[];
}

export interface DatabaseField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'email' | 'password';
  required: boolean;
  unique?: boolean;
  defaultValue?: string;
}

export interface ComponentLibraryItem {
  id: string;
  name: string;
  category: 'basic' | 'forms' | 'layout' | 'data';
  icon: string;
  template: Partial<CanvasElement>;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}