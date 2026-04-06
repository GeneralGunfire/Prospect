import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Database, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  LogOut,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDataSaver } from '../contexts/DataSaverContext';
import { cn } from '../lib/utils';

export const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { dataSaverMode, setMode } = useDataSaver();
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="pt-24 pb-16 px-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-navy/5 rounded-full mb-4">
          <Settings className="w-4 h-4 text-navy" />
          <span className="text-[10px] font-bold text-navy uppercase tracking-widest">Account Settings</span>
        </div>
        <h1 className="text-4xl font-bold text-navy uppercase tracking-tight">Settings</h1>
      </div>

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xs font-bold text-navy uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <User className="w-4 h-4 text-secondary" />
            Profile Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-navy uppercase tracking-widest mb-2">Full Name</label>
              <input
                type="text"
                defaultValue={user?.name}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-navy focus:border-secondary transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-navy uppercase tracking-widest mb-2">Email Address</label>
              <input
                type="email"
                defaultValue={user?.email}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-medium text-navy focus:border-secondary transition-all outline-none"
              />
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xs font-bold text-navy uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <Database className="w-4 h-4 text-secondary" />
            App Preferences
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  dataSaverMode ? "bg-navy text-white" : "bg-secondary/10 text-secondary"
                )}>
                  {dataSaverMode ? <ShieldCheck className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy">Data Saver Mode</h4>
                  <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Reduce animations and data usage</p>
                </div>
              </div>
              <button 
                onClick={() => setMode(!dataSaverMode)}
                className={cn(
                  "w-12 h-6 rounded-full transition-all relative",
                  dataSaverMode ? "bg-secondary" : "bg-slate-200"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  dataSaverMode ? "right-1" : "left-1"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-navy">Email Notifications</h4>
                  <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">Bursary alerts and career updates</p>
                </div>
              </div>
              <button className="w-12 h-6 bg-secondary rounded-full relative">
                <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xs font-bold text-navy uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <Shield className="w-4 h-4 text-secondary" />
            Security & Privacy
          </h3>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
              <span className="text-xs font-bold text-navy uppercase tracking-wider">Change Password</span>
              <ChevronRight className="w-4 h-4 text-navy/20 group-hover:text-secondary transition-colors" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group">
              <span className="text-xs font-bold text-navy uppercase tracking-wider">Two-Factor Authentication</span>
              <ChevronRight className="w-4 h-4 text-navy/20 group-hover:text-secondary transition-colors" />
            </button>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50 border border-red-100 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xs font-bold text-red-600 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-600" />
            Danger Zone
          </h3>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h4 className="text-sm font-bold text-navy mb-1">Delete Account</h4>
              <p className="text-[10px] text-secondary font-bold uppercase tracking-widest">This action is permanent and cannot be undone.</p>
            </div>
            <button className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex justify-between items-center pt-8">
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-[10px] font-bold text-navy/40 uppercase tracking-widest hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <button 
            onClick={handleSave}
            className={cn(
              "px-12 py-4 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2",
              isSaved ? "bg-green-600 text-white" : "bg-navy text-white hover:bg-secondary"
            )}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Settings Saved
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
