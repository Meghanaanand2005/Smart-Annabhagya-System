// Slot management utilities

export interface Slot {
  id: string;
  date: string;
  time: string;
  crowd: 'Low' | 'Medium' | 'High';
  available: boolean;
  queueCount: number;
  wasCancelled?: boolean;
}

export interface BookingHistory {
  rationNumber: string;
  tokenNumber: string;
  slot: Slot;
  bookingDate: string;
  rationItems: {
    rice: number;
    ragi: number;
    wheat: number;
    sugar: number;
  };
}

// Get all slots from localStorage
export const getSlots = (): Slot[] => {
  const slots = localStorage.getItem('availableSlots');
  if (!slots) {
    // Initialize with default slots
    const defaultSlots: Slot[] = [
      { id: '1', date: '2026-04-28', time: '09:00 AM - 11:00 AM', crowd: 'Low', available: true, queueCount: 12 },
      { id: '2', date: '2026-04-28', time: '11:00 AM - 01:00 PM', crowd: 'Medium', available: true, queueCount: 28 },
      { id: '3', date: '2026-04-28', time: '02:00 PM - 04:00 PM', crowd: 'High', available: true, queueCount: 45 },
      { id: '4', date: '2026-04-29', time: '09:00 AM - 11:00 AM', crowd: 'Low', available: true, queueCount: 8 },
      { id: '5', date: '2026-04-29', time: '11:00 AM - 01:00 PM', crowd: 'Low', available: true, queueCount: 15 },
      { id: '6', date: '2026-04-29', time: '02:00 PM - 04:00 PM', crowd: 'Medium', available: true, queueCount: 32 },
      { id: '7', date: '2026-04-30', time: '09:00 AM - 11:00 AM', crowd: 'Low', available: true, queueCount: 10 },
      { id: '8', date: '2026-04-30', time: '11:00 AM - 01:00 PM', crowd: 'Medium', available: true, queueCount: 25 },
    ];
    saveSlots(defaultSlots);
    return defaultSlots;
  }
  return JSON.parse(slots);
};

// Save slots to localStorage
export const saveSlots = (slots: Slot[]): void => {
  localStorage.setItem('availableSlots', JSON.stringify(slots));
};

// Mark a slot as booked
export const bookSlot = (slotId: string): void => {
  const slots = getSlots();
  const updatedSlots = slots.map(slot =>
    slot.id === slotId ? { ...slot, available: false, wasCancelled: false } : slot
  );
  saveSlots(updatedSlots);
};

// Cancel a booking and make slot available again
export const cancelSlotBooking = (slotId: string): void => {
  const slots = getSlots();
  const updatedSlots = slots.map(slot =>
    slot.id === slotId ? { ...slot, available: true, wasCancelled: true } : slot
  );
  saveSlots(updatedSlots);
};

// Get booking history for a user
export const getBookingHistory = (rationNumber: string): BookingHistory[] => {
  const history = localStorage.getItem(`bookingHistory_${rationNumber}`);
  return history ? JSON.parse(history) : [];
};

// Add a booking to history
export const addBookingToHistory = (booking: BookingHistory): void => {
  const history = getBookingHistory(booking.rationNumber);
  history.unshift(booking); // Add to beginning

  // Keep only last 10 bookings
  const limitedHistory = history.slice(0, 10);
  localStorage.setItem(`bookingHistory_${booking.rationNumber}`, JSON.stringify(limitedHistory));
};

// Remove a booking from history (when cancelled)
export const removeBookingFromHistory = (rationNumber: string, tokenNumber: string): void => {
  const history = getBookingHistory(rationNumber);
  const updatedHistory = history.filter(b => b.tokenNumber !== tokenNumber);
  localStorage.setItem(`bookingHistory_${rationNumber}`, JSON.stringify(updatedHistory));
};

// Get recommended slots based on user's booking history
export const getRecommendedSlots = (rationNumber: string): Slot[] => {
  const history = getBookingHistory(rationNumber);
  const availableSlots = getSlots().filter(s => s.available);

  if (history.length === 0) {
    return [];
  }

  // Analyze last 3 bookings
  const recentBookings = history.slice(0, 3);

  // Find common patterns
  const timePreferences = recentBookings.map(b => b.slot.time);
  const datePatterns = recentBookings.map(b => new Date(b.slot.date).getDay()); // Day of week

  // Find slots matching user preferences
  const recommended = availableSlots.filter(slot => {
    const slotDay = new Date(slot.date).getDay();
    const matchesTime = timePreferences.includes(slot.time);
    const matchesDay = datePatterns.includes(slotDay);

    return matchesTime || matchesDay;
  });

  return recommended.slice(0, 3); // Return top 3 recommendations
};

// Validate Aadhaar number format
export const validateAadhaar = (aadhaar: string): boolean => {
  // Remove spaces and check if it's 12 digits
  const cleaned = aadhaar.replace(/\s/g, '');
  return /^\d{12}$/.test(cleaned);
};

// Format Aadhaar number with spaces
export const formatAadhaar = (value: string): string => {
  const cleaned = value.replace(/\s/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cleaned;
};
