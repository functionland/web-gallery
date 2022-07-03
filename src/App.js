import logo from './logo.svg';
import './App.css';
import { Route, BrowserRouter as Router, Routes, Link, NavLink } from 'react-router-dom';
import Boxes from './pages/Boxes';
import Gallery from './pages/Gallery';
import Identity from './pages/Identity';
import { useState } from 'react';
import { Status } from '@functionland/fula';

const hideIfActive = ({ isActive }) => { return isActive ? { display: 'none' } : {} }

function App() {

  // fula client
  const [fulaClient, setFulaClient] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState(Status.Offline)
  const [boxAddress, setBoxAddress] = useState(null)

  // DID
  const [DID, setDID] = useState(undefined)

  return (
    <div className="app">
        <div className='app-container'>
        <div className='app-header'>
            <NavLink to='/' className='link' style={hideIfActive}>Gallery</NavLink>
            <NavLink to='/boxes' className='link' style={hideIfActive}>Connect to Box</NavLink>
            <NavLink to='/identity' className='link' style={hideIfActive}>Connect to Wallet</NavLink>
          </div>
          <Routes>
            <Route path="/" element={<Gallery fulaClient={fulaClient} DID={DID} />} />
            <Route path="/boxes" element={
              <Boxes fulaClient={fulaClient}
                setFulaClient={setFulaClient}
                connectionStatus={connectionStatus}
                setConnectionStatus={setConnectionStatus}
                boxAddress={boxAddress}
                setBoxAddress={setBoxAddress} />
            } />
            <Route path="/identity" element={<Identity setDID={setDID} DID={DID} />} />
          </Routes>
        </div>

    </div>
  );
}

export default App;
