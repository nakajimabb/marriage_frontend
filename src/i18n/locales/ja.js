import merge from 'deepmerge'
import country from './ja/country.yml';
import lang from './ja/lang.yml';
import message from './ja/message.yml';
import prefecture from './ja/prefecture.yml';
import app from './ja/app.yml';
import user from './ja/user.yml';

export const ja = merge.all([country, lang, message, prefecture, app, user]).ja;
