import { useState, useCallback } from 'react';

interface GeoState {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
  enabled: boolean;
}

export function useGeolocation() {
  const [geo, setGeo] = useState<GeoState>({
    lat: null,
    lng: null,
    loading: false,
    error: null,
    enabled: false,
  });
  const [radius, setRadius] = useState(50);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeo(prev => ({ ...prev, error: 'La géolocalisation n\'est pas supportée par votre navigateur.', enabled: false }));
      return;
    }
    setGeo(prev => ({ ...prev, loading: true, error: null }));
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeo({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          loading: false,
          error: null,
          enabled: true,
        });
      },
      (err) => {
        setGeo({
          lat: null,
          lng: null,
          loading: false,
          error: 'Impossible d\'accéder à votre position. Utilisez le filtre ville.',
          enabled: false,
        });
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  }, []);

  const disableGeo = useCallback(() => {
    setGeo({ lat: null, lng: null, loading: false, error: null, enabled: false });
  }, []);

  return { geo, radius, setRadius, requestLocation, disableGeo };
}

/** Haversine distance in km */
export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
