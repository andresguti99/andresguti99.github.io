/** Cifras de trayectoria de la empresa: un solo lugar para actualizarlas.
 *  Las usan la banda de cifras, el texto del héroe y la marquesina de logos. */
export const ANIOS_EXPERIENCIA = 35;
export const CASAS_ENTREGADAS = 5000;
export const MUNICIPIOS = 25;

const formato = new Intl.NumberFormat('es-MX');

export const ESTADISTICAS = [
  { valor: ANIOS_EXPERIENCIA, texto: 'años de experiencia' },
  { valor: CASAS_ENTREGADAS, texto: 'casas entregadas' },
  { valor: MUNICIPIOS, texto: 'municipios en México' },
];

/** "5,000" con separador de miles, para intercalar en textos. */
export const CASAS_TEXTO = formato.format(CASAS_ENTREGADAS);
