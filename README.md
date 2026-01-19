<div align="center">

# 🌐 Portafolio Personal

![Astro](https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

**Portfolio profesional minimalista con generación automática de CV, tema dual y multi-idioma**

[🌐 Ver Demo](https://lostal.dev)

</div>

---

## 🎯 El Reto

Necesitaba un portfolio que fuera más que una simple página estática: debía reflejar mi filosofía de desarrollo, generar automáticamente mi CV en PDF sincronizado con el contenido web, y ofrecer una experiencia impecable tanto en rendimiento como en accesibilidad.

> La mayoría de portfolios son plantillas genéricas o sacrifican rendimiento por diseño. Este proyecto demuestra que se puede tener ambos.

## ✨ La Solución

| ❌ Antes / Típico                      | ✅ Este Portfolio                                           |
| -------------------------------------- | ----------------------------------------------------------- |
| CV desactualizado respecto a la web    | CV generado automáticamente del mismo contenido             |
| Idioma único o traducciones dispersas  | i18n centralizado (ES/EN) con routing automático            |
| Cambiar contenido = editar componentes | Arquitectura data-driven, componentes de presentación puros |
| Frameworks CSS pesados                 | CSS puro con design tokens y tema dual                      |

**Resultado:** 100% en todas las métricas de Lighthouse, 0 JavaScript de hidratación innecesario.

---

## ⚡ Features Principales

<table>
<tr>
<td width="50%">

### 🎨 Diseño y UX

- ✅ Tema claro/oscuro con detección automática
- ✅ Tipografía Geist auto-hospedada
- ✅ Micro-animaciones (typing, parallax, magnetic)
- ✅ Card flotante interactivo al clic en foto

</td>
<td width="50%">

### 🚀 Performance

- ✅ Output 100% estático sin hidratación
- ✅ Imágenes optimizadas (AVIF, WebP, lazy)
- ✅ Font Awesome subset (~15KB vs ~1MB)
- ✅ Smooth scrolling con Lenis

</td>
</tr>
<tr>
<td>

### 🌍 Internacionalización

- ✅ Español (default) e Inglés
- ✅ Routing automático sin prefijo para ES
- ✅ Traducciones tipadas con TypeScript
- ✅ Proyectos con contenido bilingüe

</td>
<td>

### 📄 CV Automático

- ✅ PDF generado en cada build
- ✅ Versiones ES e EN sincronizadas
- ✅ Tagged PDF para accesibilidad (PDF/UA)
- ✅ Metadatos vía exiftool

</td>
</tr>
</table>

---

## 📊 Resultados e Impacto

<div align="center">

| 🎯 Métrica                | 📈 Resultado |
| :------------------------ | :----------- |
| Lighthouse Performance    | **100**      |
| Lighthouse Accessibility  | **100**      |
| Lighthouse Best Practices | **100**      |
| Lighthouse SEO            | **100**      |
| Tiempo de carga (3G)      | **< 2s**     |

</div>

### 💼 Decisiones Técnicas Clave

| Elegí esto...        | En lugar de esto... | ¿Por qué?                               |
| -------------------- | ------------------- | --------------------------------------- |
| Astro 5              | Next.js, Nuxt       | Output estático, zero JS por defecto    |
| CSS puro             | Tailwind            | Control total, sin dependencias runtime |
| Geist auto-hospedada | Google Fonts        | Sin llamadas externas, máximo control   |
| Content Collections  | Markdown files      | Validación Zod, imágenes optimizadas    |

---

## 🎓 Lo Que Aprendí

> En este proyecto me obsesioné con limpiar el ruido. Quería una web que volara, así que usé Astro y CSS nativo para demostrar que no hacen falta herramientas pesadas para lograr algo profesional. Lo mejor es que ahora mi CV se genera solo con los datos de la web: me ahorro el andar actualizando archivos y sé que todo está siempre al día. Menos problemas y más velocidad.

---

<div align="center">

## 👨‍💻 Desarrollado por Álvaro Lostal

**Ingeniero Informático • Web Developer**

[![Portfolio](https://img.shields.io/badge/Portfolio-lostal.dev-d5bd37?style=for-the-badge&logo=astro&logoColor=white)](https://lostal.dev)
[![GitHub](https://img.shields.io/badge/GitHub-lostal-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lostal)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Álvaro%20Lostal-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/alvarolostal)

</div>

---

<div align="center">

### ⭐ Si este proyecto te resulta interesante, considera darle una estrella

</div>
