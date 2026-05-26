const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');
appTsx = appTsx.replace(/Bird%20Card\.svg/g, 'Bird Card.svg');
appTsx = appTsx.replace(/bear%20card\.svg/g, 'bear card.svg');
appTsx = appTsx.replace(/more%20card\.svg/g, 'more card.svg');
fs.writeFileSync('src/App.tsx', appTsx);

let appCss = fs.readFileSync('src/App.css', 'utf8');

appCss = `/* Reset and base */
* { box-sizing: border-box; }
body { 
  margin: 0; 
  font-family: 'Nunito', 'Segoe UI', system-ui, sans-serif; 
  overflow: hidden; 
  background: #80c9ff;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
}

#root {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #80c9ff;
}

.scale-wrapper {
  position: relative;
  width: 1769px;
  height: 1086px;
  flex-shrink: 0;
  transform: scale(min(calc(100vw / 1769), calc(100vh / 1086)));
  transform-origin: center center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #334155;
  background: transparent;
}

/* Background Image Layer */
.background-layer {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0; pointer-events: none;
  background-image: url('/background.svg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

/* Header */
.top-bar {
  position: relative; z-index: 10;
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 30px 50px;
}
.profile-section { display: flex; align-items: center; gap: 20px; }
.avatar {
  background: #fff; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 40px; box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}
.avatar img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }
.profile-info { display: flex; flex-direction: column; }
.greeting { font-weight: bold; font-size: 32px; }

/* Status Badge */
.status-badge {
  display: flex; align-items: center; gap: 20px;
  background: white; border: none; padding: 12px 20px;
  border-radius: 60px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  cursor: pointer; font-family: inherit; transition: transform 0.2s;
}
.status-badge.connected { padding-right: 30px; }
.status-badge:hover { transform: scale(1.02); }
.status-badge.disconnected .status-title { color: #333; }
.status-badge.disconnected .status-subtitle { color: #888; }
.bt-icon-wrapper-new {
  width: 60px; height: 60px; background: #2b8cff; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.bt-icon-wrapper-new svg { width: 32px; height: 32px; }
.status-text { text-align: left; display: flex; flex-direction: column; justify-content: center; }
.status-title { font-weight: 800; font-size: 24px; color: #111; letter-spacing: -0.2px; }
.status-subtitle { font-size: 18px; color: #a1a1aa; font-weight: 600; margin-top: -2px; }
.check-icon-wrapper {
  width: 44px; height: 44px; background: #00d65b; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; margin-left: 15px;
}
.check-icon-wrapper svg { width: 24px; height: 24px; }

/* Main Content */
.main-content {
  position: relative; z-index: 10;
  flex: 1; display: flex; flex-direction: column; align-items: center; 
  margin-top: -20px; /* pull up slightly */
}
.center-stage { position: relative; width: 100%; max-width: 980px; padding: 0 40px; display: flex; flex-direction: column; align-items: center; }

.pod { position: relative; display: flex; flex-direction: column; align-items: center; width: 580px; }
.pod-dome { width: 100%; height: 480px; background: radial-gradient(circle, #e0f2fe 0%, white 90%); border-radius: 50% 50% 20px 20px; border: 15px solid white; border-bottom: none; box-shadow: 0 10px 30px rgba(0,0,0,0.1); display: flex; justify-content: center; position: relative; overflow: hidden; }
.pod-content { margin-top: 30px; text-align: center; z-index: 2; display: flex; flex-direction: column; align-items: center; }
.active-tag { background: #38bdf8; color: white; padding: 10px 20px; border-radius: 40px; font-size: 16px; font-weight: 800; margin-bottom: 12px; letter-spacing: 0.5px; text-transform: uppercase; }
.pod-content h2 { margin: 0; font-size: 42px; color: #1e293b; font-weight: 900; }
.pod-content p { margin: 8px 0 0 0; font-size: 22px; color: #64748b; font-weight: 600; line-height: 1.4; }
.toy-character { margin-top: auto; font-size: 240px; line-height: 1; margin-bottom: -30px; display: flex; align-items: flex-end; justify-content: center; width: 100%; height: 280px; }
.stone-placeholder { width: 200px; height: auto; object-fit: contain; margin-bottom: 10px; }
.toy-character-img { height: 260px; width: auto; object-fit: contain; margin-bottom: 10px; z-index: 10; position: relative; }
.pod-base { width: 110%; height: 80px; background: #f8fafc; border-radius: 40px; box-shadow: inset 0 -10px 20px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.1); position: relative; z-index: 3; margin-top: -10px; border: 6px solid white; }
.play-button { position: absolute; bottom: -30px; background: #84cc16; color: white; border: 6px solid white; border-radius: 60px; padding: 15px 70px; font-size: 38px; font-weight: 800; cursor: pointer; box-shadow: 0 10px 20px rgba(132, 204, 22, 0.4); z-index: 10; display: flex; align-items: center; gap: 15px; transition: transform 0.2s; }
.play-button.disabled { background: #d1d5db; box-shadow: none; cursor: not-allowed; }
.play-button:hover { transform: scale(1.05); }

/* Game Modes Section */
.game-modes-section { margin-top: 60px; text-align: center; z-index: 10; width: 100%; max-width: 1000px;}
.section-title { font-size: 28px; color: #14532d; font-weight: 800; display: inline-flex; align-items: center; gap: 12px; }
.mode-cards { display: flex; gap: 25px; justify-content: center; margin-top: 20px; padding: 0 40px; }
.mode-card-img-wrapper { 
  flex: 1; 
  border-radius: 20px; 
  overflow: hidden; 
  border: 4px solid transparent; 
  transition: all 0.3s ease; 
  box-shadow: 0 6px 20px rgba(0,0,0,0.05); 
  display: flex;
}
.mode-card-img-wrapper.active { 
  border-color: #84cc16; 
  transform: scale(1.05); 
  box-shadow: 0 12px 35px rgba(132, 204, 22, 0.4); 
}
.mode-card-img { width: 100%; height: auto; object-fit: contain; display: block; border-radius: 12px; background: white;}
`
fs.writeFileSync('src/App.css', appCss);
