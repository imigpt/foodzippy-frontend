import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Edit, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import SuccessToast from '../../components/SuccessToast';
import ErrorToast from '../../components/ErrorToast';

interface Vendor {
  _id: string;
  restaurantName: string;
  mobileNumber: string;
  fullAddress: string;
  city: string;
  state: string;
  restaurantStatus: string;
  editRequested: boolean;
  editApproved: boolean;
  editRequestDate: string | null;
  createdAt: string;
}

function AgentRequests() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEmployee = location.pathname.includes('/employee');
  const role = isEmployee ? 'employee' : 'agent';
  const tokenKey = isEmployee ? 'employeeToken' : 'agentToken';
  const dashboardRoute = isEmployee ? '/employee/dashboard' : '/agent/dashboard';
  
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    if (!token) {
      navigate('/service-registration');
      return;
    }

    fetchVendors(token);
  }, [navigate]);

  const fetchVendors = async (token: string) => {
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/users/${role}/vendors`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVendors(data.vendors);
      }
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
      setToastMessage('Failed to load vendors');
      setShowErrorToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestEdit = async (vendorId: string) => {
    const token = localStorage.getItem(tokenKey);
    if (!token) return;

    setActionLoading(vendorId);
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(
        `${apiUrl}/api/users/${role}/vendors/${vendorId}/request-edit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            remark: 'Request to edit vendor information',
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setToastMessage('Edit request submitted successfully!');
        setShowSuccessToast(true);
        fetchVendors(token); // Refresh list
      } else {
        setToastMessage(data.message || 'Failed to request edit');
        setShowErrorToast(true);
      }
    } catch (error: any) {
      setToastMessage(error.message || 'Failed to request edit');
      setShowErrorToast(true);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      publish: 'bg-green-100 text-green-700 border-green-300',
      reject: 'bg-red-100 text-red-700 border-red-300',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading requests...</p>
        </div>
      </div>
    );
  }

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
            
            <h1 className="text-2xl font-bold text-slate-900 absolute left-1/2 transform -translate-x-1/2">My Requests</h1>
            
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
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
            <p className="text-slate-600 text-sm">Total Vendors</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{vendors.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
            <p className="text-slate-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {vendors.filter(v => v.restaurantStatus === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
            <p className="text-slate-600 text-sm">Approved</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {vendors.filter(v => v.restaurantStatus === 'publish').length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
            <p className="text-slate-600 text-sm">Edit Pending</p>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {vendors.filter(v => v.editRequested && !v.editApproved).length}
            </p>
          </div>
        </div>

        {/* Vendors List */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">All Vendor Requests</h2>
          </div>

          {vendors.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {vendors.map((vendor) => (
                <div key={vendor._id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Vendor Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-900 mb-1">
                            {vendor.restaurantName}
                          </h3>
                          <div className="space-y-1 text-sm text-slate-600">
                            <p>📍 {vendor.fullAddress}</p>
                            <p>📞 {vendor.mobileNumber}</p>
                            <p>🏙️ {vendor.city}, {vendor.state}</p>
                            <p className="text-xs">Submitted: {formatDate(vendor.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col gap-3 md:items-end">
                      <div className="flex flex-wrap gap-2">
                        {getStatusBadge(vendor.restaurantStatus)}
                        
                        {vendor.editRequested && !vendor.editApproved && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-300 flex items-center gap-1">
                            <Clock size={12} />
                            Edit Pending
                          </span>
                        )}
                        
                        {vendor.editApproved && (
                          <button
                            onClick={() => {
                              const route = isEmployee 
                                ? `/employee/vendor/${vendor._id}/edit`
                                : `/agent/vendor/${vendor._id}/edit`;
                              navigate(route);
                            }}
                            className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-300 flex items-center gap-1 hover:bg-blue-200 hover:border-blue-400 transition-colors cursor-pointer"
                          >
                            <CheckCircle size={12} />
                            Can Edit
                          </button>
                        )}
                      </div>

                      {/* Request Edit Button */}
                      {!vendor.editRequested && !vendor.editApproved && vendor.restaurantStatus !== 'reject' && (
                        <button
                          onClick={() => handleRequestEdit(vendor._id)}
                          disabled={actionLoading === vendor._id}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm flex items-center gap-2 disabled:bg-slate-400"
                        >
                          <Edit size={16} />
                          {actionLoading === vendor._id ? 'Requesting...' : 'Request Edit'}
                        </button>
                      )}

                      {vendor.editRequested && !vendor.editApproved && (
                        <div className="flex items-center gap-2 text-sm text-orange-600">
                          <AlertCircle size={16} />
                          Waiting for admin approval
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Vendors Yet</h3>
              <p className="text-slate-600 mb-6">You haven't registered any vendors yet.</p>
              <button
                onClick={() => navigate('/agent/vendor-type')}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Register Your First Vendor
              </button>
            </div>
          )}
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

export default AgentRequests;
