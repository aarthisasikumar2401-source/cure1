/**
 * CureLink LocalStorage Database Abstraction Layer
 * Pure client-side persistent storage without external backend or database.
 */

export const STORAGE_KEYS = {
  EQUIPMENT: 'curelink_equipment',
  BORROW_REQUESTS: 'curelink_borrow_requests',
  RESOURCES: 'curelink_resources',
  REMINDERS: 'curelink_reminders',
  HEALTH_RECORDS: 'curelink_health_records',
  NOTIFICATIONS: 'curelink_notifications',
  USER: 'curelink_user',
  INITIALIZED: 'curelink_initialized',
} as const;

export function isStorageAvailable(): boolean {
  try {
    const testKey = '__curelink_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function dispatchStorageUpdate(key?: string): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('curelink_storage_update', { detail: { key } }));
  }
}

export function getCollection<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error(`Failed to read collection "${key}" from localStorage:`, err);
    return [];
  }
}

export function setCollection<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    dispatchStorageUpdate(key);
  } catch (err) {
    console.error(`Failed to save collection "${key}" to localStorage:`, err);
  }
}

export function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Failed to read item "${key}" from localStorage:`, err);
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    dispatchStorageUpdate(key);
  } catch (err) {
    console.error(`Failed to write item "${key}" to localStorage:`, err);
  }
}

export function addItem<T extends { id: string }>(key: string, item: T): T {
  const collection = getCollection<T>(key);
  const updated = [item, ...collection];
  setCollection(key, updated);
  return item;
}

export function updateItem<T extends { id: string }>(
  key: string,
  id: string,
  updates: Partial<T>
): T | null {
  const collection = getCollection<T>(key);
  const index = collection.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updatedItem = { ...collection[index], ...updates };
  collection[index] = updatedItem;
  setCollection(key, collection);
  return updatedItem;
}

export function deleteItem<T extends { id: string }>(key: string, id: string): boolean {
  const collection = getCollection<T>(key);
  const filtered = collection.filter((item) => item.id !== id);
  if (filtered.length === collection.length) return false;
  setCollection(key, filtered);
  return true;
}

export function clearAllCureLinkData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((k) => {
      localStorage.removeItem(k);
    });
    dispatchStorageUpdate();
  } catch (err) {
    console.error('Error resetting CureLink storage:', err);
  }
}
