import React from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  BookOpen, 
  Briefcase, 
  FileText, 
  FolderKanban, 
  Bot, 
  Bell, 
  ShieldCheck, 
  Compass, 
  ChevronDown,
  Lock,
  LogOut,
  UserPlus,
  KeyRound,
  Database
} from 'lucide-react';
import { StudentProfile } from '../types';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  profile: StudentProfile;
  isAuthenticatedAdmin: boolean;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfileModal: () => void;
  onOpenRegistration: () => void;
  onOpenCredentials: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  profile,
  isAuthenticatedAdmin,
  onOpenAdminLogin,
  onAdminLogout,
  unreadCount,
  onOpenNotifications,
  onOpenProfileModal,
  onOpenRegistration,
  onOpenCredentials,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Compass },
    { id: 'courses', label: 'Learning Hub', icon: BookOpen },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FolderKanban },
    { id: 'ai-hub', label: 'AI Assistant', icon: Bot },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  if (isAuthenticatedAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Portal', icon: ShieldCheck });
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Digital Superhighway Ribbon with Credentials reminder */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white text-xs py-1 px-4 text-center font-medium flex items-center justify-between sm:justify-center gap-2 shadow-inner">
        <div className="flex items-center gap-2 truncate">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse shrink-0" />
          <span className="truncate">Connecting Students with <strong>Education + Skills + Opportunities + Digital Superhighway</strong></span>
          <span className="hidden sm:inline-block bg-white/20 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold">
            AI-Powered
          </span>
        </div>
        <button
          onClick={onOpenCredentials}
          className="ml-2 bg-amber-400/90 hover:bg-amber-300 text-slate-950 font-bold px-2.5 py-0.5 rounded-full text-[11px] flex items-center gap-1 shadow-xs transition-colors shrink-0 cursor-pointer"
          title="Remind me email, password & database status"
        >
          <KeyRound className="w-3 h-3 text-slate-900" />
          <span>🔑 Credentials & DB</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-slate-900 text-lg font-['Outfit']">
                  SMARTSTUDENT
                </span>
                <span className="bg-gradient-to-r from-indigo-600 to-teal-500 text-white text-[11px] font-bold px-1.5 py-0.5 rounded tracking-wide flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block leading-tight">
                Digital Platform for Student Learning & Careers
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Credentials & Database Quick Action Button */}
            <button
              onClick={onOpenCredentials}
              title="View account credentials and database status"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Credentials & DB</span>
              <span className="md:hidden">Creds</span>
            </button>

            {/* Student Registration Button */}
            <button
              onClick={onOpenRegistration}
              title="Register a new student account"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs shadow-indigo-200 transition-all cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Register Student</span>
              <span className="sm:hidden">Register</span>
            </button>

            {/* Authenticated Admin Badge or Secure Admin Login */}
            {isAuthenticatedAdmin ? (
              <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 text-indigo-900 px-2.5 py-1 rounded-xl text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline font-bold">Admin Active</span>
                <button
                  onClick={onAdminLogout}
                  title="Sign out of administrative portal"
                  className="ml-1 p-1 hover:bg-indigo-100 text-indigo-700 rounded-lg flex items-center gap-1 text-[11px] font-semibold transition-colors"
                >
                  <LogOut className="w-3 h-3" />
                  <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                title="Authenticate as Institution / Platform Admin"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Admin Login</span>
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Profile Pill */}
            <div 
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl border border-slate-200/90 hover:border-indigo-300 hover:bg-indigo-50/40 cursor-pointer transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-teal-400 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {profile.fullName.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[110px]">
                  {profile.fullName}
                </p>
                <p className="text-[10px] text-slate-500 leading-tight">
                  {profile.institutionType}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Horizontal Scroll Nav */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

