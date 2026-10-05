// Tokens de identidade visual — mesmos valores usados no CSS do app Web.
// Ver docs/GUIA_TECNICO.md para a motivação ("manifesto de rota").
export const colors = {
  paper: '#EEF1F3',
  paperRaised: '#FFFFFF',
  ink: '#1A1E22',
  asphalt: '#262B30',
  routeAmber: '#E59421',
  routeAmberInk: '#1A1E22',
  signalBlue: '#3D7DFF',
  alertRed: '#D4483F',
  hairline: '#D4D9DC',
  muted: '#5B6166',
};

export const font = {
  regular: 'Archivo_400Regular',
  bold: 'Archivo_700Bold',
  black: 'Archivo_900Black',
};

export const radius = {
  sm: 4,
  md: 6,
};

export const spacing = (multiplier: number) => multiplier * 4;
