const fs = require('fs');
const path = require('path');

const srcDir = 'stitch-assets';
const destDir = 'src/components';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir).filter(file => file.endsWith('.html'));

files.forEach(file => {
    console.log(`Processing ${file}...`);
    let content = fs.readFileSync(path.join(srcDir, file), 'utf-8');

    // Extract body content
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
        content = bodyMatch[1];
    } else {
        console.warn(`No body tag found in ${file}`);
        // If no body tag, assume entire content is the body (fallback)
    }

    // Remove scripts and styles
    content = content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gmi, "");
    content = content.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gmi, "");
    
    // Remove comments
    content = content.replace(/<!--[\s\S]*?-->/g, "");

    // React attributes conversion
    content = content.replace(/\bclass="/g, 'className="');
    content = content.replace(/\bfor="/g, 'htmlFor="');
    content = content.replace(/\btabindex="/g, 'tabIndex="');
    content = content.replace(/\bautocomplete="/g, 'autoComplete="');
    content = content.replace(/\bautofocus="/g, 'autoFocus="');
    content = content.replace(/\breadonly="/g, 'readOnly="');
    content = content.replace(/\bmaxlength="/g, 'maxLength="');
    content = content.replace(/\bminlength="/g, 'minLength="');
    
    // Self-closing tags - improved regex
    const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link'];
    selfClosingTags.forEach(tag => {
        const regex = new RegExp(`<${tag}\\b((?:[^>]*?))\\/?>`, 'gi');
        content = content.replace(regex, `<${tag}$1 />`);
    });

    // Handle inline styles more safely (handles both " and ' quotes)
    if (content.match(/\bstyle=["']/)) {
        console.warn(`Warning: Inline styles found in ${file}. Attempting conversion.`);
        content = content.replace(/\bstyle=(["'])(.*?)\1/g, (match, quote, styleString) => {
            const styles = styleString.split(';').filter(s => s.trim());
            const styleProps = styles.map(style => {
                const [key, ...values] = style.split(':');
                if (key && values.length) {
                    const camelKey = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
                    // Escape single quotes if any
                    const value = values.join(':').trim().replace(/'/g, "\\'");
                    return `${camelKey}: '${value}'`;
                }
                return '';
            }).filter(s => s).join(', ');
            return `style={{ ${styleProps} }}`;
        });
    }

    // Determine Component Name
    let componentName = file.replace('.html', '')
        .replace(/_+/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
        .replace(/\s+/g, '');
    
    // Fix specific naming if needed (e.g. ReportsStats)
    // The regex above handles "reports___stats" -> "Reports   Stats" -> "ReportsStats" correctly.

    // Wrap in Component
    const componentCode = `import React from 'react';
import { Link } from 'react-router-dom';

const ${componentName} = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      ${content}
    </div>
  );
};

export default ${componentName};
`;

    fs.writeFileSync(path.join(destDir, `${componentName}.jsx`), componentCode);
    console.log(`Created ${componentName}.jsx`);
});