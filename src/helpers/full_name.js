import { str } from "./str";

export function full_name(first_name, last_name, lang) {
  if(lang == 'en') {
    return str(first_name) + ' ' + str(last_name);
  }
  return str(last_name) + ' ' + str(first_name);
}