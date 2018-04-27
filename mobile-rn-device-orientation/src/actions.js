import * as constants from './constants';

// Action Creators for Sagas
export const initRequest = () => ({ type: constants.INIT_REQUEST });

// Action Creators for Reducer
export const setOrientation = orientation => ({ type: constants.SET_ORIENTATION, orientation });

const publicActions = {
  initRequest
};

export default publicActions;
