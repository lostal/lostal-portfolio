/**
 * Información de perfil centralizada
 * Usada tanto en el sitio web como en el CV generado
 */

export interface ProfileInfo {
  name: string;
  location: string;
  website: string;
  email?: string;
  github?: string;
  linkedin?: string;
}

export const profile: ProfileInfo = {
  name: 'Álvaro Lostal',
  location: 'Santander, España',
  website: 'lostal.dev',
  email: 'alvaro@lostal.dev',
  github: 'lostal',
  linkedin: 'alvarolostal',
};
