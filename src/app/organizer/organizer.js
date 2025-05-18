"use client"
/// pages/organizer.js
import { useState } from 'react';

export default function OrganizerPage() {
  const [status, setStatus] = useState('');
  
  // Simulated paymentIntentId (replace this with real one from your database)
  const paymentIntentId = 'pi_3RQ9vxBC6CEuQswR1f0xObXT';

  const handleRefund = async () => {
    setStatus('Processing refund...');

    try {
      const res = await fetch('/api/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId })
      });

      const data = await res.json();
      if (data.success) {
        setStatus('Refund successful!');
      } else {
        setStatus(`Refund failed: ${data.error}`);
      }
    } catch (err) {
      setStatus('Refund error occurred.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Event Organizer Dashboard</h1>
      <p>Refund Ticket Payment</p>
      <button 
        onClick={handleRefund} 
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        Issue Refund
      </button>
      <p>{status}</p>
    </div>
  );
}
