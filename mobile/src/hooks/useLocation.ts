import { useState } from 'react';
import * as Location from 'expo-location';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export function useLocation() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function requestLocation() {
    setIsLoading(true);
    setError(null);
    try {
      // getCurrentPositionAsync falha silenciosamente sem permissão prévia;
      // por isso ela é sempre solicitada aqui, nunca assumida como concedida.
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permissão de localização negada.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch {
      setError('Não foi possível obter a localização.');
    } finally {
      setIsLoading(false);
    }
  }

  return { coords, error, isLoading, requestLocation };
}
