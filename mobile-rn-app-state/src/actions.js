import * as constants from './constants';

// Action Creators for Sagas
export const initRequest = () => ({ type: constants.INIT_REQUEST });

export const onAppStateChange = appState => ({ type: constants.ON_APP_STATE_CHANGE, appState });

// Action Creators for Reducer
export const setAppState = appState => ({ type: constants.SET_APP_STATE, appState });

const publicActions = {
  initRequest
};

export default publicActions;
