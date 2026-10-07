import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Equipment } from '../data/seedData';
import { equipmentService } from '../services/equipmentService';
import { AlertCircle } from 'lucide-react';

interface AddEditEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentToEdit?: Equipment | null;
  onSuccess: () => void;
}

const CATEGORIES: Equipment['category'][] = [
  'Mobility',
  'Respiratory',
  'Home Care',
  'Hospital Equipment',
  'Other',
];

const PRESET_IMAGES = [
  {
    name: 'Wheelchair / Mobility',
    url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Respiratory / Nebulizer',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Walker / Assistive',
    url: 'https://images.unsplash.com/photo-1583912267670-6575ad3736df?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Crutches / Orthopedic',
    url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Hospital Bed / Care',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
  },
];

export const AddEditEquipmentModal: React.FC<AddEditEquipmentModalProps> = ({
  isOpen,
  onClose,
  equipmentToEdit,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Equipment['category']>('Mobility');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [dailyRate, setDailyRate] = useState<number | string>(5);
  const [condition, setCondition] = useState('Excellent Condition');
  const [available, setAvailable] = useState(true);
  const [ownerName, setOwnerName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (equipmentToEdit) {
        setName(equipmentToEdit.name);
        setCategory(equipmentToEdit.category);
        setDescription(equipmentToEdit.description);
        setLocation(equipmentToEdit.location);
        setDailyRate(equipmentToEdit.dailyRate);
        setCondition(equipmentToEdit.condition);
        setAvailable(equipmentToEdit.available);
        setOwnerName(equipmentToEdit.ownerName || '');
        setContactPhone(equipmentToEdit.contactPhone || '');
        setImage(equipmentToEdit.image || PRESET_IMAGES[0].url);
      } else {
        setName('');
        setCategory('Mobility');
        setDescription('');
        setLocation('');
        setDailyRate(5);
        setCondition('Sanitized & Good Condition');
        setAvailable(true);
        setOwnerName('');
        setContactPhone('');
        setImage(PRESET_IMAGES[0].url);
      }
      setError(null);
    }
  }, [isOpen, equipmentToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Equipment name is required.');
      return;
    }
    if (!description.trim()) {
      setError('Please provide a brief description.');
      return;
    }
    if (!location.trim()) {
      setError('Pickup location address is required.');
      return;
    }

    const rateNum = Number(dailyRate);
    if (isNaN(rateNum) || rateNum < 0) {
      setError('Daily rate must be 0 or higher.');
      return;
    }

    if (equipmentToEdit) {
      equipmentService.update(equipmentToEdit.id, {
        name: name.trim(),
        category,
        description: description.trim(),
        location: location.trim(),
        dailyRate: rateNum,
        condition: condition.trim(),
        available,
        ownerName: ownerName.trim(),
        contactPhone: contactPhone.trim(),
        image,
      });
    } else {
      equipmentService.create({
        name: name.trim(),
        category,
        description: description.trim(),
        location: location.trim(),
        dailyRate: rateNum,
        condition: condition.trim(),
        available,
        ownerName: ownerName.trim() || 'Community Member',
        contactPhone: contactPhone.trim(),
        image,
      });
    }

    onSuccess();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={equipmentToEdit ? 'Edit Equipment Listing' : 'List Medical Equipment for Sharing'}
      subtitle="Share unused healthcare devices to support patients in your local community"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Equipment Title / Model *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Medline Lightweight Transport Chair"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Equipment['category'])}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Community Rate ($ / day) *
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={dailyRate}
              onChange={(e) => setDailyRate(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Condition & Sanitization Status *
          </label>
          <input
            type="text"
            required
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="e.g. Certified Sterile, Sanitized, Like New"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Pickup Location / Address *
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Sunset Community Hub, 19th Ave"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Custodian / Owner Name
            </label>
            <input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="e.g. Westside Care Network"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="e.g. +1 (555) 345-6789"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Detailed Description & Operational Instructions *
          </label>
          <textarea
            rows={2}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe features, weight capacity, accessories included..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Visual Illustration Preset
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESET_IMAGES.map((preset, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setImage(preset.url)}
                className={`p-1.5 rounded-lg border text-left text-xs transition-colors flex items-center gap-2 ${
                  image === preset.url
                    ? 'border-teal-600 bg-teal-50 text-teal-900 font-semibold ring-1 ring-teal-500'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <img
                  src={preset.url}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-sm object-cover shrink-0"
                />
                <span className="truncate">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="availableToggle"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
            className="rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
          />
          <label htmlFor="availableToggle" className="text-xs font-medium text-slate-700">
            Currently Available for Borrowing
          </label>
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
            {equipmentToEdit ? 'Save Changes' : 'List Equipment'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
