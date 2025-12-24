import type { TranslationKey } from '../i18n/utils';

export interface EducationItem {
  id: string;
  logo: string;
  logoAlt: string;
  i18nKeys: {
    title: TranslationKey;
    date: TranslationKey;
    institution: TranslationKey;
    description: TranslationKey;
    subjects?: TranslationKey[];
  };
}

export const education: EducationItem[] = [
  {
    id: 'uea',
    logo: '/assets/logos/uea.svg',
    logoAlt:
      'Logo de la Universidad Europea del Atlántico donde estudio Ingeniería Informática',
    i18nKeys: {
      title: 'journey.uea.title',
      date: 'journey.uea.date',
      institution: 'journey.uea.institution',
      description: 'journey.uea.description',
      subjects: [
        'journey.uea.subject1',
        'journey.uea.subject2',
        'journey.uea.subject3',
      ],
    },
  },
  {
    id: 'cambridge',
    logo: '/assets/logos/cambridge.svg',
    logoAlt:
      'Logo de Cambridge Assessment English donde obtuve mi certificación B2 First',
    i18nKeys: {
      title: 'journey.cambridge.title',
      date: 'journey.cambridge.date',
      institution: 'journey.cambridge.institution',
      description: 'journey.cambridge.description',
    },
  },
];
