import React, { useEffect, useState } from 'react';
import { SyncLogEntry, SyncStatus } from '../types';
import { fetchLogs } from '../services/mockApi';
import { Search, Filter, RefreshCw } from 'lucide-react';

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<SyncLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const loadLogs = async () => {
    setIsLoading(true);
    const data = await fetchLogs();
    setLogs(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'All' || log.status === filter;
    const matchesSearch = log.message.toLowerCase().includes(search.toLowerCase()) || 
                          log.syncType.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800">System Logs</h2>
        <button 
          onClick={loadLogs} 
          className="p-2 text-gray-500 hover:text-indigo-600 transition-colors"
          title="Refresh Logs"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search logs..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter size={18} className="text-gray-400" />
          <span className="text-sm text-gray-500">Filter by Status:</span>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value={SyncStatus.SUCCESS}>Success</option>
            <option value={SyncStatus.FAILED}>Failed</option>
            <option value={SyncStatus.RUNNING}>Running</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 w-1/2">Message</th>
                <th className="px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                       <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${log.status === SyncStatus.SUCCESS ? 'bg-green-50 text-green-700 border-green-200' : ''}
                        ${log.status === SyncStatus.FAILED ? 'bg-red-50 text-red-700 border-red-200' : ''}
                        ${log.status === SyncStatus.RUNNING ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                      `}>
                        {log.status === SyncStatus.SUCCESS && <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>}
                        {log.status === SyncStatus.FAILED && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>}
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{log.syncType}</td>
                    <td className="px-6 py-4 font-mono text-xs md:text-sm text-gray-600">{log.message}</td>
                    <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 bg-gray-50">
                    <p className="text-lg font-medium">No logs found</p>
                    <p className="text-sm">Try adjusting your search or filters.</p>
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

export default Logs;