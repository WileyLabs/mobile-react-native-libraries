import constants from './constants';

export const lockOrientationRequest = (landscape, rotated) => ({
  type: constants.LOCK_ORIENTATION_REQUEST,
  landscape,
  rotated
});

// Action Creators for Reducer
export const setStatus = status => ({ type: constants.SET_STATUS, status });

// Notifications
export const onOrientationChanged = (landscape, rotated) => ({
  type: constants.ON_ORIENTATION_CHANGED,
  landscape,
  rotated
});

const publicActions = {
  lockOrientationRequest
};

export default publicActions;
