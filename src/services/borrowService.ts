import {
  STORAGE_KEYS,
  getCollection,
  setCollection,
  addItem,
  updateItem,
  deleteItem,
  generateId,
} from './storage';
import { BorrowRequest, INITIAL_BORROW_REQUESTS } from '../data/seedData';
import { notificationService } from './notificationService';
import { equipmentService } from './equipmentService';

export const borrowService = {
  getAll(): BorrowRequest[] {
    const list = getCollection<BorrowRequest>(STORAGE_KEYS.BORROW_REQUESTS);
    if (!list || list.length === 0) {
      setCollection(STORAGE_KEYS.BORROW_REQUESTS, INITIAL_BORROW_REQUESTS);
      return INITIAL_BORROW_REQUESTS;
    }
    return list;
  },

  getById(id: string): BorrowRequest | undefined {
    return this.getAll().find((r) => r.id === id);
  },

  create(data: {
    equipmentId: string;
    equipmentName: string;
    requesterName: string;
    contact: string;
    startDate: string;
    returnDate: string;
    notes: string;
    dailyRate?: number;
  }): BorrowRequest {
    // Calculate total cost if dates valid
    let totalCost: number | undefined = undefined;
    if (data.dailyRate && data.startDate && data.returnDate) {
      const start = new Date(data.startDate).getTime();
      const end = new Date(data.returnDate).getTime();
      const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      totalCost = days * data.dailyRate;
    }

    const newRequest: BorrowRequest = {
      id: generateId('req'),
      equipmentId: data.equipmentId,
      equipmentName: data.equipmentName,
      requesterName: data.requesterName.trim(),
      contact: data.contact.trim(),
      startDate: data.startDate,
      returnDate: data.returnDate,
      notes: data.notes.trim(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      totalCost,
    };

    addItem<BorrowRequest>(STORAGE_KEYS.BORROW_REQUESTS, newRequest);

    // Notify user
    notificationService.create({
      title: 'Borrow Request Submitted',
      message: `Your request for "${data.equipmentName}" has been placed and is pending review.`,
      type: 'request',
    });

    return newRequest;
  },

  updateStatus(id: string, status: BorrowRequest['status']): BorrowRequest | null {
    const req = this.getById(id);
    if (!req) return null;

    const updated = updateItem<BorrowRequest>(STORAGE_KEYS.BORROW_REQUESTS, id, { status });

    if (updated) {
      if (status === 'Approved') {
        equipmentService.setAvailability(req.equipmentId, false);
        notificationService.create({
          title: 'Request Approved!',
          message: `Your borrow request for "${req.equipmentName}" was approved. Pickup is arranged.`,
          type: 'approval',
        });
      } else if (status === 'Rejected') {
        notificationService.create({
          title: 'Request Declined',
          message: `The request for "${req.equipmentName}" could not be fulfilled at this time.`,
          type: 'system',
        });
      } else if (status === 'Completed') {
        equipmentService.setAvailability(req.equipmentId, true);
        notificationService.create({
          title: 'Equipment Returned',
          message: `"${req.equipmentName}" has been safely returned and verified.`,
          type: 'system',
        });
      }
    }

    return updated;
  },

  delete(id: string): boolean {
    return deleteItem<BorrowRequest>(STORAGE_KEYS.BORROW_REQUESTS, id);
  },
};
