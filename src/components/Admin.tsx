import React, { useState, useEffect } from 'react';
import '../App.css';

interface DeviceInfo {
  id: string;
  timestamp: string;
  userAgent: string;
  platform: string;
  language: string;
  screenWidth: number;
  screenHeight: number;
  deviceMemory: number | null;
  hardwareConcurrency: number;
  cookieEnabled: boolean;
  online: boolean;
  batteryLevel: number | null;
  batteryCharging: boolean | null;
  networkType: string | null;
  downlink: number | null;
  rtt: number | null;
  sensors: string[];
}

const Admin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [inventory, setInventory] = useState<DeviceInfo[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<DeviceInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('');

  useEffect(() => {
    const storedInventory = localStorage.getItem('deviceInventory');
    if (storedInventory) {
      const parsed = JSON.parse(storedInventory);
      setInventory(parsed);
      setFilteredInventory(parsed);
    }
  }, []);

  useEffect(() => {
    let filtered = inventory;
    if (searchTerm) {
      filtered = filtered.filter(device =>
        device.userAgent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.platform.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterPlatform) {
      filtered = filtered.filter(device => device.platform === filterPlatform);
    }
    setFilteredInventory(filtered);
  }, [searchTerm, filterPlatform, inventory]);

  const handleLogin = () => {
    if (password === 'admin123') { // Simple password
      setAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(inventory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'device_inventory.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!authenticated) {
    return (
      <div className="App">
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">Admin Login</div>
                <div className="card-body">
                  <input
                    type="password"
                    className="form-control mb-3"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={handleLogin}>Login</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">🔐</div>
            <div className="brand">
              <h1>Admin Dashboard</h1>
              <p>Device Inventory Management</p>
            </div>
          </div>
          <div className="status-bar">
            <button className="btn btn-outline-light" onClick={exportData}>Export Data</button>
          </div>
        </div>
      </header>
      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header">Filters</div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by user agent or platform"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <select
                      className="form-control"
                      value={filterPlatform}
                      onChange={(e) => setFilterPlatform(e.target.value)}
                    >
                      <option value="">All Platforms</option>
                      <option value="Win32">Windows</option>
                      <option value="MacIntel">Mac</option>
                      <option value="Linux x86_64">Linux</option>
                      <option value="iPhone">iPhone</option>
                      <option value="iPad">iPad</option>
                      <option value="Android">Android</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              {filteredInventory.map((device) => (
                <div key={device.id} className="col-md-4 mb-4">
                  <div className="card">
                    <div className="card-header">Device ID: {device.id}</div>
                    <div className="card-body">
                      <p><strong>Timestamp:</strong> {new Date(device.timestamp).toLocaleString()}</p>
                      <p><strong>Platform:</strong> {device.platform}</p>
                      <p><strong>User Agent:</strong> {device.userAgent}</p>
                      <p><strong>Screen:</strong> {device.screenWidth}x{device.screenHeight}</p>
                      <p><strong>Memory:</strong> {device.deviceMemory} GB</p>
                      <p><strong>Cores:</strong> {device.hardwareConcurrency}</p>
                      <p><strong>Battery:</strong> {device.batteryLevel ? `${(device.batteryLevel * 100).toFixed(0)}%` : 'N/A'} ({device.batteryCharging ? 'Charging' : 'Not Charging'})</p>
                      <p><strong>Network:</strong> {device.networkType} ({device.downlink} Mbps, {device.rtt} ms RTT)</p>
                      <p><strong>Sensors:</strong> {device.sensors.join(', ')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;