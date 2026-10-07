import React, { useState } from 'react';
import {
  HeartPulse,
  LayoutDashboard,
  PackageCheck,
  ClipboardList,
  Building2,
  Bell,
  CalendarClock,
  FolderHeart,
  Stethoscope,
  User,
  RotateCcw,
  Menu,
  X,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'equipment'
  | 'requests'
  | 'resources'
  | 'reminders'
  | 'records'
  | 'symptoms'
  | 'notifications'
  | 'profile';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadCount: number;
  onResetDataClick: () => void;
  userName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  unreadCount,
  onResetDataClick,
  userName,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'equipment', label: 'Equipment', icon: <PackageCheck className="w-4 h-4" /> },
    { id: 'requests', label: 'My Requests', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'resources', label: 'Find Care', icon: <Building2 className="w-4 h-4" /> },
    { id: 'reminders', label: 'Reminders', icon: <CalendarClock className="w-4 h-4" /> },
    { id: 'records', label: 'Health Records', icon: <FolderHeart className="w-4 h-4" /> },
    { id: 'symptoms', label: 'Symptom Guidance', icon: <Stethoscope className="w-4 h-4" /> },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Clean Brand Zone */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-hidden group"
            >
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs group-hover:bg-teal-700 transition-colors">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
                  CureLink
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-sm">
                  Healthcare Platform
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs xl:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-teal-50 text-teal-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Reset Demo Data Button */}
            <button
              onClick={onResetDataClick}
              title="Reset sample data in browser localStorage"
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => handleNavClick('notifications')}
              title="View Notifications"
              className={`relative p-2 rounded-lg transition-colors border ${
                currentTab === 'notifications'
                  ? 'bg-teal-50 text-teal-700 border-teal-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Profile Avatar / Quick Link */}
            <button
              onClick={() => handleNavClick('profile')}
              title="Open User Profile"
              className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border transition-colors ${
                currentTab === 'profile'
                  ? 'bg-teal-50 border-teal-300 text-teal-800'
                  : 'border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-xs font-bold">
                {userName.charAt(0) || 'U'}
              </div>
              <span className="text-xs font-medium max-w-[90px] truncate hidden sm:inline-block">
                {userName.split(' ')[0]}
              </span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                onResetDataClick();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 px-3 py-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
            <span className="text-xs text-slate-400">Offline LocalStorage Mode</span>
          </div>
        </div>
      )}
    </header>
  );
};
