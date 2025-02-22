import { useState } from 'react';
import { Home, Users, Calendar, FileText, BarChart, Settings, Search, Bell, UserCircle } from 'lucide-react';

export default function DashboardLayout() {
  const [active, setActive] = useState('Dashboard');

  const menuItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'Team', icon: Users },
    { name: 'Projects', icon: Calendar },
    { name: 'Calendar', icon: Calendar },
    { name: 'Documents', icon: FileText },
    { name: 'Reports', icon: BarChart },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-lg font-semibold">Dashboard</div>
        <nav className="flex-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex items-center space-x-4 p-4 w-full text-left ${active === item.name ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 mt-auto">
          <button className="flex items-center space-x-4 w-full text-left hover:bg-gray-800 p-4">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white shadow">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-6">
            <Bell size={24} className="text-gray-600" />
            <div className="flex items-center space-x-2">
              <UserCircle size={32} className="text-gray-600" />
              <span>Tom Cook</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <section className="flex-1 p-6 bg-gray-50">
          <div className="h-full border-dashed border-2 border-gray-300 flex items-center justify-center">
            Content Area
          </div>
        </section>
      </main>
    </div>
  );
}