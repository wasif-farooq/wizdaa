'use client';

import { useEffect } from 'react';
import { useBalanceStore } from '@/src/stores';

export function AnniversaryTimer() {
  const { setBalances, balances } = useBalanceStore();
  
  useEffect(() => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch('/api/hcm/anniversary', { method: 'POST' });
        const data = await res.json();
        
        if (data.success) {
          console.log(`[Anniversary] +${data.bonusDays} days for ${data.employeeId} / ${data.locationId}`);
        }
      } catch (err) {
        console.error('[Anniversary] Failed:', err);
      }
    }, 45000);
    
    return () => clearInterval(timer);
  }, []);
  
  return null;
}