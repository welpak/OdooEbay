import React, { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle, Clock, ShoppingCart, Archive, ArrowRight, AlertTriangle } from 'lucide-react';
import { SystemHealth, SyncLogEntry, SyncType, SyncStatus } from '../types';
import { fetchHealth, fetchLogs, triggerSync } from '../services/api';

interface DashboardProps {
    onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [recentLogs, setRecentLogs] = useState<SyncLogEntry[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const healthData = await fetchHealth();
      setHealth(healthData);
      const logs = await fetchLogs();
      setRecentLogs(logs.slice(0, 5));
      setError(null);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
      setError("Failed to connect to backend service.");
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
        await triggerSync(SyncType.INVENTORY);
        await loadData(); // Refresh logs immediately
    } catch (e) {
        console.error("Sync trigger failed", e);
        alert("Failed to trigger sync.");
    }
    setIsSyncing(false);
  };

  if (error && !health) {
      return (
          <div className="p-8 text-center bg-red-50 rounded-xl border border-red-200">
              <AlertTriangle className="mx-auto text-red-500 mb-2" size={32} />
              <h3 className="text-lg font-bold text-red-700">System Unavailable</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button onClick={loadData} className="px-4 py-2 bg-white border border-red-300 rounded hover:bg-red-50">Retry Connection</button>
          </div>
      );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">System Overview</h2>
        <div className="flex space-x-3">
          <button 
            onClick={handleManualSync}
            disabled={isSyncing}
            className={`
              flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors
              ${isSyncing ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Inventory Now'}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${health?.redisConnected ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">System Health</p>
            <p className="text-lg font-bold text-gray-800">{health?.redisConnected ? 'Operational' : 'Degraded'}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Clock size={24} />
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">Last Successful Sync</p>
                <p className="text-sm font-bold text-gray-800">
                    {health?.lastSuccessfulSync 
                    ? new Date(health.lastSuccessfulSync).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                    : 'Never'}
                </p>
            </div>
        </div>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Orders</p>
            <p className="text-lg font-bold text-gray-800">0</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Archive size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Queued Updates</p>
            <p className="text-lg font-bold text-gray-800">{health?.pendingTasks || 0}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="font-semibold text-gray-800">Recent Sync Activity</h3>
          <button 
            onClick={() => onNavigate('logs')}
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center font-medium"
          >
            View All Logs <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Message</th>
                <th className="px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${log.status === SyncStatus.SUCCESS ? 'bg-green-100 text-green-800' : ''}
                      ${log.status === SyncStatus.FAILED ? 'bg-red-100 text-red-800' : ''}
                      ${log.status === SyncStatus.RUNNING ? 'bg-blue-100 text-blue-800' : ''}
                    `}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-800">{log.syncType}</td>
                  <td className="px-6 py-3 truncate max-w-md">{log.message}</td>
                  <td className="px-6 py-3 text-gray-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
              {recentLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    No recent activity found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;