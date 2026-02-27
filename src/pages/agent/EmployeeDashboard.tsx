import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  FileText, 
  List, 
  User, 
  LogOut,
  Clock,
  CheckCircle,
  Wallet,
  CalendarClock,
  IndianRupee
} from 'lucide-react';
import { API_BASE_URL } from '../../utils/api';

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  route: string;
  color: string;
  bgColor: string;
  badge?: number;
}

interface EmployeeDashboardProps {
  role?: 'employee';
}

function EmployeeDashboard({ role = 'employee' }: EmployeeDashboardProps) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>('');
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    daysPresent: 0,
    vendorsRegistered: 0,
    pendingRequests: 0,
    pendingEarnings: 0,
    paidEarnings: 0,
    followUpCount: 0,
  });

  const tokenKey = 'employeeToken';
  const apiRole = 'employee';

  useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    if (!token) {
      navigate('/service-registration');
      return;
    }

    // Get profile
    fetchUserProfile(token);
    // Get today's attendance
    fetchTodayAttendance(token);
    // Get dashboard statistics
    fetchDashboardStats(token);
  }, [navigate]);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${apiRole}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserName(data.user.name);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const fetchTodayAttendance = async (token: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendance/${apiRole}/today`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTodayAttendance(data.attendance);
      }
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async (token: string) => {
    try {
      
      // Fetch attendance statistics (current month)
      const attendanceResponse = await fetch(`${API_BASE_URL}/api/attendance/${apiRole}/my`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Fetch vendors count
      const vendorsResponse = await fetch(`${API_BASE_URL}/api/users/${apiRole}/vendors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      let daysPresent = 0;
      let vendorsCount = 0;
      let pendingCount = 0;

      if (attendanceResponse.ok) {
        const attendanceData = await attendanceResponse.json();
        daysPresent = attendanceData.statistics?.presentDays || 0;
      }

      if (vendorsResponse.ok) {
        const vendorsData = await vendorsResponse.json();
        vendorsCount = vendorsData.count || 0;
        // Count pending/under_review vendors
        pendingCount = vendorsData.vendors?.filter(
          (v: any) => v.restaurantStatus === 'pending' || v.restaurantStatus === 'under_review'
        ).length || 0;
      }

      setStats({
        daysPresent,
        vendorsRegistered: vendorsCount,
        pendingRequests: pendingCount,
        pendingEarnings: 0,
        paidEarnings: 0,
        followUpCount: 0,
      });

      // Fetch earnings stats
      try {
        const earningsResponse = await fetch(`${API_BASE_URL}/api/payments/agent/earnings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (earningsResponse.ok) {
          const earningsData = await earningsResponse.json();
          setStats(prev => ({
            ...prev,
            pendingEarnings: earningsData.earnings?.pending || 0,
            paidEarnings: earningsData.earnings?.paid || 0,
          }));
        }
      } catch (e) {
        console.log('Earnings not available yet');
      }

      // Fetch follow-up count (only pending follow-ups)
      try {
        const followUpsResponse = await fetch(`${API_BASE_URL}/api/payments/agent/followups`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (followUpsResponse.ok) {
          const followUpsData = await followUpsResponse.json();
          // Count only pending follow-ups (not completed ones)
          const pendingCount = followUpsData.followups?.filter((f: any) => 
            f.visitStatus === 'visited-followup-scheduled' || 
            f.visitStatus === 'followup-2nd-scheduled'
          ).length || 0;
          setStats(prev => ({
            ...prev,
            followUpCount: pendingCount,
          }));
        }
      } catch (e) {
        console.log('Follow-ups not available yet');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const dashboardCards: DashboardCard[] = [
    {
      id: 'attendance',
      title: 'Attendance',
      description: 'Check-in, check-out and view attendance history',
      icon: ClipboardCheck,
      route: '/employee/attendance',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'vendor-form',
      title: 'Vendor Form',
      description: 'Register new vendors and restaurants',
      icon: FileText,
      route: '/employee/vendor-type',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'my-requests',
      title: 'My Requests',
      description: 'View and manage your vendor requests',
      icon: List,
      route: '/employee/requests',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      id: 'earnings',
      title: 'My Earnings',
      description: 'View your earnings and payment history',
      icon: Wallet,
      route: '/employee/earnings',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      id: 'follow-ups',
      title: 'My Follow-ups',
      description: 'View and update scheduled follow-ups',
      icon: CalendarClock,
      route: '/employee/follow-ups',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      badge: stats.followUpCount,
    },
    {
      id: 'profile',
      title: 'Profile',
      description: 'View and update your profile information',
      icon: User,
      route: '/employee/profile',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="shadow-md sticky top-0 z-40" style={{ backgroundColor: '#F7C150' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/employee/dashboard')}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img 
                src="/foodzip2.png" 
                alt="Foodzippy Logo" 
                className="h-24 w-auto"
              />
            </button>
            
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
              <h1 className="text-2xl font-bold text-slate-900">Employee Dashboard</h1>
              <p className="text-slate-600 mt-1">
                Welcome back, <span className="font-semibold text-blue-600">{userName || 'Employee'}</span>
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Today's Attendance Status */}
      {!loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`rounded-xl p-6 shadow-md border-2 ${
            todayAttendance 
              ? todayAttendance.checkOut 
                ? 'bg-green-50 border-green-200' 
                : 'bg-blue-50 border-blue-200'
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {todayAttendance ? (
                  todayAttendance.checkOut ? (
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  ) : (
                    <Clock className="w-12 h-12 text-blue-600" />
                  )
                ) : (
                  <Clock className="w-12 h-12 text-yellow-600" />
                )}
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {todayAttendance 
                      ? todayAttendance.checkOut 
                        ? 'Checked Out' 
                        : 'Checked In'
                      : 'Not Checked In Yet'}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {todayAttendance 
                      ? todayAttendance.checkOut 
                        ? `Duration: ${Math.floor(todayAttendance.duration / 60)}h ${todayAttendance.duration % 60}m`
                        : `Check-in time: ${new Date(todayAttendance.checkIn).toLocaleTimeString()}`
                      : 'Please check in to start your day'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/employee/attendance')}
                className="px-6 py-2 bg-white text-slate-700 rounded-lg border-2 border-slate-200 hover:bg-slate-50 transition-colors font-semibold"
              >
                {todayAttendance ? 'View Details' : 'Check In Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card) => (
            <button
              key={card.id}
              onClick={() => navigate(card.route)}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-200 text-left group relative"
            >
              {card.badge && card.badge > 0 && (
                <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {card.badge}
                </span>
              )}
              <div className="flex items-start gap-6">
                <div className={`${card.bgColor} p-4 rounded-xl group-hover:scale-110 transition-transform`}>
                  <card.icon className={`w-8 h-8 ${card.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{stats.daysPresent}</p>
              <p className="text-slate-600 text-sm mt-2">Days Present</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{stats.vendorsRegistered}</p>
              <p className="text-slate-600 text-sm mt-2">Vendors Registered</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">{stats.pendingRequests}</p>
              <p className="text-slate-600 text-sm mt-2">Pending Requests</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <IndianRupee className="w-5 h-5 text-yellow-600" />
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingEarnings}</p>
              </div>
              <p className="text-slate-600 text-sm mt-2">Pending Earnings</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center justify-center gap-1">
                <IndianRupee className="w-5 h-5 text-emerald-600" />
                <p className="text-2xl font-bold text-emerald-600">{stats.paidEarnings}</p>
              </div>
              <p className="text-slate-600 text-sm mt-2">Paid Earnings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
