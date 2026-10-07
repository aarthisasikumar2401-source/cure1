import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  MapPin,
  ShieldCheck,
  PackageCheck,
  Edit2,
  Trash2,
  DollarSign,
  Tag,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { Equipment } from '../data/seedData';
import { equipmentService } from '../services/equipmentService';

interface EquipmentSharingProps {
  equipment: Equipment[];
  onViewDetails: (eq: Equipment) => void;
  onRequestEquipment: (eq: Equipment) => void;
  onAddEquipment: () => void;
  onEditEquipment: (eq: Equipment) => void;
  onDeleteEquipment: (id: string) => void;
}

const CATEGORIES = [
  'All',
  'Mobility',
  'Respiratory',
  'Home Care',
  'Hospital Equipment',
  'Other',
];

export const EquipmentSharing: React.FC<EquipmentSharingProps> = ({
  equipment,
  onViewDetails,
  onRequestEquipment,
  onAddEquipment,
  onEditEquipment,
  onDeleteEquipment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'in_use'>('all');

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Availability filter
      if (availabilityFilter === 'available' && !item.available) return false;
      if (availabilityFilter === 'in_use' && item.available) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesLoc = item.location.toLowerCase().includes(query);
        const matchesCond = item.condition.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesLoc || matchesCond;
      }

      return true;
    });
  }, [equipment, selectedCategory, availabilityFilter, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Medical Equipment Sharing
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Access community-shared wheelchairs, oxygen concentrators, hospital beds, and recovery aids.
          </p>
        </div>
        <button
          onClick={onAddEquipment}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>List Equipment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by equipment name, keywords, or location..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-slate-50/50"
            />
          </div>

          {/* Availability Filter Segment */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
            <button
              onClick={() => setAvailabilityFilter('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                availabilityFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setAvailabilityFilter('available')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                availabilityFilter === 'available'
                  ? 'bg-white text-emerald-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Available Now
            </button>
            <button
              onClick={() => setAvailabilityFilter('in_use')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                availabilityFilter === 'in_use'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In Use
            </button>
          </div>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0">Category:</span>
          {CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-teal-700 text-white font-semibold shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Equipment Count Label */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800 font-semibold">{filteredEquipment.length}</strong> items
        </span>
        {(searchQuery || selectedCategory !== 'All' || availabilityFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setAvailabilityFilter('all');
            }}
            className="text-teal-700 hover:underline font-semibold"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Equipment Grid */}
      {filteredEquipment.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <PackageCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No medical equipment matches</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or filters, or be the first to list this type of equipment
            in your community.
          </p>
          <button
            onClick={onAddEquipment}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>List Equipment Item</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEquipment.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-teal-300 rounded-2xl overflow-hidden shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              {/* Image & Status Badge */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full shadow-2xs ${
                      item.available
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-100'
                    }`}
                  >
                    {item.available ? 'Available' : 'In Use'}
                  </span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-white/90 backdrop-blur-xs text-slate-800 rounded-md shadow-2xs">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-teal-800 transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="space-y-1.5 pt-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{item.condition}</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & Footer Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-lg font-bold text-slate-900">${item.dailyRate}</span>
                      <span className="text-xs text-slate-500"> / day</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditEquipment(item)}
                        title="Edit equipment details"
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteEquipment(item.id)}
                        title="Delete equipment listing"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Primary CTA Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onViewDetails(item)}
                      className="w-full py-2 px-3 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-center"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onRequestEquipment(item)}
                      disabled={!item.available}
                      className={`w-full py-2 px-3 text-xs font-semibold rounded-xl transition-colors text-center shadow-2xs ${
                        item.available
                          ? 'bg-teal-600 text-white hover:bg-teal-700 cursor-pointer'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {item.available ? 'Request Now' : 'In Use'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
