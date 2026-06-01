import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

// Bluetooth Config
const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

// Router mapping NFC UIDs to Toy variants
const TOY_ROUTER: Record<string, string> = {
  '0480107A681990': 'BEAR',
  '047F177A681990': 'BIRD',
};


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

  const [activeToy, setActiveToy] = useState<string>('IDLE');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleCharacteristicValueChanged = (event: any) => {
    const value = event.target.value;
    const decoder = new TextDecoder('utf-8');
    const dataString = decoder.decode(value);
    
    // Format: "Pressure,Temp,Humidity,RelayStatus,NfcUID"
    const dataParts = dataString.split(',');
    
    if (dataParts.length >= 5) {
      const nfcUid = dataParts[4].trim();
      
      const nextToy = TOY_ROUTER[nfcUid] || 'IDLE';
      setActiveToy(nextToy);
    }
  };

  const connectBluetooth = useCallback(async () => {
    try {
      setError('');
      // @ts-ignore
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [SERVICE_UUID] }],
      });

      const server = await device.gatt?.connect();
      if (!server) throw new Error("Could not connect to GATT Server");

      const service = await server.getPrimaryService(SERVICE_UUID);
      const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);

      setIsConnected(true);
      
      device.addEventListener('gattserverdisconnected', () => {
        setIsConnected(false);
        setActiveToy('IDLE');
      });
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Bluetooth connection failed');
    }
  }, []);

  const handlePlayClick = () => {
    if (activeToy === 'BEAR') {
      window.location.href = 'https://bearbuddy.netlify.app/';
    } else if (activeToy === 'BIRD') {
      window.location.href = 'https://birdbuddygame.netlify.app/';
    } else {
      alert('Please connect a NebuBuddy toy to start playing!');
    }
  };

  const handlePopItClick = () => {
    window.location.href = 'https://amitnebulisergame.netlify.app/';
  };

  let activeToyDetails: any = {
      tag: "NO TOY CONNECTED",
      name: "Ready to Play?",
      subtitle: "Connect your nebulizer toy\nto start the adventure!",
      element: <img src="/noanimal.svg" className="stone-placeholder" alt="No animal" />
  };
  if (activeToy === 'BEAR') activeToyDetails = { tag: "ACTIVE TOY", name: "Bear Buddy", subtitle: "Toy connected and ready!", element: <img src="/bear.svg" className="toy-character-img" alt="Bear Buddy" /> };
  if (activeToy === 'BIRD') activeToyDetails = { tag: "ACTIVE TOY", name: "Birdie", subtitle: "Toy connected and ready!", element: <img src="/bird.svg" className="toy-character-img" alt="Birdie" /> };

  // Dynamic pod base artwork (behind the Play button)
  let podBaseSrc = '/notoyconnected.svg';
  if (activeToy === 'BEAR') podBaseSrc = '/bearactive.svg';
  if (activeToy === 'BIRD') podBaseSrc = '/birdieactive.svg';

  return (
    <div className="app-container">
      <div className="background-layer"></div>

      <div className="scale-wrapper" style={{ transform: `scale(${scale})` }}>
        <header className="top-bar">
        <div className="profile-section">
          <div className="avatar">
            <img src="/amrutaprofile.svg" alt="Amruta" />
          </div>
          <div className="profile-info">
            <span className="greeting">Hi, Amruta!</span>
          </div>
        </div>

        <button 
          className={`status-badge ${isConnected ? 'connected' : 'disconnected'}`}
          onClick={!isConnected ? connectBluetooth : undefined}
        >
          <div className="bt-icon-wrapper-new">
            <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"></polyline></svg>
          </div>
          <div className="status-text">
            <span className="status-title">{isConnected ? 'Nebulizer Connected' : 'Connect Nebulizer'}</span>
            <span className="status-subtitle">{isConnected ? 'Device is ready' : 'Tap to connect'}</span>
          </div>
          {isConnected && (
            <div className="check-icon-wrapper">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
          )}
        </button>
      </header>

      {error && <div className="error-toast">{error}</div>}

      <main className="main-content">
        <div className="center-stage">
          <div className="pod">
             <div className="pod-dome">
               <div className="pod-content">
                  <span className="active-tag">ACTIVE TOY</span>
                  <h2>{activeToyDetails.name}</h2>
                  <p>{activeToyDetails.subtitle}</p>
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeToy}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 50, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="toy-character"
                    >
                       {activeToyDetails.element}
                    </motion.div>
                  </AnimatePresence>
               </div>
             </div>
             <div
               className="pod-base"
               style={{
                 backgroundImage: `url(${podBaseSrc})`,
                 backgroundSize: 'contain',
                 backgroundRepeat: 'no-repeat',
                 backgroundPosition: 'center bottom',
               }}
             ></div>
             
             <button 
               className="play-button"
               onClick={handlePlayClick}
               disabled={!activeToy || activeToy === 'NONE' || activeToy === 'IDLE'}
               style={{
                 opacity: (!activeToy || activeToy === 'NONE' || activeToy === 'IDLE') ? 0.5 : 1,
                 cursor: (!activeToy || activeToy === 'NONE' || activeToy === 'IDLE') ? 'not-allowed' : 'pointer'
               }}
             >
               <span className="play-icon">▶</span> Play
             </button>
          </div>
        </div>

        <div className="game-modes-section">
          <h3 className="section-title"><span>🍃</span> Choose Your Game Mode <span>🍃</span></h3>
          
          <div className="mode-cards">
            <div className={`mode-card-img-wrapper ${activeToy === 'BIRD' ? 'active' : ''}`}>
              <img src="/Bird Card.svg" alt="Care Mode" className="mode-card-img" />
            </div>

            <div className={`mode-card-img-wrapper ${activeToy === 'BEAR' ? 'active' : ''}`}>
              <img src="/bear card.svg" alt="Adventure Mode" className="mode-card-img" />
            </div>

            <div 
              className="mode-card-img-wrapper" 
              onClick={handlePopItClick} 
              style={{ cursor: 'pointer' }}
            >
              <img src="/Pop it.svg" alt="Pop It" className="mode-card-img" />
            </div>

            <div className={`mode-card-img-wrapper ${activeToy === 'IDLE' ? 'active' : ''}`}>
               <img src="/more card.svg" alt="Coming Soon" className="mode-card-img" />
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}

export default App;
