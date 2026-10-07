import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Modal } from './Modal';
import { Equipment } from '../data/seedData';
import { borrowService } from '../services/borrowService';
import { userService } from '../services/userService';

interface BorrowRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  onSuccess: () => void;
}

export const BorrowRequestModal: React.FC<BorrowRequestModalProps> = ({
  isOpen,
  onClose,
  equipment,
  onSuccess,
}) => {
  const [requesterName, setRequesterName] = useState('');
  const [contact, setContact] = useState('');
  const [startDate, setStartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const profile = userService.getProfile();
      setRequesterName(profile.name || '');
      setContact(profile.phone || profile.email || '');

      // Set default dates: today and 7 days from today
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      setStartDate(today.toISOString().split('T')[0]);
      setReturnDate(nextWeek.toISOString().split('T')[0]);
      setNotes('');
      setError(null);
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!equipment) return null;

  // Calculate estimated days and cost
  let days = 0;
  let estimatedTotal = 0;
  if (startDate && returnDate) {
    const s = new Date(startDate).getTime();
    const r = new Date(returnDate).getTime();
    if (r >= s) {
      days = Math.max(1, Math.ceil((r - s) / (1000 * 60 * 60 * 24)));
      estimatedTotal = days * equipment.dailyRate;
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!requesterName.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!contact.trim()) {
      setError('Please provide a contact phone number or email.');
      return;
    }
    if (!startDate) {
      setError('Start date is required.');
      return;
    }
    if (!returnDate) {
      setError('Return date is required.');
      return;
    }
    if (new Date(returnDate) < new Date(startDate)) {
      setError('Return date cannot be earlier than start date.');
      return;
    }

    borrowService.create({
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      requesterName,
      contact,
      startDate,
      returnDate,
      notes,
      dailyRate: equipment.dailyRate,
    });

    setIsSuccess(true);
    setTimeout(() => {
      onSuccess();
      onClose();
    }, 1400);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Medical Equipment"
      subtitle={`Request to borrow: ${equipment.name}`}
      maxWidth="max-w-lg"
    >
      {isSuccess ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-semibold text-slate-900">Request Submitted!</h4>
          <p className="text-sm text-slate-600 max-w-sm mx-auto">
            Your borrow request for <strong>{equipment.name}</strong> was saved and added to your
            requests queue.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between items-center text-slate-800 font-medium">
              <span>{equipment.name}</span>
              <span className="text-teal-700 font-bold">${equipment.dailyRate}/day</span>
            </div>
            <p className="text-slate-500 line-clamp-1">{equipment.location}</p>
            <div className="flex items-center gap-1.5 text-slate-600 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Condition: {equipment.condition}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Requester Full Name *
              </label>
              <input
                type="text"
                required
                value={requesterName}
                onChange={(e) => setRequesterName(e.target.value)}
                placeholder="e.g. Sarah Mitchell"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact Phone or Email *
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="e.g. (555) 234-5678"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pickup / Start Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expected Return Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
              </div>
            </div>
          </div>

          {days > 0 && (
            <div className="flex items-center justify-between p-3 bg-teal-50/70 border border-teal-100 rounded-lg text-xs">
              <span className="text-teal-900 font-medium">
                Duration: <strong className="font-semibold">{days} day(s)</strong>
              </span>
              <span className="text-teal-900 font-medium">
                Estimated Community Contribution:{' '}
                <strong className="text-teal-700 font-bold">${estimatedTotal}</strong>
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Medical Purpose / Special Handover Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. For post-surgery rehabilitation, need ground-floor handover..."
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
              Submit Borrow Request
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
