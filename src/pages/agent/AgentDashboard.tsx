import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  List, 
  User, 
  LogOut,
  Wallet,
  CalendarClock,
  IndianRupee
} from 'lucide-react';

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

function AgentDashboard() {
  const navigate = useNavigate();
  const [agentName, setAgentName] = useState<string>('');
  const [stats, setStats] = useState({
    vendorsRegistered: 0,
    pendingRequests: 0,
    pendingEarnings: 0,
    paidEarnings: 0,
    followUpCount: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('agentToken');
    if (!token) {
      navigate('/service-registration');
      return;
    }

    // Get agent profile
    fetchAgentProfile(token);
    // Get dashboard statistics
    fetchDashboardStats(token);
  }, [navigate]);

  const fetchAgentProfile = async (token: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://foodzippy-backend-h2ju.onrender.com';
      const response = await fetch(`${apiUrl}/api/users/agent/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAgentName(data.user.name);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const fetchDashboardStats = async (token: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://foodzippy-backend-h2ju.onrender.com';
      
      // Fetch vendors count
      const vendorsResponse = await fetch(`${apiUrl}/api/users/agent/vendors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      let vendorsCount = 0;
      let pendingCount = 0;

      if (vendorsResponse.ok) {
        const vendorsData = await vendorsResponse.json();
        vendorsCount = vendorsData.count || 0;
        // Count pending/under_review vendors
        pendingCount = vendorsData.vendors?.filter(
          (v: any) => v.restaurantStatus === 'pending' || v.restaurantStatus === 'under_review'
        ).length || 0;
      }

      setStats({
        vendorsRegistered: vendorsCount,
        pendingRequests: pendingCount,
        pendingEarnings: 0,
        paidEarnings: 0,
        followUpCount: 0,
      });

      // Fetch earnings stats
      try {
        const earningsResponse = await fetch(`${apiUrl}/api/payments/agent/earnings`, {
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
        const followUpsResponse = await fetch(`${apiUrl}/api/payments/agent/followups`, {
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
    localStorage.removeItem('agentToken');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const dashboardCards: DashboardCard[] = [
    {
      id: 'vendor-form',
      title: 'Vendor Form',
      description: 'Register new vendors and restaurants',
      icon: FileText,
      route: '/agent/vendor-type',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'my-requests',
      title: 'My Requests',
      description: 'View and manage your vendor requests',
      icon: List,
      route: '/agent/requests',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      id: 'earnings',
      title: 'My Earnings',
      description: 'View your earnings and payment history',
      icon: Wallet,
      route: '/agent/earnings',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      id: 'follow-ups',
      title: 'My Follow-ups',
      description: 'View and update scheduled follow-ups',
      icon: CalendarClock,
      route: '/agent/follow-ups',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      badge: stats.followUpCount,
    },
    {
      id: 'profile',
      title: 'Profile',
      description: 'View and update your profile information',
      icon: User,
      route: '/agent/profile',
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
              onClick={() => navigate('/agent/dashboard')}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img 
                src="/foodzip2.png" 
                alt="Foodzippy Logo" 
                className="h-24 w-auto"
              />
            </button>
            
            <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
              <h1 className="text-2xl font-bold text-slate-900">Agent Dashboard</h1>
              <p className="text-slate-600 mt-1">
                Welcome back, <span className="font-semibold text-red-600">{agentName || 'Agent'}</span>
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card) => (
            <button
              key={card.id}
              onClick={() => navigate(card.route)}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-red-200 text-left group relative"
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
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

export default AgentDashboard;
