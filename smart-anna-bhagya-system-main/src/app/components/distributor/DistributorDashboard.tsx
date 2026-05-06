import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, Package, PlusCircle, TrendingUp, BarChart3, Users, Clock, MessageCircle, Filter, CalendarDays } from 'lucide-react';
import WhatsAppBroadcast from './WhatsAppBroadcast';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AuthContextType } from '../../App';
import { filterDataByDate, DateFilterRange } from '../../utils/dateFilter';
import { getMonthlyDistributionData, getDistributionItemData, TimeFilter } from '../../utils/graphData';

interface Props {
  authContext: AuthContextType;
}

interface Stock {
  rice: number;
  ragi: number;
  wheat: number;
  sugar: number;
}

interface Slot {
  date: string;
  time: string;
  capacity: number;
}

const filterOptions: { value: DateFilterRange; label: string }[] = [
  { value: 'thisMonth', label: 'This Month' },
  { value: 'last3Months', label: 'Last 3 Months' },
  { value: 'all', label: 'All Data' },
];

export default function DistributorDashboard({ authContext }: Props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'slots' | 'stock' | 'analytics' | 'broadcast'>('slots');
  const [dateFilter, setDateFilter] = useState<DateFilterRange>('thisMonth');
  const [stock, setStock] = useState<Stock>({ rice: 500, ragi: 300, wheat: 400, sugar: 200 });
  const [slots, setSlots] = useState<Slot[]>([
    { date: '2026-04-28', time: '09:00 AM - 11:00 AM', capacity: 50 },
    { date: '2026-04-28', time: '11:00 AM - 01:00 PM', capacity: 50 },
    { date: '2026-04-25', time: '09:00 AM - 11:00 AM', capacity: 50 },
    { date: '2026-03-15', time: '02:00 PM - 04:00 PM', capacity: 50 },
    { date: '2026-02-10', time: '10:00 AM - 12:00 PM', capacity: 50 },
  ]);
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  const handleLogout = () => {
    authContext.logout();
    navigate('/');
  };

  // Filter slots by date
  const filteredSlots = filterDataByDate(slots, 'date', dateFilter);

  // Get analytics data based on filter
  const timeFilterLabel: TimeFilter =
    dateFilter === 'thisMonth' ? 'This Month' :
    dateFilter === 'last3Months' ? 'Last 3 Months' : 'All Data';

  const monthlyData = getMonthlyDistributionData(timeFilterLabel);
  const distributionData = getDistributionItemData(timeFilterLabel);

  // Recalculate summaries from filtered data
  const totalDistributed = distributionData.reduce((sum, item) => sum + item.value, 0);
  const bplUsage = timeFilterLabel === 'This Month' ? 2847 :
                   timeFilterLabel === 'Last 3 Months' ? 8520 : 15640;

  const addSlot = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSlot: Slot = {
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      capacity: parseInt(formData.get('capacity') as string),
    };
    setSlots([...slots, newSlot]);
    setShowAddSlotModal(false);
  };

  const updateStock = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newStock: Stock = {
      rice: parseInt(formData.get('rice') as string) || 0,
      ragi: parseInt(formData.get('ragi') as string) || 0,
      wheat: parseInt(formData.get('wheat') as string) || 0,
      sugar: parseInt(formData.get('sugar') as string) || 0,
    };
    setStock(newStock);
    setShowStockModal(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl text-indigo-900">Distributor Dashboard</h1>
              <p className="text-sm text-muted-foreground">{authContext.userData.name} - {authContext.userData.district}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 border-b overflow-x-auto">
            {[
              { id: 'slots', label: 'Slot Management', icon: Calendar },
              { id: 'stock', label: 'Stock Management', icon: Package },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'broadcast', label: 'WhatsApp Broadcast', icon: MessageCircle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm sm:text-base">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Date Filter Bar */}
        <div className="bg-white rounded-xl p-4 shadow-lg flex flex-wrap gap-4 items-center mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-green-600" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilterRange)}
              className="px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Slot Management Tab */}
        {activeTab === 'slots' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-indigo-900">Available Slots</h2>
              <button
                onClick={() => setShowAddSlotModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Add Slot
              </button>
            </div>

            {filteredSlots.length === 0 ? (
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg text-indigo-900 mb-1">No Slots Available</h3>
                <p className="text-sm text-muted-foreground">
                  No slots found for the selected time period. Try switching to "All Data" or add a new slot.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSlots.map((slot, index) => (
                  <div key={index} className="bg-white rounded-xl p-5 shadow-lg border-2 border-green-200">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">{slot.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-medium">{slot.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Capacity</p>
                        <p className="font-medium">{slot.capacity} people</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stock Management Tab */}
        {activeTab === 'stock' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-indigo-900">Current Stock Levels</h2>
              <button
                onClick={() => setShowStockModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Package className="w-4 h-4" />
                Update Stock
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'Rice', amount: stock.rice, icon: '🌾', color: 'from-amber-100 to-yellow-100', textColor: 'text-amber-700' },
                { name: 'Ragi', amount: stock.ragi, icon: '🌰', color: 'from-orange-100 to-amber-100', textColor: 'text-orange-700' },
                { name: 'Wheat', amount: stock.wheat, icon: '🌾', color: 'from-yellow-100 to-orange-100', textColor: 'text-yellow-700' },
                { name: 'Sugar', amount: stock.sugar, icon: '🍬', color: 'from-pink-100 to-red-100', textColor: 'text-pink-700' },
              ].map((item) => (
                <div key={item.name} className={`bg-gradient-to-br ${item.color} rounded-xl p-6 shadow-lg`}>
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <p className="text-sm text-muted-foreground mb-1">{item.name}</p>
                  <p className={`text-3xl ${item.textColor}`}>{item.amount} kg</p>
                  <div className="mt-3 h-2 bg-white/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.textColor.replace('text', 'bg')}`}
                      style={{ width: `${(item.amount / 1000) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg text-indigo-900 mb-4">Stock Alerts</h3>
              <div className="space-y-3">
                {Object.entries(stock).map(([item, amount]) => {
                  const lowStock = amount < 200;
                  return (
                    <div key={item} className={`p-3 rounded-lg ${lowStock ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
                      <div className="flex items-center justify-between">
                        <span className="capitalize">{item}</span>
                        <span className={lowStock ? 'text-red-700' : 'text-green-700'}>
                          {lowStock ? '⚠️ Low Stock' : '✓ Adequate'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Broadcast Tab */}
        {activeTab === 'broadcast' && <WhatsAppBroadcast />}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">Total Distributed</p>
                </div>
                <p className="text-2xl text-indigo-900">{totalDistributed} kg</p>
                <p className="text-xs text-green-600 mt-1">↑ 12% from last month</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">BPL Families</p>
                </div>
                <p className="text-2xl text-indigo-900">{bplUsage}</p>
                <p className="text-xs text-muted-foreground mt-1">Active beneficiaries</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">Top Item</p>
                </div>
                <p className="text-2xl text-indigo-900">Rice</p>
                <p className="text-xs text-muted-foreground mt-1">{distributionData[0]?.value || 0} kg this period</p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-sm text-muted-foreground">Avg/Day</p>
                </div>
                <p className="text-2xl text-indigo-900">{monthlyData.length > 0 ? (totalDistributed / (monthlyData.length * 30)).toFixed(1) : '0.0'} kg</p>
                <p className="text-xs text-muted-foreground mt-1">Daily average</p>
              </div>
            </div>

            {/* Monthly Distribution Chart */}
            {monthlyData.length > 0 ? (
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg text-indigo-900 mb-4">Monthly Distribution Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rice" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="ragi" stroke="#ea580c" strokeWidth={2} />
                    <Line type="monotone" dataKey="wheat" stroke="#fbbf24" strokeWidth={2} />
                    <Line type="monotone" dataKey="sugar" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg text-indigo-900 mb-1">No Analytics Data</h3>
                <p className="text-sm text-muted-foreground">
                  No distribution data found for the selected time period. Try switching to "All Data".
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Item Distribution Pie Chart */}
              {distributionData.some(d => d.value > 0) && (
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg text-indigo-900 mb-4">Distribution by Item</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Comparison Bar Chart */}
              {monthlyData.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg text-indigo-900 mb-4">Period Comparison</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="rice" fill="#f59e0b" />
                      <Bar dataKey="wheat" fill="#fbbf24" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      {showAddSlotModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl text-indigo-900 mb-4">Add New Slot</h3>
            <form onSubmit={addSlot} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Time Slot</label>
                <input
                  type="text"
                  name="time"
                  placeholder="e.g., 09:00 AM - 11:00 AM"
                  required
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Capacity (people)</label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  defaultValue={50}
                  required
                  className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddSlotModal(false)}
                  className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Stock Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl text-indigo-900 mb-4">Update Stock Levels</h3>
            <form onSubmit={updateStock} className="space-y-4">
              {['rice', 'ragi', 'wheat', 'sugar'].map((item) => (
                <div key={item}>
                  <label className="block text-sm mb-1 capitalize">{item} (kg)</label>
                  <input
                    type="number"
                    name={item}
                    min="0"
                    defaultValue={stock[item as keyof Stock]}
                    className="w-full px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              ))}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowStockModal(false)}
                  className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

