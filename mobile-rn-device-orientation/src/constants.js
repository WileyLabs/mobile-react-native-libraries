export const NAME = 'mobile-rn-device-orientation';

export const INIT_REQUEST                       = NAME + '/INIT_REQUEST';
export const LOCK_ORIENTATION_REQUEST           = NAME + '/LOCK_ORIENTATION_REQUEST';
export const LOCK_SPECIFIC_ORIENTATION_REQUEST  = NAME + '/LOCK_SPECIFIC_ORIENTATION_REQUEST';

export const SET_ORIENTATION                = NAME + '/SET_ORIENTATION';
export const SET_ORIENTATION_LOCK           = NAME + '/SET_ORIENTATION_LOCK';
export const SET_SPECIFIC_ORIENTATION       = NAME + '/SET_SPECIFIC_ORIENTATION';
export const SET_SPECIFIC_ORIENTATION_LOCK  = NAME + '/SET_SPECIFIC_ORIENTATION_LOCK';
export const SET_SILENT                     = NAME + '/SET_SILENT';

export const ON_ORIENTATION_CHANGE          = NAME + '/ON_ORIENTATION_CHANGE';
export const ON_SPECIFIC_ORIENTATION_CHANGE = NAME + '/ON_SPECIFIC_ORIENTATION_CHANGE';

export const mode = {
  PORTRAIT: 'PORTRAIT',
  LANDSCAPE: 'LANDSCAPE',
  PORTRAITUPSIDEDOWN: 'PORTRAITUPSIDEDOWN',   // This mode is not supported by lock function
  UNKNOWN: 'UNKNOWN'                          // This mode is not supported by lock function
};

export const specificMode = {
  PORTRAIT: 'PORTRAIT',
  LANDSCAPELEFT: 'LANDSCAPE-LEFT',
  LANDSCAPERIGHT: 'LANDSCAPE-RIGHT',
  PORTRAITUPSIDEDOWN: 'PORTRAITUPSIDEDOWN',   // This mode is not supported by lock function
  UNKNOWN: 'UNKNOWN'                          // This mode is not supported by lock function
};

export const log = (...args) => console.log('[' + NAME + ']', ...args);

const publicConstants = {
  NAME,
  mode,
  specificMode
};

export default publicConstants;
