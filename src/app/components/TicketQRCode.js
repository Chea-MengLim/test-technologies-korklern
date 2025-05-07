'use client';

import React from 'react';
import QRCode from 'react-qr-code';

function TicketQRCode() {
  const ticketData = {
    ticketId: 'abc123-xyz789',
    eventId: 'event567',
    type: 'VIP',
    date: '2025-06-01',
    place: 'Conference Hall A',
  };

  const qrValue = JSON.stringify(ticketData);

  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h2>Your Ticket QR Code</h2>
      <div style={{ background: 'white', padding: '16px', display: 'inline-block' }}>
        <QRCode value={qrValue} size={256} />
      </div>
      <pre style={{ marginTop: 20 }}>{qrValue}</pre>
    </div>
  );
}

export default TicketQRCode;
