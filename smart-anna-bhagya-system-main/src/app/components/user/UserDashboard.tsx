import WhatsAppShare from "../WhatsAppShare";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, Clock, Users, Wheat, Package, AlertCircle, CheckCircle, QrCode, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { AuthContextType } from '../../App';

interface Props {
  authContext: AuthContextType;
}

interface Slot {
  id: string;
  date: string;
  time: string;
  crowd: 'Low' | 'Medium' | 'High';
  available: boolean;
  queueCount: number;
  isBuffer?: boolean;
}

interface BufferSlot {
  id: string;
  date: string;
  time: string;
  status: 'Limited' | 'Emergency' | 'Extra';
  available: boolean;
  queueCount: number;
}

interface Booking {
  tokenNumber: string;
  slot: Slot;
  rationItems: {
    rice: number;
    ragi: number;
    wheat: number;
    sugar: number;
  };
  bookingDate: string;
}

// Mock data for available slots
const mockSlots: Slot[] = [
  { id: '1', date: '2026-04-28', time: '09:00 AM - 11:00 AM', crowd: 'Low', available: true, queueCount: 12 },
  { id: '2', date: '2026-04-28', time: '11:00 AM - 01:00 PM', crowd: 'Medium', available: true, queueCount: 28 },
  { id: '3', date: '2026-04-28', time: '02:00 PM - 04:00 PM', crowd: 'High', available: true, queueCount: 45 },
  { id: '4', date: '2026-04-29', time: '09:00 AM - 11:00 AM', crowd: 'Low', available: true, queueCount: 8 },
  { id: '5', date: '2026-04-29', time: '11:00 AM - 01:00 PM', crowd: 'Low', available: true, queueCount: 15 },
  { id: '6', date: '2026-04-29', time: '02:00 PM - 04:00 PM', crowd: 'Medium', available: true, queueCount: 32 },
  { id: '7', date: '2026-04-30', time: '09:00 AM - 11:00 AM', crowd: 'Low', available: true, queueCount: 10 },
  { id: '8', date: '2026-04-30', time: '11:00 AM - 01:00 PM', crowd: 'Medium', available: true, queueCount: 25 },
];

const bufferSlots: BufferSlot[] = [
  { id: 'b1', date: '2026-04-28', time: '04:30 PM - 05:00 PM', status: 'Limited', available: true, queueCount: 6 },
  { id: 'b2', date: '2026-04-28', time: '05:00 PM - 05:30 PM', status: 'Emergency', available: true, queueCount: 3 },
  { id: 'b3', date: '2026-04-28', time: '05:30 PM - 06:00 PM', status: 'Extra', available: true, queueCount: 8 },
];

export default function UserDashboard({ authContext }: Props) {
  const navigate = useNavigate();
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isPriority, setIsPriority] = useState(false);
  const [priorityType, setPriorityType] = useState('');

  const handleLogout = () => {
    authContext.logout();
    navigate('/');
  };

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (!selectedSlot) return;

    const tokenNumber = `TKN${Date.now().toString().slice(-8)}`;
    const booking: Booking = {
      tokenNumber,
      slot: selectedSlot,
      rationItems: {
        rice: 5,
        ragi: 3,
        wheat: 2,
        sugar: 1,
      },
      bookingDate: new Date().toISOString(),
    };

    setActiveBooking(booking);
    setShowBookingModal(false);
    setSelectedSlot(null);

    // Mock SMS/WhatsApp notification
    console.log('Sending SMS/WhatsApp notification for token:', tokenNumber);
  };

  const cancelBooking = () => {
    if (window.confirm('Are you sure you want to cancel your booking?')) {
      setActiveBooking(null);
    }
  };

  const getCrowdColor = (crowd: string) => {
    switch (crowd) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBufferColor = (status: string) => {
    switch (status) {
      case 'Limited':
        return 'text-orange-600 bg-orange-100';
      case 'Emergency':
        return 'text-red-600 bg-red-100';
      case 'Extra':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl text-indigo-900">Welcome, {authContext.userData.headName}</h1>
            <p className="text-sm text-muted-foreground">Card: {authContext.userData.rationNumber}</p>
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

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Active Booking Display */}
        {activeBooking && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h2 className="text-xl text-green-700">Booking Confirmed</h2>
              </div>
              <button
                onClick={cancelBooking}
                className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">Token Number</p>
                  <p className="text-2xl text-green-700">{activeBooking.tokenNumber}</p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                  <p className="text-lg">{activeBooking.slot.date}</p>
                  <p className="text-lg">{activeBooking.slot.time}</p>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground mb-2">Allocated Ration</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Rice: {activeBooking.rationItems.rice} kg</div>
                    <div>Ragi: {activeBooking.rationItems.ragi} kg</div>
                    <div>Wheat: {activeBooking.rationItems.wheat} kg</div>
                    <div>Sugar: {activeBooking.rationItems.sugar} kg</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6">
                <QrCode className="w-8 h-8 text-indigo-600 mb-3" />
                <p className="text-sm text-muted-foreground mb-4">Scan this QR code at the distribution center</p>
                <div className="bg-white p-4 rounded-xl shadow-lg">
                  <QRCodeSVG
                    value={JSON.stringify({
                      token: activeBooking.tokenNumber,
                      rationCard: authContext.userData.rationNumber,
                      slot: activeBooking.slot,
                    })}
                    size={200}
                    level="H"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  Confirmation sent via SMS & WhatsApp
                </p>
                <WhatsAppShare
                  name={authContext.userData.headName}
                  rationId={authContext.userData.rationNumber}
                  slotDate={`${activeBooking.slot.date} ${activeBooking.slot.time}`}
                  shopName="Government Ration Shop"
                />
              </div>
            </div>
          </div>
        )}

        {/* Available Ration Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl text-indigo-900">Available Ration This Month</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { name: 'Rice', amount: 5, icon: '🌾', color: 'from-amber-100 to-yellow-100' },
              { name: 'Ragi', amount: 3, icon: '🌰', color: 'from-orange-100 to-amber-100' },
              { name: 'Wheat', amount: 2, icon: '🌾', color: 'from-yellow-100 to-orange-100' },
              { name: 'Sugar', amount: 1, icon: '🍬', color: 'from-pink-100 to-red-100' },
            ].map((item) => (
              <div key={item.name} className={`bg-gradient-to-br ${item.color} rounded-xl p-4 text-center`}>
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="text-sm text-muted-foreground">{item.name}</p>
                <p className="text-2xl">{item.amount} kg</p>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Booking */}
        {!activeBooking && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl shadow-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-purple-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg text-purple-900 mb-2">Priority Booking Available</h3>
                <p className="text-sm text-purple-700 mb-3">
                  Eligible for priority booking? Get faster service.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Elderly (60+)', 'Disabled', 'Essential Worker'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setIsPriority(true);
                        setPriorityType(type);
                      }}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        isPriority && priorityType === type
                          ? 'bg-purple-600 text-white'
                          : 'bg-white text-purple-700 hover:bg-purple-50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slot Booking */}
        {!activeBooking && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl text-indigo-900">Book Your Slot</h2>
              {isPriority && (
                <span className="ml-auto px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  Priority: {priorityType}
                </span>
              )}
            </div>

            {/* Normal Slots */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200 hover:border-blue-400 transition-all cursor-pointer group"
                  onClick={() => slot.available && handleSlotSelect(slot)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <p className="text-sm">{slot.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <p className="text-sm">{slot.time}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getCrowdColor(slot.crowd)}`}>
                      {slot.crowd}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <Users className="w-4 h-4" />
                    <span>Queue: {slot.queueCount} people</span>
                  </div>

                  <button
                    disabled={!slot.available}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group-hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {slot.available ? 'Book Slot' : 'Not Available'}
                  </button>
                </div>
              ))}
            </div>

            {/* Buffer Slots */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg text-orange-700">Buffer Slots Available</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bufferSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="bg-gradient-to-br from-orange-50 to-purple-50 rounded-xl p-4 border-2 border-orange-200 hover:border-orange-400 transition-all cursor-pointer group"
                    onClick={() =>
                      slot.available &&
                      handleSlotSelect({
                        id: slot.id,
                        date: slot.date,
                        time: slot.time,
                        crowd: 'Low',
                        available: slot.available,
                        queueCount: slot.queueCount,
                      })
                    }
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-orange-600" />
                          <p className="text-sm">{slot.date}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <p className="text-sm">{slot.time}</p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getBufferColor(
                          slot.status
                        )}`}
                      >
                        {slot.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Users className="w-4 h-4" />
                      <span>Queue: {slot.queueCount} people</span>
                    </div>

                    <button className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors group-hover:shadow-lg">
                      Book Buffer Slot
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingModal && selectedSlot && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl text-indigo-900 mb-4">Confirm Your Booking</h3>

            <div className="space-y-3 mb-6">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="text-lg">{selectedSlot.date}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="text-lg">{selectedSlot.time}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Expected Crowd</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${getCrowdColor(selectedSlot.crowd)}`}>
                  {selectedSlot.crowd}
                </span>
              </div>

              {isPriority && (
                <div className="bg-purple-50 rounded-lg p-3 border-2 border-purple-300">
                  <p className="text-sm text-purple-700">✨ Priority Booking: {priorityType}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedSlot(null);
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

