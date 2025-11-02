import React, { useState, useEffect, useRef } from 'react';
import SensorCard from './components/SensorCard';
import './App.css';

function App() {
  const [accelerometerData, setAccelerometerData] = useState<{ x: number | null, y: number | null, z: number | null }>({ x: null, y: null, z: null });
  const [gyroscopeData, setGyroscopeData] = useState<{ x: number | null, y: number | null, z: number | null }>({ x: null, y: null, z: null });
  const [magnetometerData, setMagnetometerData] = useState<{ x: number | null, y: number | null, z: number | null }>({ x: null, y: null, z: null });
  const [ambientLightData, setAmbientLightData] = useState<number | null>(null);
  const [geolocationData, setGeolocationData] = useState<{ lat: number, lon: number } | null>(null);
  const [batteryData, setBatteryData] = useState<{ level: number, charging: boolean } | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [proximityData, setProximityData] = useState<number | null>(null);
  const [absoluteOrientationData, setAbsoluteOrientationData] = useState<readonly [number, number, number, number] | null>(null);
  const [relativeOrientationData, setRelativeOrientationData] = useState<readonly [number, number, number, number] | null>(null);
  const [gravityData, setGravityData] = useState<{ x: number | null, y: number | null, z: number | null }>({ x: null, y: null, z: null });
  const [linearAccelerationData, setLinearAccelerationData] = useState<{ x: number | null, y: number | null, z: number | null }>({ x: null, y: null, z: null });
  const [deviceOrientationData, setDeviceOrientationData] = useState<{ alpha: number | null, beta: number | null, gamma: number | null }>({ alpha: null, beta: null, gamma: null });
  const [deviceMotionData, setDeviceMotionData] = useState<{ acceleration: { x: number | null, y: number | null, z: number | null } | null, rotationRate: { alpha: number | null, beta: number | null, gamma: number | null } | null }>({ acceleration: null, rotationRate: null });
  const [networkInfo, setNetworkInfo] = useState<{ effectiveType: string, downlink: number, rtt: number, saveData: boolean } | null>(null);
  const [deviceMemory, setDeviceMemory] = useState<number | null>(null);
  const [hardwareConcurrency, setHardwareConcurrency] = useState<number>(0);
  const [touchData, setTouchData] = useState<{ touches: number, targetTouches: number, changedTouches: number }>({ touches: 0, targetTouches: 0, changedTouches: 0 });
  const [screenOrientation, setScreenOrientation] = useState<string>('unknown'); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [fingerprintStatus, setFingerprintStatus] = useState<string>('Not authenticated');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Permission handling removed to prevent errors on unsupported permission names
    // handlePermission('accelerometer');
    // handlePermission('gyroscope');
    // handlePermission('magnetometer');
    // handlePermission('ambient-light-sensor');
    // handlePermission('geolocation');
    // handlePermission('camera');
  }, []);

  useEffect(() => {
    try {
      const accelerometer = new Accelerometer({ frequency: 60 });
      accelerometer.addEventListener('reading', () => {
        setAccelerometerData({ x: accelerometer.x, y: accelerometer.y, z: accelerometer.z });
      });
      accelerometer.start();
      return () => accelerometer.stop();
    } catch (error) {
      console.error('Accelerometer not found', error);
    }
  }, []);

  useEffect(() => {
    try {
      const gyroscope = new Gyroscope({ frequency: 60 });
      gyroscope.addEventListener('reading', () => {
        setGyroscopeData({ x: gyroscope.x, y: gyroscope.y, z: gyroscope.z });
      });
      gyroscope.start();
      return () => gyroscope.stop();
    } catch (error) {
      console.error('Gyroscope not found', error);
    }
  }, []);

  useEffect(() => {
    try {
      const magnetometer = new Magnetometer({ frequency: 60 });
      magnetometer.addEventListener('reading', () => {
        setMagnetometerData({ x: magnetometer.x, y: magnetometer.y, z: magnetometer.z });
      });
      magnetometer.start();
      return () => magnetometer.stop();
    } catch (error) {
      console.error('Magnetometer not found', error);
    }
  }, []);

  useEffect(() => {
    try {
      const ambientLight = new AmbientLightSensor({ frequency: 60 });
      ambientLight.addEventListener('reading', () => {
        setAmbientLightData(ambientLight.illuminance);
      });
      ambientLight.start();
      return () => ambientLight.stop();
    } catch (error) {
      console.error('AmbientLightSensor not found', error);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocationData({ lat: position.coords.latitude, lon: position.coords.longitude });
        },
        (error) => {
          console.error('Geolocation error', error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        setBatteryData({ level: battery.level, charging: battery.charging });
        battery.addEventListener('levelchange', () => {
          setBatteryData({ level: battery.level, charging: battery.charging });
        });
        battery.addEventListener('chargingchange', () => {
          setBatteryData({ level: battery.level, charging: battery.charging });
        });
      });
    }
  }, []);

  useEffect(() => {
    try {
      const proximity = new ProximitySensor({ frequency: 60 });
      proximity.addEventListener('reading', () => {
        setProximityData(proximity.distance);
      });
      proximity.start();
      return () => proximity.stop();
    } catch (error) {
      console.error('ProximitySensor not found', error);
    }
  }, []);

  useEffect(() => {
    try {
      const absoluteOrientation = new AbsoluteOrientationSensor({ frequency: 60 });
      absoluteOrientation.addEventListener('reading', () => {
        setAbsoluteOrientationData(absoluteOrientation.quaternion);
      });
      absoluteOrientation.start();
      return () => absoluteOrientation.stop();
    } catch (error) {
      console.error('AbsoluteOrientationSensor not found', error);
    }
  }, []);

  useEffect(() => {
    try {
      const relativeOrientation = new RelativeOrientationSensor({ frequency: 60 });
      relativeOrientation.addEventListener('reading', () => {
        setRelativeOrientationData(relativeOrientation.quaternion);
      });
      relativeOrientation.start();
      return () => relativeOrientation.stop();
    } catch (error) {
      console.error('RelativeOrientationSensor not found', error);
    }
  }, []);

  useEffect(() => {
    try {
      const gravity = new GravitySensor({ frequency: 60 });
      gravity.addEventListener('reading', () => {
        setGravityData({ x: gravity.x, y: gravity.y, z: gravity.z });
      });
      gravity.start();
      return () => gravity.stop();
    } catch (error) {
      console.error('GravitySensor not found', error);
    }
  }, []);

  useEffect(() => {
    try {
      const linearAcceleration = new LinearAccelerationSensor({ frequency: 60 });
      linearAcceleration.addEventListener('reading', () => {
        setLinearAccelerationData({ x: linearAcceleration.x, y: linearAcceleration.y, z: linearAcceleration.z });
      });
      linearAcceleration.start();
      return () => linearAcceleration.stop();
    } catch (error) {
      console.error('LinearAccelerationSensor not found', error);
    }
  }, []);

  useEffect(() => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      setDeviceOrientationData({ alpha: event.alpha, beta: event.beta, gamma: event.gamma });
    };
    window.addEventListener('deviceorientation', handleDeviceOrientation);
    return () => window.removeEventListener('deviceorientation', handleDeviceOrientation);
  }, []);

  useEffect(() => {
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      setDeviceMotionData({
        acceleration: event.acceleration ? { x: event.acceleration.x, y: event.acceleration.y, z: event.acceleration.z } : null,
        rotationRate: event.rotationRate ? { alpha: event.rotationRate.alpha, beta: event.rotationRate.beta, gamma: event.rotationRate.gamma } : null
      });
    };
    window.addEventListener('devicemotion', handleDeviceMotion);
    return () => window.removeEventListener('devicemotion', handleDeviceMotion);
  }, []);

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection!;
      setNetworkInfo({ effectiveType: connection.effectiveType, downlink: connection.downlink, rtt: connection.rtt, saveData: connection.saveData });
      connection.addEventListener('change', () => {
        setNetworkInfo({ effectiveType: connection.effectiveType, downlink: connection.downlink, rtt: connection.rtt, saveData: connection.saveData });
      });
    }
  }, []);

  useEffect(() => {
    if ('deviceMemory' in navigator) {
      setDeviceMemory(navigator.deviceMemory || null);
    }
    setHardwareConcurrency(navigator.hardwareConcurrency);
  }, []);

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      setTouchData({ touches: event.touches.length, targetTouches: event.targetTouches.length, changedTouches: event.changedTouches.length });
    };
    const handleTouchEnd = (event: TouchEvent) => {
      setTouchData({ touches: event.touches.length, targetTouches: event.targetTouches.length, changedTouches: event.changedTouches.length });
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Camera access denied', error);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const registerFingerprint = async () => {
    if (!('credentials' in navigator)) {
      setFingerprintStatus('Not supported');
      return;
    }
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge,
          rp: { name: 'Sensor PWA' },
          user: { id: new Uint8Array(16), name: 'user', displayName: 'User' },
          pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
        },
      });
      if (credential) {
        setFingerprintStatus('Registered');
      }
    } catch (error) {
      console.error('Fingerprint registration failed', error);
      setFingerprintStatus('Registration failed');
    }
  };

  const authenticateFingerprint = async () => {
    if (!('credentials' in navigator)) {
      setFingerprintStatus('Not supported');
      return;
    }
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge,
          userVerification: 'required',
        },
      });
      if (credential) {
        setFingerprintStatus('Authenticated');
      }
    } catch (error) {
      console.error('Fingerprint authentication failed', error);
      setFingerprintStatus('Authentication failed');
    }
  };

  const vibrateDevice = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📱 Sensor PWA</h1>
        <p>Test your device's sensors</p>
      </header>
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4 mb-4">
            <SensorCard sensorName="Accelerometer 📱" data={accelerometerData} />
          </div>
          <div className="col-md-4 mb-4">
            <SensorCard sensorName="Gyroscope 🌀" data={gyroscopeData} />
          </div>
          <div className="col-md-4 mb-4">
            <SensorCard sensorName="Magnetometer 🧲" data={magnetometerData} />
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">🌞 Ambient Light</div>
              <div className="card-body">
                <p>Illuminance: {ambientLightData !== null ? `${ambientLightData} lux` : 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">📍 Geolocation</div>
              <div className="card-body">
                {geolocationData ? (
                  <p>Lat: {geolocationData.lat}, Lon: {geolocationData.lon}</p>
                ) : (
                  <p>N/A</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">🔋 Battery</div>
              <div className="card-body">
                {batteryData ? (
                  <p>Level: {(batteryData.level * 100).toFixed(0)}%, Charging: {batteryData.charging ? 'Yes' : 'No'}</p>
                ) : (
                  <p>N/A</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">📷 Camera</div>
              <div className="card-body">
                <button className="btn btn-primary me-2" onClick={startCamera}>Start Camera</button>
                <button className="btn btn-secondary" onClick={stopCamera}>Stop Camera</button>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', marginTop: '10px', borderRadius: '10px' }} />
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">📁 File Upload</div>
              <div className="card-body">
                <input type="file" onChange={handleFileUpload} className="form-control mb-2" />
                {uploadedFile && <p>Uploaded: {uploadedFile.name}</p>}
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">🔐 Fingerprint</div>
              <div className="card-body">
                <button className="btn btn-primary me-2" onClick={registerFingerprint}>Register</button>
                <button className="btn btn-success" onClick={authenticateFingerprint}>Authenticate</button>
                <p>Status: {fingerprintStatus}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">⚙️ Permissions</div>
              <div className="card-body">
                <p>Permission status not available on this browser.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">📏 Proximity</div>
              <div className="card-body">
                <p>Distance: {proximityData !== null ? `${proximityData} cm` : 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">🧭 Absolute Orientation</div>
              <div className="card-body">
                <p>Quaternion: {absoluteOrientationData ? absoluteOrientationData.join(', ') : 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">🧭 Relative Orientation</div>
              <div className="card-body">
                <p>Quaternion: {relativeOrientationData ? relativeOrientationData.join(', ') : 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <SensorCard sensorName="🌍 Gravity" data={gravityData} />
          </div>
          <div className="col-md-4 mb-4">
            <SensorCard sensorName="🚀 Linear Acceleration" data={linearAccelerationData} />
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">📐 Device Orientation</div>
              <div className="card-body">
                <p>Alpha: {deviceOrientationData.alpha}, Beta: {deviceOrientationData.beta}, Gamma: {deviceOrientationData.gamma}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">📊 Device Motion</div>
              <div className="card-body">
                <p>Acceleration: {deviceMotionData.acceleration ? `X: ${deviceMotionData.acceleration.x}, Y: ${deviceMotionData.acceleration.y}, Z: ${deviceMotionData.acceleration.z}` : 'N/A'}</p>
                <p>Rotation Rate: {deviceMotionData.rotationRate ? `Alpha: ${deviceMotionData.rotationRate.alpha}, Beta: ${deviceMotionData.rotationRate.beta}, Gamma: ${deviceMotionData.rotationRate.gamma}` : 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">📡 Network Info</div>
              <div className="card-body">
                {networkInfo ? (
                  <p>Type: {networkInfo.effectiveType}, Downlink: {networkInfo.downlink} Mbps, RTT: {networkInfo.rtt} ms, Save Data: {networkInfo.saveData ? 'Yes' : 'No'}</p>
                ) : (
                  <p>N/A</p>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">💾 Device Memory</div>
              <div className="card-body">
                <p>Memory: {deviceMemory} GB</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">⚡ Hardware Concurrency</div>
              <div className="card-body">
                <p>Cores: {hardwareConcurrency}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">👆 Touch</div>
              <div className="card-body">
                <p>Touches: {touchData.touches}, Target Touches: {touchData.targetTouches}, Changed Touches: {touchData.changedTouches}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">📱 Screen Orientation</div>
              <div className="card-body">
                <p>Orientation: {screenOrientation}</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">📳 Vibration</div>
              <div className="card-body">
                <button className="btn btn-warning" onClick={vibrateDevice}>Vibrate</button>
              </div>
            </div>
          </div>
          {deferredPrompt && (
            <div className="col-md-4 mb-4">
              <div className="card">
                <div className="card-header">📲 Install PWA</div>
                <div className="card-body">
                  <button className="btn btn-success" onClick={handleInstallClick}>Install App</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
