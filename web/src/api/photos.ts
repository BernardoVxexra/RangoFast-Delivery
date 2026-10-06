import { apiClient } from './client';

// Envia a foto (data URI capturada pela câmera) para o servidor salvar em
// disco e devolve a URL permanente — evita guardar um base64 gigante no
// pedido mockado em localStorage.
export async function uploadDeliveryPhoto(code: string, dataUri: string): Promise<string> {
  const response = await apiClient.post<{ url: string }>('/delivery-photos', { code, dataUri });
  return response.data.url;
}
