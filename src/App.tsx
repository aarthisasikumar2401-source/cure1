import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { EquipmentSharing } from './pages/EquipmentSharing';
import { MyRequests } from './pages/MyRequests';
import { HealthcareResources } from './pages/HealthcareResources';
import { Reminders } from './pages/Reminders';
import { HealthRecords } from './pages/HealthRecords';
import { SymptomChecker } from './pages/SymptomChecker';
import { Notifications } from './pages/Notifications';
import { Profile } from './pages/Profile';

import { Equipment, Reminder, BorrowRequest, HealthRecord, NotificationItem, UserProfile } from './data/seedData';
import { equipmentService } from './services/equipmentService';
import { borrowService } from './services/borrowService';
import { resourceService } from './services/resourceService';
import { reminderService } from './services/reminderService';
import { healthRecordService } from './services/healthRecordService';
import { notificationService } from './services/notificationService';
import { userService } from './services/userService';
import { dashboardService, DashboardSummary } from './services/dashboardService';
import { initializeDatabaseIfNeeded, resetDemoDatabase } from './utils/dbInit';

import { BorrowRequestModal } from './components/BorrowRequestModal';
import { EquipmentDetailsModal } from './components/EquipmentDetailsModal';
import { AddEditEquipmentModal } from './components/AddEditEquipmentModal';
import { AddReminderModal } from './components/AddReminderModal';
import { AddHealthRecordModal } from './components/AddHealthRecordModal';
import { ConfirmDialog } from './components/ConfirmDialog';
import { HeartPulse, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Application Data States (Synced from localStorage)
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [profile, setProfile] = useState<UserProfile>(userService.getProfile());
  const [summary, setSummary] = useState<DashboardSummary>({
    totalEquipment: 0,
    availableEquipment: 0,
    activeBorrowRequests: 0,
    upcomingReminders: 0,
    healthcareResources: 0,
    healthRecords: 0,
  });

  // Modal Dialog States
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [selectedEquipmentForBorrow, setSelectedEquipmentForBorrow] = useState<Equipment | null>(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEquipmentForDetails, setSelectedEquipmentForDetails] = useState<Equipment | null>(null);

  const [addEditEquipmentOpen, setAddEditEquipmentOpen] = useState(false);
  const [equipmentToEdit, setEquipmentToEdit] = useState<Equipment | null>(null);

  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [reminderToEdit, setReminderToEdit] = useState<Reminder | null>(null);

  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<HealthRecord | null>(null);

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'equipment' | 'reminder' | 'record' | 'request';
    id: string;
    title: string;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Re-read everything from localStorage
  const refreshAllData = useCallback(() => {
    setEquipment(equipmentService.getAll());
    setRequests(borrowService.getAll());
    setResources(resourceService.getAll());
    setReminders(reminderService.getAll());
    setRecords(healthRecordService.getAll());
    setNotifications(notificationService.getAll());
    setProfile(userService.getProfile());
    setSummary(dashboardService.getSummary());
  }, []);

  // Initialize DB on boot and register storage event listener
  useEffect(() => {
    initializeDatabaseIfNeeded();
    refreshAllData();

    const handleStorageUpdate = () => {
      refreshAllData();
    };

    window.addEventListener('curelink_storage_update', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('curelink_storage_update', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [refreshAllData]);

  // Handler: Confirm Reset Demo Data
  const handleConfirmReset = () => {
    resetDemoDatabase();
    refreshAllData();
    showToast('Demo data reinitialized to showcase baseline.');
  };

  // Handlers for Equipment
  const handleOpenBorrowModal = (eq: Equipment) => {
    setSelectedEquipmentForBorrow(eq);
    setBorrowModalOpen(true);
  };

  const handleOpenDetailsModal = (eq: Equipment) => {
    setSelectedEquipmentForDetails(eq);
    setDetailsModalOpen(true);
  };

  const handleAddEquipment = () => {
    setEquipmentToEdit(null);
    setAddEditEquipmentOpen(true);
  };

  const handleEditEquipment = (eq: Equipment) => {
    setEquipmentToEdit(eq);
    setAddEditEquipmentOpen(true);
  };

  const handleDeleteEquipmentPrompt = (id: string) => {
    const item = equipment.find((e) => e.id === id);
    setItemToDelete({
      type: 'equipment',
      id,
      title: item ? `equipment "${item.name}"` : 'this equipment listing',
    });
    setDeleteConfirmOpen(true);
  };

  // Handlers for Reminders
  const handleAddReminder = () => {
    setReminderToEdit(null);
    setReminderModalOpen(true);
  };

  const handleEditReminder = (rem: Reminder) => {
    setReminderToEdit(rem);
    setReminderModalOpen(true);
  };

  const handleDeleteReminderPrompt = (id: string) => {
    const item = reminders.find((r) => r.id === id);
    setItemToDelete({
      type: 'reminder',
      id,
      title: item ? `reminder "${item.title}"` : 'this reminder',
    });
    setDeleteConfirmOpen(true);
  };

  const handleToggleReminderComplete = (id: string) => {
    reminderService.toggleComplete(id);
    refreshAllData();
  };

  // Handlers for Health Records
  const handleAddRecord = () => {
    setRecordToEdit(null);
    setRecordModalOpen(true);
  };

  const handleEditRecord = (rec: HealthRecord) => {
    setRecordToEdit(rec);
    setRecordModalOpen(true);
  };

  const handleDeleteRecordPrompt = (id: string) => {
    const item = records.find((r) => r.id === id);
    setItemToDelete({
      type: 'record',
      id,
      title: item ? `record "${item.title}"` : 'this health record',
    });
    setDeleteConfirmOpen(true);
  };

  // Handlers for Borrow Requests
  const handleRequestStatusChange = (id: string, status: BorrowRequest['status']) => {
    borrowService.updateStatus(id, status);
    refreshAllData();
    showToast(`Borrow request status updated to "${status}".`);
  };

  const handleDeleteRequestPrompt = (id: string) => {
    const item = requests.find((r) => r.id === id);
    setItemToDelete({
      type: 'request',
      id,
      title: item ? `request for "${item.equipmentName}"` : 'this borrow request',
    });
    setDeleteConfirmOpen(true);
  };

  // Generic Delete Action Confirmation Execution
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'equipment') {
      equipmentService.delete(itemToDelete.id);
      showToast('Equipment removed from inventory.');
    } else if (itemToDelete.type === 'reminder') {
      reminderService.delete(itemToDelete.id);
      showToast('Reminder deleted.');
    } else if (itemToDelete.type === 'record') {
      healthRecordService.delete(itemToDelete.id);
      showToast('Health record removed.');
    } else if (itemToDelete.type === 'request') {
      borrowService.delete(itemToDelete.id);
      showToast('Borrow request deleted.');
    }
    refreshAllData();
    setItemToDelete(null);
  };

  // Handlers for Notifications
  const handleMarkNotificationRead = (id: string) => {
    notificationService.markRead(id);
    refreshAllData();
  };

  const handleMarkAllNotificationsRead = () => {
    notificationService.markAllAsRead();
    refreshAllData();
    showToast('All notifications marked as read.');
  };

  const handleDeleteNotification = (id: string) => {
    notificationService.delete(id);
    refreshAllData();
  };

  const handleClearAllNotifications = () => {
    notificationService.clearAll();
    refreshAllData();
    showToast('Notification center cleared.');
  };

  // Handlers for Profile
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    userService.updateProfile(updated);
    refreshAllData();
    showToast('Profile preferences updated.');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-teal-500 selection:text-white">
      {/* Top Bar Contract Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        unreadCount={unreadCount}
        onResetDataClick={() => setResetConfirmOpen(true)}
        userName={profile.name}
      />

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-lg border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === 'dashboard' && (
          <Dashboard
            summary={summary}
            equipment={equipment}
            reminders={reminders}
            requests={requests}
            notifications={notifications}
            userName={profile.name}
            onNavigate={(tab) => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRequestEquipment={handleOpenBorrowModal}
            onViewEquipmentDetails={handleOpenDetailsModal}
            onAddReminderClick={handleAddReminder}
            onAddEquipmentClick={handleAddEquipment}
          />
        )}

        {currentTab === 'equipment' && (
          <EquipmentSharing
            equipment={equipment}
            onViewDetails={handleOpenDetailsModal}
            onRequestEquipment={handleOpenBorrowModal}
            onAddEquipment={handleAddEquipment}
            onEditEquipment={handleEditEquipment}
            onDeleteEquipment={handleDeleteEquipmentPrompt}
          />
        )}

        {currentTab === 'requests' && (
          <MyRequests
            requests={requests}
            onStatusChange={handleRequestStatusChange}
            onDeleteRequest={handleDeleteRequestPrompt}
            onNavigateToEquipment={() => setCurrentTab('equipment')}
          />
        )}

        {currentTab === 'resources' && (
          <HealthcareResources resources={resources} />
        )}

        {currentTab === 'reminders' && (
          <Reminders
            reminders={reminders}
            onAddReminder={handleAddReminder}
            onEditReminder={handleEditReminder}
            onDeleteReminder={handleDeleteReminderPrompt}
            onToggleComplete={handleToggleReminderComplete}
          />
        )}

        {currentTab === 'records' && (
          <HealthRecords
            records={records}
            onAddRecord={handleAddRecord}
            onEditRecord={handleEditRecord}
            onDeleteRecord={handleDeleteRecordPrompt}
          />
        )}

        {currentTab === 'symptoms' && (
          <SymptomChecker
            onNavigateToResources={() => setCurrentTab('resources')}
          />
        )}

        {currentTab === 'notifications' && (
          <Notifications
            notifications={notifications}
            onMarkRead={handleMarkNotificationRead}
            onMarkAllRead={handleMarkAllNotificationsRead}
            onDeleteNotification={handleDeleteNotification}
            onClearAll={handleClearAllNotifications}
          />
        )}

        {currentTab === 'profile' && (
          <Profile
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onResetDataClick={() => setResetConfirmOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <HeartPulse className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-900">CureLink</span>
              <span className="text-slate-400">·</span>
              <span>AI-Based Digitalized Healthcare Platform</span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button
                onClick={() => setResetConfirmOpen(true)}
                className="hover:text-slate-800 text-slate-500 underline"
              >
                Reset Demo Data
              </button>
              <span>·</span>
              <span className="text-slate-400">Local Browser Storage Architecture</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <p>
              Educational demonstration platform. All equipment sharing, borrow bookings, and health
              records are stored offline in browser localStorage.
            </p>
            <p>Ready for direct Vercel deployment.</p>
          </div>
        </div>
      </footer>

      {/* Global Modals & Dialogs */}
      <BorrowRequestModal
        isOpen={borrowModalOpen}
        onClose={() => {
          setBorrowModalOpen(false);
          setSelectedEquipmentForBorrow(null);
        }}
        equipment={selectedEquipmentForBorrow}
        onSuccess={() => {
          refreshAllData();
          showToast('Borrow request placed in queue.');
        }}
      />

      <EquipmentDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedEquipmentForDetails(null);
        }}
        equipment={selectedEquipmentForDetails}
        onRequestClick={(eq) => {
          handleOpenBorrowModal(eq);
        }}
      />

      <AddEditEquipmentModal
        isOpen={addEditEquipmentOpen}
        onClose={() => {
          setAddEditEquipmentOpen(false);
          setEquipmentToEdit(null);
        }}
        equipmentToEdit={equipmentToEdit}
        onSuccess={() => {
          refreshAllData();
          showToast(equipmentToEdit ? 'Equipment updated.' : 'New equipment added to community pool.');
        }}
      />

      <AddReminderModal
        isOpen={reminderModalOpen}
        onClose={() => {
          setReminderModalOpen(false);
          setReminderToEdit(null);
        }}
        reminderToEdit={reminderToEdit}
        onSuccess={() => {
          refreshAllData();
          showToast(reminderToEdit ? 'Reminder updated.' : 'New reminder created.');
        }}
      />

      <AddHealthRecordModal
        isOpen={recordModalOpen}
        onClose={() => {
          setRecordModalOpen(false);
          setRecordToEdit(null);
        }}
        recordToEdit={recordToEdit}
        onSuccess={() => {
          refreshAllData();
          showToast(recordToEdit ? 'Record updated.' : 'Health record added to local locker.');
        }}
      />

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset Demo Data?"
        message="This will clear all customized equipment listings, borrow requests, health records, and reminders from your browser's localStorage and reload the original CureLink demonstration dataset."
        confirmText="Reset All Data"
        cancelText="Cancel"
        danger={true}
      />

      {/* Item Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to permanently delete ${
          itemToDelete?.title || 'this item'
        }? This change cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
      />
    </div>
  );
}
