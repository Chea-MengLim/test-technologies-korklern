'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const MOCK_TICKETS = [
  { ticketId: 'abc123-xyz789', eventId: 'event567' },
  { ticketId: 'def456-uvw123', eventId: 'event568' },
];

function QRScanner() {
  const [message, setMessage] = useState('');
  const [lastScanned, setLastScanned] = useState('');
  const html5QrCodeRef = useRef(null);
  const qrRegionId = 'qr-reader';
  const isProcessingRef = useRef(false); // Prevent multiple scans at once

  const playSound = (isSuccess) => {
    const audio = new Audio(isSuccess ? '/success.mp3' : '/error.mp3');
    audio.play().catch((err) => console.error('Audio play error:', err));
  };

  const startScanner = async () => {
    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
    }

    try {
      await html5QrCodeRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          // Avoid duplicate processing or spam
          if (isProcessingRef.current || decodedText === lastScanned) return;

          isProcessingRef.current = true;
          setLastScanned(decodedText);

          try {
            const parsed = JSON.parse(decodedText);
            const isValid = MOCK_TICKETS.some(
              (ticket) =>
                ticket.ticketId === parsed.ticketId &&
                ticket.eventId === parsed.eventId
            );
            setMessage(isValid ? '✅ Ticket is valid!' : '❌ Invalid Ticket!');
            playSound(isValid);
          } catch {
            setMessage('❌ Invalid QR data');
            playSound(false);
          }

          // Allow scanning next code after short delay
          setTimeout(() => {
            isProcessingRef.current = false;
            setMessage('');
          }, 1000); // adjust this timeout to your scan speed
        },
        (error) => {
          // ignore scan errors (no QR in view, etc.)
        }
      );
    } catch (err) {
      console.error('Failed to start scanner:', err);
    }
  };

  useEffect(() => {
    startScanner();

    return () => {
      html5QrCodeRef.current?.stop().catch(() => {});
      html5QrCodeRef.current?.clear().catch(() => {});
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h2>QR Ticket Scanner</h2>
      <div id={qrRegionId} style={{ width: '300px', margin: '0 auto' }}></div>
      {message && (
        <div style={{ marginTop: 20 }}>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default QRScanner;
