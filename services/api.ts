import { SyncLogEntry, SystemHealth, ProductMapping, SyncType, OdooConfig, EbayConfig } from '../types';

const API_BASE = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${response.status} ${errorText}`);
  }
  return response.json();
}

export const fetchHealth = async (): Promise<SystemHealth> => {
  return handleResponse<SystemHealth>(await fetch(`${API_BASE}/health/`));
};

export const fetchLogs = async (): Promise<SyncLogEntry[]> => {
  return handleResponse<SyncLogEntry[]>(await fetch(`${API_BASE}/logs/`));
};

export const fetchMappings = async (): Promise<ProductMapping[]> => {
  return handleResponse<ProductMapping[]>(await fetch(`${API_BASE}/mappings/`));
};

export const triggerSync = async (type: SyncType): Promise<SyncLogEntry> => {
  return handleResponse<SyncLogEntry>(await fetch(`${API_BASE}/sync/trigger/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type }),
  }));
};

export const testOdooConnection = async (credentials: OdooConfig): Promise<{ success: boolean; message: string }> => {
  return handleResponse<{ success: boolean; message: string }>(await fetch(`${API_BASE}/config/test-odoo/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  }));
};

// Add placeholders for other config savings if needed in the future
export const saveOdooConfig = async (config: OdooConfig) => {
    return handleResponse(await fetch(`${API_BASE}/config/odoo/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
    }));
};
