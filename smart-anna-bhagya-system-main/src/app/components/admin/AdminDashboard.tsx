import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, MapPin, TrendingUp, Users, Package, BarChart3, FileText, Filter, Download, CalendarDays } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AuthContextType } from '../../App';
import { filterDataByDate, DateFilterRange } from '../../utils/dateFilter';
import { getStateTrendData, TimeFilter } from '../../utils/graphData';

interface Props {
  authContext: AuthContextType;
}

// Mock data for districts with dates
const districtData = [
  { name: 'Bangalore Urban', totalKg: 12450, distributors: 25, users: 8920, efficiency: 94, date: '2026-04-15' },
  { name: 'Mysore', totalKg: 8760, distributors: 18, users: 6340, efficiency: 91, date: '2026-04-10' },
  { name: 'Mangalore', totalKg: 7520, distributors: 15, users: 5280, efficiency: 88, date: '2026-03-28' },
  { name: 'Hubli', totalKg: 6890, distributors: 14, users: 4920, efficiency: 92, date: '2026-03-20' },
  { name: 'Belgaum', totalKg: 6340, distributors: 12, users: 4560, efficiency: 89, date: '2026-02-15' },
  { name: 'Tumkur', totalKg: 5670, distributors: 11, users: 4120, efficiency: 87, date: '2026-01-20' },
];

const distributorPerformance = [
  { id: 'dist001', name: 'Bangalore Central', district: 'Bangalore Urban', distributed: 2840, rating: 4.8, slots: 156, date: '2026-04-18' },
  { id: 'dist002', name: 'Mysore Main', district: 'Mysore', distributed: 2420, rating: 4.6, slots: 142, date: '2026-04-12' },
  { id: 'dist003', name: 'Mangalore East', district: 'Mangalore', distributed: 2180, rating: 4.7, slots: 128, date: '2026-03-25' },
  { id: 'dist004', name: 'Hubli North', district: 'Hubli', distributed: 1960, rating: 4.5, slots: 118, date: '2026-03-18' },
  { id: 'dist005', name: 'Belgaum West', district: 'Belgaum', distributed: 1840, rating: 4.4, slots: 112, date: '2026-02-10' },
];

const filterOptions: { value: DateFilterRange; label: string }[] = [
  { value: 'thisMonth', label: 'This Month' },
  { value: 'last3Months', label: 'Last 3 Months' },
  { value: 'all', label: 'All Data' },
];

export default function AdminDashboard({ authContext }: Props) {
  const navigate = useNavigate();
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [dateFilter, setDateFilter] = useState<DateFilterRange>('thisMonth');

  const handleLogout = () => {
    authContext.logout();
    navigate('/');
  };

  // Filter data by date
  const filteredDistrictData = filterDataByDate(districtData, 'date', dateFilter).filter((d) =>
    selectedDistrict === 'All Districts' ? true : d.name === selectedDistrict
  );

  const filteredDistributorPerformance = filterDataByDate(distributorPerformance, 'date', dateFilter).filter((d) =>
    selectedDistrict === 'All Districts' ? true : d.district === selectedDistrict
  );

  // Get trend data based on filter
  const timeFilterLabel: TimeFilter =
    dateFilter === 'thisMonth' ? 'This Month' :
    dateFilter === 'last3Months' ? 'Last 3 Months' : 'All Data';
  const monthlyTrend = getStateTrendData(timeFilterLabel);

  // Recalculate summary cards from filtered data
  const totalDistributed = filteredDistrictData.reduce((sum, d) => sum + d.totalKg, 0);
  const totalDistributors = filteredDistrictData.reduce((sum, d) => sum + d.distributors, 0);
  const totalUsers = filteredDistrictData.reduce((sum, d) => sum + d.users, 0);
  const avgEfficiency = filteredDistrictData.length > 0
    ? Math.round(filteredDistrictData.reduce((sum, d) => sum + d.efficiency, 0) / filteredDistrictData.length)
    : 0;

  const hasData = filteredDistrictData.length > 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl text-indigo-900">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">{authContext.userData.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-xl p-4 shadow-lg flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option>All Districts</option>
            {districtData.map((d) => (
              <option key={d.name}>{d.name}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-purple-600" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilterRange)}
              className="px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>

        {/* Empty State */}
        {!hasData && (
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg text-indigo-900 mb-1">No Data Available</h3>
            <p className="text-sm text-muted-foreground">
              No records found for the selected time period. Try switching to "All Data" or a different filter.
            </p>
          </div>
        )}

        {/* Summary Cards */}
        {hasData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-orange-500">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Distributed</p>
              <p className="text-2xl text-indigo-900">{totalDistributed.toLocaleString()} kg</p>
              <p className="text-xs text-green-600 mt-1">↑ 8.4% from last month</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-blue-500">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Active Distributors</p>
              <p className="text-2xl text-indigo-900">{totalDistributors}</p>
              <p className="text-xs text-muted-foreground mt-1">Across {filteredDistrictData.length} districts</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-green-500">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Registered Users</p>
              <p className="text-2xl text-indigo-900">{totalUsers.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">↑ 5.2% active this month</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-purple-500">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Avg Efficiency</p>
              <p className="text-2xl text-indigo-900">{avgEfficiency}%</p>
              <p className="text-xs text-green-600 mt-1">↑ 2.1% improvement</p>
            </div>
          </div>
        )}

        {/* Monthly Trend Chart */}
        {monthlyTrend.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl text-indigo-900">State-wide Distribution Trend</h2>
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="distributed" stroke="#9333ea" strokeWidth={3} name="Distributed (kg)" />
                <Line type="monotone" dataKey="beneficiaries" stroke="#ec4899" strokeWidth={3} name="Beneficiaries" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* District Performance */}
        {hasData && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl text-indigo-900 mb-6">District Performance Overview</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-purple-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">District</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total (kg)</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Distributors</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Users</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Efficiency</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDistrictData.map((district, index) => (
                    <tr key={district.name} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <span className="font-medium">{district.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-indigo-900 font-medium">{district.totalKg.toLocaleString()} kg</td>
                      <td className="py-4 px-4">{district.distributors}</td>
                      <td className="py-4 px-4">{district.users.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px]">
                            <div
                              className={`h-full ${district.efficiency >= 90 ? 'bg-green-500' : 'bg-yellow-500'}`}
                              style={{ width: `${district.efficiency}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{district.efficiency}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distributor Performance */}
          {filteredDistributorPerformance.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl text-indigo-900 mb-6">Top Distributors</h2>
              <div className="space-y-4">
                {filteredDistributorPerformance.map((dist, index) => (
                  <div key={dist.id} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center font-medium text-purple-700">
                          #{index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{dist.name}</p>
                          <p className="text-sm text-muted-foreground">{dist.district}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <p className="font-medium text-purple-700">⭐ {dist.rating}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-xs text-muted-foreground">Distributed</p>
                        <p className="text-sm font-medium">{dist.distributed} kg</p>
                      </div>
                      <div className="bg-white rounded-lg p-2">
                        <p className="text-xs text-muted-foreground">Slots Created</p>
                        <p className="text-sm font-medium">{dist.slots}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* District Comparison Chart */}
          {hasData && (
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl text-indigo-900 mb-6">District Comparison</h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={filteredDistrictData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalKg" fill="#9333ea" name="Total Distributed (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl text-indigo-900 mb-6">Recent System Activity</h2>
          <div className="space-y-3">
            {[
              { time: '2 min ago', action: 'New booking created', user: 'Rajesh Kumar (KA29AB1234567890)', type: 'success' },
              { time: '15 min ago', action: 'Stock updated', user: 'Distributor: Bangalore Central', type: 'info' },
              { time: '1 hour ago', action: 'New slot created', user: 'Distributor: Mysore Main', type: 'info' },
              { time: '2 hours ago', action: 'New user registered', user: 'Priya Sharma', type: 'success' },
              { time: '3 hours ago', action: 'Booking cancelled', user: 'Amit Patel', type: 'warning' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-500' :
                  activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.user}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

