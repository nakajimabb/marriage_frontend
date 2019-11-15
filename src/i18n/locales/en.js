import merge from 'deepmerge'
import country from './en/country.yml';
import lang from './en/lang.yml';
import message from './en/message.yml';
import prefecture from './en/prefecture.yml';
import app from './en/app.yml';
import user from './en/user.yml';
import user_friend from './en/user_friend.yml';
import requirement from './en/requirement.yml';

export const en = merge.all([country, lang, message, prefecture, app, user, user_friend, requirement]).en;
