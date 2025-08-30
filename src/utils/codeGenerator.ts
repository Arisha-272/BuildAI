import { CanvasElement } from '../types';

export const generateCode = async (elements: CanvasElement[]) => {
  // Simulate AI code generation delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const reactCode = generateReactCode(elements);
  const htmlCode = generateHTMLCode(elements);
  const cssCode = generateCSSCode(elements);
  const jsCode = generateJavaScriptCode(elements);

  return {
    react: reactCode,
    html: htmlCode,
    css: cssCode,
    js: jsCode
  };
};

const generateReactCode = (elements: CanvasElement[]): string => {
  const imports = `import React from 'react';\n\n`;
  
  const componentCode = `const GeneratedComponent = () => {\n  return (\n    <div className="generated-container">\n${generateReactElements(elements, 6)}\n    </div>\n  );\n};\n\nexport default GeneratedComponent;`;

  return imports + componentCode;
};

const generateReactElements = (elements: CanvasElement[], indent: number = 0): string => {
  const indentStr = ' '.repeat(indent);
  
  return elements.map(element => {
    const style = generateInlineStyles(element);
    const className = `element-${element.type}`;
    
    switch (element.type) {
      case 'button':
        return `${indentStr}<button className="${className}" style={${JSON.stringify(style)}}>\n${indentStr}  ${element.properties.text || 'Button'}\n${indentStr}</button>`;
      
      case 'text':
        return `${indentStr}<div className="${className}" style={${JSON.stringify(style)}}>\n${indentStr}  ${element.properties.text || 'Text'}\n${indentStr}</div>`;
      
      case 'input':
        return `${indentStr}<input\n${indentStr}  type="text"\n${indentStr}  placeholder="${element.properties.placeholder || ''}"\n${indentStr}  className="${className}"\n${indentStr}  style={${JSON.stringify(style)}}\n${indentStr}/>`;
      
      case 'container':
        const children = element.children ? generateReactElements(element.children, indent + 2) : '';
        return `${indentStr}<div className="${className}" style={${JSON.stringify(style)}}>\n${children}\n${indentStr}</div>`;
      
      case 'image':
        return `${indentStr}<img\n${indentStr}  src="${element.properties.src || ''}"\n${indentStr}  alt="${element.properties.alt || ''}"\n${indentStr}  className="${className}"\n${indentStr}  style={${JSON.stringify(style)}}\n${indentStr}/>`;
      
      default:
        return `${indentStr}<div className="${className}" style={${JSON.stringify(style)}}>\n${indentStr}  {/* ${element.type} */}\n${indentStr}</div>`;
    }
  }).join('\n');
};

const generateHTMLCode = (elements: CanvasElement[]): string => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Generated Website</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="generated-container">
${generateHTMLElements(elements, 4)}
  </div>
  <script src="script.js"></script>
</body>
</html>`;

  return html;
};

const generateHTMLElements = (elements: CanvasElement[], indent: number = 0): string => {
  const indentStr = ' '.repeat(indent);
  
  return elements.map(element => {
    const className = `element-${element.type}`;
    const inlineStyle = Object.entries(generateInlineStyles(element))
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
    
    switch (element.type) {
      case 'button':
        return `${indentStr}<button class="${className}" style="${inlineStyle}">${element.properties.text || 'Button'}</button>`;
      
      case 'text':
        return `${indentStr}<div class="${className}" style="${inlineStyle}">${element.properties.text || 'Text'}</div>`;
      
      case 'input':
        return `${indentStr}<input type="text" placeholder="${element.properties.placeholder || ''}" class="${className}" style="${inlineStyle}">`;
      
      case 'container':
        const children = element.children ? generateHTMLElements(element.children, indent + 2) : '';
        return `${indentStr}<div class="${className}" style="${inlineStyle}">\n${children}\n${indentStr}</div>`;
      
      case 'image':
        return `${indentStr}<img src="${element.properties.src || ''}" alt="${element.properties.alt || ''}" class="${className}" style="${inlineStyle}">`;
      
      default:
        return `${indentStr}<div class="${className}" style="${inlineStyle}"><!-- ${element.type} --></div>`;
    }
  }).join('\n');
};

const generateCSSCode = (elements: CanvasElement[]): string => {
  let css = `/* Generated CSS */
.generated-container {
  position: relative;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

`;

  const addElementStyles = (elements: CanvasElement[]) => {
    elements.forEach(element => {
      const style = generateInlineStyles(element);
      css += `.element-${element.type} {\n`;
      Object.entries(style).forEach(([key, value]) => {
        css += `  ${key}: ${value};\n`;
      });
      css += `}\n\n`;

      if (element.children) {
        addElementStyles(element.children);
      }
    });
  };

  addElementStyles(elements);
  return css;
};

const generateJavaScriptCode = (elements: CanvasElement[]): string => {
  return `// Generated JavaScript
document.addEventListener('DOMContentLoaded', function() {
  console.log('Website loaded successfully');
  
  // Add event listeners for buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      console.log('Button clicked:', this.textContent);
    });
  });

  // Add form validation
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      // Add your validation logic here
      console.log('Input changed:', this.value);
    });
  });
});`;
};

const generateInlineStyles = (element: CanvasElement): Record<string, string> => {
  const { properties } = element;
  const styles: Record<string, string> = {
    position: 'absolute',
    left: `${element.x}px`,
    top: `${element.y}px`,
    width: `${element.width}px`,
    height: `${element.height}px`
  };

  if (properties.backgroundColor) {
    styles.backgroundColor = properties.backgroundColor;
  }
  
  if (properties.textColor) {
    styles.color = properties.textColor;
  }
  
  if (properties.borderRadius) {
    styles.borderRadius = `${properties.borderRadius}px`;
  }
  
  if (properties.padding) {
    styles.padding = `${properties.padding}px`;
  }
  
  if (properties.fontSize) {
    styles.fontSize = `${properties.fontSize}px`;
  }
  
  if (properties.fontWeight) {
    styles.fontWeight = properties.fontWeight;
  }

  if (properties.boxShadow) {
    styles.boxShadow = properties.boxShadow;
  }

  return styles;
};