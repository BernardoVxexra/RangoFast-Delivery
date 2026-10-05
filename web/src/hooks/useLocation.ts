import { useState } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

export function useLocation() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function requestLocation() {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada neste navegador.');
      return;
    }
    setIsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      () => {
        setError('Não foi possível obter a localização.');
        setIsLoading(false);
      },
      // Sem timeout, o navegador pode deixar a chamada pendente
      // indefinidamente quando a permissão não é respondida.
      { timeout: 10000 }
    );
  }

  return { coords, error, isLoading, requestLocation };
}
