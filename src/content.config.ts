import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/*
 * El corazón modular del sitio: cada desarrollo es UN archivo JSON en
 * src/content/desarrollos/. Si a un archivo le falta un campo obligatorio o
 * una imagen no existe, el build falla con un mensaje claro que nombra el
 * archivo y el campo — nunca una página en blanco en producción.
 */

// Campos que describen una vivienda; se usan igual para un desarrollo
// completo que para cada modelo dentro de un desarrollo.
const camposVivienda = {
  precio: z.string().optional(),
  plantas: z.string().optional(),
  recamaras: z.string().optional(),
  banos: z.string().optional(),
  superficie: z.string().optional(),
  construccion: z.string().optional(),
  caracteristicasVivienda: z.string().optional(),
  caracteristicasConjunto: z.string().optional(),
};

const desarrollos = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/desarrollos' }),
  schema: ({ image }) =>
    z.object({
      ...camposVivienda,
      nombre: z.string(),
      ciudad: reference('ciudades'),
      anio: z.number(),
      descripcion: z.string(),
      precio: z.string(),
      disponible: z.boolean(),
      telefono: z.string(),
      facebook: z.string().url().optional(),
      ubicacion: z.string().optional(),
      mapa: z.string().optional(),
      tourVirtual: z.string().optional(),
      logo: image().optional(),
      imagenes: z.array(image()).min(1),
      planos: z.array(image()).optional(),
      /** Nombre del modelo único (desarrollos sin arreglo de modelos), p. ej. "Nova". */
      nombreModelo: z.string().optional(),
      modelos: z
        .array(
          z.object({
            ...camposVivienda,
            nombre: z.string(),
            /** Sin precio ⇒ la página muestra "Consultar precio". */
            precio: z.string().optional(),
            /** Etapa o condominio al que pertenece, p. ej. "Condominio 9 · Puerto Xiamen". */
            etapa: z.string().optional(),
            /** Distribución por planta, en HTML breve. */
            distribucion: z.string().optional(),
            imagenes: z.array(image()).min(1),
            planos: z.array(image()).optional(),
          })
        )
        .optional(),
    }),
});

const ciudades = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/ciudades' }),
  schema: z.object({
    nombre: z.string(),
    estado: z.string().optional(),
    // Posición del pin sobre el mapa de México, en porcentaje del ancho/alto
    x: z.number().min(0).max(100),
    y: z.number().min(0).max(100),
  }),
});

const testimonios = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/testimonios' }),
  schema: z.object({
    autor: z.string(),
    proyecto: z.string(),
    texto: z.string(),
    enlace: z.string().url().optional(),
    estrellas: z.number().min(1).max(5).default(5),
  }),
});

export const collections = { desarrollos, ciudades, testimonios };
