import { INIT_REQUEST, LOCK_ORIENTATION_REQUEST, LOCK_SPECIFIC_ORIENTATION_REQUEST,
         SET_ORIENTATION, SET_ORIENTATION_LOCK,
         SET_SPECIFIC_ORIENTATION, SET_SPECIFIC_ORIENTATION_LOCK,
         ON_ORIENTATION_CHANGE, ON_SPECIFIC_ORIENTATION_CHANGE,
         SET_SILENT } from './constants';

// Action Creators for Sagas
export const initRequest = (options) => ({ type: INIT_REQUEST, options });
export const lockOrientation = orientation => ({ type: LOCK_ORIENTATION_REQUEST, orientation });
export const lockSpecificOrientation = specific => ({ type: LOCK_SPECIFIC_ORIENTATION_REQUEST, specific });

// Action Creators for Reducer
export const setOrientation = orientation => ({ type: SET_ORIENTATION, orientation });
export const setOrientationLock = orientation => ({ type: SET_ORIENTATION_LOCK, orientation });
export const setSpecificOrientation = specific => ({ type: SET_SPECIFIC_ORIENTATION, specific });
export const setSpecificOrientationLock = specific => ({ type: SET_SPECIFIC_ORIENTATION_LOCK, specific });
export const setSilent = silent => ({ type: SET_SILENT, silent });

// Notifications
export const onOrientationChange = orientation => ({ type: ON_ORIENTATION_CHANGE, orientation });
export const onSpecificOrientationChange = specific => ({ type: ON_SPECIFIC_ORIENTATION_CHANGE, specific });

const publicActions = {
  initRequest,
  lockOrientation,
  lockSpecificOrientation
};

export default publicActions;
