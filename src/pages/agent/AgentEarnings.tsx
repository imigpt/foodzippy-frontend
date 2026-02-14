import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

interface EarningSummary {
  category: string;
  visits: number;
  visitAmount: number;
  followups: number;
  followupAmount: number;
  onboardings: number;
  onboardingAmount: number;
  total: number;
}

interface Payment {
  _id: string;
  vendorId: string;
  vendorName: string;
  category: string;
  paymentType: string;
  amount: number;
  paymentStatus: string;
  paidAt?: string;
  createdAt: string;
}

interface AgentEarningsProps {
  role: 'agent' | 'employee';
}

export default function AgentEarnings({ role }: AgentEarningsProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'history'>('summary');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Data
  const [earnings, setEarnings] = useState({
    totalEarned: 0,
    pending: 0,
    paid: 0,
    vendorCount: 0,
  });
  const [summary, setSummary] = useState<EarningSummary[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    loadData();
  }, [activeTab, statusFilter]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      if (activeTab === 'summary') {
        const response = await api.getMyEarnings(undefined, role);
        if (response.success) {
          // Handle the actual API response structure
          const apiEarnings = response.earnings as any;
          setEarnings({
            totalEarned: apiEarnings.allTime?.total || apiEarnings.totalEarned || 0,
            pending: apiEarnings.allTime?.pending || apiEarnings.pending || 0,
            paid: apiEarnings.allTime?.paid || apiEarnings.paid || 0,
            vendorCount: apiEarnings.vendorCount || 0,
          });
          // Summary might not exist - use empty array as fallback
          setSummary(response.summary || []);
        }
      } else {
        const response = await api.getMyPayments(
          { status: statusFilter !== 'all' ? statusFilter : undefined, page: pagination.page },
          role
        );
        if (response.success) {
          setPayments(response.payments || []);
          setPagination(response.pagination || { page: 1, pages: 1, total: 0 });
        }
      }
    } catch (error) {
      console.error('Failed to load earnings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getPaymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      visit: 'Visit',
      followup: 'Follow-up',
      'visit-followup': 'Visit + Follow-up',
      onboarding: 'Onboarding',
      balance: 'Balance',
    };
    return labels[type] || type;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      A: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      B: 'bg-blue-100 text-blue-800 border-blue-300',
      C: 'bg-green-100 text-green-800 border-green-300',
      D: 'bg-orange-100 text-orange-800 border-orange-300',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="shadow-md sticky top-0 z-40" style={{ backgroundColor: '#F7C150' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(role === 'employee' ? '/employee/dashboard' : '/agent/dashboard')}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img 
                src="/foodzip2.png" 
                alt="Foodzippy Logo" 
                className="h-24 w-auto"
              />
            </button>
            
            <h1 className="text-2xl font-bold text-slate-900 absolute left-1/2 transform -translate-x-1/2">My Earnings</h1>
            
            <button
              onClick={() => navigate(role === 'employee' ? '/employee/dashboard' : '/agent/dashboard')}
              className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
            >
              <span className="font-medium">Back to Dashboard</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4">
              <p className="text-gray-600 text-sm">Total Earned</p>
              <p className="text-2xl font-bold" style={{ color: '#FF263A' }}>{formatCurrency(earnings.totalEarned)}</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-gray-600 text-sm">Vendors</p>
              <p className="text-2xl font-bold" style={{ color: '#FF263A' }}>{earnings.vendorCount}</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-xl font-bold" style={{ color: '#FF263A' }}>{formatCurrency(earnings.pending)}</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <p className="text-gray-600 text-sm">Paid</p>
              <p className="text-xl font-bold" style={{ color: '#FF263A' }}>{formatCurrency(earnings.paid)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b bg-white">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'summary'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-sm font-medium ${
            activeTab === 'history'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500'
          }`}
        >
          Payment History
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'summary' ? (
          /* Summary Tab */
          <div className="space-y-4">
            {(!summary || summary.length === 0) ? (
              <div className="text-center py-8 text-gray-500">
                <p>No earnings yet</p>
                <p className="text-sm mt-2">Start adding vendors to earn!</p>
              </div>
            ) : (
              summary.map((item) => (
                <div
                  key={item.category}
                  className="bg-white rounded-xl border shadow-sm overflow-hidden"
                >
                  <div className={`px-4 py-2 flex items-center justify-between ${getCategoryColor(item.category)}`}>
                    <span className="font-bold">Category {item.category}</span>
                    <span className="font-bold">{formatCurrency(item.total)}</span>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Visits ({item.visits})</span>
                      <span className="font-medium">{formatCurrency(item.visitAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Follow-ups ({item.followups})</span>
                      <span className="font-medium">{formatCurrency(item.followupAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Onboardings ({item.onboardings})</span>
                      <span className="font-medium">{formatCurrency(item.onboardingAmount)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* History Tab */
          <div className="space-y-4">
            {/* Filter */}
            <div className="flex gap-2">
              {['all', 'pending', 'paid'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    statusFilter === status
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 border'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Payment List */}
            {(!payments || payments.length === 0) ? (
              <div className="text-center py-8 text-gray-500">
                <p>No payment records found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment._id}
                    className="bg-white rounded-xl border shadow-sm p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{payment.vendorName}</h3>
                        <p className="text-sm text-gray-500">
                          {getPaymentTypeLabel(payment.paymentType)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-green-600">
                          {formatCurrency(payment.amount)}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            payment.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {payment.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded border ${getCategoryColor(payment.category)}`}>
                        Cat {payment.category}
                      </span>
                      <span>{formatDate(payment.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
