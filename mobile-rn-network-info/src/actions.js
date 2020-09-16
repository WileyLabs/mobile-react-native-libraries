import * as constants from './constants';

// Action Creators for Sagas

// Init networkInfo feature
export const initRequest = () => ({ type: constants.INIT_REQUEST });

// Request update for "connected" property
export const updateRequest = () => ({ type: constants.UPDATE_REQUEST });

// Notify "external" world about connection change
export const onConnectionChange = ({ connected, isConnected, isWifi, isCellular, connectionType, netInfoState }) =>
  ({ type: constants.ON_CONNECTION_CHANGE, connected, isConnected, isWifi, isCellular, connectionType, netInfoState });

// Action Creators for Reducers
export const setNetInfoState = netInfoState => ({ type: constants.SET_NET_INFO_STATE, netInfoState });

const publicActions = {
  initRequest,
  updateRequest
};

export default publicActions;
