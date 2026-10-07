import React from 'react';
import {
  PackageCheck,
  CheckCircle2,
  ClipboardList,
  CalendarClock,
  Building2,
  FolderHeart,
  ArrowRight,
  Plus,
  Stethoscope,
  HeartHandshake,
  Clock,
  MapPin,
  Check,
  Sparkles,
} from 'lucide-react';
import { NavTab } from '../components/Navbar';
import { DashboardSummary } from '../services/dashboardService';
import { Equipment, Reminder, BorrowRequest, NotificationItem } from '../data/seedData';
import { reminderService } from '../services/reminderService';

interface DashboardProps {
  summary: DashboardSummary;
  equipment: Equipment[];
  reminders: Reminder[];
  requests: BorrowRequest[];
  notifications: NotificationItem[];
  userName: string;
  onNavigate: (tab: NavTab) => void;
  onRequestEquipment: (eq: Equipment) => void;
  onViewEquipmentDetails: (eq: Equipment) => void;
  onAddReminderClick: () => void;
  onAddEquipmentClick: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  summary,
  equipment,
  reminders,
  requests,
  notifications,
  userName,
  onNavigate,
  onRequestEquipment,
  onViewEquipmentDetails,
  onAddReminderClick,
  onAddEquipmentClick,
}) => {
  const pendingReminders = reminders.filter((r) => !r.completed).slice(0, 4);
  const featuredEquipment = equipment.slice(0, 3);
  const recentRequests = requests.slice(0, 3);

  const handleToggleReminder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    reminderService.toggleComplete(id);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-800 via-teal-700 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-600/60 border border-teal-400/30 text-teal-100 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-teal-200" />
            <span>Digitalized Healthcare Support Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white text-balance">
            Welcome back, {userName}
          </h1>
          <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed max-w-2xl">
            CureLink connects you to community medical equipment sharing, localized care facilities,
            explainable symptom triaging, and your personal offline health record locker.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('equipment')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-teal-900 hover:bg-teal-50 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs"
            >
              <PackageCheck className="w-4 h-4 text-teal-700" />
              <span>Borrow Equipment</span>
            </button>
            <button
              onClick={() => onNavigate('symptoms')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600/70 hover:bg-teal-600 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all border border-teal-400/40"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Symptom Guidance</span>
            </button>
            <button
              onClick={() => onNavigate('resources')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900/40 hover:bg-slate-900/60 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all border border-white/20"
            >
              <Building2 className="w-4 h-4" />
              <span>Find Nearby Care</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards Grid (All dynamic from localStorage) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Platform Overview</h2>
          <span className="text-xs text-slate-500 font-medium">Synced with LocalStorage</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Card 1: Total Equipment */}
          <button
            onClick={() => onNavigate('equipment')}
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-teal-300 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-xs font-medium text-slate-500">Total Equipment</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <PackageCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {summary.totalEquipment}
            </p>
            <span className="text-[11px] text-teal-600 font-medium mt-1 flex items-center gap-1">
              Browse inventory <ArrowRight className="w-3 h-3" />
            </span>
          </button>

          {/* Card 2: Available Equipment */}
          <button
            onClick={() => onNavigate('equipment')}
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-emerald-300 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-xs font-medium text-slate-500">Available Now</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {summary.availableEquipment}
            </p>
            <span className="text-[11px] text-emerald-600 font-medium mt-1">
              Ready for immediate loan
            </span>
          </button>

          {/* Card 3: Active Borrow Requests */}
          <button
            onClick={() => onNavigate('requests')}
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-teal-300 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-xs font-medium text-slate-500">Active Requests</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <ClipboardList className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {summary.activeBorrowRequests}
            </p>
            <span className="text-[11px] text-amber-600 font-medium mt-1 flex items-center gap-1">
              View status queue <ArrowRight className="w-3 h-3" />
            </span>
          </button>

          {/* Card 4: Upcoming Reminders */}
          <button
            onClick={() => onNavigate('reminders')}
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-teal-300 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-xs font-medium text-slate-500">Pending Reminders</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <CalendarClock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {summary.upcomingReminders}
            </p>
            <span className="text-[11px] text-indigo-600 font-medium mt-1">Doses & Appointments</span>
          </button>

          {/* Card 5: Healthcare Resources */}
          <button
            onClick={() => onNavigate('resources')}
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-teal-300 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-xs font-medium text-slate-500">Care Facilities</span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {summary.healthcareResources}
            </p>
            <span className="text-[11px] text-sky-600 font-medium mt-1">Verified providers</span>
          </button>

          {/* Card 6: Health Records */}
          <button
            onClick={() => onNavigate('records')}
            className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-teal-300 hover:shadow-xs transition-all text-left flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between w-full mb-2">
              <span className="text-xs font-medium text-slate-500">Saved Records</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <FolderHeart className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {summary.healthRecords}
            </p>
            <span className="text-[11px] text-rose-600 font-medium mt-1">In local browser vault</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Equipment Sharing & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Equipment Highlights */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Featured Equipment</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Available for community borrowing at nominal non-profit rates
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onAddEquipmentClick}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>List Item</span>
                </button>
                <button
                  onClick={() => onNavigate('equipment')}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {featuredEquipment.map((eq) => (
                <div
                  key={eq.id}
                  className="border border-slate-200 rounded-xl overflow-hidden hover:border-teal-300 hover:shadow-xs transition-all flex flex-col justify-between bg-slate-50/50"
                >
                  <div className="h-32 w-full bg-slate-100 relative">
                    <img
                      src={eq.image}
                      alt={eq.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                          eq.available ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-100'
                        }`}
                      >
                        {eq.available ? 'Available' : 'In Use'}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        {eq.category}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-900 line-clamp-1 mt-0.5">
                        {eq.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{eq.location}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        ${eq.dailyRate}{' '}
                        <span className="text-[10px] font-normal text-slate-500">/day</span>
                      </span>
                      <button
                        onClick={() => onViewEquipmentDetails(eq)}
                        className="text-[11px] font-semibold text-teal-700 hover:text-teal-900"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Active Requests Status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Your Equipment Requests</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track approved pickups and pending approvals
                </p>
              </div>
              <button
                onClick={() => onNavigate('requests')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>All Requests</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentRequests.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">You haven't requested any equipment yet.</p>
                <button
                  onClick={() => onNavigate('equipment')}
                  className="mt-2 text-xs font-semibold text-teal-600 hover:underline"
                >
                  Explore equipment catalog
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentRequests.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => onNavigate('requests')}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-slate-800">{req.equipmentName}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>Period: {req.startDate} to {req.returnDate}</span>
                        {req.totalCost !== undefined && (
                          <>
                            <span>·</span>
                            <span className="font-semibold text-slate-700">${req.totalCost}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${
                        req.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800'
                          : req.status === 'Completed'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Upcoming Reminders & Recent Notifications */}
        <div className="space-y-6">
          {/* Upcoming Reminders Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-semibold text-slate-900">Upcoming Reminders</h3>
              </div>
              <button
                onClick={onAddReminderClick}
                className="p-1 text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
                title="Add new reminder"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {pendingReminders.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500">No active pending reminders.</p>
                <button
                  onClick={onAddReminderClick}
                  className="mt-1.5 text-xs font-semibold text-teal-600 hover:underline"
                >
                  Create reminder
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {pendingReminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 hover:border-slate-300 transition-colors"
                  >
                    <button
                      onClick={(e) => handleToggleReminder(rem.id, e)}
                      className="mt-0.5 w-4 h-4 rounded-sm border border-slate-300 bg-white hover:border-teal-500 flex items-center justify-center text-teal-600"
                      title="Mark as completed"
                    >
                      {rem.completed && <Check className="w-3 h-3" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate">{rem.title}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>
                          {rem.date} at {rem.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => onNavigate('reminders')}
              className="w-full text-center py-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors"
            >
              Manage Reminders
            </button>
          </div>

          {/* Quick Support & Explainable Guidance Banner */}
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 rounded-2xl p-5 text-white space-y-3">
            <div className="flex items-center gap-2 text-teal-300">
              <Stethoscope className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Explainable Health Support
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">Experiencing new symptoms?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Check your symptoms using our deterministic triage engine for explainable next-step
              guidance and emergency red-flag screening.
            </p>
            <button
              onClick={() => onNavigate('symptoms')}
              className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Launch Symptom Guidance</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Community Care Facilities Preview */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-semibold text-slate-900">Nearby Care</h3>
              </div>
              <button
                onClick={() => onNavigate('resources')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700"
              >
                Search
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Find verified emergency hospitals, neighborhood clinics, diagnostic labs, and 24-hour pharmacies.
            </p>
            <button
              onClick={() => onNavigate('resources')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore Provider Directory</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
