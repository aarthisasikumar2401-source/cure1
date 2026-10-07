import {
  STORAGE_KEYS,
  getCollection,
  setCollection,
  addItem,
  updateItem,
  deleteItem,
  generateId,
} from './storage';
import { NotificationItem, INITIAL_NOTIFICATIONS } from '../data/seedData';

export const notificationService = {
  getAll(): NotificationItem[] {
    const list = getCollection<NotificationItem>(STORAGE_KEYS.NOTIFICATIONS);
    if (!list || list.length === 0) {
      setCollection(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
      return INITIAL_NOTIFICATIONS;
    }
    return list;
  },

  getUnreadCount(): number {
    return this.getAll().filter((n) => !n.read).length;
  },

  create(data: {
    title: string;
    message: string;
    type?: NotificationItem['type'];
  }): NotificationItem {
    const item: NotificationItem = {
      id: generateId('notif'),
      title: data.title,
      message: data.message,
      type: data.type || 'system',
      date: new Date().toISOString(),
      read: false,
    };
    return addItem<NotificationItem>(STORAGE_KEYS.NOTIFICATIONS, item);
  },

  markRead(id: string): NotificationItem | null {
    return updateItem<NotificationItem>(STORAGE_KEYS.NOTIFICATIONS, id, { read: true });
  },

  markAllAsRead(): void {
    const all = this.getAll().map((item) => ({ ...item, read: true }));
    setCollection(STORAGE_KEYS.NOTIFICATIONS, all);
  },

  delete(id: string): boolean {
    return deleteItem<NotificationItem>(STORAGE_KEYS.NOTIFICATIONS, id);
  },

  clearAll(): void {
    setCollection(STORAGE_KEYS.NOTIFICATIONS, []);
  },
};
