interface BalanceRecord {
  employeeId: string;
  locationId: string;
  locationName: string;
  balanceDays: number;
  version: number;
  lastUpdated: string;
}

const LOCATIONS = [
  { id: 'loc-ny', name: 'New York Office' },
  { id: 'loc-sf', name: 'San Francisco Office' },
  { id: 'loc-chi', name: 'Chicago Office' },
  { id: 'loc-uk', name: 'London Office' },
];

const EMPLOYEES = [
  { id: 'emp-001', name: 'Alice Johnson', department: 'Engineering' },
  { id: 'emp-002', name: 'Bob Smith', department: 'Marketing' },
  { id: 'emp-003', name: 'Carol Williams', department: 'Sales' },
  { id: 'emp-004', name: 'David Brown', department: 'Engineering' },
  { id: 'emp-005', name: 'Eva Martinez', department: 'HR' },
  { id: 'emp-006', name: 'Frank Lee', department: 'Finance' },
  { id: 'emp-007', name: 'Grace Kim', department: 'Engineering' },
  { id: 'emp-008', name: 'Henry Wilson', department: 'Operations' },
  { id: 'emp-009', name: 'Iris Chen', department: 'Legal' },
  { id: 'emp-010', name: 'Jack Davis', department: 'Engineering' },
];

function initializeBalances(): Map<string, BalanceRecord> {
  const balances = new Map<string, BalanceRecord>();
  
  for (const emp of EMPLOYEES) {
    for (const loc of LOCATIONS) {
      const key = `${emp.id}:${loc.id}`;
      balances.set(key, {
        employeeId: emp.id,
        locationId: loc.id,
        locationName: loc.name,
        balanceDays: 10 + Math.floor(Math.random() * 20),
        version: 1,
        lastUpdated: new Date().toISOString(),
      });
    }
  }
  
  return balances;
}

declare global {
  var __balances: Map<string, BalanceRecord> | undefined;
}

let balances: Map<string, BalanceRecord>;

if (!global.__balances) {
  global.__balances = initializeBalances();
}
balances = global.__balances;

export function getBalanceRecord(employeeId: string, locationId: string): BalanceRecord | null {
  return balances.get(`${employeeId}:${locationId}`) || null;
}

export function getAllBalances(employeeId: string): BalanceRecord[] {
  const results: BalanceRecord[] = [];
  
  for (const record of balances.values()) {
    if (record.employeeId === employeeId) {
      results.push(record);
    }
  }
  
  return results;
}

export function updateBalance(
  employeeId: string,
  locationId: string,
  days: number
): { success: boolean; newBalance?: number; version?: number; error?: string; message?: string; lastUpdated?: string } {
  const key = `${employeeId}:${locationId}`;
  const record = balances.get(key);
  
  if (!record) {
    return { success: false, error: 'NOT_FOUND', message: 'Balance record not found' };
  }
  
  if (record.balanceDays < days) {
    return {
      success: false,
      error: 'INSUFFICIENT_BALANCE',
      message: `Requested ${days} days but only ${record.balanceDays} available`,
    };
  }
  
  if (Math.random() < 0.1) {
    return {
      success: true,
      newBalance: record.balanceDays,
      version: record.version,
      lastUpdated: record.lastUpdated,
    };
  }
  
  record.balanceDays -= days;
  record.version += 1;
  record.lastUpdated = new Date().toISOString();
  
  return {
    success: true,
    newBalance: record.balanceDays,
    version: record.version,
    lastUpdated: record.lastUpdated,
  };
}

export function triggerAnniversaryBonus(): { success: boolean; employeeId?: string; locationId?: string; bonusDays?: number } {
  const employeeIds = Array.from(new Set(Array.from(balances.values()).map((b: BalanceRecord) => b.employeeId)));
  const empId = employeeIds[Math.floor(Math.random() * employeeIds.length)];
  
  const empBalances = Array.from(balances.values()).filter(
    (b: BalanceRecord) => b.employeeId === empId
  );
  
  if (empBalances.length === 0) {
    return { success: false };
  }
  
  const loc = empBalances[Math.floor(Math.random() * empBalances.length)];
  const record = balances.get(`${empId}:${loc.locationId}`);
  
  if (record) {
    record.balanceDays += 5;
    record.version += 1;
    record.lastUpdated = new Date().toISOString();
    
    return {
      success: true,
      employeeId: empId,
      locationId: loc.locationId,
      bonusDays: 5,
    };
  }
  
  return { success: false };
}

export function checkBalance(
  employeeId: string,
  locationId: string,
  requestedDays: number
): { sufficient: boolean; availableBalance: number; requestedDays: number; message: string } {
  const record = getBalanceRecord(employeeId, locationId);

  if (!record) {
    return {
      sufficient: false,
      availableBalance: 0,
      requestedDays,
      message: 'Balance record not found',
    };
  }

  const sufficient = record.balanceDays >= requestedDays;

  if (!sufficient) {
    return {
      sufficient: false,
      availableBalance: record.balanceDays,
      requestedDays,
      message: `Only ${record.balanceDays} days available, cannot approve ${requestedDays} days`,
    };
  }

  return {
    sufficient: true,
    availableBalance: record.balanceDays,
    requestedDays,
    message: 'Balance sufficient for approval',
  };
}

export function denyRequest(
  employeeId: string,
  locationId: string,
  requestedDays: number
): { success: boolean; message?: string } {
  console.log(`[HCM] Request denied: ${employeeId} / ${locationId} / ${requestedDays} days`);
  return { success: true, message: 'Request has been denied' };
}

export { EMPLOYEES, LOCATIONS };