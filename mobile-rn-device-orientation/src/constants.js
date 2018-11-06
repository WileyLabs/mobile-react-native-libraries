export const NAME = 'mobile-rn-device-orientation';

export const LOCK_ORIENTATION_REQUEST = NAME + '/LOCK_ORIENTATION_REQUEST';
export const ON_ORIENTATION_CHANGED   = NAME + '/ON_ORIENTATION_CHANGED';

export const SET_STATUS               = NAME + '/SET_STATUS';

const publicConstants = {
  NAME,
  SET_STATUS,
  ON_ORIENTATION_CHANGED,
  LOCK_ORIENTATION_REQUEST
};

export default publicConstants;
