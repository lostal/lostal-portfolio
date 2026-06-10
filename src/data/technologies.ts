/**
 * Tecnologías y herramientas del portafolio
 * Usadas en Technologies.astro y cv-print.astro
 */

export interface Technology {
  name: string;
  icon: string;
}

export interface TechCategory {
  /** Identificador único, debe coincidir con clave i18n technologies.{id} */
  id: string;
  /** Clase de icono FontAwesome para la categoría */
  iconClass: string;
  items: Technology[];
}

export const technologies: TechCategory[] = [
  {
    id: 'languages',
    iconClass: 'fas fa-code',
    items: [
      { name: 'TypeScript', icon: '/assets/tech-icons/typescript.svg' },
      { name: 'JavaScript', icon: '/assets/tech-icons/javascript.svg' },
      { name: 'CSS', icon: '/assets/tech-icons/css3.svg' },
      { name: 'SQL', icon: '/assets/tech-icons/sql.svg' },
    ],
  },
  {
    id: 'frameworks',
    iconClass: 'fas fa-cubes',
    items: [
      { name: 'Next.js', icon: '/assets/tech-icons/nextjs.svg' },
      { name: 'Astro', icon: '/assets/tech-icons/astro.svg' },
      { name: 'Framer Motion', icon: '/assets/tech-icons/framer.svg' },
      { name: 'Vitest', icon: '/assets/tech-icons/vitest.svg' },
    ],
  },
  {
    id: 'tools',
    iconClass: 'fas fa-tools',
    items: [
      { name: 'Figma', icon: '/assets/tech-icons/figma.svg' },
      { name: 'GitHub', icon: '/assets/tech-icons/github.svg' },
      { name: 'Docker', icon: '/assets/tech-icons/docker.svg' },
      { name: 'VS Code', icon: '/assets/tech-icons/vscode.svg' },
    ],
  },
];
