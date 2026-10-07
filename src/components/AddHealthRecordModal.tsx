import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { HealthRecord } from '../data/seedData';
import { healthRecordService } from '../services/healthRecordService';
import { AlertCircle, ShieldAlert } from 'lucide-react';

interface AddHealthRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordToEdit?: HealthRecord | null;
  onSuccess: () => void;
}

const RECORD_TYPES: HealthRecord['type'][] = [
  'Prescription',
  'Lab Report',
  'Appointment',
  'Medical Report',
  'Other',
];

export const AddHealthRecordModal: React.FC<AddHealthRecordModalProps> = ({
  isOpen,
  onClose,
  recordToEdit,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<HealthRecord['type']>('Prescription');
  const [date, setDate] = useState('');
  const [provider, setProvider] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (recordToEdit) {
        setTitle(recordToEdit.title);
        setType(recordToEdit.type);
        setDate(recordToEdit.date);
        setProvider(recordToEdit.provider);
        setNotes(recordToEdit.notes || '');
      } else {
        const today = new Date().toISOString().split('T')[0];
        setTitle('');
        setType('Prescription');
        setDate(today);
        setProvider('');
        setNotes('');
      }
      setError(null);
    }
  }, [isOpen, recordToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Record title is required.');
      return;
    }
    if (!date) {
      setError('Date is required.');
      return;
    }
    if (!provider.trim()) {
      setError('Hospital or Doctor name is required.');
      return;
    }

    if (recordToEdit) {
      healthRecordService.update(recordToEdit.id, {
        title: title.trim(),
        type,
        date,
        provider: provider.trim(),
        notes: notes.trim(),
      });
    } else {
      healthRecordService.create({
        title: title.trim(),
        type,
        date,
        provider: provider.trim(),
        notes: notes.trim(),
      });
    }

    onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={recordToEdit ? 'Edit Health Record' : 'Add Health Record to Locker'}
      subtitle="Organize prescriptions, laboratory panels, and clinical summaries"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Local storage privacy notice */}
        <div className="flex items-start gap-2.5 p-3 bg-amber-50/80 border border-amber-200 text-amber-900 rounded-xl text-xs leading-relaxed">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Local Storage Notice:</strong> This demo stores health information locally in
            your browser. It is not a secure medical records system.
          </span>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Record Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Comprehensive Blood Chemistry Panel"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Record Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as HealthRecord['type'])}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
            >
              {RECORD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Date *</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Healthcare Provider / Doctor / Facility *
          </label>
          <input
            type="text"
            required
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="e.g. Dr. Elena Rostova / Quest Diagnostics"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Clinical Notes, Dosage or Results Summary
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Record doctor instructions, dosage instructions, test results or follow-up milestones..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
          >
            {recordToEdit ? 'Save Changes' : 'Save Health Record'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
