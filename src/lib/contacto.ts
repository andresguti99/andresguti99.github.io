/** Datos de contacto generales de la empresa. También son el respaldo para
 *  desarrollos que no tengan WhatsApp o Facebook propios. */
export const TELEFONO_OFICINA = '443 324 2601';
export const CELULAR_VENTAS = '443 376 2167';
export const CORREO_VENTAS = 'lgarza@ureppsa.com';
export const FACEBOOK_UREPPSA = 'https://www.facebook.com/ureppsa/';

/** Enlace tel: con lada de México a partir de un número con o sin espacios. */
export function enlaceTelefono(numero: string): string {
  let digitos = numero.replace(/\D/g, '');
  if (digitos.length === 10) digitos = `52${digitos}`;
  return `tel:+${digitos}`;
}

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
