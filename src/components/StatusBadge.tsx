import React from 'react';
import { AppointmentStatus } from '../types';
import { CheckCircle2, Clock, XCircle, AlertCircle, CalendarCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: AppointmentStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Confirmed',
          bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2
        };
      case 'completed':
        return {
          label: 'Completed',
          bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: CalendarCheck
        };
      case 'pending':
        return {
          label: 'Pending',
          bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Clock
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: XCircle
        };
      case 'no_show':
        return {
          label: 'No-Show',
          bgColor: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: AlertCircle
        };
      default:
        return {
          label: status,
          bgColor: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: Clock
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${config.bgColor} ${sizeClasses}`}
    >
      <Icon size={iconSize} className="shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
