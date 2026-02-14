import { useEffect, useRef, useState } from 'react';

interface Section8Data {
  restaurantName: string;
  restaurantImage: File | null;
  restaurantStatus: string;
  rating: string;
  approxDeliveryTime: string;
  approxPriceForTwo: string;
  certificateCode: string;
  mobileNumber: string;
  shortDescription: string;
  services: string[];
  isPureVeg: boolean;
  isPopular: boolean;
  deliveryChargeType: string;
  fixedCharge: string;
  dynamicCharge: string;
  storeCharge: string;
  deliveryRadius: string;
  minimumOrderPrice: string;
  commissionRate: string;
  bankName: string;
  bankCode: string;
  recipientName: string;
  accountNumber: string;
  paypalId: string;
  upiId: string;
  searchLocation: string;
  fullAddress: string;
  pincode: string;
  landmark: string;
  latitude: string;
  longitude: string;
  city: string;
  state: string;
  mapType: 'roadmap' | 'satellite';
  loginEmail: string;
  loginPassword: string;
  categories: string[];
}

interface Section8Props {
  data: Section8Data;
  onUpdate: (data: Section8Data) => void;
  errors?: { [key: string]: string };
}

let googleMapsScriptLoading: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  if (googleMapsScriptLoading) {
    return googleMapsScriptLoading;
  }

  if (typeof window !== 'undefined' && (window as any).google && (window as any).google.maps) {
    googleMapsScriptLoading = Promise.resolve();
    return googleMapsScriptLoading;
  }

  googleMapsScriptLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.head.appendChild(script);
  });

  return googleMapsScriptLoading;
}

function Section8({ data, onUpdate, errors = {} }: Section8Props) {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const dataRef = useRef<Section8Data>(data);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return;
    }

    let cancelled = false;
    console.log("data inside the map", data)
    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (cancelled) return;
        if (!mapRef.current) return;

        const google = (window as any).google;
        const hasCoords = data.latitude && data.longitude;
        const initialCenter = hasCoords
          ? { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) }
          : { lat: 28.6139, lng: 77.209 };
          console.log('Initial Center:', initialCenter);
        const map = new google.maps.Map(mapRef.current, {
          center: initialCenter,
          zoom: 15,
          mapTypeId: data.mapType || 'roadmap',
        });
        mapInstanceRef.current = map;

        const marker = new google.maps.Marker({
          map,
          position: initialCenter,
        });
        markerRef.current = marker;

        if (searchInputRef.current) {
          const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
            types: ['geocode'],
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place || !place.geometry || !place.geometry.location) {
              return;
            }

            const location = place.geometry.location;
            const lat = location.lat();
            const lng = location.lng();

            let city = '';
            let state = '';
            let pincode = '';

            const components = place.address_components || [];
            components.forEach((component: any) => {
              const types = component.types || [];
              if (types.includes('locality') || types.includes('sublocality')) {
                if (!city) {
                  city = component.long_name;
                }
              }
              if (types.includes('administrative_area_level_1')) {
                state = component.long_name;
              }
              if (types.includes('postal_code')) {
                pincode = component.long_name;
              }
            });

            const previous = dataRef.current;
            const formattedAddress = place.formatted_address || previous.fullAddress;

            onUpdate({
              ...previous,
              searchLocation: place.formatted_address || previous.searchLocation,
              fullAddress: formattedAddress,
              city: city || previous.city,
              state: state || previous.state,
              pincode: pincode || previous.pincode,
              latitude: String(lat),
              longitude: String(lng),
            });

            const newCenter = { lat, lng };
            map.setCenter(newCenter);
            marker.setPosition(newCenter);
          });
        }
      })
      .catch((error) => {
        console.error('Error loading Google Maps', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const google = (window as any).google;
    if (!google || !google.maps) return;

    map.setMapTypeId(data.mapType || 'roadmap');
  }, [data.mapType]);

  useEffect(() => {
    if (!data.latitude || !data.longitude) return;
    const lat = parseFloat(data.latitude);
    const lng = parseFloat(data.longitude);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    const map = mapInstanceRef.current;
    const marker = markerRef.current;
    const position = { lat, lng };

    if (map) {
      map.setCenter(position);
    }
    if (marker) {
      marker.setPosition(position);
    }
  }, [data.latitude, data.longitude]);

  const handleFieldChange = (field: keyof Section8Data, value: any) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  const handleMultiSelectChange = (field: 'services' | 'categories', values: string[]) => {
    handleFieldChange(field, values);
  };

  const handlePhotoChange = (file: File | null) => {
    handleFieldChange('restaurantImage', file);
  };

  const handleUseCurrentLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported in this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const previous = dataRef.current;
        const google = (window as any).google;

        if (google && google.maps && google.maps.Geocoder) {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results: any, status: string) => {
            let fullAddress = previous.fullAddress;
            let searchLocation = previous.searchLocation;
            let city = previous.city;
            let state = previous.state;
            let pincode = previous.pincode;

            if (status === 'OK' && results && results[0]) {
              const place = results[0];
              fullAddress = place.formatted_address || fullAddress;
              searchLocation = place.formatted_address || searchLocation;

              const components = place.address_components || [];
              components.forEach((component: any) => {
                const types = component.types || [];
                if (types.includes('locality') || types.includes('sublocality')) {
                  if (!city) {
                    city = component.long_name;
                  }
                }
                if (types.includes('administrative_area_level_1')) {
                  state = component.long_name;
                }
                if (types.includes('postal_code')) {
                  pincode = component.long_name;
                }
              });
            }

            onUpdate({
              ...previous,
              latitude: String(lat),
              longitude: String(lng),
              fullAddress,
              searchLocation,
              city,
              state,
              pincode,
            });
          });
        } else {
          onUpdate({
            ...previous,
            latitude: String(lat),
            longitude: String(lng),
          });
        }
      },
      (error) => {
        console.error('Geolocation error', error);
        alert('Unable to retrieve current location');
      }
    );
  };

  const serviceOptions = ['Delivery', 'Dine-In', 'Takeaway', 'Curbside Pickup'];
  const categoryOptions = ['North Indian', 'South Indian', 'Chinese', 'Fast Food', 'Desserts', 'Cafe'];

  const hasCoordinates = !!(data.latitude && data.longitude);

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Restaurant Admin Details</h2>
        <p className="text-slate-600">Provide complete information about the restaurant for admin configuration.</p>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">1. Restaurant Information</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Restaurant Name</label>
            <input
              type="text"
              value={data.restaurantName}
              onChange={(e) => handleFieldChange('restaurantName', e.target.value)}
              placeholder="Enter restaurant name"
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                errors.restaurantName ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            />
            {errors.restaurantName && <p className="text-red-500 text-sm mt-2">{errors.restaurantName}</p>}
          </div>

          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Restaurant Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                handlePhotoChange(file);
              }}
              className={`w-full text-sm text-slate-700 border-2 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-600 hover:file:bg-red-100 ${
                errors.restaurantImage ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.restaurantImage && <p className="text-red-500 text-sm mt-2">{errors.restaurantImage}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-semibold text-slate-900 mb-3">Restaurant Status</label>
              <select
                value={data.restaurantStatus}
                onChange={(e) => handleFieldChange('restaurantStatus', e.target.value)}
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg bg-white focus:outline-none transition-colors ${
                  errors.restaurantStatus ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
                }`}
              >
                <option value="">Select status</option>
                <option value="publish">Publish</option>
                <option value="unpublish">Unpublish</option>
              </select>
              {errors.restaurantStatus && <p className="text-red-500 text-sm mt-2">{errors.restaurantStatus}</p>}
            </div>

            <div>
              <label className="block text-lg font-semibold text-slate-900 mb-3">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={data.rating}
                onChange={(e) => handleFieldChange('rating', e.target.value)}
                placeholder="e.g., 4.5"
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.rating ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
                }`}
              />
              {errors.rating && <p className="text-red-500 text-sm mt-2">{errors.rating}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-semibold text-slate-900 mb-3">Approx Delivery Time</label>
              <input
                type="text"
                value={data.approxDeliveryTime}
                onChange={(e) => handleFieldChange('approxDeliveryTime', e.target.value)}
                placeholder="e.g., 30-40 mins"
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.approxDeliveryTime ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
                }`}
              />
              {errors.approxDeliveryTime && <p className="text-red-500 text-sm mt-2">{errors.approxDeliveryTime}</p>}
            </div>

            <div>
              <label className="block text-lg font-semibold text-slate-900 mb-3">Approx Price for Two</label>
              <input
                type="number"
                value={data.approxPriceForTwo}
                onChange={(e) => handleFieldChange('approxPriceForTwo', e.target.value)}
                placeholder="e.g., 500"
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.approxPriceForTwo ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
                }`}
              />
              {errors.approxPriceForTwo && <p className="text-red-500 text-sm mt-2">{errors.approxPriceForTwo}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-semibold text-slate-900 mb-3">Certificate / License Code</label>
              <input
                type="text"
                value={data.certificateCode}
                onChange={(e) => handleFieldChange('certificateCode', e.target.value)}
                placeholder="Enter certificate or license code"
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.certificateCode ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
                }`}
              />
              {errors.certificateCode && <p className="text-red-500 text-sm mt-2">{errors.certificateCode}</p>}
            </div>

            <div>
              <label className="block text-lg font-semibold text-slate-900 mb-3">Mobile Number </label>
              <input
                type="text"
                value={data.mobileNumber}
                onChange={(e) => handleFieldChange('mobileNumber', e.target.value)}
                placeholder="e.g.,98765 43210"
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.mobileNumber ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
                }`}
              />
              {errors.mobileNumber && <p className="text-red-500 text-sm mt-2">{errors.mobileNumber}</p>}
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Short Description</label>
            <textarea
              value={data.shortDescription}
              onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
              placeholder="Briefly describe the restaurant"
              rows={4}
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors resize-none ${
                errors.shortDescription ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            />
            {errors.shortDescription && <p className="text-red-500 text-sm mt-2">{errors.shortDescription}</p>}
          </div>

          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Restaurant Services</label>
            {isMobile ? (
              <div className={`space-y-2 p-4 border-2 rounded-lg ${
                errors.services ? 'border-red-500' : 'border-slate-300'
              }`}>
                {serviceOptions.map((option) => (
                  <label key={option} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded">
                    <input
                      type="checkbox"
                      checked={data.services.includes(option)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...data.services, option]
                          : data.services.filter((service) => service !== option);
                        handleMultiSelectChange('services', updated);
                      }}
                      className="w-5 h-5 text-red-600 border-slate-300 rounded"
                    />
                    <span className="text-base text-slate-900">{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <select
                multiple
                value={data.services}
                onChange={() => {}}
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg bg-white focus:outline-none transition-colors h-32 ${
                  errors.services ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
                }`}
              >
                {serviceOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      const exists = data.services.includes(option);
                      const updated = exists
                        ? data.services.filter((service) => service !== option)
                        : [...data.services, option];
                      handleMultiSelectChange('services', updated);
                    }}
                  >
                    {option}
                  </option>
                ))}
              </select>
            )}
            {errors.services && <p className="text-red-500 text-sm mt-2">{errors.services}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.isPureVeg}
                onChange={(e) => handleFieldChange('isPureVeg', e.target.checked)}
                className="w-5 h-5 text-green-600 border-slate-300 rounded"
              />
              <span className="text-lg text-slate-900">Is Pure Veg?</span>
            </label>

            <label className="inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.isPopular}
                onChange={(e) => handleFieldChange('isPopular', e.target.checked)}
                className="w-5 h-5 text-yellow-500 border-slate-300 rounded"
              />
              <span className="text-lg text-slate-900">Is Popular?</span>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">2. Restaurant Login Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Email Address</label>
            <input
              type="email"
              value={data.loginEmail}
              onChange={(e) => handleFieldChange('loginEmail', e.target.value)}
              placeholder="Enter login email"
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                errors.loginEmail ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            />
            {errors.loginEmail && <p className="text-red-500 text-sm mt-2">{errors.loginEmail}</p>}
          </div>

          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Password</label>
            <input
              type="password"
              value={data.loginPassword}
              onChange={(e) => handleFieldChange('loginPassword', e.target.value)}
              placeholder="Enter password"
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                errors.loginPassword ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            />
            {errors.loginPassword && <p className="text-red-500 text-sm mt-2">{errors.loginPassword}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">3. Restaurant Category Information</h3>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">Restaurant Categories</label>
          {isMobile ? (
            <div className={`space-y-2 p-4 border-2 rounded-lg ${
              errors.categories ? 'border-red-500' : 'border-slate-300'
            }`}>
              {categoryOptions.map((option) => (
                <label key={option} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded">
                  <input
                    type="checkbox"
                    checked={data.categories.includes(option)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...data.categories, option]
                        : data.categories.filter((category) => category !== option);
                      handleMultiSelectChange('categories', updated);
                    }}
                    className="w-5 h-5 text-red-600 border-slate-300 rounded"
                  />
                  <span className="text-base text-slate-900">{option}</span>
                </label>
              ))}
            </div>
          ) : (
            <select
              multiple
              value={data.categories}
              onChange={() => {}}
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg bg-white focus:outline-none transition-colors h-32 ${
                errors.categories ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            >
              {categoryOptions.map((option) => (
                <option
                  key={option}
                  value={option}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    const exists = data.categories.includes(option);
                    const updated = exists
                      ? data.categories.filter((category) => category !== option)
                      : [...data.categories, option];
                    handleMultiSelectChange('categories', updated);
                  }}
                >
                  {option}
                </option>
              ))}
            </select>
          )}
          {errors.categories && <p className="text-red-500 text-sm mt-2">{errors.categories}</p>}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">4. Restaurant Address Information (Google Maps)</h3>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">Full Address</label>
          <textarea
            value={data.fullAddress}
            onChange={(e) => handleFieldChange('fullAddress', e.target.value)}
            placeholder="Enter full address"
            rows={3}
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors resize-none ${
              errors.fullAddress ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.fullAddress && <p className="text-red-500 text-sm mt-2">{errors.fullAddress}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Pincode</label>
            <input
              type="text"
              value={data.pincode}
              onChange={(e) => handleFieldChange('pincode', e.target.value)}
              placeholder="Enter pincode"
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                errors.pincode ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            />
            {errors.pincode && <p className="text-red-500 text-sm mt-2">{errors.pincode}</p>}
          </div>

          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Landmark</label>
            <input
              type="text"
              value={data.landmark}
              onChange={(e) => handleFieldChange('landmark', e.target.value)}
              placeholder="Nearby landmark"
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                errors.landmark ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            />
            {errors.landmark && <p className="text-red-500 text-sm mt-2">{errors.landmark}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Latitude</label>
            <input
              type="text"
              value={data.latitude}
              readOnly
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg bg-slate-50 cursor-not-allowed ${
                errors.latitude ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.latitude && <p className="text-red-500 text-sm mt-2">{errors.latitude}</p>}
          </div>

          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Longitude</label>
            <input
              type="text"
              value={data.longitude}
              readOnly
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg bg-slate-50 cursor-not-allowed ${
                errors.longitude ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.longitude && <p className="text-red-500 text-sm mt-2">{errors.longitude}</p>}
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">Search Location (Google Places)</label>
          <input
            type="text"
            ref={searchInputRef}
            value={data.searchLocation}
            onChange={(e) => handleFieldChange('searchLocation', e.target.value)}
            placeholder="Start typing to search location..."
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.searchLocation ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.searchLocation && <p className="text-red-500 text-sm mt-2">{errors.searchLocation}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Use My Current Location
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">Map Type</span>
            <div className="inline-flex rounded-lg border-2 border-slate-300 overflow-hidden">
              <button
                type="button"
                onClick={() => handleFieldChange('mapType', 'roadmap')}
                className={`px-3 py-1 text-sm font-medium ${
                  data.mapType === 'roadmap' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'
                }`}
              >
                Map
              </button>
              <button
                type="button"
                onClick={() => handleFieldChange('mapType', 'satellite')}
                className={`px-3 py-1 text-sm font-medium ${
                  data.mapType === 'satellite' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'
                }`}
              >
                Satellite
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">Map Preview</label>
          <div
            ref={mapRef}
            className={`w-full h-64 rounded-lg border-2 ${
              hasCoordinates ? 'border-slate-300' : 'border-dashed border-slate-300'
            } overflow-hidden bg-slate-100`}
          />
          {!hasCoordinates && (
            <p className="text-sm text-slate-500 mt-2">
              Select a place using search or use your current location to update the map.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">5. Select Delivery Charge Type</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Delivery Charge Type <span className="text-slate-500 font-normal">(Fill Fixed & Dynamic)</span></label>
            <select
              value={data.deliveryChargeType}
              onChange={(e) => handleFieldChange('deliveryChargeType', e.target.value)}
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg bg-white focus:outline-none transition-colors ${
                errors.deliveryChargeType ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            >
              <option value="">Select type</option>
              <option value="fixed">Fixed</option>
              <option value="dynamic">Dynamic</option>
              <option value="free">Free</option>
            </select>
            {errors.deliveryChargeType && <p className="text-red-500 text-sm mt-2">{errors.deliveryChargeType}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">6. Restaurant Delivery Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.deliveryChargeType === 'fixed' && (
            <div>
              <label className="block text-lg font-semibold text-slate-900 mb-3">Fixed Charge</label>
              <input
                type="number"
                value={data.fixedCharge}
                onChange={(e) => handleFieldChange('fixedCharge', e.target.value)}
                placeholder="e.g., 30"
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.fixedCharge ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
                }`}
              />
              {errors.fixedCharge && <p className="text-red-500 text-sm mt-2">{errors.fixedCharge}</p>}
            </div>
          )}

          {data.deliveryChargeType === 'dynamic' && (
            <div>
              <label className="block text-lg font-semibold text-slate-900 mb-3">Dynamic Charge</label>
              <input
                type="number"
                value={data.dynamicCharge}
                onChange={(e) => handleFieldChange('dynamicCharge', e.target.value)}
                placeholder="e.g., 10"
                className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.dynamicCharge ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
                }`}
              />
              {errors.dynamicCharge && <p className="text-red-500 text-sm mt-2">{errors.dynamicCharge}</p>}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Store Charge (Packing / Extra)</label>
            <input
              type="number"
              value={data.storeCharge}
              onChange={(e) => handleFieldChange('storeCharge', e.target.value)}
              placeholder="e.g., 20"
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                errors.storeCharge ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            />
            {errors.storeCharge && <p className="text-red-500 text-sm mt-2">{errors.storeCharge}</p>}
          </div>

          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Delivery Radius (km)</label>
            <input
              type="number"
              value={data.deliveryRadius}
              onChange={(e) => handleFieldChange('deliveryRadius', e.target.value)}
              placeholder="e.g., 5"
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                errors.deliveryRadius ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            />
            {errors.deliveryRadius && <p className="text-red-500 text-sm mt-2">{errors.deliveryRadius}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Minimum Order Price</label>
            <input
              type="number"
              value={data.minimumOrderPrice}
              onChange={(e) => handleFieldChange('minimumOrderPrice', e.target.value)}
              placeholder="e.g., 200"
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                errors.minimumOrderPrice ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            />
            {errors.minimumOrderPrice && <p className="text-red-500 text-sm mt-2">{errors.minimumOrderPrice}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">7. Restaurant Admin Commission</h3>

        <div>
          <label className="block text-lg font-semibold text-slate-900 mb-3">Commission Rate (%)</label>
          <input
            type="number"
            value={data.commissionRate}
            onChange={(e) => handleFieldChange('commissionRate', e.target.value)}
            placeholder="e.g., 10"
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
              errors.commissionRate ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
            }`}
          />
          {errors.commissionRate && <p className="text-red-500 text-sm mt-2">{errors.commissionRate}</p>}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-slate-900">8. Restaurant Payout Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Bank Name</label>
            <input
              type="text"
              value={data.bankName}
              onChange={(e) => handleFieldChange('bankName', e.target.value)}
              placeholder="Enter bank name"
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                errors.bankName ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            />
            {errors.bankName && <p className="text-red-500 text-sm mt-2">{errors.bankName}</p>}
          </div>

          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Bank Code / IFSC</label>
            <input
              type="text"
              value={data.bankCode}
              onChange={(e) => handleFieldChange('bankCode', e.target.value)}
              placeholder="e.g., HDFC0000001"
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                errors.bankCode ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            />
            {errors.bankCode && <p className="text-red-500 text-sm mt-2">{errors.bankCode}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Recipient Name</label>
            <input
              type="text"
              value={data.recipientName}
              onChange={(e) => handleFieldChange('recipientName', e.target.value)}
              placeholder="Enter recipient name"
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                errors.recipientName ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            />
            {errors.recipientName && <p className="text-red-500 text-sm mt-2">{errors.recipientName}</p>}
          </div>

          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">Account Number</label>
            <input
              type="text"
              value={data.accountNumber}
              onChange={(e) => handleFieldChange('accountNumber', e.target.value)}
              placeholder="Enter account number"
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                errors.accountNumber ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            />
            {errors.accountNumber && <p className="text-red-500 text-sm mt-2">{errors.accountNumber}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">PayPal ID</label>
            <input
              type="text"
              value={data.paypalId}
              onChange={(e) => handleFieldChange('paypalId', e.target.value)}
              placeholder="Enter PayPal ID"
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                errors.paypalId ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            />
            {errors.paypalId && <p className="text-red-500 text-sm mt-2">{errors.paypalId}</p>}
          </div>

          <div>
            <label className="block text-lg font-semibold text-slate-900 mb-3">UPI ID</label>
            <input
              type="text"
              value={data.upiId}
              onChange={(e) => handleFieldChange('upiId', e.target.value)}
              placeholder="Enter UPI ID"
              className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none transition-colors ${
                errors.upiId ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-red-500'
              }`}
            />
            {errors.upiId && <p className="text-red-500 text-sm mt-2">{errors.upiId}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Section8;
