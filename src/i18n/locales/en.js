import merge from 'deepmerge'
import country from './en/country.yml';
import dict from './en/dict.yml';
import lang from './en/lang.yml';
import message from './en/message.yml';
import prefecture from './en/prefecture.yml';
import user from './en/user.yml';

export const en = merge.all([country, dict, lang, message, prefecture, user]).en;
