const fs = require('fs');

let appCss = fs.readFileSync('src/App.css', 'utf8');

// Replace the scale-wrapper rule with flex and aspect-ratio based scaling
appCss = appCss.replace(/\.scale-wrapper \{[\s\S]*?\}/, `.scale-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  aspect-ratio: 1769 / 1086;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #334155;
  background: transparent;
}`);

// Wait, if scale-wrapper is width: 100% and height: 100%, and the contents are fixed px (like padding: 30px, width: 620px), they won't scale automatically!
// We need them to scale. 
// If we can't use transform: scale() with viewport units, we must use a JavaScript resize observer to apply a CSS variable!
