// Date filtering utility for dashboards

export type DateFilterRange = 'thisMonth' | 'last3Months' | 'all';

export const getFilterLabel = (range: DateFilterRange): string => {
  switch (range) {
    case 'thisMonth':
      return 'This Month';
    case 'last3Months':
      return 'Last 3 Months';
    case 'all':
      return 'All Data';
    default:
      return 'All Data';
  }
};

export const getFilterOptions = (): { value: DateFilterRange; label: string }[] => [
  { value: 'thisMonth', label: 'This Month' },
  { value: 'last3Months', label: 'Last 3 Months' },
  { value: 'all', label: 'All Data' },
];

/**
 * Filter data array by date field based on selected range
 * @param data - Array of objects containing a date field
 * @param dateKey - The key in the object that holds the date string
 * @param filterRange - The time range to filter by
 * @returns Filtered array
 */
export const filterDataByDate = <T extends Record<string, any>>(
  data: T[],
  dateKey: keyof T,
  filterRange: DateFilterRange
): T[] => {
  if (filterRange === 'all') {
    return data;
  }

  const now = new Date();

  return data.filter((item) => {
    const itemDate = new Date(item[dateKey] as string);

    // Handle invalid dates gracefully
    if (isNaN(itemDate.getTime())) {
      return false;
    }

    if (filterRange === 'thisMonth') {
      return (
        itemDate.getMonth() === now.getMonth() &&
        itemDate.getFullYear() === now.getFullYear()
      );
    }

    if (filterRange === 'last3Months') {
      const past = new Date();
      past.setMonth(now.getMonth() - 3);
      past.setHours(0, 0, 0, 0);
      return itemDate >= past;
    }

    return true;
  });
};

/**
 * Get start date for a filter range
 */
export const getFilterStartDate = (filterRange: DateFilterRange): Date | null => {
  if (filterRange === 'all') return null;
  
  const now = new Date();
  
  if (filterRange === 'thisMonth') {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  
  if (filterRange === 'last3Months') {
    const past = new Date();
    past.setMonth(now.getMonth() - 3);
    past.setHours(0, 0, 0, 0);
    return past;
  }
  
  return null;
};

