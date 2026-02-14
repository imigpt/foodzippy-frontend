import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Store, Coffee, Building2, Cake, Candy, Loader2, Utensils, UtensilsCrossed, Beer, Wine, GlassWater, Pizza, IceCream2, Soup, Music, PartyPopper, Drumstick, Leaf, Salad } from 'lucide-react';
import { api, VendorType } from '../../utils/api';
import ErrorToast from '../../components/ErrorToast';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  store: Store,
  coffee: Coffee,
  hotel: Building2,
  cake: Cake,
  candy: Candy,
  'bread-slice': Cake,
  'candy-cane': Candy,
  utensils: Utensils,
  utensilsCrossed: UtensilsCrossed,
  beer: Beer,
  wine: Wine,
  glassWater: GlassWater,
  pizza: Pizza,
  iceCream: IceCream2,
  soup: Soup,
  music: Music,
  partyPopper: PartyPopper,
  drumstick: Drumstick,
  leaf: Leaf,
  salad: Salad,
};

const getIcon = (iconName: string) => {
  return ICON_MAP[iconName] || Store;
};

export default function VendorTypeSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEmployee = location.pathname.includes('/employee');
  const dashboardRoute = isEmployee ? '/employee/dashboard' : '/agent/dashboard';
  const formRoute = isEmployee ? '/employee/vendor-form' : '/agent/vendor-form';

  const [vendorTypes, setVendorTypes] = useState<VendorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    loadVendorTypes();
  }, []);

  const loadVendorTypes = async () => {
    try {
      setLoading(true);
      const response = await api.getVendorTypes(true);
      if (response.success && response.data) {
        setVendorTypes(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load vendor types');
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectType = (type: VendorType) => {
    // Navigate to vendor form with selected type
    navigate(formRoute, { 
      state: { 
        vendorType: type.slug,
        vendorTypeName: type.name 
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-2" />
          <p className="text-gray-600">Loading vendor types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="shadow-md sticky top-0 z-40" style={{ backgroundColor: '#F7C150' }}>
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
            
            <h1 className="text-2xl font-bold text-slate-900 absolute left-1/2 transform -translate-x-1/2">Select Vendor Type</h1>
            
            <button
              onClick={() => navigate(dashboardRoute)}
              className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
            >
              <span className="font-medium">Back to Dashboard</span>
              <ChevronLeft size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            What type of vendor are you registering?
          </h2>
          <p className="text-gray-600">
            Select the category that best describes the business
          </p>
        </div>

        {/* Vendor Type Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {vendorTypes.map((type) => {
            const IconComponent = getIcon(type.icon);
            return (
              <button
                key={type._id}
                onClick={() => handleSelectType(type)}
                className="group bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-orange-500 hover:shadow-lg transition-all duration-200 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 group-hover:bg-orange-500 flex items-center justify-center transition-colors">
                  <IconComponent className="w-8 h-8 text-orange-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {type.name}
                </h3>
                {type.description && (
                  <p className="text-sm text-gray-500">
                    {type.description}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {vendorTypes.length === 0 && !loading && (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Vendor Types Available
            </h3>
            <p className="text-gray-500">
              Please contact admin to set up vendor types.
            </p>
          </div>
        )}
      </main>

      {/* Error Toast */}
      {showError && (
        <ErrorToast
          message={error}
          onClose={() => setShowError(false)}
        />
      )}
    </div>
  );
}
