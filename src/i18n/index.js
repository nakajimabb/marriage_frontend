import i18next from 'i18next';
import { en, ja } from './locales';

const resources = {
  en: {
    translation: en
  },
  ja: {
    translation: ja
  }
};

i18next.init({
  lng: 'ja',
  debug: true,
  resources,
  }
);

i18next.attr = (...args) => i18next.t('activerecord.attributes.' + args.join('.'));
i18next.enum = (...args) => i18next.t('enum.' + args.join('.'));
i18next.model = (...args) => i18next.t('activerecord.models.' + args.join('.'));

export default i18next;