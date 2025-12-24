/**
 * Barrel export para todos los datos del portafolio
 * Facilita imports: import { experience, education, technologies, profile } from '../data'
 */

export { experience, type ExperienceItem } from './experience';
export { education, type EducationItem } from './education';
export {
  technologies,
  type Technology,
  type TechCategory,
} from './technologies';
export { profile, type ProfileInfo } from './profile';
