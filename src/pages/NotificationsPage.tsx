import React from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storage';
import { NotificationType } from '../types';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Info, 
  Check, 
  Trash2,
  CalendarCheck
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { currentUser, refreshUserData } = useAuth();
  const notifications = storageService.getUserNotifications(currentUser.id);

  const handleMarkAsRead = (id: string) => {
    storageService.markNotificationAsRead(id);
    refreshUserData();
  };

  const handleMarkAllRead = () => {
    storageService.markAllNotificationsAsRead(currentUser.id);
    refreshUserData();
  };

  const handleClearAll = () => {
    storageService.clearNotifications(currentUser.id);
    refreshUserData();
  };

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case 'confirmation':
        return <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />;
      case 'reminder':
        return <Clock size={18} className="text-amber-600 shrink-0" />;
      case 'cancellation':
        return <AlertCircle size={18} className="text-rose-600 shrink-0" />;
      case 'system':
      default:
        return <Info size={18} className="text-blue-600 shrink-0" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="text-[#1E5AA8]" size={24} />
            Notifications & Appointment Alerts
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Automated appointment confirmations, schedule updates, and clinical reminders.
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1E5AA8] bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
              <Check size={14} />
              <span>Mark All Read</span>
            </button>
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              <Trash2 size={14} />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={36} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-semibold text-slate-900">No notifications</h3>
            <p className="text-sm text-slate-500 mt-1">
              You are completely caught up. New alerts will appear here when appointments are scheduled or updated.
            </p>
          </div>
        ) : (
          notifications.map(notif => (
            <div
              key={notif.id}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${
                !notif.read ? 'bg-blue-50/40' : 'bg-white hover:bg-slate-50/60'
              }`}
            >
              <div className="mt-0.5">
                {getNotifIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    {notif.type} notification
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(notif.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.sent_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-medium text-slate-800 mt-1 leading-relaxed">
                  {notif.message}
                </p>
              </div>

              {!notif.read && (
                <button
                  onClick={() => handleMarkAsRead(notif.id)}
                  className="p-1 text-[#1E5AA8] hover:bg-blue-100 rounded-md transition-colors shrink-0"
                  title="Mark as read"
                >
                  <Check size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
