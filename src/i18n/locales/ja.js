import merge from 'deepmerge'
import country from './ja/country.yml';
import dict from './ja/dict.yml';
import lang from './ja/lang.yml';
import message from './ja/message.yml';
import prefecture from './ja/prefecture.yml';
import user from './ja/user.yml';

export const ja = merge.all([country, dict, lang, message, prefecture, user]).ja;
