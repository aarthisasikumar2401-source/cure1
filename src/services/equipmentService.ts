import {
  STORAGE_KEYS,
  getCollection,
  setCollection,
  addItem,
  updateItem,
  deleteItem,
  generateId,
} from './storage';
import { Equipment, INITIAL_EQUIPMENT } from '../data/seedData';
import { notificationService } from './notificationService';

export const equipmentService = {
  getAll(): Equipment[] {
    const list = getCollection<Equipment>(STORAGE_KEYS.EQUIPMENT);
    if (!list || list.length === 0) {
      // Seed if empty
      setCollection(STORAGE_KEYS.EQUIPMENT, INITIAL_EQUIPMENT);
      return INITIAL_EQUIPMENT;
    }
    return list;
  },

  getById(id: string): Equipment | undefined {
    return this.getAll().find((eq) => eq.id === id);
  },

  create(data: Omit<Equipment, 'id'>): Equipment {
    const newEquipment: Equipment = {
      ...data,
      id: generateId('eq'),
    };
    addItem<Equipment>(STORAGE_KEYS.EQUIPMENT, newEquipment);
    notificationService.create({
      title: 'Equipment Listed',
      message: `"${newEquipment.name}" has been added to the CureLink community pool.`,
      type: 'system',
    });
    return newEquipment;
  },

  update(id: string, updates: Partial<Equipment>): Equipment | null {
    return updateItem<Equipment>(STORAGE_KEYS.EQUIPMENT, id, updates);
  },

  delete(id: string): boolean {
    const eq = this.getById(id);
    const success = deleteItem<Equipment>(STORAGE_KEYS.EQUIPMENT, id);
    if (success && eq) {
      notificationService.create({
        title: 'Equipment Removed',
        message: `"${eq.name}" was removed from the inventory.`,
        type: 'system',
      });
    }
    return success;
  },

  setAvailability(id: string, available: boolean): Equipment | null {
    return this.update(id, { available });
  },
};
