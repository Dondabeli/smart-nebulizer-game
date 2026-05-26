const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

if (!appTsx.includes('useWindowScale')) {
  // Add useEffect to the imports
  appTsx = appTsx.replace("import { useState, useCallback } from 'react';", "import { useState, useCallback, useEffect } from 'react';");
  
  const hookCode = `
function useWindowScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / 1769;
      const scaleY = window.innerHeight / 1086;
      setScale(Math.min(scaleX, scaleY));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return scale;
}

function App() {
  const scale = useWindowScale();
`;
  appTsx = appTsx.replace("function App() {", hookCode);
  
  appTsx = appTsx.replace('<div className="scale-wrapper">', '<div className="scale-wrapper" style={{ transform: `scale(${scale})` }}>');
  
  fs.writeFileSync('src/App.tsx', appTsx);
  console.log("Updated App.tsx with useWindowScale");
}

let appCss = fs.readFileSync('src/App.css', 'utf8');

// remove any pure css transform that was failing
appCss = appCss.replace(/transform: scale\([^)]+\);/g, '');

fs.writeFileSync('src/App.css', appCss);
console.log("Updated App.css");
