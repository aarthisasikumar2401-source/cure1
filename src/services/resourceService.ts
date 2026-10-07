import {
  STORAGE_KEYS,
  getCollection,
  setCollection,
  addItem,
  updateItem,
  deleteItem,
  generateId,
} from './storage';
import { HealthcareResource, INITIAL_RESOURCES } from '../data/seedData';

// Haversine formula for distance in miles
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const resourceService = {
  getAll(): HealthcareResource[] {
    const list = getCollection<HealthcareResource>(STORAGE_KEYS.RESOURCES);
    if (!list || list.length === 0) {
      setCollection(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
      return INITIAL_RESOURCES;
    }
    return list;
  },

  getById(id: string): HealthcareResource | undefined {
    return this.getAll().find((r) => r.id === id);
  },

  create(data: Omit<HealthcareResource, 'id'>): HealthcareResource {
    const item: HealthcareResource = {
      ...data,
      id: generateId('res'),
    };
    return addItem<HealthcareResource>(STORAGE_KEYS.RESOURCES, item);
  },

  update(id: string, updates: Partial<HealthcareResource>): HealthcareResource | null {
    return updateItem<HealthcareResource>(STORAGE_KEYS.RESOURCES, id, updates);
  },

  delete(id: string): boolean {
    return deleteItem<HealthcareResource>(STORAGE_KEYS.RESOURCES, id);
  },
};
