/** Datos de contacto generales de la empresa. */
export const TELEFONO_OFICINA = '443 324 2601';
export const CELULAR_VENTAS = '753 120 0721';
export const CORREO_VENTAS = 'lgarza@ureppsa.com';
export const FACEBOOK_UREPPSA = 'https://www.facebook.com/ureppsa.mx/';

/**
 * Construye un enlace de WhatsApp válido a partir de un teléfono en cualquier
 * formato ("+52 753 136 3839", "7531200721", …) y un mensaje prellenado.
 * wa.me exige el número internacional sin espacios ni signo +.
 */
export function enlaceWhatsApp(telefono: string, mensaje: string): string {
  let digitos = telefono.replace(/\D/g, '');
  if (digitos.length === 10) digitos = `52${digitos}`;
  return `https://wa.me/${digitos}?text=${encodeURIComponent(mensaje)}`;
}
