'use client';

import Link from 'next/link';
import { 
  Users, 
  LayoutDashboard, 
  Settings, 
  LogOut,
  StoreIcon,
  X 
} from 'lucide-react';

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const sidebarLinks = [
    { title: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, href: '/dashboard', active: true },
    { title: 'Create Store', icon: <StoreIcon className="h-5 w-5" />, href: '/dashboard/createStore' },
    { title: 'Create User', icon: <Users className="h-5 w-5" />, href: '/dashboard/createUser' },
    { title: 'Categories', icon: <Users className="h-5 w-5" />, href: '/dashboard/categories' },
    { title: 'Logout', icon: <Users className="h-5 w-5" />, href: '/login-super-admin' },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 bg-white border-r border-gray-200 w-64`}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Super Admin</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                link.active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {link.icon}
              <span>{link.title}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t">
          <Link 
            href="/logout"
            className="flex items-center space-x-3 text-red-600 hover:text-red-700 w-full px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}