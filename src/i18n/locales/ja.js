import merge from 'deepmerge'
import dict from './ja/dict.yml';
import user from './ja/user.yml';

export const ja = merge.all([dict, user]).ja;
