import { useState, useEffect } from "react";

interface LocationData {
  latitude: number;
  longitude: number;
  district?: string;
  state?: string;
}

interface UseLocationReturn {
  location: string | null;
  locationData: LocationData | null;
  loading: boolean;
  error: string | null;
}

export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using a free geocoding service (you can replace with a better one)
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${import.meta.env.VITE_OPENCAGE_API_KEY || 'demo'}&language=en`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const components = result.components;
        
        // Check if it's in Kerala
        const state = components.state || components.state_district;
        const district = components.state_district || components.county || components.city;
        
        if (state && state.toLowerCase().includes('kerala')) {
          return `${district || 'Kerala'}, Kerala`;
        } else {
          return `${components.city || components.town || components.village || 'Unknown'}, ${state || 'India'}`;
        }
      }
      
      return 'Location not found';
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return 'Ernakulam, Kerala'; // Default fallback
    }
  };

  useEffect(() => {
    const getCurrentLocation = async () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by this browser');
        setLocation('Ernakulam, Kerala'); // Default fallback
        setLoading(false);
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          const locationData: LocationData = {
            latitude,
            longitude,
          };
          
          setLocationData(locationData);
          
          try {
            const locationString = await reverseGeocode(latitude, longitude);
            setLocation(locationString);
          } catch (error) {
            console.error('Error getting location name:', error);
            setLocation('Ernakulam, Kerala'); // Fallback
          }
          
          setLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError(error.message);
          setLocation('Ernakulam, Kerala'); // Default fallback
          setLoading(false);
        },
        options
      );
    };

    getCurrentLocation();
  }, []);

  return {
    location,
    locationData,
    loading,
    error,
  };
}
