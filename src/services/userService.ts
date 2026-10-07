import { STORAGE_KEYS, getItem, setItem } from './storage';
import { UserProfile, INITIAL_USER } from '../data/seedData';
import { notificationService } from './notificationService';

export const userService = {
  getProfile(): UserProfile {
    const user = getItem<UserProfile>(STORAGE_KEYS.USER);
    if (!user) {
      setItem(STORAGE_KEYS.USER, INITIAL_USER);
      return INITIAL_USER;
    }
    return user;
  },

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated = { ...current, ...updates };
    setItem(STORAGE_KEYS.USER, updated);
    notificationService.create({
      title: 'Profile Updated',
      message: 'Your personal demo profile settings have been updated.',
      type: 'system',
    });
    return updated;
  },
};
