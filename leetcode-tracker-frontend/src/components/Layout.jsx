import React, { useState } from 'react';
import { NavLink, Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, User as UserIcon, BookOpen, Map, LogOut, Code2, Sun, Moon, Bell, Menu, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import logoImg from '../assets/logo.jpeg';

export default function Layout({ onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: UserIcon },
    { name: 'Problems', path: '/practice', icon: BookOpen },
    { name: 'Roadmap', path: '/roadmap', icon: Map },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-sky-500/30 overflow-hidden transition-colors duration-300">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between flex-shrink-0 z-30 transition-transform duration-300`}>
        <div>
          <div className="p-6 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800/50">
            <div className="bg-slate-100 dark:bg-sky-500/20 rounded-xl overflow-hidden flex items-center justify-center w-10 h-10 border border-slate-200 dark:border-sky-500/30">
              <img src={logoImg} alt="DSA Mastery Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-wider text-slate-900 dark:text-slate-200">DSA<span className="font-normal text-slate-500 dark:text-sky-400">Mastery</span></span>
          </div>

          <nav className="p-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                    isActive
                      ? 'bg-slate-100 dark:bg-sky-500/10 text-slate-900 dark:text-sky-400 border border-slate-200 dark:border-sky-500/20 shadow-sm dark:shadow-[inset_0_0_20px_rgba(14,165,233,0.05)]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
                  }`
                }
              >
                <item.icon size={20} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800/50">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all font-medium border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex flex-col">
        {/* Abstract Background Effects (Dark Mode Only) */}
        <div className="hidden dark:block absolute top-[-10%] left-[-10%] w-96 h-96 bg-sky-500/10 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>
        <div className="hidden dark:block absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></div>
        
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 hover:opacity-80 transition-opacity hidden sm:flex">
              <img src={logoImg} alt="DSA Master Logo" className="w-8 h-8 rounded-lg object-cover shadow-sm" />
              <span>DSA Master</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <NavLink to="/profile" className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-sky-500 transition-all cursor-pointer">
              <UserIcon size={20} className="text-slate-500 dark:text-slate-400" />
            </NavLink>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
}
