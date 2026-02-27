import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, LogIn, LogOut, Clock, MapPin, Calendar, Loader2 } from 'lucide-react';
import SuccessToast from '../../components/SuccessToast';
import ErrorToast from '../../components/ErrorToast';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

interface AttendanceRecord {
  _id: string;
  date: string;
  checkIn: string;
  checkOut: string | null;
  duration: number;
  status: string;
  remark: string;
  location?: {
    checkInLocation?: LocationData;
    checkOutLocation?: LocationData;
  };
}

function AgentAttendance() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEmployee = location.pathname.includes('/employee');
  const role = isEmployee ? 'employee' : 'agent';
  const tokenKey = isEmployee ? 'employeeToken' : 'agentToken';
  
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [statistics, setStatistics] = useState<any>({});

  useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    if (!token) {
      navigate('/service-registration');
      return;
    }

    fetchTodayAttendance(token);
    fetchAttendanceHistory(token);
  }, [navigate, selectedMonth, selectedYear]);

  const fetchTodayAttendance = async (token: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://foodzippy-backend-h2ju.onrender.com';
      const response = await fetch(`${apiUrl}/api/attendance/${role}/today`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTodayAttendance(data.attendance);
      }
    } catch (error) {
      console.error('Failed to fetch today attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceHistory = async (token: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://foodzippy-backend-h2ju.onrender.com';
      const response = await fetch(
        `${apiUrl}/api/attendance/${role}/my?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAttendanceHistory(data.attendance);
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error('Failed to fetch attendance history:', error);
    }
  };

  // Get user's current location
  const getCurrentLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          
          // Get address from coordinates using Google Maps API
          const address = await getAddressFromCoordinates(latitude, longitude);
          
          resolve({
            latitude,
            longitude,
            address,
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Unable to get your location. ';
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please allow location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable. Please check your GPS.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out. Please try again or move to a better location for GPS signal.';
              break;
            default:
              errorMessage += 'Please enable location services and try again.';
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        }
      );
    });
  };

  // Convert coordinates to address using Google Maps Geocoding API
  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      if (!apiKey) return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      
      const data = await response.json();
      
      if (data.results && data.results[0]) {
        return data.results[0].formatted_address;
      }
      
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch (error) {
      console.error('Geocoding error:', error);
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const handleCheckIn = async () => {
    const token = localStorage.getItem(tokenKey);
    if (!token) return;

    setActionLoading(true);
    try {
      // Get current location
      const location = await getCurrentLocation();
      
      const apiUrl = import.meta.env.VITE_API_URL || 'https://foodzippy-backend-h2ju.onrender.com';

      const response = await fetch(`${apiUrl}/api/attendance/${role}/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ location }),
      });

      const data = await response.json();

      if (response.ok) {
        setTodayAttendance(data.attendance);
        setToastMessage('Checked in successfully!');
        setShowSuccessToast(true);
        fetchAttendanceHistory(token);
      } else {
        setToastMessage(data.message || 'Failed to check in');
        setShowErrorToast(true);
      }
    } catch (error: any) {
      setToastMessage(error.message || 'Failed to check in');
      setShowErrorToast(true);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    const token = localStorage.getItem(tokenKey);
    if (!token) return;

    setActionLoading(true);
    try {
      // Get current location
      const location = await getCurrentLocation();
      
      const apiUrl = import.meta.env.VITE_API_URL || 'https://foodzippy-backend-h2ju.onrender.com';

      const response = await fetch(`${apiUrl}/api/attendance/${role}/check-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          location,
          remark: 'Day completed'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTodayAttendance(data.attendance);
        setToastMessage('Checked out successfully!');
        setShowSuccessToast(true);
        fetchAttendanceHistory(token);
      } else {
        setToastMessage(data.message || 'Failed to check out');
        setShowErrorToast(true);
      }
    } catch (error: any) {
      setToastMessage(error.message || 'Failed to check out');
      setShowErrorToast(true);
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading attendance...</p>
        </div>
      </div>
    );
  }

  const dashboardRoute = isEmployee ? '/employee/dashboard' : '/agent/dashboard';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="shadow-md sticky top-0 z-40" style={{ backgroundColor: '#F7C150' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(dashboardRoute)}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img 
                src="/foodzip2.png" 
                alt="Foodzippy Logo" 
                className="h-24 w-auto"
              />
            </button>
            
            <h1 className="text-2xl font-bold text-slate-900 absolute left-1/2 transform -translate-x-1/2">Attendance</h1>
            
            <button
              onClick={() => navigate(dashboardRoute)}
              className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
            >
              <span className="font-medium">Back to Dashboard</span>
              <ChevronLeft size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Today's Check-in/out Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Today's Attendance</h2>
          
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            {/* Check-In Button */}
            <button
              onClick={handleCheckIn}
              disabled={actionLoading || todayAttendance !== null}
              className={`flex-1 max-w-xs p-8 rounded-xl border-2 transition-all ${
                todayAttendance
                  ? 'bg-green-50 border-green-300 cursor-not-allowed'
                  : 'bg-white border-blue-300 hover:border-blue-500 hover:shadow-lg'
              }`}
            >
              <LogIn className={`w-16 h-16 mx-auto mb-4 ${todayAttendance ? 'text-green-600' : 'text-blue-600'}`} />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Check In</h3>
              {todayAttendance ? (
                <p className="text-green-600 font-semibold">
                  ✓ {formatTime(todayAttendance.checkIn)}
                </p>
              ) : (
                <p className="text-slate-600 text-sm">Start your day</p>
              )}
            </button>

            {/* Check-Out Button */}
            <button
              onClick={handleCheckOut}
              disabled={actionLoading || !todayAttendance || todayAttendance?.checkOut}
              className={`flex-1 max-w-xs p-8 rounded-xl border-2 transition-all ${
                todayAttendance?.checkOut
                  ? 'bg-green-50 border-green-300 cursor-not-allowed'
                  : todayAttendance
                  ? 'bg-white border-orange-300 hover:border-orange-500 hover:shadow-lg'
                  : 'bg-gray-50 border-gray-300 cursor-not-allowed'
              }`}
            >
              <LogOut className={`w-16 h-16 mx-auto mb-4 ${
                todayAttendance?.checkOut ? 'text-green-600' : todayAttendance ? 'text-orange-600' : 'text-gray-400'
              }`} />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Check Out</h3>
              {todayAttendance?.checkOut ? (
                <p className="text-green-600 font-semibold">
                  ✓ {formatTime(todayAttendance.checkOut)}
                </p>
              ) : todayAttendance ? (
                <p className="text-slate-600 text-sm">End your day</p>
              ) : (
                <p className="text-gray-400 text-sm">Check in first</p>
              )}
            </button>
          </div>

          {/* Today's Duration */}
          {todayAttendance?.checkOut && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-slate-600">Today's Duration</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">
                {formatDuration(todayAttendance.duration)}
              </p>
              <p className="text-sm text-slate-600 mt-1">Status: {todayAttendance.status}</p>
            </div>
          )}
        </div>

        {/* Monthly Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
            <p className="text-slate-600 text-sm">Total Days</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{statistics.totalDays || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
            <p className="text-slate-600 text-sm">Present</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{statistics.presentDays || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
            <p className="text-slate-600 text-sm">Half Days</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">{statistics.halfDays || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
            <p className="text-slate-600 text-sm">Total Hours</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{statistics.totalHours || 0}</p>
          </div>
        </div>

        {/* Month/Year Selector */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-slate-200">
          <div className="flex items-center gap-4">
            <Calendar className="w-6 h-6 text-slate-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
            >
              {[2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Attendance History Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Attendance History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Check In</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Check In Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Check Out</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Check Out Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {attendanceHistory.length > 0 ? (
                  attendanceHistory.map((record) => (
                    <tr key={record._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {formatTime(record.checkIn)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {record.location?.checkInLocation ? (
                          <a
                            href={`https://www.google.com/maps?q=${record.location.checkInLocation.latitude},${record.location.checkInLocation.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                            title={record.location.checkInLocation.address || 'View on map'}
                          >
                            <MapPin className="w-4 h-4" />
                            <span className="max-w-[150px] truncate">
                              {record.location.checkInLocation.address || 
                               `${record.location.checkInLocation.latitude.toFixed(4)}, ${record.location.checkInLocation.longitude.toFixed(4)}`}
                            </span>
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {record.checkOut ? formatTime(record.checkOut) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {record.location?.checkOutLocation ? (
                          <a
                            href={`https://www.google.com/maps?q=${record.location.checkOutLocation.latitude},${record.location.checkOutLocation.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline"
                            title={record.location.checkOutLocation.address || 'View on map'}
                          >
                            <MapPin className="w-4 h-4" />
                            <span className="max-w-[150px] truncate">
                              {record.location.checkOutLocation.address || 
                               `${record.location.checkOutLocation.latitude.toFixed(4)}, ${record.location.checkOutLocation.longitude.toFixed(4)}`}
                            </span>
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {record.duration > 0 ? formatDuration(record.duration) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          record.status === 'Present' 
                            ? 'bg-green-100 text-green-700' 
                            : record.status === 'Half-Day'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No attendance records found for this month
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Toasts */}
      {showSuccessToast && (
        <SuccessToast
          message={toastMessage}
          onClose={() => setShowSuccessToast(false)}
        />
      )}
      {showErrorToast && (
        <ErrorToast
          message={toastMessage}
          onClose={() => setShowErrorToast(false)}
        />
      )}
    </div>
  );
}

export default AgentAttendance;
