import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  Activity, 
  Package, 
  Menu, 
  X 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Product Mappings', icon: Package },
    { id: 'logs', label: 'Sync Logs', icon: Activity },
    { id: 'settings', label: 'Configuration', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-indigo-700 text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">Odoo-eBay Sync</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 z-20 h-screen w-64 bg-indigo-800 text-white transition-transform transform 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:flex md:flex-col
      `}>
        <div className="p-6 border-b border-indigo-700">
          <h1 className="text-2xl font-bold tracking-tight">Sync Engine</h1>
          <p className="text-indigo-300 text-sm mt-1">Odoo 19 ↔ eBay</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-indigo-700">
          <div className="bg-indigo-900/50 rounded p-3 text-xs text-indigo-200">
            <p className="font-semibold">System Status</p>
            <div className="flex items-center mt-2">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              Redis: Connected
            </div>
            <div className="flex items-center mt-1">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              Celery: Active
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;