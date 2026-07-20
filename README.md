# UREPPSA — Sitio web

Sitio estático de [UREPPSA](https://www.ureppsa.com) (desarrollos habitacionales), construido con [Astro](https://astro.build). **Todo el contenido vive en archivos de datos**: agregar o modificar un desarrollo nunca requiere tocar el código de las páginas.

## Cómo trabajar con el sitio

```bash
npm install        # solo la primera vez
npm run dev        # servidor local en http://localhost:4321
npm run build      # genera el sitio final en dist/
```

Cada `git push` a la rama `main` construye y publica el sitio automáticamente
(GitHub Actions → GitHub Pages → www.ureppsa.com). No hay que hacer nada más.

## Agregar o editar un desarrollo (lo importante)

Un desarrollo = **un archivo JSON** en `src/content/desarrollos/` + **sus fotos** en `src/assets/desarrollos/<slug>/`.

1. Copia las fotos a `src/assets/desarrollos/mi-desarrollo/` (el build las
   optimiza solo: no importa que pesen varios MB).
2. Crea `src/content/desarrollos/mi-desarrollo.json`. Campos principales:

```jsonc
{
  "nombre": "Mi Desarrollo",
  "ciudad": "lazaro",                  // archivo en src/content/ciudades/
  "anio": 2026,
  "descripcion": "Línea 1 <br> Línea 2",  // cada <br> se vuelve un punto con guion
  "precio": "DESDE $1,000,000.00",
  "disponible": true,                  // píldora verde/roja en todo el sitio
  "logo": "../../assets/desarrollos/mi-desarrollo/logo.png",
  "imagenes": ["../../assets/desarrollos/mi-desarrollo/01.jpg"],
  // Opcionales: telefono, facebook (sin ellos usa los generales),
  // ubicacion, mapa (iframe), tourVirtual (iframe), planos,
  // plantas, recamaras, banos, superficie, construccion,
  // caracteristicasVivienda, caracteristicasConjunto (HTML <ul>),
  // nombreModelo (desarrollos de un solo modelo, p. ej. "Nova"),
  // modelos: [ { nombre, precio?, etapa?, distribucion?, imagenes, planos, ... } ]
}
```

3. `git push`. La página del desarrollo, su tarjeta, el pin del mapa, los
   filtros y el sitemap se generan solos. Si falta un campo obligatorio o una
   imagen no existe, **el build avisa con un error claro y el sitio en vivo no
   se toca**.

Notas:

- **Sin `precio` en un modelo** → muestra "Consultar precio" con enlace a WhatsApp.
- **Planos**: siempre `[planta baja, planta alta]`, en horizontal.
- **Datos de contacto generales** (teléfono, celular/WhatsApp, correo,
  Facebook): un solo lugar, `src/lib/contacto.ts`.
- **Ciudad nueva** → crear su JSON en `src/content/ciudades/` (nombre, estado,
  `descripcion` para su página "Casas en venta en…", y posición x/y del pin).
  Su página `/casas-en-venta/<ciudad>/`, el pin del mapa, el filtro y el
  enlace del pie se generan solos.
- Las guías de venta en PDF dentro de `images/` **no** se suben al repositorio
  (es público); ver `.gitignore`.

## Estructura

| Carpeta | Qué es |
|---|---|
| `src/content/` | Los datos: desarrollos, ciudades y testimonios (JSON validados) |
| `src/assets/` | Fotos usadas por el sitio (optimizadas en el build) |
| `src/pages/` | Las páginas (inicio, desarrollo, financiamiento, contacto…) |
| `src/components/` | Piezas reutilizables (barra, tarjetas, mapa, íconos…) |
| `src/lib/contacto.ts` | Teléfonos, correo y Facebook generales |
| `public/` | Archivos servidos tal cual (favicon, robots, redirecciones viejas) |
| `images/` | Archivo fotográfico fuente (no lo usa el sitio directamente) |
