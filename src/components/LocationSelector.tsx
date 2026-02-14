import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationData {
  fullAddress: string;
  latitude: string;
  longitude: string;
  pincode: string;
  landmark: string;
  city: string;
  state: string;
  searchLocation: string;
}

interface LocationSelectorProps {
  data: LocationData;
  onUpdate: (updates: Partial<LocationData>) => void;
  mapType?: 'roadmap' | 'satellite';
  onMapTypeChange?: (type: 'roadmap' | 'satellite') => void;
  errors?: {
    fullAddress?: string;
    latitude?: string;
    longitude?: string;
  };
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

export default function LocationSelector({
  data,
  onUpdate,
  mapType = 'roadmap',
  onMapTypeChange,
  errors = {},
}: LocationSelectorProps) {
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const dataRef = useRef<LocationData>(data);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [mapsLoaded, setMapsLoaded] = useState(false);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  // Load Google Maps
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API key not found');
      return;
    }

    let cancelled = false;

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (cancelled) return;
        setMapsLoaded(true);
        initializeMap();
      })
      .catch((error) => {
        console.error('Error loading Google Maps', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Initialize map and autocomplete
  const initializeMap = () => {
    if (!mapRef.current) return;

    const google = (window as any).google;
    const hasCoords = data.latitude && data.longitude;
    const initialCenter = hasCoords
      ? { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) }
      : { lat: 28.6139, lng: 77.209 }; // Default to Delhi

    const map = new google.maps.Map(mapRef.current, {
      center: initialCenter,
      zoom: 15,
      mapTypeId: mapType,
    });
    mapInstanceRef.current = map;

    const marker = new google.maps.Marker({
      map,
      position: initialCenter,
      draggable: true,
    });
    markerRef.current = marker;

    // Handle marker drag
    marker.addListener('dragend', () => {
      const position = marker.getPosition();
      if (position) {
        const lat = position.lat();
        const lng = position.lng();
        reverseGeocode(lat, lng);
      }
    });

    // Initialize autocomplete
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

        updateLocationFromPlace(place, lat, lng);

        map.setCenter({ lat, lng });
        marker.setPosition({ lat, lng });
      });
    }
  };

  // Update map when coordinates change externally
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

  // Update map type
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const google = (window as any).google;
    if (!google || !google.maps) return;

    map.setMapTypeId(mapType);
  }, [mapType]);

  const reverseGeocode = (lat: number, lng: number) => {
    const google = (window as any).google;
    if (!google || !google.maps) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results: any, status: string) => {
      if (status === 'OK' && results && results[0]) {
        const place = results[0];
        updateLocationFromPlace(place, lat, lng);
      } else {
        // Just update coordinates
        onUpdate({
          latitude: String(lat),
          longitude: String(lng),
        });
      }
    });
  };

  const updateLocationFromPlace = (place: any, lat: number, lng: number) => {
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

    const formattedAddress = place.formatted_address || dataRef.current.fullAddress;

    onUpdate({
      searchLocation: formattedAddress,
      fullAddress: formattedAddress,
      city: city || dataRef.current.city,
      state: state || dataRef.current.state,
      pincode: pincode || dataRef.current.pincode,
      latitude: String(lat),
      longitude: String(lng),
    });
  };

  const handleUseCurrentLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported in this browser');
      return;
    }

    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        reverseGeocode(lat, lng);

        const map = mapInstanceRef.current;
        const marker = markerRef.current;
        if (map) {
          map.setCenter({ lat, lng });
        }
        if (marker) {
          marker.setPosition({ lat, lng });
        }

        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Geolocation error', error);
        alert('Unable to retrieve current location. Please check your browser permissions.');
        setIsLoadingLocation(false);
      }
    );
  };

  const hasCoordinates = !!(data.latitude && data.longitude);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="border-l-4 border-blue-500 pl-4 bg-blue-50 p-3 rounded">
        <h3 className="text-lg font-semibold text-gray-900">Restaurant Address Information (Google Maps)</h3>
        <p className="text-sm text-gray-600 mt-1">Provide accurate location details</p>
      </div>

      {/* Full Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Address <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.fullAddress}
          onChange={(e) => onUpdate({ fullAddress: e.target.value })}
          placeholder="Enter full address"
          rows={3}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.fullAddress ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.fullAddress && (
          <p className="text-red-500 text-sm mt-1">{errors.fullAddress}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pincode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
          <input
            type="text"
            value={data.pincode}
            onChange={(e) => onUpdate({ pincode: e.target.value })}
            placeholder="Enter pincode"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Landmark */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
          <input
            type="text"
            value={data.landmark}
            onChange={(e) => onUpdate({ landmark: e.target.value })}
            placeholder="Nearby landmark"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Latitude & Longitude (Read-only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Latitude <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.latitude}
            readOnly
            placeholder="Latitude"
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 cursor-not-allowed ${
              errors.latitude ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.latitude && (
            <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longitude <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.longitude}
            readOnly
            placeholder="Longitude"
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 cursor-not-allowed ${
              errors.longitude ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.longitude && (
            <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>
          )}
        </div>
      </div>

      {/* Search Location (Google Places) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Location (Google Places)
        </label>
        <input
          type="text"
          ref={searchInputRef}
          placeholder="Start typing to search location..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLoadingLocation || !mapsLoaded}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoadingLocation ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Getting Location...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              Use My Current Location
            </>
          )}
        </button>

        {onMapTypeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Map Type</span>
            <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
              <button
                type="button"
                onClick={() => onMapTypeChange('roadmap')}
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  mapType === 'roadmap'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Map
              </button>
              <button
                type="button"
                onClick={() => onMapTypeChange('satellite')}
                className={`px-3 py-1 text-sm font-medium transition-colors ${
                  mapType === 'satellite'
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                Satellite
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Map Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Map Preview</label>
        <div
          ref={mapRef}
          className={`w-full h-80 rounded-lg border-2 overflow-hidden ${
            hasCoordinates ? 'border-gray-300' : 'border-dashed border-gray-300'
          } bg-gray-100`}
        />
        {!hasCoordinates && (
          <p className="text-sm text-gray-500 mt-2">
            Select a place using search or use your current location to update the map.
          </p>
        )}
      </div>
    </div>
  );
}
