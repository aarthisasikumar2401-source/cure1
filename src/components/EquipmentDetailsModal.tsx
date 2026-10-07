import React from 'react';
import {
  MapPin,
  ShieldCheck,
  Tag,
  DollarSign,
  Phone,
  User,
  PackageCheck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Modal } from './Modal';
import { Equipment } from '../data/seedData';

interface EquipmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipment: Equipment | null;
  onRequestClick: (eq: Equipment) => void;
}

export const EquipmentDetailsModal: React.FC<EquipmentDetailsModalProps> = ({
  isOpen,
  onClose,
  equipment,
  onRequestClick,
}) => {
  if (!equipment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={equipment.name}
      subtitle={`Category: ${equipment.category}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Image / Fallback Container */}
        <div className="relative w-full h-56 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
          <img
            src={equipment.image}
            alt={equipment.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full shadow-xs ${
                equipment.available
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-700 text-slate-100'
              }`}
            >
              {equipment.available ? 'Available Now' : 'Currently Borrowed'}
            </span>
          </div>
        </div>

        {/* Core Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-teal-600" />
              <span>Daily Rate</span>
            </div>
            <p className="text-base font-bold text-slate-900">${equipment.dailyRate} / day</p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Condition</span>
            </div>
            <p className="text-xs font-semibold text-slate-900 truncate">
              {equipment.condition}
            </p>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <Tag className="w-3.5 h-3.5 text-teal-600" />
              <span>Category</span>
            </div>
            <p className="text-xs font-semibold text-slate-900">{equipment.category}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Equipment Overview
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
            {equipment.description}
          </p>
        </div>

        {/* Location & Organization */}
        <div className="space-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800">Pickup Location:</span>
              <p className="text-slate-600">{equipment.location}</p>
            </div>
          </div>
          {equipment.ownerName && (
            <div className="flex items-start gap-2 pt-1 border-t border-slate-200">
              <User className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Custodian / Organization:</span>
                <p className="text-slate-600">{equipment.ownerName}</p>
              </div>
            </div>
          )}
          {equipment.contactPhone && (
            <div className="flex items-start gap-2 pt-1 border-t border-slate-200">
              <Phone className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Direct Inquiries:</span>
                <p className="text-slate-600">{equipment.contactPhone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onRequestClick(equipment);
            }}
            disabled={!equipment.available}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              equipment.available
                ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-xs cursor-pointer'
                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>{equipment.available ? 'Request to Borrow' : 'Currently Unavailable'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
