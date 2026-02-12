import React, { useState } from 'react';
import { Save, ShieldCheck, Database, ShoppingBag, AlertCircle, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { testOdooConnection } from '../services/api';

const Settings: React.FC = () => {
  const [isTestingOdoo, setIsTestingOdoo] = useState(false);
  const [odooTestResult, setOdooTestResult] = useState<{success: boolean; message: string} | null>(null);

  // Form State
  const [odooConfig, setOdooConfig] = useState({
    url: 'https://odoo.mycompany.com',
    dbName: 'odoo_prod',
    username: 'admin',
    apiKey: ''
  });

  const handleOdooChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOdooConfig({
      ...odooConfig,
      [e.target.name]: e.target.value
    });
    // Clear test result when user types to avoid confusion
    if (odooTestResult) setOdooTestResult(null);
  };

  const handleTestConnection = async () => {
    setIsTestingOdoo(true);
    setOdooTestResult(null);
    
    try {
        const result = await testOdooConnection({
            url: odooConfig.url,
            dbName: odooConfig.dbName,
            username: odooConfig.username,
            apiKey: odooConfig.apiKey
        });
        setOdooTestResult(result);
    } catch (e) {
        setOdooTestResult({ success: false, message: "Network error connecting to API" });
    }
    
    setIsTestingOdoo(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Configuration</h2>
        <p className="text-gray-500 mt-1">Manage credentials and sync parameters.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Odoo Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
              <Database size={20} />
            </div>
            <h3 className="font-semibold text-indigo-900">Odoo 19 Connection</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Server URL</label>
              <input 
                type="text" 
                name="url"
                value={odooConfig.url}
                onChange={handleOdooChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
              <input 
                type="text" 
                name="dbName"
                value={odooConfig.dbName}
                onChange={handleOdooChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input 
                type="text" 
                name="username"
                value={odooConfig.username}
                onChange={handleOdooChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
              <input 
                type="password" 
                name="apiKey"
                value={odooConfig.apiKey}
                onChange={handleOdooChange}
                placeholder="Enter API Key"
                className="w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
              />
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
             <div className="flex-1 mr-4">
                {isTestingOdoo && (
                    <div className="flex items-center text-sm text-gray-500">
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Testing...
                    </div>
                )}
                {!isTestingOdoo && odooTestResult && (
                    <div className={`flex items-center text-sm ${odooTestResult.success ? 'text-green-600' : 'text-red-600'}`}>
                        {odooTestResult.success ? <CheckCircle className="mr-2" size={16}/> : <XCircle className="mr-2" size={16}/>}
                        <span className="truncate max-w-[150px] md:max-w-[200px]" title={odooTestResult.message}>{odooTestResult.message}</span>
                    </div>
                )}
             </div>
             <button 
                onClick={handleTestConnection}
                disabled={isTestingOdoo}
                className="text-sm text-indigo-600 font-medium hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 px-3 py-1.5 rounded transition-colors"
             >
                Test Connection
             </button>
          </div>
        </div>

        {/* eBay Configuration */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center space-x-3">
            <div className="p-2 bg-orange-100 text-orange-700 rounded-lg">
              <ShoppingBag size={20} />
            </div>
            <h3 className="font-semibold text-orange-900">eBay Inventory API</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">App ID (Client ID)</label>
              <input type="text" defaultValue="" placeholder="Enter App ID" className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cert ID (Client Secret)</label>
              <input type="password" value="" placeholder="Enter Cert ID" className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm p-2 border" />
            </div>
            <div className="pt-2">
               <div className="flex items-center space-x-2 text-sm text-gray-400 mb-2">
                  <ShieldCheck size={16} />
                  <span>OAuth Token Status: Unknown</span>
               </div>
               <button className="w-full py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                 Authenticate with eBay
               </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors font-medium">
          <Save size={18} />
          <span>Save Configuration</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;