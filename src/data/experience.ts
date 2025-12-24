import type { TranslationKey } from '../i18n/utils';

export interface ExperienceItem {
  id: string;
  logo: string;
  logoAlt: string;
  i18nKeys: {
    title: TranslationKey;
    date: TranslationKey;
    company: TranslationKey;
    description: TranslationKey;
    tasks?: TranslationKey[];
  };
}

export const experience: ExperienceItem[] = [
  {
    id: 'eurocastalia',
    logo: '/assets/logos/eurocastalia.svg',
    logoAlt:
      'Logo de Eurocastalia, empresa donde realicé prácticas de desarrollo web',
    i18nKeys: {
      title: 'journey.eurocastalia.title',
      date: 'journey.eurocastalia.date',
      company: 'journey.eurocastalia.company',
      description: 'journey.eurocastalia.description',
      tasks: ['journey.eurocastalia.task1', 'journey.eurocastalia.task2'],
    },
  },
];
