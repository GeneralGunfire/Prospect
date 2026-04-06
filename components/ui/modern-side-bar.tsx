"use client";
import React, { useState, useEffect } from 'react';
import {
  Home, User, Settings, LogOut, Menu, X, ChevronLeft, ChevronRight,
  BarChart3, FileText, Bell, Search, HelpCircle, BookOpen, Briefcase, Map, Calendar,
} from 'lucide-react';

interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: string;
}

interface SidebarProps {
  className?: string;
  onNavigate?: (href: string) => void;
  activePage?: string;
  userName?: string;
}

const navigationItems: NavigationItem[] = [
  { id: "dashboard", name: "Dashboard", icon: Home, href: "/dashboard" },
  { id: "quiz", name: "Quiz", icon: BarChart3, href: "/quiz" },
  { id: "careers", name: "Careers", icon: Briefcase, href: "/careers" },
  { id: "tvet", name: "TVET Paths", icon: FileText, href: "/tvet" },
  { id: "library", name: "Study Library", icon: BookOpen, href: "/library" },
  { id: "bursaries", name: "Bursaries", icon: Bell, href: "/bursaries" },
  { id: "map", name: "Job Map", icon: Map, href: "/map" },
  { id: "calendar", name: "Calendar", icon: Calendar, href: "/calendar" },
  { id: "settings", name: "Settings", icon: Settings, href: "/settings" },
  { id: "help", name: "Help & Support", icon: HelpCircle, href: "/help" },
];

export function Sidebar({ className = "", onNavigate, activePage, userName }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState(activePage || "dashboard");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsOpen(true);
      else setIsOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleItemClick = (item: NavigationItem) => {
    setActiveItem(item.id);
    onNavigate?.(item.href);
    if (window.innerWidth < 768) setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 p-3 rounded-lg bg-white shadow-md border border-slate-100 md:hidden hover:bg-slate-50 transition-all duration-200"
        aria-label="Toggle sidebar"
        data-mobile-menu-trigger
      >
        {isOpen ? <X className="h-5 w-5 text-slate-600" /> : <Menu className="h-5 w-5 text-slate-600" />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-slate-200 z-40 transition-all duration-300 ease-in-out flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${isCollapsed ? "w-20" : "w-72"}
        md:translate-x-0 md:static md:z-auto
        ${className}
      `}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50/60">
          {!isCollapsed && (
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-[#176293] rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base">P</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800 text-base">Prospect SA</span>
                <span className="text-xs text-slate-500">Career Guidance</span>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-9 h-9 bg-[#176293] rounded-lg flex items-center justify-center mx-auto shadow-sm">
              <span className="text-white font-bold text-base">P</span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-md hover:bg-slate-100 transition-all duration-200"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4 text-slate-500" /> : <ChevronLeft className="h-4 w-4 text-slate-500" />}
          </button>
        </div>

        {!isCollapsed && (
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#176293] focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-0.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleItemClick(item)}
                    className={`
                      w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-md text-left transition-all duration-200 group relative
                      ${isActive ? "bg-[#176293]/10 text-[#176293]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                      ${isCollapsed ? "justify-center px-2" : ""}
                    `}
                  >
                    <div className="flex items-center justify-center min-w-[24px]">
                      <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-[#176293]" : "text-slate-500 group-hover:text-slate-700"}`} />
                    </div>
                    {!isCollapsed && (
                      <span className={`text-sm ${isActive ? "font-medium" : "font-normal"}`}>{item.name}</span>
                    )}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto border-t border-slate-200">
          <div className={`border-b border-slate-200 bg-slate-50/30 ${isCollapsed ? 'py-3 px-2' : 'p-3'}`}>
            {!isCollapsed ? (
              <div className="flex items-center px-3 py-2 rounded-md bg-white">
                <div className="w-8 h-8 bg-[#176293]/20 rounded-full flex items-center justify-center">
                  <span className="text-[#176293] font-medium text-sm">
                    {userName ? userName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                  </span>
                </div>
                <div className="flex-1 min-w-0 ml-2.5">
                  <p className="text-sm font-medium text-slate-800 truncate">{userName || "Student"}</p>
                  <p className="text-xs text-slate-500 truncate">SA Student</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-9 h-9 bg-[#176293]/20 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-[#176293]" />
                </div>
              </div>
            )}
          </div>

          <div className="p-3">
            <button
              className={`w-full flex items-center rounded-md text-left transition-all duration-200 group text-red-600 hover:bg-red-50 hover:text-red-700 ${isCollapsed ? "justify-center p-2.5" : "space-x-2.5 px-3 py-2.5"}`}
            >
              <LogOut className="h-4 w-4 flex-shrink-0 text-red-500" />
              {!isCollapsed && <span className="text-sm">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
