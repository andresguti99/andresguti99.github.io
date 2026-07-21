/** Utilidades de SEO: datos estructurados (JSON-LD) y textos derivados.
 *  Un solo lugar para que todas las páginas construyan sus bloques igual. */

/** @id estable de la empresa: los demás bloques (productos, migas) la
 *  referencian para que Google consolide todo en una sola entidad. */
export const ID_ORGANIZACION = 'https://www.ureppsa.com/#organizacion';

/** JSON.stringify seguro para incrustar en <script>: escapa `<` para que
 *  ningún dato (p. ej. un nombre con "</script>") pueda romper la etiqueta. */
export const jsonLdSeguro = (obj: object) => JSON.stringify(obj).replace(/</g, '\\u003c');

/** Extrae el número de un precio como "DESDE $1,230,120.00".
 *  Devuelve undefined para "VENDIDO", "Consultar precio", etc. */
export const precioNumero = (precio: string | undefined): number | undefined => {
  const m = precio?.match(/\$\s*([\d,]+(?:\.\d+)?)/);
  return m ? Number(m[1].replace(/,/g, '')) : undefined;
};

/** Migas de pan (BreadcrumbList) a partir de pares [nombre, url absoluta]. */
export const migasDePan = (pasos: [string, string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: pasos.map(([nombre, url], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: nombre,
    item: url,
  })),
});

/** Palabras de los nombres de archivo que llevan acento en pantalla (o que
 *  en pantalla se dicen distinto, como conjunto → desarrollo). */
const ACENTOS: Record<string, string> = {
  conjunto: 'del desarrollo',
  aerea: 'aérea',
  panoramica: 'panorámica',
  area: 'área',
  areas: 'áreas',
  bano: 'baño',
  banos: 'baños',
  jardin: 'jardín',
  portico: 'pórtico',
  recamara: 'recámara',
  recamaras: 'recámaras',
  ninos: 'niños',
};

/** Describe una fotografía a partir del nombre de su archivo fuente:
 *  "aerea-conjunto.abc123.webp" → "vista aérea del desarrollo".
 *  Los archivos ya se nombran por su contenido (cocina, fachada, sala…),
 *  así que ese nombre es la mejor descripción disponible para buscadores
 *  y lectores de pantalla. Devuelve undefined si no hay nombre útil. */
export const descripcionFoto = (src: string): string | undefined => {
  const base = src.split('/').pop()?.match(/^([a-z0-9-]+)\./)?.[1];
  if (!base) return undefined;
  const palabras = base
    .replace(/^r\d+-/, '') // prefijos de render tipo "r1-"
    .replace(/-\d+$/, '') // sufijos de serie tipo "aerea-01"
    .split('-')
    .filter((p) => p && !/^\d+$/.test(p))
    .map((p) => ACENTOS[p] ?? p);
  if (palabras.length === 0) return undefined;
  const texto = palabras.join(' ');
  return texto.startsWith('aérea') ? `vista ${texto}` : texto;
};
