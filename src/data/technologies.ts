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
      { name: 'JavaScript', icon: '/assets/tech-icons/javascript.svg' },
      { name: 'TypeScript', icon: '/assets/tech-icons/typescript.svg' },
      { name: 'HTML5', icon: '/assets/tech-icons/html5.svg' },
      { name: 'CSS3', icon: '/assets/tech-icons/css3.svg' },
      { name: 'Tailwind CSS', icon: '/assets/tech-icons/tailwind.svg' },
    ],
  },
  {
    id: 'frameworks',
    iconClass: 'fas fa-cubes',
    items: [
      { name: 'React.js', icon: '/assets/tech-icons/react.svg' },
      { name: 'Next.js', icon: '/assets/tech-icons/nextjs.svg' },
      { name: 'Astro', icon: '/assets/tech-icons/astro.svg' },
      { name: 'Node.js', icon: '/assets/tech-icons/nodejs.svg' },
      { name: 'MongoDB', icon: '/assets/tech-icons/mongodb.svg' },
    ],
  },
  {
    id: 'tools',
    iconClass: 'fas fa-tools',
    items: [
      { name: 'VS Code', icon: '/assets/tech-icons/vscode.svg' },
      { name: 'Figma', icon: '/assets/tech-icons/figma.svg' },
      { name: 'GitHub', icon: '/assets/tech-icons/github.svg' },
      { name: 'Photoshop', icon: '/assets/tech-icons/photoshop.svg' },
    ],
  },
];
