interface SensorOptions {
  frequency?: number;
}

interface Sensor extends EventTarget {
  start(): void;
  stop(): void;
}

declare class SensorBase implements Sensor {
  constructor(options?: SensorOptions);
  start(): void;
  stop(): void;
  onreading: (() => void) | null;
  onerror: ((error: any) => void) | null;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  dispatchEvent(event: Event): boolean;
}

declare class Accelerometer extends SensorBase {
  constructor(options?: SensorOptions);
  readonly x: number | null;
  readonly y: number | null;
  readonly z: number | null;
}

declare class Gyroscope extends SensorBase {
  constructor(options?: SensorOptions);
  readonly x: number | null;
  readonly y: number | null;
  readonly z: number | null;
}

declare class Magnetometer extends SensorBase {
  constructor(options?: SensorOptions);
  readonly x: number | null;
  readonly y: number | null;
  readonly z: number | null;
}

declare class AmbientLightSensor extends SensorBase {
  constructor(options?: SensorOptions);
  readonly illuminance: number | null;
}

declare class ProximitySensor extends SensorBase {
  constructor(options?: SensorOptions);
  readonly distance: number | null;
  readonly max: number | null;
  readonly min: number | null;
}

declare class AbsoluteOrientationSensor extends SensorBase {
  constructor(options?: SensorOptions);
  readonly quaternion: readonly [number, number, number, number] | null;
}

declare class RelativeOrientationSensor extends SensorBase {
  constructor(options?: SensorOptions);
  readonly quaternion: readonly [number, number, number, number] | null;
}

declare class GravitySensor extends SensorBase {
  constructor(options?: SensorOptions);
  readonly x: number | null;
  readonly y: number | null;
  readonly z: number | null;
}

declare class LinearAccelerationSensor extends SensorBase {
  constructor(options?: SensorOptions);
  readonly x: number | null;
  readonly y: number | null;
  readonly z: number | null;
}

interface DeviceOrientationEvent extends Event {
  readonly alpha: number | null;
  readonly beta: number | null;
  readonly gamma: number | null;
  readonly absolute: boolean;
}

interface DeviceMotionEvent extends Event {
  readonly acceleration: DeviceAcceleration | null;
  readonly accelerationIncludingGravity: DeviceAcceleration | null;
  readonly rotationRate: DeviceRotationRate | null;
  readonly interval: number;
}

interface DeviceAcceleration {
  readonly x: number | null;
  readonly y: number | null;
  readonly z: number | null;
}

interface DeviceRotationRate {
  readonly alpha: number | null;
  readonly beta: number | null;
  readonly gamma: number | null;
}

interface Window {
  ondeviceorientation: ((this: Window, ev: DeviceOrientationEvent) => any) | null;
  ondevicemotion: ((this: Window, ev: DeviceMotionEvent) => any) | null;
}

interface Navigator {
  deviceMemory?: number;
  hardwareConcurrency: number;
  connection?: NetworkInformation;
}

interface NetworkInformation extends EventTarget {
  readonly effectiveType: string;
  readonly downlink: number;
  readonly rtt: number;
  readonly saveData: boolean;
}

interface VibrationPattern {
  // number or array of numbers
}

interface Navigator {
  vibrate(pattern: VibrationPattern): boolean;
}

interface TouchEvent extends Event {
  readonly touches: TouchList;
  readonly targetTouches: TouchList;
  readonly changedTouches: TouchList;
}

interface TouchList {
  readonly length: number;
  item(index: number): Touch | null;
  [index: number]: Touch;
}

interface Touch {
  readonly identifier: number;
  readonly target: EventTarget;
  readonly screenX: number;
  readonly screenY: number;
  readonly clientX: number;
  readonly clientY: number;
  readonly pageX: number;
  readonly pageY: number;
}

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

interface Navigator {
  getBattery(): Promise<BatteryManager>;
}

interface GeolocationPosition {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  timestamp: number;
}

interface GeolocationPositionError {
  code: number;
  message: string;
}

interface Geolocation {
  getCurrentPosition(success: (position: GeolocationPosition) => void, error?: (error: GeolocationPositionError) => void, options?: PositionOptions): void;
  watchPosition(success: (position: GeolocationPosition) => void, error?: (error: GeolocationPositionError) => void, options?: PositionOptions): number;
  clearWatch(id: number): void;
}

interface Navigator {
  geolocation: Geolocation;
}

interface MediaStreamConstraints {
  audio?: boolean | MediaTrackConstraints;
  video?: boolean | MediaTrackConstraints;
}

interface MediaDevices {
  getUserMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
}

interface Navigator {
  mediaDevices: MediaDevices;
}

interface CredentialCreationOptions {
  publicKey: PublicKeyCredentialCreationOptions;
}

interface PublicKeyCredentialCreationOptions {
  challenge: Uint8Array;
  rp: { name: string; id?: string };
  user: { id: Uint8Array; name: string; displayName: string };
  pubKeyCredParams: { type: string; alg: number }[];
  authenticatorSelection?: { authenticatorAttachment?: string; requireResidentKey?: boolean; userVerification?: string };
  timeout?: number;
  attestation?: string;
}

interface PublicKeyCredential {
  id: string;
  rawId: ArrayBuffer;
  response: AuthenticatorAttestationResponse;
  type: string;
}

interface AuthenticatorAttestationResponse {
  clientDataJSON: ArrayBuffer;
  attestationObject: ArrayBuffer;
}

interface CredentialRequestOptions {
  publicKey: PublicKeyCredentialRequestOptions;
}

interface PublicKeyCredentialRequestOptions {
  challenge: Uint8Array;
  allowCredentials?: { type: string; id: Uint8Array }[];
  timeout?: number;
  userVerification?: string;
}

interface AuthenticatorAssertionResponse {
  clientDataJSON: ArrayBuffer;
  authenticatorData: ArrayBuffer;
  signature: ArrayBuffer;
  userHandle?: ArrayBuffer;
}

interface CredentialsContainer {
  create(options?: CredentialCreationOptions): Promise<PublicKeyCredential | null>;
  get(options?: CredentialRequestOptions): Promise<PublicKeyCredential | null>;
}

interface Navigator {
  credentials: CredentialsContainer;
}
