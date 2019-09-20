import merge from 'deepmerge'
import user from './ja/user.yml';

export const ja = merge.all([user]).ja;
