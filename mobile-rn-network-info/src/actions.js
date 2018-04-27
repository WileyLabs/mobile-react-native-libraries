import * as constants from './constants';

// Action Creators for Sagas

// Init networkInfo feature
export const initRequest = () => ({ type: constants.INIT_REQUEST });

// Request update for "connected" property
export const updateRequest = () => ({ type: constants.UPDATE_REQUEST });

// Notify "external" world about connection change
export const onConnectionChange = (connected) => ({ type: constants.ON_CONNECTION_CHANGE, connected });

// Action Creators for Reducers
export const setConnected = connected => ({ type: constants.SET_CONNECTED, connected });

const publicActions = {
  initRequest,
  updateRequest
};

export default publicActions;
