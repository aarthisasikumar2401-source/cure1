import {
  STORAGE_KEYS,
  getCollection,
  setCollection,
  addItem,
  updateItem,
  deleteItem,
  generateId,
} from './storage';
import { HealthRecord, INITIAL_HEALTH_RECORDS } from '../data/seedData';
import { notificationService } from './notificationService';

export const healthRecordService = {
  getAll(): HealthRecord[] {
    const list = getCollection<HealthRecord>(STORAGE_KEYS.HEALTH_RECORDS);
    if (!list || list.length === 0) {
      setCollection(STORAGE_KEYS.HEALTH_RECORDS, INITIAL_HEALTH_RECORDS);
      return INITIAL_HEALTH_RECORDS;
    }
    return list;
  },

  getById(id: string): HealthRecord | undefined {
    return this.getAll().find((r) => r.id === id);
  },

  create(data: {
    title: string;
    type: HealthRecord['type'];
    date: string;
    provider: string;
    notes?: string;
  }): HealthRecord {
    const item: HealthRecord = {
      id: generateId('rec'),
      title: data.title.trim(),
      type: data.type,
      date: data.date,
      provider: data.provider.trim(),
      notes: (data.notes || '').trim(),
      createdAt: new Date().toISOString(),
    };

    addItem<HealthRecord>(STORAGE_KEYS.HEALTH_RECORDS, item);
    notificationService.create({
      title: 'Health Record Added',
      message: `"${item.title}" saved to your personal local locker.`,
      type: 'system',
    });
    return item;
  },

  update(id: string, updates: Partial<HealthRecord>): HealthRecord | null {
    return updateItem<HealthRecord>(STORAGE_KEYS.HEALTH_RECORDS, id, updates);
  },

  delete(id: string): boolean {
    const item = this.getById(id);
    const success = deleteItem<HealthRecord>(STORAGE_KEYS.HEALTH_RECORDS, id);
    if (success && item) {
      notificationService.create({
        title: 'Record Removed',
        message: `"${item.title}" deleted from your local health locker.`,
        type: 'system',
      });
    }
    return success;
  },
};
