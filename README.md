# 🌐 Portafolio Personal

<div align="center">

![Astro](https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

**Portafolio profesional** construido con Astro y enfocado en rendimiento, accesibilidad y diseño minimalista.

[lostal.dev](https://lostal.dev)

</div>

---

## 📋 Descripción

Portafolio web pensado para mostrar mi trabajo de forma clara y directa. Construido desde cero con Astro, TypeScript y CSS puro, priorizando la experiencia de usuario y la velocidad de carga.

El diseño sigue una filosofía minimalista pero con personalidad: tema dual adaptado al sistema, tipografía Geist auto-hospedada y micro-animaciones que aportan vida sin comprometer el rendimiento. Todo el contenido está preparado para internacionalización (español e inglés) y el CV se genera automáticamente en PDF durante el build.

---

## ✨ Características

### Diseño y UX

- **Tema dual** con detección automática del sistema y transiciones suaves
- **Tipografía Geist** auto-hospedada para máximo control y rendimiento
- **Micro-animaciones** cuidadas: efecto typing, parallax, carrusel interactivo
- **Card flotante** con información personal al hacer clic en la foto de perfil
- **Diseño responsive** adaptado a todos los dispositivos

### Rendimiento

- **Output 100% estático** sin JavaScript de hidratación innecesario
- **Imágenes optimizadas** con `astro:assets` (AVIF, WebP, lazy loading)
- **Font Awesome en subconjunto** para reducir peso del bundle
- **Smooth scrolling** con Lenis para navegación fluida

### SEO y Accesibilidad

- **Sitemap automático** y URLs canónicas
- **JSON-LD estructurado** para rich snippets
- **Hreflang** para internacionalización correcta
- **Skip-link** y soporte completo para `prefers-reduced-motion`
- **Semántica HTML** siguiendo estándares WCAG

### Internacionalización

- **Español e inglés** con sistema de traducciones centralizado
- **Rutas localizadas** sin prefijo para el idioma por defecto
- **Contenido de proyectos** con traducciones embebidas

### Generación de CV

- **PDF automático** generado con Puppeteer durante cada build
- **Multi-idioma**: genera versiones en español e inglés
- **Sincronizado** con los datos del portafolio (reutiliza la misma fuente de datos)

---

## 📁 Arquitectura

```text
src/
├── assets/         Imágenes procesadas por Astro
├── components/     Componentes Astro (Hero, Projects, Journey...)
├── content/        Content Collections (proyectos)
├── data/           Datos estructurados (perfil, educación, tecnologías)
├── i18n/           Traducciones y utilidades de internacionalización
├── layouts/        Layout principal con SEO y meta tags
├── pages/          Páginas del sitio (ES por defecto, EN con prefijo)
├── scripts/        TypeScript para interactividad (tema, animaciones, carrusel)
├── styles/         CSS global, variables y efectos
└── utils/          Utilidades compartidas
```

El proyecto sigue una arquitectura **data-driven**: toda la información personal, proyectos, experiencia y tecnologías está centralizada en archivos de datos. Esto permite actualizar el contenido sin tocar los componentes y mantiene sincronizado el sitio web con el CV generado.

---

## 💡 Decisiones de Desarrollo

| Decisión                 | Justificación                                                             |
| ------------------------ | ------------------------------------------------------------------------- |
| **Astro**                | Output estático, zero JS por defecto y optimización de imágenes integrada |
| **CSS puro**             | Control total sobre el diseño sin dependencia de utilidades externas      |
| **Geist auto-hospedada** | Evita llamadas a Google Fonts y garantiza consistencia tipográfica        |
| **Content Collections**  | Validación de esquema con Zod y optimización automática de imágenes       |
| **Puppeteer para CV**    | Genera PDFs idénticos al diseño web sin duplicar plantillas               |
| **Font Awesome subset**  | Solo los iconos necesarios, reduciendo el peso de ~1MB a ~15KB            |

---

<div align="center">

**Álvaro Lostal**

[![Portafolio](https://img.shields.io/badge/Portafolio-lostal.dev-d5bd37?style=for-the-badge&logo=astro&logoColor=white)](https://lostal.dev)
[![GitHub](https://img.shields.io/badge/GitHub-lostal-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lostal)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Álvaro%20Lostal-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/alvarolostal)

</div>

---

<div align="center">

⭐ **¿Te gusta este proyecto?** ¡Dale una estrella para apoyar mi trabajo!

</div>
