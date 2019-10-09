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
i18next.data_list = (...args) => {
  let data = i18next.getDataByLanguage(i18next.language).translation;
  for(let key of args) {
    data = data[key];
  }
  return data;
};

export default i18next;