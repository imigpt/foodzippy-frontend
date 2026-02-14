import { useState } from 'react';
import { Users, Briefcase } from 'lucide-react';

interface Section7Data {
  role?: 'agent' | 'employee';
}

interface Section7Props {
  data: Section7Data;
  onUpdate: (data: Section7Data) => void;
  errors?: { [key: string]: string };
  onAgentLogin: (username: string, password: string, role: 'agent' | 'employee') => Promise<void>;
  isAgentAuthenticated: boolean;
  agentLoginError?: string;
}

function Section7({ data, onUpdate, errors = {}, onAgentLogin, isAgentAuthenticated, agentLoginError }: Section7Props) {
  const [selectedRole, setSelectedRole] = useState<'agent' | 'employee'>(data.role || 'agent');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleRoleSelect = (role: 'agent' | 'employee') => {
    setSelectedRole(role);
    onUpdate({ ...data, role });
  };

  const handleLoginClick = () => {
    setShowLoginForm(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      return;
    }

    setIsLoggingIn(true);
    try {
      await onAgentLogin(username, password, selectedRole);
      // Success - reset form
      setShowLoginForm(false);
      setUsername('');
      setPassword('');
      setIsLoggingIn(false);
    } catch (error) {
      // Error handled by parent, but ensure we reset loading state
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">User Information</h2>
        <p className="text-slate-600">Select your role and provide your information</p>
      </div>

      {/* Role Selection */}
      <div className="space-y-4">
        <label className="block text-lg font-semibold text-slate-900 mb-3">
          Select Role <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Agent Card */}
          <button
            type="button"
            onClick={() => handleRoleSelect('agent')}
            disabled={isAgentAuthenticated}
            className={`p-6 border-2 rounded-xl transition-all ${
              selectedRole === 'agent'
                ? 'border-red-500 bg-red-50 shadow-lg'
                : 'border-slate-300 bg-white hover:border-slate-400'
            } ${isAgentAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${selectedRole === 'agent' ? 'bg-red-100' : 'bg-slate-100'}`}>
                <Users className={`w-8 h-8 ${selectedRole === 'agent' ? 'text-red-600' : 'text-slate-600'}`} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-900">Agent</h3>
                <p className="text-sm text-slate-600">Field representative</p>
              </div>
            </div>
            {selectedRole === 'agent' && (
              <div className="mt-3 flex items-center justify-center">
                <span className="inline-flex items-center gap-2 text-red-600 font-semibold">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Selected
                </span>
              </div>
            )}
          </button>

          {/* Employee Card */}
          <button
            type="button"
            onClick={() => handleRoleSelect('employee')}
            disabled={isAgentAuthenticated}
            className={`p-6 border-2 rounded-xl transition-all ${
              selectedRole === 'employee'
                ? 'border-blue-500 bg-blue-50 shadow-lg'
                : 'border-slate-300 bg-white hover:border-slate-400'
            } ${isAgentAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${selectedRole === 'employee' ? 'bg-blue-100' : 'bg-slate-100'}`}>
                <Briefcase className={`w-8 h-8 ${selectedRole === 'employee' ? 'text-blue-600' : 'text-slate-600'}`} />
              </div>
              <div className="text-left">
                <h3 className="text-xl font-bold text-slate-900">Employee</h3>
                <p className="text-sm text-slate-600">Office staff member</p>
              </div>
            </div>
            {selectedRole === 'employee' && (
              <div className="mt-3 flex items-center justify-center">
                <span className="inline-flex items-center gap-2 text-blue-600 font-semibold">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Selected
                </span>
              </div>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* User Login Section */}
        <div className={`border-2 rounded-lg p-6 ${
          selectedRole === 'agent' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
        }`}>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            {selectedRole === 'agent' ? 'Agent' : 'Employee'} Authentication Required
          </h3>
          
          {!isAgentAuthenticated ? (
            <>
              {!showLoginForm ? (
                <button
                  onClick={handleLoginClick}
                  className={`w-full text-white py-3 px-6 rounded-lg font-semibold transition-colors ${
                    selectedRole === 'agent' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Login as {selectedRole === 'agent' ? 'Agent' : 'Employee'}
                </button>
              ) : (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
                      disabled={isLoggingIn}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-red-500"
                      disabled={isLoggingIn}
                    />
                  </div>

                  {agentLoginError && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3">
                      <p className="text-red-700 text-sm font-medium">{agentLoginError}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={isLoggingIn || !username || !password}
                      className={`flex-1 text-white py-2 px-4 rounded-lg font-semibold transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed ${
                        selectedRole === 'agent'
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {isLoggingIn ? 'Logging in...' : 'Login'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLoginForm(false);
                        setUsername('');
                        setPassword('');
                      }}
                      disabled={isLoggingIn}
                      className="px-6 py-2 border-2 border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-green-900 font-semibold">
                    {selectedRole === 'agent' ? 'Agent' : 'Employee'} Authenticated
                  </p>
                  <p className="text-green-700 text-sm">You can now proceed to the final step</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {isAgentAuthenticated && (
          <div className={`border-2 rounded-lg p-6 ${
            selectedRole === 'agent' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-2 ${
              selectedRole === 'agent' ? 'text-blue-900' : 'text-green-900'
            }`}>
              Almost Done!
            </h3>
            <p className={selectedRole === 'agent' ? 'text-blue-800' : 'text-green-800'}>
              After entering the {selectedRole} name, proceed to the final step to complete restaurant admin details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Section7;
