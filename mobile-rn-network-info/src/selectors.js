import { NAME } from './constants';

export const isConnected = state => state[NAME].connected;

export const publicSelectors = {
  isConnected
};
