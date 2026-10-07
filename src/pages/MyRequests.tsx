import React, { useState } from 'react';
import {
  ClipboardList,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Trash2,
  RotateCcw,
  Check,
  ChevronRight,
  Package,
} from 'lucide-react';
import { BorrowRequest } from '../data/seedData';
import { borrowService } from '../services/borrowService';

interface MyRequestsProps {
  requests: BorrowRequest[];
  onStatusChange: (id: string, status: BorrowRequest['status']) => void;
  onDeleteRequest: (id: string) => void;
  onNavigateToEquipment: () => void;
}

export const MyRequests: React.FC<MyRequestsProps> = ({
  requests,
  onStatusChange,
  onDeleteRequest,
  onNavigateToEquipment,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredRequests = requests.filter((req) => {
    if (filterStatus === 'All') return true;
    return req.status === filterStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Borrow Requests
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Track equipment booking status, loan duration, and simulate community owner approvals.
          </p>
        </div>
        <button
          onClick={onNavigateToEquipment}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors shrink-0"
        >
          <Package className="w-4 h-4" />
          <span>Browse More Equipment</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit overflow-x-auto max-w-full">
        {['All', 'Pending', 'Approved', 'Completed', 'Rejected'].map((status) => {
          const active = filterStatus === status;
          const count =
            status === 'All'
              ? requests.length
              : requests.filter((r) => r.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                active
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{status}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  active ? 'bg-slate-100 text-slate-800' : 'bg-slate-200/70 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">No requests in this category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterStatus === 'All'
              ? "You haven't submitted any equipment borrow requests yet."
              : `There are currently no requests with "${filterStatus}" status.`}
          </p>
          <button
            onClick={onNavigateToEquipment}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <span>Request Equipment</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-slate-900">{req.equipmentName}</h3>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        req.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : req.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : req.status === 'Completed'
                          ? 'bg-sky-100 text-sky-800 border border-sky-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Requested by <strong className="text-slate-700">{req.requesterName}</strong> ·{' '}
                    Contact: <span className="text-slate-700">{req.contact}</span>
                  </p>
                </div>

                <div className="text-right sm:shrink-0 flex sm:flex-col items-center sm:items-end justify-between">
                  {req.totalCost !== undefined && (
                    <span className="text-base font-bold text-slate-900">${req.totalCost} est.</span>
                  )}
                  <span className="text-[11px] text-slate-400">
                    Placed: {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Dates & Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>
                    Pickup Start: <strong className="text-slate-800">{req.startDate}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>
                    Scheduled Return: <strong className="text-slate-800">{req.returnDate}</strong>
                  </span>
                </div>
                {req.notes && (
                  <div className="sm:col-span-2 pt-1 border-t border-slate-200 text-slate-600 italic">
                    "{req.notes}"
                  </div>
                )}
              </div>

              {/* Demo Status Controls */}
              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-slate-500 mr-1">
                    Demo Status Simulation:
                  </span>
                  <button
                    onClick={() => onStatusChange(req.id, 'Approved')}
                    disabled={req.status === 'Approved'}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
                      req.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 opacity-60 cursor-not-allowed'
                        : 'bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-800'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => onStatusChange(req.id, 'Completed')}
                    disabled={req.status === 'Completed'}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
                      req.status === 'Completed'
                        ? 'bg-sky-50 text-sky-700 opacity-60 cursor-not-allowed'
                        : 'bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Return / Complete</span>
                  </button>
                  <button
                    onClick={() => onStatusChange(req.id, 'Rejected')}
                    disabled={req.status === 'Rejected'}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
                      req.status === 'Rejected'
                        ? 'bg-rose-50 text-rose-700 opacity-60 cursor-not-allowed'
                        : 'bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-800'
                    }`}
                  >
                    <XCircle className="w-3 h-3" />
                    <span>Decline</span>
                  </button>
                  <button
                    onClick={() => onStatusChange(req.id, 'Pending')}
                    disabled={req.status === 'Pending'}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                      req.status === 'Pending'
                        ? 'bg-amber-50 text-amber-700 opacity-60 cursor-not-allowed'
                        : 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800'
                    }`}
                  >
                    Pending
                  </button>
                </div>

                <button
                  onClick={() => onDeleteRequest(req.id)}
                  className="self-end sm:self-auto p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete request"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
