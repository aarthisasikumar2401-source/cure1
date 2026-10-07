import React, { useState, useMemo } from 'react';
import {
  FolderHeart,
  Plus,
  Search,
  Calendar,
  User,
  Trash2,
  Edit2,
  FileText,
  ShieldAlert,
  TestTube2,
  FileCheck2,
  Pill,
  Stethoscope,
} from 'lucide-react';
import { HealthRecord } from '../data/seedData';

interface HealthRecordsProps {
  records: HealthRecord[];
  onAddRecord: () => void;
  onEditRecord: (record: HealthRecord) => void;
  onDeleteRecord: (id: string) => void;
}

const RECORD_TYPES = [
  'All',
  'Prescription',
  'Lab Report',
  'Appointment',
  'Medical Report',
  'Other',
];

export const HealthRecords: React.FC<HealthRecordsProps> = ({
  records,
  onAddRecord,
  onEditRecord,
  onDeleteRecord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedType !== 'All' && r.type !== selectedType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = r.title.toLowerCase().includes(q);
        const matchesProv = r.provider.toLowerCase().includes(q);
        const matchesNotes = r.notes.toLowerCase().includes(q);
        return matchesTitle || matchesProv || matchesNotes;
      }
      return true;
    });
  }, [records, selectedType, searchQuery]);

  const getRecordIcon = (type: HealthRecord['type']) => {
    switch (type) {
      case 'Prescription':
        return <Pill className="w-4 h-4 text-emerald-600" />;
      case 'Lab Report':
        return <TestTube2 className="w-4 h-4 text-sky-600" />;
      case 'Appointment':
        return <Stethoscope className="w-4 h-4 text-indigo-600" />;
      case 'Medical Report':
        return <FileCheck2 className="w-4 h-4 text-teal-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Personal Health Record Locker
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Store prescriptions, lab panel summaries, clinical visit notes, and diagnostic milestones.
          </p>
        </div>
        <button
          onClick={onAddRecord}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Record</span>
        </button>
      </div>

      {/* Explicit Legal / Storage Disclaimer Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-semibold text-amber-950">
            Local Browser Storage Notice & Privacy Boundary
          </p>
          <p className="leading-relaxed text-amber-900/90">
            This demo stores health information locally in your browser. It is not a secure medical
            records system. Never enter sensitive personal health information (PHI) or protected HIPAA data.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records by title, doctor, facility, or clinical notes..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-slate-50/50"
          />
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0">Type:</span>
          {RECORD_TYPES.map((type) => {
            const active = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-teal-700 text-white font-semibold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Records Grid */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <FolderHeart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No health records found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || selectedType !== 'All'
              ? 'Try adjusting your search criteria.'
              : 'Add your first clinical note, prescription record, or lab test summary to your local locker.'}
          </p>
          <button
            onClick={onAddRecord}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Record</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRecords.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-teal-300 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md">
                      {getRecordIcon(item.type)}
                      <span>{item.type}</span>
                    </span>
                    <h3 className="text-base font-semibold text-slate-900 mt-1">{item.title}</h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => onEditRecord(item)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit record"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteRecord(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal-600" />
                    <span>Date: {item.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-teal-600" />
                    <span>Provider: {item.provider}</span>
                  </div>
                </div>

                {item.notes && (
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {item.notes}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between items-center">
                <span>Stored in browser localStorage</span>
                <span>ID: {item.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
