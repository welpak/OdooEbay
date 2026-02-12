import { SyncLogEntry, SyncStatus, SyncType, SystemHealth, ProductMapping } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock Data
let mockLogs: SyncLogEntry[] = [
  { id: '1', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), status: SyncStatus.SUCCESS, syncType: SyncType.ORDER, message: 'Imported 3 new orders from eBay.' },
  { id: '2', timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(), status: SyncStatus.SUCCESS, syncType: SyncType.INVENTORY, message: 'Updated stock for 15 products.' },
  { id: '3', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), status: SyncStatus.FAILED, syncType: SyncType.PRODUCT, message: 'Error mapping SKU "TSHIRT-001": Product not found in Odoo.' },
  { id: '4', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), status: SyncStatus.SUCCESS, syncType: SyncType.ORDER, message: 'No new orders found.' },
  { id: '5', timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), status: SyncStatus.SUCCESS, syncType: SyncType.INVENTORY, message: 'Full inventory sync completed.' },
];

const mockMappings: ProductMapping[] = [
  { id: '1', odooProductId: 101, ebaySku: 'EBAY-001', odooName: 'Wireless Mouse', lastSyncedAt: new Date().toISOString(), status: 'Synced' },
  { id: '2', odooProductId: 102, ebaySku: 'EBAY-002', odooName: 'Mechanical Keyboard', lastSyncedAt: new Date().toISOString(), status: 'Synced' },
  { id: '3', odooProductId: 103, ebaySku: 'EBAY-003', odooName: 'USB-C Cable', lastSyncedAt: new Date(Date.now() - 86400000).toISOString(), status: 'OutOfSync' },
];

export const fetchHealth = async (): Promise<SystemHealth> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        redisConnected: true,
        celeryWorkersActive: 2,
        lastSuccessfulSync: mockLogs.find(l => l.status === SyncStatus.SUCCESS)?.timestamp || null,
        pendingTasks: 0,
      });
    }, 500);
  });
};

export const fetchLogs = async (): Promise<SyncLogEntry[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }, 600);
  });
};

export const fetchMappings = async (): Promise<ProductMapping[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockMappings), 400);
    });
}

export const triggerSync = async (type: SyncType): Promise<SyncLogEntry> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newLog: SyncLogEntry = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        status: SyncStatus.SUCCESS,
        syncType: type,
        message: `Manual ${type} sync completed successfully.`,
      };
      mockLogs = [newLog, ...mockLogs];
      resolve(newLog);
    }, 2000);
  });
};

export const testOdooConnection = async (credentials: { url: string, db: string, username: string, apiKey: string }): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Validation Logic: Fail if using the default dummy data
      if (credentials.url.includes('odoo.mycompany.com') || credentials.apiKey === '••••••••••••••••') {
         resolve({
            success: false,
            message: 'Connection Failed: Invalid Hostname or API Key (Placeholder data detected).'
         });
         return;
      }

      if (!credentials.url.startsWith('http')) {
          resolve({
              success: false,
              message: 'Connection Failed: Invalid URL format (must start with http:// or https://).'
          });
          return;
      }

      if (credentials.db.trim() === '' || credentials.username.trim() === '') {
        resolve({
            success: false,
            message: 'Connection Failed: Database name and Username are required.'
        });
        return;
      }

      // If data looks "real" (changed from default), simulate a success
      const isSuccess = Math.random() > 0.05; // 95% success chance for valid-looking inputs
      resolve({
        success: isSuccess,
        message: isSuccess 
          ? `Successfully connected to Odoo 19 at ${credentials.url}` 
          : 'Connection Failed: Timeout reaching server (Simulation).'
      });
    }, 1500);
  });
};