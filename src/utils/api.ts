const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://foodzippy-backend-h2ju.onrender.com';

export { API_BASE_URL };

export interface FormField {
  _id: string;
  section: string;
  sectionLabel: string;
  label: string;
  fieldKey: string;
  fieldType: string;
  options?: string[];
  placeholder: string;
  required: boolean;
  order: number;
  visibleTo: string[];
  isActive: boolean;
  isSystemField: boolean;
  helpText?: string;
  vendorTypes?: string[];
  labelTemplate?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface FormSection {
  _id: string;
  sectionKey: string;
  sectionLabel: string;
  sectionDescription: string;
  order: number;
  stepNumber: number;
  isActive: boolean;
  visibleTo: string[];
  fields: FormField[];
  vendorTypes?: string[];
  labelTemplate?: string;
}

export interface VendorType {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export interface FormConfigResponse {
  success: boolean;
  data: FormSection[];
}

class ApiClient {
  private getAuthToken(role?: 'agent' | 'employee'): string | null {
    // If role is specified, get the specific token
    if (role === 'agent') {
      return localStorage.getItem('agentToken');
    }
    if (role === 'employee') {
      return localStorage.getItem('employeeToken');
    }
    
    // If no role specified, check URL to determine which token to use
    const currentPath = window.location.pathname;
    if (currentPath.includes('/employee')) {
      return localStorage.getItem('employeeToken');
    }
    
    // Default: try employee token first (most recent login), then agent token
    return localStorage.getItem('employeeToken') || localStorage.getItem('agentToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    role?: 'agent' | 'employee',
    _retries = 2
  ): Promise<T> {
    const token = this.getAuthToken(role);
    
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    // Only add Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    let response: Response;
    try {
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } catch (networkError) {
      // Retry on network errors (Render cold start, transient failures)
      if (_retries > 0) {
        await new Promise((r) => setTimeout(r, 1500));
        return this.request<T>(endpoint, options, role, _retries - 1);
      }
      throw new Error('Server is waking up — please try again in a few seconds.');
    }

    const data = await response.json();

    if (!response.ok) {
      const error: any = new Error(data.message || 'Request failed');
      error.missingFields = data.missingFields;
      error.errors = data.errors;
      throw error;
    }

    return data;
  }

  // Form Configuration API
  async getFormConfig(visibleTo?: string, vendorType?: string): Promise<FormConfigResponse> {
    const params = new URLSearchParams();
    if (visibleTo) params.append('visibleTo', visibleTo);
    if (vendorType) params.append('vendorType', vendorType);
    const queryString = params.toString();
    return this.request<FormConfigResponse>(`/api/form/config${queryString ? `?${queryString}` : ''}`);
  }

  // Vendor Types API
  async getVendorTypes(activeOnly: boolean = true): Promise<{ success: boolean; data: VendorType[] }> {
    const queryString = activeOnly ? '?activeOnly=true' : '';
    return this.request(`/api/vendor-types${queryString}`);
  }

  // Vendor Registration API
  async registerVendor(formData: FormData, role?: 'agent' | 'employee'): Promise<any> {
    return this.request('/api/vendors/register', {
      method: 'POST',
      body: formData,
    }, role);
  }

  // Cloudinary Upload (for voice recordings)
  async uploadToCloudinary(file: Blob, resourceType: 'image' | 'video' | 'raw' = 'raw'): Promise<string> {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'foodzippy/voice-notes');

    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    return data.secure_url;
  }

  // Get single vendor for editing
  async getMyVendorById(vendorId: string, role?: 'agent' | 'employee'): Promise<any> {
    const rolePrefix = role || (window.location.pathname.includes('/employee') ? 'employee' : 'agent');
    return this.request(`/api/users/${rolePrefix}/vendors/${vendorId}`, {}, role);
  }

  // Update vendor
  async updateMyVendor(vendorId: string, formData: FormData, role?: 'agent' | 'employee'): Promise<any> {
    const rolePrefix = role || (window.location.pathname.includes('/employee') ? 'employee' : 'agent');
    return this.request(`/api/users/${rolePrefix}/vendors/${vendorId}`, {
      method: 'PUT',
      body: formData,
    }, role);
  }

  // Agent/Employee Earnings API
  async getMyEarnings(
    params?: { startDate?: string; endDate?: string },
    role?: 'agent' | 'employee'
  ): Promise<{
    success: boolean;
    earnings: {
      totalEarned: number;
      pending: number;
      paid: number;
      vendorCount: number;
    };
    summary: {
      category: string;
      visits: number;
      visitAmount: number;
      followups: number;
      followupAmount: number;
      onboardings: number;
      onboardingAmount: number;
      total: number;
    }[];
  }> {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    const queryString = searchParams.toString();
    return this.request(`/api/payments/agent/earnings${queryString ? `?${queryString}` : ''}`, {}, role);
  }

  // Agent/Employee Payments List
  async getMyPayments(
    params?: { status?: string; page?: number; limit?: number },
    role?: 'agent' | 'employee'
  ): Promise<{
    success: boolean;
    payments: Array<{
      _id: string;
      vendorId: string;
      vendorName: string;
      category: string;
      paymentType: string;
      amount: number;
      paymentStatus: string;
      paidAt?: string;
      createdAt: string;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    const queryString = searchParams.toString();
    return this.request(`/api/payments/agent/payments${queryString ? `?${queryString}` : ''}`, {}, role);
  }

  // Agent Follow-ups
  async getMyFollowUps(role?: 'agent' | 'employee'): Promise<{
    success: boolean;
    followups: Array<{
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
    }>;
  }> {
    return this.request('/api/payments/agent/followups', {}, role);
  }

  // Update Follow-up Status
  async updateFollowUpStatus(
    vendorId: string,
    updateData: { status: string; notes?: string; nextFollowUpDate?: string },
    role?: 'agent' | 'employee'
  ): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/payments/agent/followups/${vendorId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    }, role);
  }
}

export const api = new ApiClient();
