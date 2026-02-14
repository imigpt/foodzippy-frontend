import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

interface FollowUp {
  _id: string;
  restaurantName: string;
  paymentCategory: string;
  visitStatus: string;
  followUpDate?: string;
  secondFollowUpDate?: string;
  ownerName?: string;
  mobileNumber: string;
  fullAddress: string;
  createdAt: string;
}

interface AgentFollowUpsProps {
  role: 'agent' | 'employee';
}

export default function AgentFollowUps({ role }: AgentFollowUpsProps) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [pendingFollowups, setPendingFollowups] = useState<FollowUp[]>([]);
  const [historyFollowups, setHistoryFollowups] = useState<FollowUp[]>([]);
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateNotes, setUpdateNotes] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    loadFollowUps();
  }, []);

  const loadFollowUps = async () => {
    try {
      setIsLoading(true);
      const response = await api.getMyFollowUps(role);
      if (response.success) {
        // Separate pending and completed follow-ups
        const pending = response.followups.filter((f: FollowUp) => 
          f.visitStatus === 'visited-followup-scheduled' || 
          f.visitStatus === 'followup-2nd-scheduled'
        );
        const history = response.followups.filter((f: FollowUp) => 
          f.visitStatus.includes('onboarded') || 
          f.visitStatus.includes('rejected')
        );
        setPendingFollowups(pending);
        setHistoryFollowups(history);
      }
    } catch (error) {
      console.error('Failed to load follow-ups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccessNotification = (message: string) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleOpenModal = (followup: FollowUp) => {
    setSelectedFollowUp(followup);
    setUpdateStatus('');
    setUpdateNotes('');
    setNextFollowUpDate('');
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedFollowUp || !updateStatus) return;

    // Validate date if scheduling 2nd follow-up
    if (updateStatus === 'followup-2nd-scheduled' && !nextFollowUpDate) {
      showSuccessNotification('❌ Please select a follow-up date');
      return;
    }

    try {
      setIsUpdating(true);
      const response = await api.updateFollowUpStatus(
        selectedFollowUp._id,
        { 
          status: updateStatus, 
          notes: updateNotes,
          nextFollowUpDate: nextFollowUpDate || undefined 
        },
        role
      );
      if (response.success) {
        setIsModalOpen(false);
        
        // Show professional notification
        const statusLabel = updateStatus.includes('onboarded') 
          ? '✓ Onboarded Successfully' 
          : updateStatus.includes('rejected')
          ? '✗ Marked as Rejected'
          : '↻ Follow-up Scheduled';
        showSuccessNotification(statusLabel);
        
        // Move the updated item to history and reload
        await loadFollowUps();
      }
    } catch (error: any) {
      showSuccessNotification('❌ Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'visited-followup-scheduled': 'Follow-up Scheduled',
      'followup-2nd-scheduled': '2nd Follow-up Scheduled',
      'followup-onboarded': '✓ Onboarded',
      '2nd-followup-onboarded': '✓ Onboarded (2nd)',
      'followup-rejected': '✗ Rejected',
      '2nd-followup-rejected': '✗ Rejected (2nd)',
    };
    return labels[status] || status.replace(/-/g, ' ');
  };

  const getStatusColor = (status: string) => {
    if (status.includes('onboarded')) {
      return 'bg-green-100 text-green-700 border-green-300';
    }
    if (status.includes('rejected')) {
      return 'bg-red-100 text-red-700 border-red-300';
    }
    if (status.includes('2nd')) {
      return 'bg-orange-100 text-orange-700 border-orange-300';
    }
    return 'bg-blue-100 text-blue-700 border-blue-300';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      A: 'bg-yellow-100 text-yellow-800',
      B: 'bg-blue-100 text-blue-800',
      C: 'bg-green-100 text-green-800',
      D: 'bg-orange-100 text-orange-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getUpdateOptions = (currentStatus: string) => {
    if (currentStatus === 'visited-followup-scheduled') {
      return [
        { value: 'followup-onboarded', label: '✓ Onboarded' },
        { value: 'followup-rejected', label: '✗ Rejected' },
        { value: 'followup-2nd-scheduled', label: '↻ Schedule 2nd Follow-up' },
      ];
    }
    if (currentStatus === 'followup-2nd-scheduled') {
      return [
        { value: '2nd-followup-onboarded', label: '✓ Onboarded' },
        { value: '2nd-followup-rejected', label: '✗ Rejected' },
      ];
    }
    return [];
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
            
            <h1 className="text-2xl font-bold text-slate-900 absolute left-1/2 transform -translate-x-1/2">My Follow-ups</h1>
            
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
      {/* Professional Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 flex items-center gap-3 min-w-[300px]">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{notificationMessage}</p>
              <p className="text-sm text-gray-500">Status updated successfully</p>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-4 px-6 font-medium transition-colors relative ${
                activeTab === 'pending'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Follow-ups
              {pendingFollowups.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600">
                  {pendingFollowups.length}
                </span>
              )}
              {activeTab === 'pending' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-4 px-6 font-medium transition-colors relative ${
                activeTab === 'history'
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              History
              {historyFollowups.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                  {historyFollowups.length}
                </span>
              )}
              {activeTab === 'history' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'pending' ? (
          pendingFollowups.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No follow-ups pending</p>
              <p className="text-sm text-gray-400 mt-1">Your scheduled follow-ups will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingFollowups.map((followup) => (
                <div
                  key={followup._id}
                  className="bg-white rounded-xl border shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{followup.restaurantName}</h3>
                        {followup.ownerName && (
                        <p className="text-sm text-gray-500">{followup.ownerName}</p>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(followup.paymentCategory)}`}>
                      Cat {followup.paymentCategory}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 border ${getStatusColor(followup.visitStatus)}`}>
                    {getStatusLabel(followup.visitStatus)}
                  </div>

                  {/* Follow-up Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {followup.visitStatus === 'followup-2nd-scheduled'
                        ? formatDate(followup.secondFollowUpDate)
                        : formatDate(followup.followUpDate)}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                    <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="line-clamp-2">{followup.fullAddress}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <a
                      href={`tel:${followup.mobileNumber}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-600 py-2 rounded-lg font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call
                    </a>
                    <button
                      onClick={() => handleOpenModal(followup)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
        ) : (
          // History Tab
          historyFollowups.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No history yet</p>
              <p className="text-sm text-gray-400 mt-1">Completed follow-ups will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {historyFollowups.map((followup) => (
                <div
                  key={followup._id}
                  className="bg-white rounded-xl border shadow-sm overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{followup.restaurantName}</h3>
                        {followup.ownerName && (
                          <p className="text-sm text-gray-500">{followup.ownerName}</p>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(followup.paymentCategory)}`}>
                        Cat {followup.paymentCategory}
                      </span>
                    </div>

                    {/* Status Badge - Shows Final Outcome */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 border ${getStatusColor(followup.visitStatus)}`}>
                      {getStatusLabel(followup.visitStatus)}
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{followup.mobileNumber}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="line-clamp-2">{followup.fullAddress}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Completed: {formatDate(followup.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      {/* Update Status Modal */}
      {isModalOpen && selectedFollowUp && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
          <div className="bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-xl">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Update Status</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">{selectedFollowUp.restaurantName}</p>
            </div>

            <div className="p-4 space-y-4">
              {/* Status Options */}
              <div className="space-y-2">
                {getUpdateOptions(selectedFollowUp.visitStatus).map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      updateStatus === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={updateStatus === option.value}
                      onChange={(e) => setUpdateStatus(e.target.value)}
                      className="sr-only"
                    />
                    <span className="font-medium">{option.label}</span>
                  </label>
                ))}
              </div>

              {/* Next Follow-up Date (Only for "Schedule 2nd Follow-up") */}
              {updateStatus === 'followup-2nd-scheduled' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Next Follow-up Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={nextFollowUpDate}
                    onChange={(e) => setNextFollowUpDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    When should the next follow-up visit happen?
                  </p>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="Add any notes about this follow-up..."
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="p-4 border-t flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 border rounded-lg font-medium text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={!updateStatus || isUpdating}
                className={`flex-1 py-3 rounded-lg font-medium text-white ${
                  !updateStatus || isUpdating
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600'
                }`}
              >
                {isUpdating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
