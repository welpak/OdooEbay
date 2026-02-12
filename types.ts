export enum SyncStatus {
  SUCCESS = 'Success',
  FAILED = 'Failed',
  PENDING = 'Pending',
  RUNNING = 'Running'
}

export enum SyncType {
  ORDER = 'Order',
  PRODUCT = 'Product',
  INVENTORY = 'Inventory'
}

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  status: SyncStatus;
  syncType: SyncType;
  message: string;
}

export interface SystemHealth {
  redisConnected: boolean;
  celeryWorkersActive: number;
  lastSuccessfulSync: string | null;
  pendingTasks: number;
}

export interface OdooConfig {
  url: string;
  dbName: string;
  username: string;
  apiKey: string;
}

export interface EbayConfig {
  appId: string;
  certId: string;
  userToken: string;
  refreshToken: string;
}

export interface ProductMapping {
  id: string;
  odooProductId: number;
  ebaySku: string;
  odooName: string;
  lastSyncedAt: string;
  status: 'Synced' | 'Error' | 'OutOfSync';
}