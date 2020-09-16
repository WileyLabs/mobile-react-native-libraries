import { NAME } from './constants';

export const isConnected = state => state[NAME].netInfoState.isConnected;

export const isWifi = state => state[NAME].netInfoState.isConnected &&
  state[NAME].netInfoState.type === 'wifi';

export const isCellular = state => state[NAME].netInfoState.isConnected &&
  state[NAME].netInfoState.type === 'cellular';

export const getConnectionType = state => state[NAME].netInfoState.type;

const publicSelectors = {
  isConnected,
  isWifi,
  isCellular,
  getConnectionType
};

export default publicSelectors;
