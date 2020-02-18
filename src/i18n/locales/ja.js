import merge from 'deepmerge'
import country from './ja/country.yml';
import lang from './ja/lang.yml';
import message from './ja/message.yml';
import prefecture from './ja/prefecture.yml';
import app from './ja/app.yml';
import user from './ja/user.yml';
import user_friend from './ja/user_friend.yml';
import requirement from './ja/requirement.yml';
import question from './ja/question.yml';
import question_choice from './ja/question_choice.yml';
import room from './ja/room.yml';
import devise from './ja/devise.yml';
import devise_invitable from './ja/devise_invitable.yml';

export const ja = merge.all([country, lang, message, prefecture, app, user, user_friend, requirement,
  question, question_choice, room, devise, devise_invitable]).ja;
