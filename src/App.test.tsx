import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// @ts-ignore
global.MediaStream = jest.fn();

// Mock navigator
const mockNavigator = {
  permissions: {
    query: jest.fn().mockResolvedValue({ state: 'granted', onchange: jest.fn() }),
  },
  geolocation: {
    getCurrentPosition: jest.fn().mockImplementation((success) => {
      success({ coords: { latitude: 40.7128, longitude: -74.0060, accuracy: 100 } });
    }),
  },
  getBattery: jest.fn().mockResolvedValue({
    level: 0.8,
    charging: false,
    addEventListener: jest.fn(),
  }),
  mediaDevices: {
    getUserMedia: jest.fn().mockResolvedValue(new MediaStream()),
  },
  credentials: {
    create: jest.fn().mockResolvedValue({}),
    get: jest.fn().mockResolvedValue({}),
  },
};

// Mock window
Object.defineProperty(window, 'navigator', {
  value: mockNavigator,
  writable: true,
});

// @ts-ignore
global.MediaStream = jest.fn();

// @ts-ignore
global.Accelerometer = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  x: 1, y: 2, z: 3,
}));

// @ts-ignore
global.Gyroscope = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  x: 4, y: 5, z: 6,
}));

// @ts-ignore
global.Magnetometer = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  x: 7, y: 8, z: 9,
}));

// @ts-ignore
global.ProximitySensor = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  distance: 10,
}));

// @ts-ignore
global.AbsoluteOrientationSensor = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  quaternion: [0, 0, 0, 1],
}));

// @ts-ignore
global.RelativeOrientationSensor = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  quaternion: [0, 0, 0, 1],
}));

// @ts-ignore
global.GravitySensor = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  x: 0, y: 0, z: 9.8,
}));

// @ts-ignore
global.LinearAccelerationSensor = jest.fn().mockImplementation(() => ({
  addEventListener: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  x: 0, y: 0, z: 0,
}));

// Mock window events
Object.defineProperty(window, 'addEventListener', {
  writable: true,
  value: jest.fn(),
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  value: jest.fn(),
});

// Mock screen
Object.defineProperty(window, 'screen', {
  value: {
    orientation: {
      type: 'portrait-primary',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
  },
  writable: true,
});

// Mock navigator extensions
(mockNavigator as any).deviceMemory = 8;
(mockNavigator as any).hardwareConcurrency = 4;
(mockNavigator as any).connection = {
  effectiveType: '4g',
  downlink: 10,
  rtt: 50,
  saveData: false,
  addEventListener: jest.fn(),
};
(mockNavigator as any).vibrate = jest.fn();

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the app title', () => {
    render(<App />);
    expect(screen.getByText('Sensor PWA')).toBeInTheDocument();
  });

  test('renders sensor cards', () => {
    render(<App />);
    expect(screen.getByText('Accelerometer')).toBeInTheDocument();
    expect(screen.getByText('Gyroscope')).toBeInTheDocument();
    expect(screen.getByText('Magnetometer')).toBeInTheDocument();
  });

  test('renders additional features', () => {
    render(<App />);
    expect(screen.getByText('Ambient Light')).toBeInTheDocument();
    expect(screen.getByText('Geolocation')).toBeInTheDocument();
    expect(screen.getByText('Battery')).toBeInTheDocument();
    expect(screen.getByText('Camera')).toBeInTheDocument();
    expect(screen.getByText('File Upload')).toBeInTheDocument();
    expect(screen.getByText('Fingerprint')).toBeInTheDocument();
  });

  test('camera buttons work', async () => {
    render(<App />);
    const startButton = screen.getByText('Start Camera');
    const stopButton = screen.getByText('Stop Camera');

    fireEvent.click(startButton);
    await waitFor(() => {
      expect(mockNavigator.mediaDevices.getUserMedia).toHaveBeenCalled();
    });

    fireEvent.click(stopButton);
    // Assuming stop logic is handled
  });

  test('file upload works', () => {
    render(<App />);
    const input = screen.getByDisplayValue(''); // Assuming input is empty initially
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(input, { target: { files: [file] } });
    expect(screen.getByText('Uploaded: test.txt')).toBeInTheDocument();
  });

  test('fingerprint register works when supported', async () => {
    render(<App />);
    const registerButton = screen.getByText('Register');

    fireEvent.click(registerButton);
    await waitFor(() => {
      expect(mockNavigator.credentials.create).toHaveBeenCalledWith({
        publicKey: {
          challenge: expect.any(Uint8Array),
          rp: { name: 'Sensor PWA' },
          user: { id: expect.any(Uint8Array), name: 'user', displayName: 'User' },
          pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
        },
      });
    });
    expect(screen.getByText('Status: Registered')).toBeInTheDocument();
  });

  test('fingerprint authenticate works when supported', async () => {
    render(<App />);
    const authButton = screen.getByText('Authenticate');

    fireEvent.click(authButton);
    await waitFor(() => {
      expect(mockNavigator.credentials.get).toHaveBeenCalledWith({
        publicKey: {
          challenge: expect.any(Uint8Array),
          userVerification: 'required',
        },
      });
    });
    expect(screen.getByText('Status: Authenticated')).toBeInTheDocument();
  });

  test('renders additional sensor cards', () => {
    render(<App />);
    expect(screen.getByText('Proximity')).toBeInTheDocument();
    expect(screen.getByText('Absolute Orientation')).toBeInTheDocument();
    expect(screen.getByText('Relative Orientation')).toBeInTheDocument();
    expect(screen.getByText('Gravity')).toBeInTheDocument();
    expect(screen.getByText('Linear Acceleration')).toBeInTheDocument();
    expect(screen.getByText('Device Orientation')).toBeInTheDocument();
    expect(screen.getByText('Device Motion')).toBeInTheDocument();
    expect(screen.getByText('Network Info')).toBeInTheDocument();
    expect(screen.getByText('Device Memory')).toBeInTheDocument();
    expect(screen.getByText('Hardware Concurrency')).toBeInTheDocument();
    expect(screen.getByText('Touch')).toBeInTheDocument();
    expect(screen.getByText('Screen Orientation')).toBeInTheDocument();
    expect(screen.getByText('Vibration')).toBeInTheDocument();
  });

  test('vibrate button works', () => {
    render(<App />);
    const vibrateButton = screen.getByText('Vibrate');
    fireEvent.click(vibrateButton);
    expect((mockNavigator as any).vibrate).toHaveBeenCalledWith(200);
  });

  test('fingerprint shows not supported if not available', () => {
    // Temporarily remove credentials
    delete (window.navigator as any).credentials;

    render(<App />);
    const registerButton = screen.getByText('Register');
    fireEvent.click(registerButton);
    expect(screen.getByText('Status: Not supported')).toBeInTheDocument();

    // Restore
    (window.navigator as any).credentials = mockNavigator.credentials;
  });
});