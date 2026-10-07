import React, { useState } from 'react';
import {
  CalendarClock,
  Plus,
  Check,
  Clock,
  Calendar,
  Pill,
  Stethoscope,
  RotateCcw,
  Activity,
  Trash2,
  Edit2,
  Filter,
} from 'lucide-react';
import { Reminder } from '../data/seedData';
import { reminderService } from '../services/reminderService';

interface RemindersProps {
  reminders: Reminder[];
  onAddReminder: () => void;
  onEditReminder: (reminder: Reminder) => void;
  onDeleteReminder: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export const Reminders: React.FC<RemindersProps> = ({
  reminders,
  onAddReminder,
  onEditReminder,
  onDeleteReminder,
  onToggleComplete,
}) => {
  const [filterState, setFilterState] = useState<'all' | 'active' | 'completed'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const filteredReminders = reminders.filter((item) => {
    if (filterState === 'active' && item.completed) return false;
    if (filterState === 'completed' && !item.completed) return false;
    if (typeFilter !== 'All' && item.type !== typeFilter) return false;
    return true;
  });

  const activeCount = reminders.filter((r) => !r.completed).length;
  const completedCount = reminders.filter((r) => r.completed).length;

  const getTypeIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'Medication':
        return <Pill className="w-4 h-4 text-rose-500" />;
      case 'Appointment':
        return <Stethoscope className="w-4 h-4 text-sky-500" />;
      case 'Equipment Return':
        return <RotateCcw className="w-4 h-4 text-amber-500" />;
      case 'Health Check':
        return <Activity className="w-4 h-4 text-emerald-500" />;
      default:
        return <CalendarClock className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Health Reminders</h1>
          <p className="text-sm text-slate-600 mt-1">
            Stay on schedule with prescription doses, doctor appointments, and medical equipment returns.
          </p>
        </div>
        <button
          onClick={onAddReminder}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Reminder</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Active/Completed segment */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
            <button
              onClick={() => setFilterState('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterState === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({reminders.length})
            </button>
            <button
              onClick={() => setFilterState('active')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterState === 'active'
                  ? 'bg-white text-teal-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({activeCount})
            </button>
            <button
              onClick={() => setFilterState('completed')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                filterState === 'completed'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Medication', 'Appointment', 'Equipment Return', 'Health Check'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  typeFilter === t
                    ? 'bg-teal-50 text-teal-800 font-semibold border border-teal-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reminders List */}
      {filteredReminders.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <CalendarClock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No reminders found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Keep track of medication courses, doctor consultations, and equipment loan dates by
            setting a new reminder.
          </p>
          <button
            onClick={onAddReminder}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Reminder</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReminders.map((item) => (
            <div
              key={item.id}
              className={`bg-white border rounded-2xl p-4 sm:p-5 transition-all shadow-2xs space-y-3 ${
                item.completed
                  ? 'border-slate-200 bg-slate-50/60 opacity-80'
                  : 'border-slate-200 hover:border-teal-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Complete checkbox button */}
                <button
                  onClick={() => onToggleComplete(item.id)}
                  title={item.completed ? 'Mark uncompleted' : 'Mark completed'}
                  className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                    item.completed
                      ? 'bg-teal-600 border-teal-600 text-white'
                      : 'border-slate-300 hover:border-teal-500 bg-white'
                  }`}
                >
                  {item.completed && <Check className="w-3.5 h-3.5" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      {getTypeIcon(item.type)}
                      <span>{item.type}</span>
                    </span>
                    {item.completed && (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Done
                      </span>
                    )}
                  </div>
                  <h3
                    className={`text-sm font-semibold mt-1.5 ${
                      item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Edit & Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onEditReminder(item)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit reminder"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteReminder(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete reminder"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>{item.time}</span>
                </div>
              </div>

              {item.notes && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                  {item.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
