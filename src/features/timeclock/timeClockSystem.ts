export interface TimeClockEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  clockIn: Date;
  clockOut?: Date;
  breakStart?: Date;
  breakEnd?: Date;
  location?: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
  photoUrl?: string;
  badgeId?: string;
  status: 'on-time' | 'late' | 'early' | 'no-show';
  notes?: string;
}

export interface TimeClockSettings {
  requireGPS: boolean;
  requirePhoto: boolean;
  geofenceRadius: number; // meters
  allowedLocations: Array<{
    name: string;
    latitude: number;
    longitude: number;
  }>;
  graceperiodMinutes: number; // how many minutes late before marked "late"
}

export const DEFAULT_TIMECLOCK_SETTINGS: TimeClockSettings = {
  requireGPS: true,
  requirePhoto: false,
  geofenceRadius: 100, // 100 meters
  allowedLocations: [
    { name: 'Main Office', latitude: 40.7128, longitude: -74.0060 },
  ],
  gracePeriodMinutes: 5,
};

// Calculate distance between two GPS coordinates (Haversine formula)
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Verify GPS location is within allowed area
export function verifyLocation(
  userLat: number,
  userLon: number,
  settings: TimeClockSettings
): { valid: boolean; nearestLocation?: string; distance?: number } {
  let nearestDistance = Infinity;
  let nearestLocation = '';

  settings.allowedLocations.forEach(location => {
    const distance = calculateDistance(
      userLat,
      userLon,
      location.latitude,
      location.longitude
    );

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestLocation = location.name;
    }
  });

  const valid = nearestDistance <= settings.geofenceRadius;

  return {
    valid,
    nearestLocation,
    distance: nearestDistance,
  };
}

// Request browser geolocation
export async function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
} | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.error('Geolocation not supported');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

// Capture photo from webcam
export async function capturePhoto(): Promise<string | null> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: 640, height: 480 },
    });

    const video = document.createElement('video');
    video.srcObject = stream;
    video.play();

    // Wait for video to be ready
    await new Promise((resolve) => {
      video.onloadedmetadata = resolve;
    });

    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, 640, 480);

    // Stop the stream
    stream.getTracks().forEach(track => track.stop());

    // Convert to base64
    return canvas.toDataURL('image/jpeg', 0.8);
  } catch (error) {
    console.error('Camera error:', error);
    return null;
  }
}

// Determine clock-in status
export function determineClockInStatus(
  scheduledTime: string, // "08:00"
  actualTime: Date,
  graceperiodMinutes: number
): 'on-time' | 'late' | 'early' {
  const [hours, minutes] = scheduledTime.split(':').map(Number);
  const scheduled = new Date(actualTime);
  scheduled.setHours(hours, minutes, 0, 0);

  const diffMinutes = (actualTime.getTime() - scheduled.getTime()) / (1000 * 60);

  if (diffMinutes <= -15) return 'early'; // More than 15 min early
  if (diffMinutes <= graceperiodMinutes) return 'on-time';
  return 'late';
}

// Calculate total worked hours including break
export function calculateWorkedHours(entry: TimeClockEntry): number {
  if (!entry.clockOut) return 0;

  let totalMillis = entry.clockOut.getTime() - entry.clockIn.getTime();

  // Subtract break time if applicable
  if (entry.breakStart && entry.breakEnd) {
    const breakMillis = entry.breakEnd.getTime() - entry.breakStart.getTime();
    totalMillis -= breakMillis;
  }

  return totalMillis / (1000 * 60 * 60); // Convert to hours
}

// Format duration for display
export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}

// Generate QR code data for badge scanning
export function generateBadgeQR(employeeId: string): string {
  const data = {
    type: 'noxshift-badge',
    employeeId,
    timestamp: Date.now(),
  };
  return btoa(JSON.stringify(data));
}

// Parse QR code badge scan
export function parseBadgeQR(qrData: string): { employeeId: string; timestamp: number } | null {
  try {
    const decoded = JSON.parse(atob(qrData));
    if (decoded.type === 'noxshift-badge') {
      return {
        employeeId: decoded.employeeId,
        timestamp: decoded.timestamp,
      };
    }
  } catch (e) {
    console.error('Invalid QR code');
  }
  return null;
}

// Clock-in validation
export async function validateClockIn(
  employeeId: string,
  settings: TimeClockSettings
): Promise<{
  valid: boolean;
  errors: string[];
  location?: { latitude: number; longitude: number; accuracy: number };
  photoUrl?: string;
}> {
  const errors: string[] = [];
  let location: { latitude: number; longitude: number; accuracy: number } | undefined;
  let photoUrl: string | undefined;

  // GPS verification
  if (settings.requireGPS) {
    location = await getCurrentLocation();
    if (!location) {
      errors.push('GPS location required but not available');
    } else {
      const verification = verifyLocation(location.latitude, location.longitude, settings);
      if (!verification.valid) {
        errors.push(
          `Location verification failed. You are ${Math.round(verification.distance!)} meters from ${verification.nearestLocation} (max: ${settings.geofenceRadius}m)`
        );
      }
    }
  }

  // Photo verification
  if (settings.requirePhoto) {
    photoUrl = await capturePhoto();
    if (!photoUrl) {
      errors.push('Photo verification required but camera not available');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    location,
    photoUrl,
  };
}

// Mock hardware badge scanners support
export const SUPPORTED_HARDWARE = [
  { id: 'rfid-hid', name: 'HID ProxCard', type: 'RFID' },
  { id: 'rfid-mifare', name: 'MIFARE Classic', type: 'RFID' },
  { id: 'nfc-general', name: 'NFC Tags', type: 'NFC' },
  { id: 'qr-scanner', name: 'QR Code Scanner', type: 'QR' },
  { id: 'barcode-scanner', name: 'Barcode Scanner', type: 'Barcode' },
  { id: 'biometric-fingerprint', name: 'Fingerprint Scanner', type: 'Biometric' },
  { id: 'biometric-facial', name: 'Facial Recognition', type: 'Biometric' },
  { id: 'kronos-terminal', name: 'Kronos InTouch', type: 'Terminal' },
  { id: 'adp-terminal', name: 'ADP Time Clock', type: 'Terminal' },
  { id: 'tcp-terminal', name: 'TimeClock Plus', type: 'Terminal' },
];
