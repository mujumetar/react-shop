import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const INDIAN_STATES = [
  'Gujarat',
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh',
  'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Haryana',
  'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal',
];

// Mirrors the server defaults; the server's own calculation is what gets charged.
export const DEFAULT_SHIPPING = { freeStates: ['Gujarat'], outsideBase: 100, outsidePerKg: 40, outsideFreeAbove: 0 };

const norm = (v = '') => String(v).trim().toLowerCase();

/** Returns 0 for free, a rupee amount, or null when the state is not chosen yet. */
export function calcShipping(settings, state, totalKg, subtotal) {
  if (!state) return null;
  const s = settings || DEFAULT_SHIPPING;
  if ((s.freeStates || []).map(norm).includes(norm(state))) return 0;
  if (s.outsideFreeAbove > 0 && subtotal >= s.outsideFreeAbove) return 0;
  const kg = Math.max(1, Math.ceil(Number(totalKg) || 0));
  return Math.round(s.outsideBase + (kg - 1) * s.outsidePerKg);
}

export function useShippingSettings() {
  const [settings, setSettings] = useState(DEFAULT_SHIPPING);
  useEffect(() => {
    let alive = true;
    fetch(`${API_URL}/api/shipping/settings`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => { if (alive && d) setSettings({ ...DEFAULT_SHIPPING, ...d }); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);
  return settings;
}
