/** Datos de contacto generales de la empresa. También son el respaldo para
 *  desarrollos que no tengan WhatsApp o Facebook propios. */
export const TELEFONO_OFICINA = '443 324 2601';
export const CELULAR_VENTAS = '443 376 2167';
export const CORREO_VENTAS = 'lgarza@ureppsa.com';
export const FACEBOOK_UREPPSA = 'https://www.facebook.com/ureppsa/';

/** Mensajes prellenados de WhatsApp, en un solo lugar para que el texto de
 *  venta sea idéntico en todas las páginas que lo usan. */
export const MENSAJE_INFORMES = 'Hola, quiero informes de los desarrollos de UREPPSA';
export const MENSAJE_FINANCIAMIENTO =
  'Hola, quiero saber qué opciones de financiamiento tengo para una casa UREPPSA';

/** Contacto efectivo de un desarrollo: el propio si existe y no está vacío,
 *  o el general. Único lugar donde vive esta regla. */
export function contactoDe(datos: { telefono?: string; facebook?: string }) {
  return {
    telefono: datos.telefono || CELULAR_VENTAS,
    facebook: datos.facebook || FACEBOOK_UREPPSA,
  };
}

/**
 * Construye un enlace de WhatsApp válido a partir de un teléfono en cualquier
 * formato ("+52 753 136 3839", "7531200721", …) y un mensaje prellenado.
 * wa.me exige el número internacional sin espacios ni signo +.
 */
export function enlaceWhatsApp(telefono: string, mensaje: string): string {
  let digitos = telefono.replace(/\D/g, '');
  if (digitos.length === 0) digitos = CELULAR_VENTAS.replace(/\D/g, '');
  if (digitos.length === 10) digitos = `52${digitos}`;
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensaje)}`;
}

/** Enlace tel: con lada de México a partir de un número con o sin espacios. */
export function enlaceTelefono(numero: string): string {
  let digitos = numero.replace(/\D/g, '');
  if (digitos.length === 0) digitos = CELULAR_VENTAS.replace(/\D/g, '');
  if (digitos.length === 10) digitos = `52${digitos}`;
  return `tel:+${digitos}`;
}
