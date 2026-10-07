import { equipmentService } from './equipmentService';
import { borrowService } from './borrowService';
import { resourceService } from './resourceService';
import { reminderService } from './reminderService';
import { healthRecordService } from './healthRecordService';
import { notificationService } from './notificationService';

export interface DashboardSummary {
  totalEquipment: number;
  availableEquipment: number;
  activeBorrowRequests: number;
  upcomingReminders: number;
  healthcareResources: number;
  healthRecords: number;
}

export const dashboardService = {
  getSummary(): DashboardSummary {
    const equipment = equipmentService.getAll();
    const requests = borrowService.getAll();
    const resources = resourceService.getAll();
    const reminders = reminderService.getAll();
    const records = healthRecordService.getAll();

    const availableEquipment = equipment.filter((eq) => eq.available).length;
    const activeBorrowRequests = requests.filter(
      (r) => r.status === 'Pending' || r.status === 'Approved'
    ).length;
    const upcomingReminders = reminders.filter((r) => !r.completed).length;

    return {
      totalEquipment: equipment.length,
      availableEquipment,
      activeBorrowRequests,
      upcomingReminders,
      healthcareResources: resources.length,
      healthRecords: records.length,
    };
  },

  getRecentActivity() {
    const notifications = notificationService.getAll().slice(0, 5);
    const recentRequests = borrowService.getAll().slice(0, 3);
    const pendingReminders = reminderService
      .getAll()
      .filter((r) => !r.completed)
      .slice(0, 4);

    return {
      notifications,
      recentRequests,
      pendingReminders,
    };
  },
};
