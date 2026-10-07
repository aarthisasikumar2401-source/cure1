import {
  STORAGE_KEYS,
  getCollection,
  setCollection,
  addItem,
  updateItem,
  deleteItem,
  generateId,
} from './storage';
import { Reminder, INITIAL_REMINDERS } from '../data/seedData';
import { notificationService } from './notificationService';

export const reminderService = {
  getAll(): Reminder[] {
    const list = getCollection<Reminder>(STORAGE_KEYS.REMINDERS);
    if (!list || list.length === 0) {
      setCollection(STORAGE_KEYS.REMINDERS, INITIAL_REMINDERS);
      return INITIAL_REMINDERS;
    }
    return list;
  },

  getById(id: string): Reminder | undefined {
    return this.getAll().find((r) => r.id === id);
  },

  create(data: {
    title: string;
    type: Reminder['type'];
    date: string;
    time: string;
    notes?: string;
  }): Reminder {
    const item: Reminder = {
      id: generateId('rem'),
      title: data.title.trim(),
      type: data.type,
      date: data.date,
      time: data.time,
      notes: (data.notes || '').trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    addItem<Reminder>(STORAGE_KEYS.REMINDERS, item);
    notificationService.create({
      title: 'Reminder Created',
      message: `"${item.title}" scheduled for ${item.date} at ${item.time}.`,
      type: 'reminder',
    });
    return item;
  },

  toggleComplete(id: string): Reminder | null {
    const rem = this.getById(id);
    if (!rem) return null;

    const nextState = !rem.completed;
    const updated = updateItem<Reminder>(STORAGE_KEYS.REMINDERS, id, {
      completed: nextState,
    });

    if (updated && nextState) {
      notificationService.create({
        title: 'Reminder Completed',
        message: `Great job! "${rem.title}" marked as completed.`,
        type: 'reminder',
      });
    }

    return updated;
  },

  update(id: string, updates: Partial<Reminder>): Reminder | null {
    return updateItem<Reminder>(STORAGE_KEYS.REMINDERS, id, updates);
  },

  delete(id: string): boolean {
    return deleteItem<Reminder>(STORAGE_KEYS.REMINDERS, id);
  },
};
