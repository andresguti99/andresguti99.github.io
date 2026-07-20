import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdir, readFile, unlink, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Astro copia a dist/_astro los originales (PNG/JPG) de cada imagen de las
 *  colecciones aunque las páginas solo usen las versiones WebP optimizadas.
 *  Este paso final borra los originales que ninguna página referencia:
 *  ~120 MB menos por publicación sin cambiar nada de lo que se sirve. */
const limpiarOriginales = () => ({
  name: 'limpiar-originales',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const dist = fileURLToPath(dir);

      // Todo el texto publicado (HTML, CSS, JS, XML…): si un archivo de imagen
      // no aparece mencionado ahí, nada puede pedirlo.
      const archivos = await readdir(dist, { recursive: true });
      const textos = await Promise.all(
        archivos
          .filter((a) =>
            ['.html', '.css', '.js', '.mjs', '.xml', '.webmanifest', '.txt', '.json'].includes(extname(a))
          )
          .map((a) => readFile(join(dist, a), 'utf-8'))
      );
      const publicado = textos.join('\n');

      let borrados = 0;
      let bytes = 0;
      for (const archivo of archivos) {
        if (!archivo.includes('_astro')) continue; // solo lo generado, nunca public/
        if (!['.png', '.jpg', '.jpeg'].includes(extname(archivo).toLowerCase())) continue;
        if (publicado.includes(basename(archivo))) continue;
        const ruta = join(dist, archivo);
        bytes += (await stat(ruta)).size;
        await unlink(ruta);
        borrados++;
      }
      logger.info(`${borrados} imágenes originales sin uso eliminadas (${(bytes / 1024 / 1024).toFixed(0)} MB)`);
    },
  },
});

export default defineConfig({
  site: 'https://www.ureppsa.com',
  trailingSlash: 'ignore',
  integrations: [sitemap(), limpiarOriginales()],
});
