
import { NAME } from './constants';

export const log = (...args) => console.log('[' + NAME + ']', ...args);
