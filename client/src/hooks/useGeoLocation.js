import { useState, useCallback } from 'react';

export function useGeoLocation() {
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { coords, loading, error, request };
}
