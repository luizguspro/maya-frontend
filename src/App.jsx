// src/App.jsx
import React, { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeadsPipeline from './pages/LeadsPipeline';
import QRCodeIntegration from './pages/QRCodeIntegration';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import Contacts from './pages/Contacts';
import Messages from './pages/Messages';
import Sidebar from './components/Sidebar';
import { mockUser } from './data/mockData';
import { Menu, X } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveMenu('dashboard');
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay para mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <Sidebar 
          user={mockUser} 
          activeMenu={activeMenu} 
          setActiveMenu={(menu) => {
            setActiveMenu(menu);
            setSidebarOpen(false);
          }} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {activeMenu === 'dashboard' && <Dashboard />}
          {activeMenu === 'pipeline' && <LeadsPipeline />}
          {activeMenu === 'leads' && <Contacts />}
          {activeMenu === 'messages' && <Messages />}
          {activeMenu === 'qrcode' && <QRCodeIntegration />}
          {activeMenu === 'calendar' && <Calendar />}
          {activeMenu === 'analytics' && <Analytics />}
          {activeMenu === 'settings' && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Configurações em desenvolvimento...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;