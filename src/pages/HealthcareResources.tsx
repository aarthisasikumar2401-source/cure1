import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Navigation,
  AlertCircle,
  ExternalLink,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { HealthcareResource } from '../data/seedData';
import { calculateDistance } from '../services/resourceService';

interface HealthcareResourcesProps {
  resources: HealthcareResource[];
}

const RESOURCE_TYPES = [
  'All',
  'Hospital',
  'Clinic',
  'Pharmacy',
  'Diagnostic Center',
];

export const HealthcareResources: React.FC<HealthcareResourcesProps> = ({ resources }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your current browser.');
      return;
    }
    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('Location access was denied. Showing all resources without distance sorting.');
        } else {
          setLocationError('Unable to retrieve your location at this time.');
        }
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  const filteredResources = useMemo(() => {
    const list = resources.filter((item) => {
      if (selectedType !== 'All' && item.type !== selectedType) return false;
      if (emergencyOnly && !item.emergencyServices) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesAddr = item.address.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        return matchesName || matchesAddr || matchesDesc;
      }

      return true;
    });

    // If user has coordinates, calculate distance and sort
    if (userCoords) {
      return [...list].sort((a, b) => {
        const distA = calculateDistance(userCoords.lat, userCoords.lng, a.lat, a.lng);
        const distB = calculateDistance(userCoords.lat, userCoords.lng, b.lat, b.lng);
        return distA - distB;
      });
    }

    return list;
  }, [resources, selectedType, emergencyOnly, searchQuery, userCoords]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Find Healthcare Facilities
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Discover verified emergency hospitals, community clinics, pharmacies, and diagnostic laboratories.
          </p>
        </div>

        {/* Geolocation trigger */}
        <button
          onClick={handleUseLocation}
          disabled={locating}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors border shadow-2xs shrink-0 ${
            userCoords
              ? 'bg-teal-50 text-teal-800 border-teal-300'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
          }`}
        >
          <Navigation className={`w-4 h-4 ${locating ? 'animate-spin text-teal-600' : 'text-teal-600'}`} />
          <span>
            {locating
              ? 'Detecting Location...'
              : userCoords
              ? 'Sorted by Proximity'
              : 'Use My Location'}
          </span>
        </button>
      </div>

      {locationError && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-2xs">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospital name, diagnostic center, or address..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 bg-slate-50/50"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={emergencyOnly}
              onChange={(e) => setEmergencyOnly(e.target.checked)}
              className="rounded-sm border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
            />
            <span className="flex items-center gap-1 text-slate-800">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>24/7 Emergency Care Only</span>
            </span>
          </label>
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 mr-1 shrink-0">Facility:</span>
          {RESOURCE_TYPES.map((type) => {
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

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredResources.map((res) => {
          let distanceStr: string | null = null;
          if (userCoords) {
            const d = calculateDistance(userCoords.lat, userCoords.lng, res.lat, res.lng);
            distanceStr = `${d} miles away`;
          }

          return (
            <div
              key={res.id}
              className="bg-white border border-slate-200 hover:border-teal-300 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-700 rounded-md">
                        {res.type}
                      </span>
                      {res.verified && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-teal-600" />
                          <span>Verified</span>
                        </span>
                      )}
                      {res.emergencyServices && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                          <Flame className="w-3 h-3 text-rose-600" />
                          <span>24/7 ER</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mt-1.5">{res.name}</h3>
                  </div>

                  {distanceStr && (
                    <span className="px-2 py-1 bg-teal-50 text-teal-800 text-xs font-semibold rounded-lg shrink-0 tabular-nums">
                      {distanceStr}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>

                <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{res.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{res.openingHours}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <a
                  href={`tel:${res.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {res.phone}</span>
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(
                    `${res.name} ${res.address}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  <span>Directions</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
