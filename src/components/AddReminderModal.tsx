import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Reminder } from '../data/seedData';
import { reminderService } from '../services/reminderService';
import { AlertCircle } from 'lucide-react';

interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminderToEdit?: Reminder | null;
  onSuccess: () => void;
}

const REMINDER_TYPES: Reminder['type'][] = [
  'Medication',
  'Appointment',
  'Equipment Return',
  'Health Check',
  'Other',
];

export const AddReminderModal: React.FC<AddReminderModalProps> = ({
  isOpen,
  onClose,
  reminderToEdit,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<Reminder['type']>('Medication');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (reminderToEdit) {
        setTitle(reminderToEdit.title);
        setType(reminderToEdit.type);
        setDate(reminderToEdit.date);
        setTime(reminderToEdit.time);
        setNotes(reminderToEdit.notes || '');
      } else {
        const today = new Date().toISOString().split('T')[0];
        setTitle('');
        setType('Medication');
        setDate(today);
        setTime('09:00');
        setNotes('');
      }
      setError(null);
    }
  }, [isOpen, reminderToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Reminder title is required.');
      return;
    }
    if (!date) {
      setError('Date is required.');
      return;
    }
    if (!time) {
      setError('Time is required.');
      return;
    }

    if (reminderToEdit) {
      reminderService.update(reminderToEdit.id, {
        title: title.trim(),
        type,
        date,
        time,
        notes: notes.trim(),
      });
    } else {
      reminderService.create({
        title: title.trim(),
        type,
        date,
        time,
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
      title={reminderToEdit ? 'Edit Health Reminder' : 'Set Health Reminder'}
      subtitle="Keep track of medication schedules, doctor appointments, and equipment milestones"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Reminder Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Blood Pressure Medication Dose"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Reminder Type *</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as Reminder['type'])}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
          >
            {REMINDER_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
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
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Time *</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Instructions</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Take with food, drink 250ml water..."
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
            {reminderToEdit ? 'Save Changes' : 'Create Reminder'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
