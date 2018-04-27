import { NAME } from './constants';

export const isConnected = state => state[NAME].connected;

const publicSelectors = {
  isConnected
};

export default publicSelectors;
