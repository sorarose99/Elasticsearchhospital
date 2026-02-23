// QR Code generation utility for appointments
// This creates a simple QR code as an SVG for appointment confirmation

export interface AppointmentQRData {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  confirmationCode: string;
  hospitalName: string;
}

export function generateAppointmentQRCode(data: AppointmentQRData): string {
  // Create a JSON string with appointment data
  const qrData = JSON.stringify({
    type: 'appointment',
    id: data.appointmentId,
    patient: data.patientId,
    doctor: data.doctorId,
    datetime: `${data.date}T${data.time}`,
    code: data.confirmationCode,
    hospital: data.hospitalName
  });

  // For demo purposes, we'll create a simple placeholder QR code SVG
  // In a real implementation, you would use a QR code library like 'qrcode'
  const size = 200;
  const cellSize = size / 25; // 25x25 grid for simplicity
  
  // Create a simple pattern based on the data hash
  const hash = simpleHash(qrData);
  const pattern = generatePattern(hash, 25);
  
  let svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${size}" height="${size}" fill="white"/>`;
  
  // Add positioning squares (corners)
  svg += createPositioningSquare(0, 0, cellSize);
  svg += createPositioningSquare(18 * cellSize, 0, cellSize);
  svg += createPositioningSquare(0, 18 * cellSize, cellSize);
  
  // Add data pattern
  for (let row = 0; row < 25; row++) {
    for (let col = 0; col < 25; col++) {
      // Skip positioning squares
      if (isPositioningSquare(row, col)) continue;
      
      if (pattern[row][col]) {
        svg += `<rect x="${col * cellSize}" y="${row * cellSize}" width="${cellSize}" height="${cellSize}" fill="black"/>`;
      }
    }
  }
  
  svg += '</svg>';
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function generatePattern(hash: number, size: number): boolean[][] {
  const pattern: boolean[][] = [];
  let seed = hash;
  
  for (let row = 0; row < size; row++) {
    pattern[row] = [];
    for (let col = 0; col < size; col++) {
      // Simple pseudo-random generator
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      pattern[row][col] = (seed % 2) === 1;
    }
  }
  
  return pattern;
}

function createPositioningSquare(x: number, y: number, cellSize: number): string {
  const size = cellSize * 7;
  return `
    <rect x="${x}" y="${y}" width="${size}" height="${size}" fill="black"/>
    <rect x="${x + cellSize}" y="${y + cellSize}" width="${size - 2 * cellSize}" height="${size - 2 * cellSize}" fill="white"/>
    <rect x="${x + 2 * cellSize}" y="${y + 2 * cellSize}" width="${size - 4 * cellSize}" height="${size - 4 * cellSize}" fill="black"/>
  `;
}

function isPositioningSquare(row: number, col: number): boolean {
  // Top-left
  if (row >= 0 && row < 7 && col >= 0 && col < 7) return true;
  // Top-right
  if (row >= 0 && row < 7 && col >= 18 && col < 25) return true;
  // Bottom-left
  if (row >= 18 && row < 25 && col >= 0 && col < 7) return true;
  
  return false;
}

export function generateAppointmentPDF(data: AppointmentQRData): string {
  // For demo purposes, return a placeholder PDF data URL
  // In a real implementation, you would use a PDF generation library
  const pdfContent = `
    Appointment Confirmation
    
    Confirmation Code: ${data.confirmationCode}
    Date: ${data.date}
    Time: ${data.time}
    Hospital: ${data.hospitalName}
    
    Please arrive 15 minutes before your appointment time.
    Bring this confirmation and your identification.
  `;
  
  return `data:text/plain;base64,${btoa(pdfContent)}`;
}

export function shareAppointment(data: AppointmentQRData): void {
  const shareData = {
    title: 'Appointment Confirmation',
    text: `Your appointment is confirmed for ${data.date} at ${data.time}. Confirmation code: ${data.confirmationCode}`,
    url: window.location.origin + '/appointment/' + data.confirmationCode
  };

  if (navigator.share) {
    navigator.share(shareData);
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(shareData.text);
  }
}