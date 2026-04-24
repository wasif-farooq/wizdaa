import http from 'http';
import type { Balance } from '../../src/lib/types';

declare global {
  var __balances: Map<string, { employeeId: string; locationId: string; locationName: string; balanceDays: number; version: number; lastUpdated: string }> | undefined;
}

const LOCATIONS = [
  { id: 'loc-ny', name: 'New York Office' },
  { id: 'loc-sf', name: 'San Francisco Office' },
  { id: 'loc-chi', name: 'Chicago Office' },
  { id: 'loc-uk', name: 'London Office' },
];

const EMPLOYEES = [
  { id: 'emp-001', name: 'Alice Johnson' },
  { id: 'emp-002', name: 'Bob Smith' },
  { id: 'emp-003', name: 'Carol Williams' },
  { id: 'emp-004', name: 'David Brown' },
  { id: 'emp-005', name: 'Eva Martinez' },
  { id: 'emp-006', name: 'Frank Lee' },
  { id: 'emp-007', name: 'Grace Kim' },
  { id: 'emp-008', name: 'Henry Wilson' },
  { id: 'emp-009', name: 'Iris Chen' },
  { id: 'emp-010', name: 'Jack Davis' },
];

function initializeBalances(): Map<string, Balance> {
  const balances = new Map<string, Balance>();
  
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

function resetBalances() {
  global.__balances = initializeBalances();
}

function makeHandler() {
  return async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const url = req.url || '/';
    const pathname = url.split('?')[0];
    const searchParams = new URL(url, 'http://localhost').searchParams;
    
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }
    
    const parsedBody = body ? JSON.parse(body) : {};
    
    res.setHeader('Content-Type', 'application/json');
    
    try {
      if (pathname === '/api/hcm/balance' && req.method === 'GET') {
        const employeeId = searchParams.get('employeeId');
        const locationId = searchParams.get('locationId');
        
        if (!employeeId || !locationId) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'MISSING_PARAMS', message: 'employeeId and locationId required' }));
          return;
        }
        
        if (Math.random() < 0.05) {
          res.writeHead(500);
          res.end(JSON.stringify({ success: false, error: 'SERVER_ERROR', message: 'HCM temporarily unavailable' }));
          return;
        }
        
        const balance = global.__balances?.get(`${employeeId}:${locationId}`);
        
        if (!balance) {
          res.writeHead(404);
          res.end(JSON.stringify({ success: false, error: 'NOT_FOUND', message: 'Balance not found' }));
          return;
        }
        
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          balanceDays: balance.balanceDays,
          version: balance.version,
          lastUpdated: balance.lastUpdated,
        }));
        return;
      }
      
      if (pathname === '/api/hcm/balance' && req.method === 'POST') {
        const { employeeId, locationId, requestedDays } = parsedBody;
        
        if (!employeeId || !locationId || !requestedDays) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'MISSING_PARAMS', message: 'Missing params' }));
          return;
        }
        
        if (Math.random() < 0.05) {
          res.writeHead(500);
          res.end(JSON.stringify({ success: false, error: 'SERVER_ERROR', message: 'HCM temporarily unavailable' }));
          return;
        }
        
        const balance = global.__balances?.get(`${employeeId}:${locationId}`);
        
        if (!balance) {
          res.writeHead(404);
          res.end(JSON.stringify({ success: false, error: 'NOT_FOUND' }));
          return;
        }
        
        if (balance.balanceDays < requestedDays) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'INSUFFICIENT_BALANCE', message: 'Not enough days' }));
          return;
        }
        
        balance.balanceDays -= requestedDays;
        balance.version += 1;
        balance.lastUpdated = new Date().toISOString();
        
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          newBalance: balance.balanceDays,
          version: balance.version,
          lastUpdated: balance.lastUpdated,
        }));
        return;
      }
      
      if (pathname === '/api/hcm/batch' && req.method === 'GET') {
        const employeeId = searchParams.get('employeeId');
        
        if (!employeeId) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'MISSING_PARAMS' }));
          return;
        }
        
        if (Math.random() < 0.05) {
          res.writeHead(500);
          res.end(JSON.stringify({ success: false, error: 'SERVER_ERROR' }));
          return;
        }
        
        await new Promise(r => setTimeout(r, 10));
        
        const balances: Balance[] = [];
        for (const [key, balance] of global.__balances || []) {
          if (balance.employeeId === employeeId) {
            balances.push(balance);
          }
        }
        
        if (Math.random() < 0.05) {
          balances.splice(0, 1);
        }
        
        res.writeHead(200);
        res.end(JSON.stringify({ balances }));
        return;
      }
      
      if (pathname === '/api/hcm/check' && req.method === 'POST') {
        const { employeeId, locationId, requestedDays } = parsedBody;
        
        if (!employeeId || !locationId || !requestedDays) {
          res.writeHead(400);
          res.end(JSON.stringify({ sufficient: false, message: 'Missing params' }));
          return;
        }
        
        if (Math.random() < 0.05) {
          res.writeHead(500);
          res.end(JSON.stringify({ sufficient: false, message: 'HCM temporarily unavailable' }));
          return;
        }
        
        const balance = global.__balances?.get(`${employeeId}:${locationId}`);
        
        if (!balance) {
          res.writeHead(200);
          res.end(JSON.stringify({ sufficient: false, availableBalance: 0, requestedDays, message: 'Balance not found' }));
          return;
        }
        
        const sufficient = balance.balanceDays >= requestedDays;
        res.writeHead(200);
        res.end(JSON.stringify({
          sufficient,
          availableBalance: balance.balanceDays,
          requestedDays,
          message: sufficient ? 'Balance sufficient' : `Only ${balance.balanceDays} days available`,
        }));
        return;
      }
      
      if (pathname === '/api/hcm/deny' && req.method === 'POST') {
        const { employeeId, locationId, requestedDays } = parsedBody;
        
        if (!employeeId || !locationId || !requestedDays) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: 'MISSING_PARAMS' }));
          return;
        }
        
        if (Math.random() < 0.05) {
          res.writeHead(500);
          res.end(JSON.stringify({ success: false, error: 'SERVER_ERROR' }));
          return;
        }
        
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, message: 'Request has been denied' }));
        return;
      }
      
      if (pathname === '/api/hcm/anniversary' && req.method === 'POST') {
        if (!global.__balances || global.__balances.size === 0) {
          res.writeHead(500);
          res.end(JSON.stringify({ success: false, error: 'TRIGGER_FAILED' }));
          return;
        }
        
        const keys = Array.from(global.__balances.keys());
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const balance = global.__balances.get(randomKey);
        
        if (balance) {
          balance.balanceDays += 5;
          balance.version += 1;
          balance.lastUpdated = new Date().toISOString();
          
          res.writeHead(200);
          res.end(JSON.stringify({
            success: true,
            employeeId: balance.employeeId,
            locationId: balance.locationId,
            bonusDays: 5,
          }));
          return;
        }
        
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: 'TRIGGER_FAILED' }));
        return;
      }
      
      if (pathname === '/api/hcm/timer' && req.method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({ message: 'Timer running', intervalMs: 45000 }));
        return;
      }
      
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal error', message: (err as Error).message }));
    }
  };
}

export async function makeRequest(method: string, path: string, body?: unknown) {
  return new Promise<{ status: number; body: unknown }>((resolve) => {
    const server = http.createServer(makeHandler());
    
    server.listen(0, () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 3000;
      
      const options: http.RequestOptions = {
        hostname: 'localhost',
        port,
        path,
        method,
        headers: body ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(body)),
        } : {},
      };
      
      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          resolve({
            status: res.statusCode || 500,
            body: data ? JSON.parse(data) : {},
          });
          server.close();
        });
      });
      
      if (body) {
        req.write(JSON.stringify(body));
      }
      req.end();
    });
  });
}

export { resetBalances };