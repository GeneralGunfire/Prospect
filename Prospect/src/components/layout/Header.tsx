import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, ShieldCheck, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import { useDataSaver } from '../../contexts/DataSaverContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { dataSaverMode, setMode } = useDataSaver();
  const { user, logout, isAuthenticated, isGuest } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const navLinks = [
    ...(isAuthenticated ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
    { name: 'Quiz', path: '/quiz' },
    { name: 'Careers', path: '/careers' },
    { name: 'Bursaries', path: '/bursaries' },
    { name: 'APS Calc', path: '/aps-calculator' },
    { name: 'Library', path: '/library' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavContent = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          onClick={() => mobile && setIsDrawerOpen(false)}
          className={cn(
            "font-semibold tracking-wider text-[11px] uppercase transition-colors",
            location.pathname === link.path 
              ? "text-secondary" 
              : "text-navy hover:text-secondary",
            mobile ? "text-lg py-4 border-b border-slate-100 block bg-white" : ""
          )}
        >
          {link.name}
        </Link>
      ))}
    </>
  );

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-xl shadow-sm py-1.5" : "bg-white/40 backdrop-blur-md py-3 border-b border-slate-100/50"
      )}
    >
      <div className="flex justify-between items-center px-4 md:px-8 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleDrawer}
            className="p-1.5 hover:bg-slate-100/50 rounded-lg transition-colors md:hidden"
          >
            <Menu className="w-5 h-5 text-navy" />
          </button>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-navy rounded-lg flex items-center justify-center text-white font-semibold text-base shadow-lg shadow-navy/10 group-hover:bg-secondary transition-colors duration-300">P</div>
            <div className="text-xs font-bold tracking-[0.1em] text-navy uppercase hidden sm:block">
              Prospect
            </div>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <NavContent />
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Mode Switcher */}
          <button
            onClick={() => setMode(!dataSaverMode)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors group relative"
            title={dataSaverMode ? "Switch to Normal Mode" : "Switch to Data Saver"}
          >
            {dataSaverMode ? (
              <ShieldCheck className="w-5 h-5 text-navy/60" />
            ) : (
              <Zap className="w-5 h-5 text-secondary" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={toggleUserMenu}
                className="flex items-center gap-2 p-1 pl-3 bg-navy/5 hover:bg-navy/10 rounded-full transition-colors"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-navy hidden sm:block">
                  {user?.name.split(' ')[0]}
                </span>
                <div className="w-7 h-7 bg-navy text-white rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsUserMenuOpen(false)}
                      className="fixed inset-0 z-40"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-50">
                        <p className="text-xs font-bold text-navy uppercase tracking-wider">{user?.name}</p>
                        <p className="text-[10px] text-secondary truncate">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link 
                          to="/dashboard" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-navy hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link 
                          to="/settings" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-navy hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-navy text-white px-5 py-2 rounded-full font-semibold text-[10px] uppercase tracking-[0.1em] hover:bg-secondary transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleDrawer}
              className="fixed inset-0 bg-black/50 z-[55] backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-[70] w-full sm:w-72 bg-white shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                <div className="text-sm font-bold tracking-widest text-navy uppercase">Prospect</div>
                <button onClick={toggleDrawer} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                  <X className="w-5 h-5 text-navy" />
                </button>
              </div>
              <div className="p-6 flex flex-col">
                <NavContent mobile />
                {!isAuthenticated && (
                  <Link 
                    to="/login" 
                    onClick={() => setIsDrawerOpen(false)}
                    className="mt-8 bg-navy text-white py-4 rounded-xl font-bold text-center uppercase tracking-widest"
                  >
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
