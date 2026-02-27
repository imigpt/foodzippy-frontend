import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Camera, Mail, Calendar, Phone, User as UserIcon, Briefcase } from 'lucide-react';
import SuccessToast from '../../components/SuccessToast';
import ErrorToast from '../../components/ErrorToast';

interface AgentProfile {
  _id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dob: string | null;
  age: number | null;
  agentType?: string;
  role?: string;
  profileImage: string;
  isActive: boolean;
}

function AgentProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Detect role from route
  const isEmployee = location.pathname.includes('/employee');
  const role = isEmployee ? 'employee' : 'agent';
  const tokenKey = isEmployee ? 'employeeToken' : 'agentToken';
  const dashboardRoute = isEmployee ? '/employee/dashboard' : '/agent/dashboard';
  const accentColor = isEmployee ? 'blue' : 'red';
  
  // Editable fields
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem(tokenKey);
    if (!token) {
      navigate('/service-registration');
      return;
    }

    fetchProfile(token);
  }, [navigate, tokenKey]);

  const fetchProfile = async (token: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://foodzippy-backend-h2ju.onrender.com';
      const response = await fetch(`${apiUrl}/api/users/${role}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setEmail(data.user.email || '');
        setDob(data.user.dob ? data.user.dob.split('T')[0] : '');
        setImagePreview(data.user.profileImage || '');
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setToastMessage('Failed to load profile');
      setShowErrorToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem(tokenKey);
    if (!token) return;

    setSaving(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://foodzippy-backend-h2ju.onrender.com';
      
      const formData = new FormData();
      formData.append('email', email);
      if (dob) {
        formData.append('dob', dob);
      }
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await fetch(`${apiUrl}/api/users/${role}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setEmail(data.user.email || '');
        setDob(data.user.dob ? data.user.dob.split('T')[0] : '');
        setImagePreview(data.user.profileImage || '');
        setProfileImage(null);
        setEditing(false);
        setToastMessage('Profile updated successfully!');
        setShowSuccessToast(true);
      } else {
        setToastMessage(data.message || 'Failed to update profile');
        setShowErrorToast(true);
      }
    } catch (error: any) {
      setToastMessage(error.message || 'Failed to update profile');
      setShowErrorToast(true);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEmail(profile.email || '');
      setDob(profile.dob ? profile.dob.split('T')[0] : '');
      setImagePreview(profile.profileImage || '');
      setProfileImage(null);
    }
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
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
            
            <h1 className="text-2xl font-bold text-slate-900 absolute left-1/2 transform -translate-x-1/2">Profile</h1>
            
            <button
              onClick={() => navigate(dashboardRoute)}
              className={`flex items-center gap-2 text-slate-600 hover:text-${accentColor}-600 transition-colors`}
            >
              <span className="font-medium">Back to Dashboard</span>
              <ChevronLeft size={24} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header Section with Profile Image and Info */}
          <div className={`bg-gradient-to-r ${isEmployee ? 'from-blue-500 to-cyan-500' : 'from-red-500 to-orange-500'} px-8 pt-12 pb-8`}>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600">
                      <UserIcon className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                
                {editing && (
                  <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer hover:bg-slate-100 transition-colors shadow-lg">
                    <Camera className={`w-5 h-5 ${isEmployee ? 'text-blue-600' : 'text-red-600'}`} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white">{profile.name}</h2>
                <p className="text-white/80 mt-1 text-lg">@{profile.username}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    profile.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {profile.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {profile.role && (
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/90 text-blue-700">
                      {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                    </span>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex items-center">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-slate-50 transition-colors font-semibold shadow-md"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:bg-slate-400"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-6 py-2 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="px-8 pb-8">

            {/* Profile Details */}
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name (Read-only) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <UserIcon size={16} />
                    Full Name
                  </label>
                  <div className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-600">
                    {profile.name}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Read-only</p>
                </div>

                {/* Email (Editable) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Mail size={16} />
                    Email Address
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-${accentColor}-500`}
                      placeholder="Enter email"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-900">
                      {profile.email || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Phone (Read-only) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <div className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-600">
                    {profile.phone || 'Not provided'}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Read-only</p>
                </div>

                {/* Alternate Phone (Read-only) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Phone size={16} />
                    Alternate Phone Number
                  </label>
                  <div className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-600">
                    {profile.alternatePhone || 'Not provided'}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Read-only</p>
                </div>

                {/* Date of Birth (Editable) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Calendar size={16} />
                    Date of Birth
                  </label>
                  {editing ? (
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className={`w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-${accentColor}-500`}
                    />
                  ) : (
                    <div className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-900">
                      {profile.dob 
                        ? new Date(profile.dob).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Age (Read-only, calculated) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <UserIcon size={16} />
                    Age
                  </label>
                  <div className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-600">
                    {profile.age ? `${profile.age} years` : 'Not calculated'}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Calculated from DOB</p>
                </div>

                {/* Role (Read-only) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                    <Briefcase size={16} />
                    Role
                  </label>
                  <div className="px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-600">
                    {profile.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Not specified'}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Read-only</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> You can only edit your email, date of birth, and profile picture. 
            Other fields are managed by the administrator.
          </p>
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

export default AgentProfile;
