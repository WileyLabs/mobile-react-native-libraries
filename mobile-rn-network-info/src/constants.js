export const NAME = 'networkInfo';

// Constants for Sagas

export const INIT_REQUEST = 'networkInfo/INIT_REQUEST';
export const UPDATE_REQUEST = 'networkInfo/UPDATE_REQUEST';
export const ON_CONNECTION_CHANGE = 'networkInfo/ON_CONNECTION_CHANGE';

// Constants for Reducers

export const SET_NET_INFO_STATE = 'networkInfo/SET_NET_INFO_STATE';

const publicConstants = {
  NAME,
  ON_CONNECTION_CHANGE
};

export default publicConstants;
