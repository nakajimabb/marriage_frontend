import merge from 'deepmerge'
import en2 from './en/en.yml';

export const en = merge.all([en2]).en;
