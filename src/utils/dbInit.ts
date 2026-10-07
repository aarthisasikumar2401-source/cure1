import {
  STORAGE_KEYS,
  getItem,
  setItem,
  setCollection,
  clearAllCureLinkData,
  dispatchStorageUpdate,
} from '../services/storage';
import {
  INITIAL_EQUIPMENT,
  INITIAL_BORROW_REQUESTS,
  INITIAL_RESOURCES,
  INITIAL_REMINDERS,
  INITIAL_HEALTH_RECORDS,
  INITIAL_NOTIFICATIONS,
  INITIAL_USER,
} from '../data/seedData';

export function initializeDatabaseIfNeeded(): void {
  try {
    const initialized = getItem<string>(STORAGE_KEYS.INITIALIZED);
    if (!initialized) {
      // Seed all collections
      setCollection(STORAGE_KEYS.EQUIPMENT, INITIAL_EQUIPMENT);
      setCollection(STORAGE_KEYS.BORROW_REQUESTS, INITIAL_BORROW_REQUESTS);
      setCollection(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
      setCollection(STORAGE_KEYS.REMINDERS, INITIAL_REMINDERS);
      setCollection(STORAGE_KEYS.HEALTH_RECORDS, INITIAL_HEALTH_RECORDS);
      setCollection(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
      setItem(STORAGE_KEYS.USER, INITIAL_USER);
      setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  } catch (err) {
    console.error('Failed to initialize CureLink database:', err);
  }
}

export function resetDemoDatabase(): void {
  clearAllCureLinkData();
  setCollection(STORAGE_KEYS.EQUIPMENT, INITIAL_EQUIPMENT);
  setCollection(STORAGE_KEYS.BORROW_REQUESTS, INITIAL_BORROW_REQUESTS);
  setCollection(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  setCollection(STORAGE_KEYS.REMINDERS, INITIAL_REMINDERS);
  setCollection(STORAGE_KEYS.HEALTH_RECORDS, INITIAL_HEALTH_RECORDS);
  setCollection(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  setItem(STORAGE_KEYS.USER, INITIAL_USER);
  setItem(STORAGE_KEYS.INITIALIZED, 'true');
  dispatchStorageUpdate();
}
