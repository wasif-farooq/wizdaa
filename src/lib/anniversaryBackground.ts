import cron, { ScheduledTask } from 'node-cron';
import { triggerAnniversaryBonus } from './hcmStore';

let task: ScheduledTask | null = null;

export function startAnniversaryTimer() {
  if (task) return;

  console.log('[AnniversaryTimer] Starting cron job (*/45 * * * * *)');

  const tick = () => {
    const result = triggerAnniversaryBonus();
    if (result.success) {
      console.log(`[AnniversaryTimer] +${result.bonusDays} days for ${result.employeeId} / ${result.locationId}`);
    }
  };

  task = cron.schedule('*/45 * * * * *', tick);

  tick();
}

export function stopAnniversaryTimer() {
  if (task) {
    task.stop();
    task = null;
  }
}

startAnniversaryTimer();