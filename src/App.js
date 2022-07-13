import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter as Router, Routes, Link, NavLink, useLocation } from 'react-router-dom';
import Boxes from './pages/Boxes';
import Gallery from './pages/Gallery';
import Identity from './pages/Identity';
import { useEffect, useState } from 'react';
import { Status } from '@functionland/fula';
import SharedPhotos from './pages/SharedPhotos';

const hideIfActive = ({ isActive }) => { return isActive ? { display: 'none' } : {} }

function App() {

  // fula client
  const [fulaClient, setFulaClient] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState(Status.Offline)
  const [boxAddress, setBoxAddress] = useState(null)

  // DID
  const [DID, setDID] = useState(undefined)

  const location = useLocation()

  const navLinks = [
    {
      to: '/',
      caption: 'Gallery'
    },
    {
      to: '/box',
      caption: 'Connect to Box'
    },
    {
      to: '/identity',
      caption: 'Connect to Wallet'
    },
    {
      to: '/shared',
      caption: 'Shared'
    }
  ]
  return (
    <div className="app">
      <div className='app-container'>
        <div className='app-header'>
          {navLinks.filter(link => link.to !== location.pathname).map(link => <NavLink to={link.to} className="link">{link.caption}</NavLink>)}
        </div>
        <Routes>
          <Route path="/" element={<Gallery fulaClient={fulaClient} DID={DID} />} />
          <Route path="/box" element={
            <Boxes fulaClient={fulaClient}
              setFulaClient={setFulaClient}
              connectionStatus={connectionStatus}
              setConnectionStatus={setConnectionStatus}
              boxAddress={boxAddress}
              setBoxAddress={setBoxAddress} />
          } />
          <Route path="/identity" element={<Identity setDID={setDID} DID={DID} />} />
          <Route path="/shared" element={<SharedPhotos fulaClient={fulaClient} DID={DID} />} />
        </Routes>
      </div>

    </div>
  );
}

export default App;
