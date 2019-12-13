import merge from 'deepmerge'
import country from './en/country.yml';
import lang from './en/lang.yml';
import message from './en/message.yml';
import prefecture from './en/prefecture.yml';
import app from './en/app.yml';
import user from './en/user.yml';
import user_friend from './en/user_friend.yml';
import requirement from './en/requirement.yml';
import question from './en/question.yml';
import question_choice from './en/question_choice.yml';
import room from './en/room.yml';

export const en = merge.all([country, lang, message, prefecture, app, user, user_friend, requirement,
  question, question_choice, room]).en;
