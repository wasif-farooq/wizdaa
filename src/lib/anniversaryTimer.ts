import { triggerAnniversaryBonus } from '../lib/hcmStore';

let timer: NodeJS.Timeout | null = null;
let isRunning = false;

export function startAnniversaryTimer(intervalMs: number = 45000) {
  if (isRunning || process.env.NODE_ENV === 'production') {
    return;
  }
  
  isRunning = true;
  
  timer = setInterval(() => {
    const result = triggerAnniversaryBonus();
    if (result.success) {
      console.log(
        `[Anniversary] +${result.bonusDays} days added to ${result.employeeId} / ${result.locationId}`
      );
    }
  }, intervalMs);
  
  console.log(`[Anniversary] Timer started (every ${intervalMs / 1000}s)`);
}

export function stopAnniversaryTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  isRunning = false;
  console.log('[Anniversary] Timer stopped');
}

export function getAnniversaryTimerStatus() {
  return { isRunning, interval: timer ? 45000 : null };
}