/*
 * Migración única: convierte el cities.json del sitio v1 en la estructura
 * modular del v2 (un archivo por desarrollo + un archivo por ciudad) y copia
 * las fotos a src/assets/desarrollos/<slug>/.
 *
 * Uso: npm run migrar
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const origen = JSON.parse(fs.readFileSync(path.join(ROOT, 'cities.json'), 'utf8'));

const CIUDADES = {
  Celaya: { nombre: 'Celaya', estado: 'Guanajuato' },
  Lazaro: { nombre: 'Lázaro Cárdenas', estado: 'Michoacán' },
  Ixtapa: { nombre: 'Ixtapa-Zihuatanejo', estado: 'Guerrero' },
  Morelia: { nombre: 'Morelia', estado: 'Michoacán' },
  Zitacuaro: { nombre: 'Zitácuaro', estado: 'Michoacán' },
};

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const dirContenido = (sub) => path.join(ROOT, 'src', 'content', sub);
fs.mkdirSync(dirContenido('desarrollos'), { recursive: true });
fs.mkdirSync(dirContenido('ciudades'), { recursive: true });

function copiarImagen(rutaOriginal, slug) {
  // "images/Ciudades/<Ciudad>/<Proyecto>/resto..." → src/assets/desarrollos/<slug>/resto...
  const partes = rutaOriginal.split('/');
  const resto = partes.length > 4 ? partes.slice(4).join('/') : partes.at(-1);
  const destino = path.join(ROOT, 'src', 'assets', 'desarrollos', slug, resto);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.copyFileSync(path.join(ROOT, rutaOriginal), destino);
  return `../../assets/desarrollos/${slug}/${resto}`;
}

const camposVivienda = (v, slug) => ({
  ...(v.price && { precio: v.price }),
  ...(v.floors && { plantas: v.floors }),
  ...(v.bedrooms && { recamaras: v.bedrooms }),
  ...(v.bathrooms && { banos: v.bathrooms }),
  ...(v.size && { superficie: v.size }),
  ...(v.construction_size && { construccion: v.construction_size }),
  ...(v.house_info && { caracteristicasVivienda: v.house_info }),
  ...(v.additional_info && { caracteristicasConjunto: v.additional_info }),
  ...(v.floor_plan && { planos: v.floor_plan.map((i) => copiarImagen(i, slug)) }),
  ...(v.images && { imagenes: v.images.map((i) => copiarImagen(i, slug)) }),
});

let total = 0;
for (const [claveCiudad, ciudad] of Object.entries(origen)) {
  const slugCiudad = kebab(claveCiudad);
  const info = CIUDADES[claveCiudad] ?? { nombre: claveCiudad };
  fs.writeFileSync(
    path.join(dirContenido('ciudades'), `${slugCiudad}.json`),
    JSON.stringify({ ...info, x: Number(ciudad.position.x), y: Number(ciudad.position.y) }, null, 2)
  );

  for (const [clave, p] of Object.entries(ciudad)) {
    if (clave === 'position') continue;
    const slug = kebab(p.short_name ?? clave);
    const datos = {
      nombre: p.name,
      ciudad: slugCiudad,
      anio: Number(p.year),
      descripcion: p.description ?? '',
      disponible: !/vendido/i.test(p.price ?? ''),
      telefono: p.phone,
      ...(p.link && { facebook: p.link.trim() }),
      ...(p.location && { ubicacion: p.location }),
      ...(p.mapEmbed && { mapa: p.mapEmbed }),
      ...(p.virtual_tour && { tourVirtual: p.virtual_tour }),
      ...(p.logo && { logo: copiarImagen(p.logo, slug) }),
      ...camposVivienda(p, slug),
      ...(p.models && {
        modelos: Object.entries(p.models).map(([nombre, m]) => ({
          nombre,
          ...camposVivienda(m, slug),
        })),
      }),
    };
    fs.writeFileSync(
      path.join(dirContenido('desarrollos'), `${slug}.json`),
      JSON.stringify(datos, null, 2)
    );
    total++;
  }
}
console.log(`✔ Migrados ${total} desarrollos y ${Object.keys(origen).length} ciudades.`);
