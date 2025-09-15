export const createSandboxedPreview = (htmlContent: string, cssContent: string, jsContent: string): string => {
  // Sanitize and combine content for safe iframe preview
  const sanitizedHtml = sanitizeHtml(htmlContent);
  const sanitizedCss = sanitizeCss(cssContent);
  const sanitizedJs = sanitizeJs(jsContent);
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="
        default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:;
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: blob: https:;
        font-src 'self' data: https:;
    ">
    <title>Preview</title>
    <style>
        body { margin: 0; padding: 16px; font-family: system-ui, -apple-system, sans-serif; }
        ${sanitizedCss}
    </style>
</head>
<body>
    ${sanitizedHtml}
    <script>
        // Capture console logs and send to parent
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = function(...args) {
            window.parent.postMessage({ type: 'console', level: 'log', args: args.map(arg => String(arg)) }, '*');
            originalLog.apply(console, args);
        };
        
        console.error = function(...args) {
            window.parent.postMessage({ type: 'console', level: 'error', args: args.map(arg => String(arg)) }, '*');
            originalError.apply(console, args);
        };
        
        console.warn = function(...args) {
            window.parent.postMessage({ type: 'console', level: 'warn', args: args.map(arg => String(arg)) }, '*');
            originalWarn.apply(console, args);
        };
        
        // Handle errors
        window.addEventListener('error', (event) => {
            window.parent.postMessage({ 
                type: 'console', 
                level: 'error', 
                args: [\`Error: \${event.message} at line \${event.lineno}\`] 
            }, '*');
        });
        
        ${sanitizedJs}
    </script>
</body>
</html>`;
};

const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove existing script tags
    .replace(/on\w+="[^"]*"/gi, '') // Remove inline event handlers
    .replace(/javascript:/gi, ''); // Remove javascript: protocols
};

const sanitizeCss = (css: string): string => {
  // Basic CSS sanitization
  return css
    .replace(/expression\s*\(/gi, '') // Remove CSS expressions
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/@import/gi, ''); // Remove @import statements
};

const sanitizeJs = (js: string): string => {
  // Basic JS sanitization - wrap in try-catch for error handling
  return `
    try {
      ${js}
    } catch (error) {
      console.error('JavaScript Error:', error.message);
    }
  `;
};