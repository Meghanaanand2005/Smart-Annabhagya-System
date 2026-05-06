// Dynamic graph data generation based on time filters

export type TimeFilter = 'This Month' | 'Last 3 Months' | 'All Data';

interface MonthlyDataPoint {
  month: string;
  rice: number;
  ragi: number;
  wheat: number;
  sugar: number;
}

interface TrendDataPoint {
  month: string;
  distributed: number;
  beneficiaries: number;
}

// Base monthly distribution data
const baseMonthlyData: MonthlyDataPoint[] = [
  { month: 'Oct', rice: 450, ragi: 280, wheat: 320, sugar: 120 },
  { month: 'Nov', rice: 520, ragi: 310, wheat: 360, sugar: 140 },
  { month: 'Dec', rice: 580, ragi: 340, wheat: 390, sugar: 150 },
  { month: 'Jan', rice: 610, ragi: 370, wheat: 420, sugar: 165 },
  { month: 'Feb', rice: 640, ragi: 390, wheat: 450, sugar: 175 },
  { month: 'Mar', rice: 680, ragi: 410, wheat: 480, sugar: 190 },
];

const baseTrendData: TrendDataPoint[] = [
  { month: 'Oct', distributed: 38200, beneficiaries: 28400 },
  { month: 'Nov', distributed: 41500, beneficiaries: 29100 },
  { month: 'Dec', distributed: 44300, beneficiaries: 30200 },
  { month: 'Jan', distributed: 46800, beneficiaries: 31500 },
  { month: 'Feb', distributed: 45200, beneficiaries: 30800 },
  { month: 'Mar', distributed: 47630, beneficiaries: 33540 },
];

// Get month distribution data based on filter
export const getMonthlyDistributionData = (filter: TimeFilter): MonthlyDataPoint[] => {
  switch (filter) {
    case 'This Month':
      return baseMonthlyData.slice(-1); // Last 1 month
    case 'Last 3 Months':
      return baseMonthlyData.slice(-3); // Last 3 months
    case 'All Data':
    default:
      return baseMonthlyData; // All 6 months
  }
};

// Get state-wide trend data based on filter
export const getStateTrendData = (filter: TimeFilter): TrendDataPoint[] => {
  switch (filter) {
    case 'This Month':
      return baseTrendData.slice(-1); // Last 1 month
    case 'Last 3 Months':
      return baseTrendData.slice(-3); // Last 3 months
    case 'All Data':
    default:
      return baseTrendData; // All 6 months
  }
};

// Get total distributed based on filter
export const getTotalDistributed = (filter: TimeFilter): number => {
  const data = getMonthlyDistributionData(filter);
  return data.reduce((sum, item) => sum + item.rice + item.ragi + item.wheat + item.sugar, 0);
};

// Get distribution item data for pie chart
export const getDistributionItemData = (filter: TimeFilter) => {
  const data = getMonthlyDistributionData(filter);
  const totals = data.reduce(
    (acc, item) => ({
      rice: acc.rice + item.rice,
      ragi: acc.ragi + item.ragi,
      wheat: acc.wheat + item.wheat,
      sugar: acc.sugar + item.sugar,
    }),
    { rice: 0, ragi: 0, wheat: 0, sugar: 0 }
  );

  return [
    { name: 'Rice', value: totals.rice, color: '#f59e0b' },
    { name: 'Ragi', value: totals.ragi, color: '#ea580c' },
    { name: 'Wheat', value: totals.wheat, color: '#fbbf24' },
    { name: 'Sugar', value: totals.sugar, color: '#ef4444' },
  ];
};
