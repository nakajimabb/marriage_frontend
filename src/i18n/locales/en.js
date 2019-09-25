import merge from 'deepmerge'
import user from './en/user.yml';

export const en = merge.all([user]).en;
