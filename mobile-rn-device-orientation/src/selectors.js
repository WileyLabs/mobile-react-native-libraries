import { NAME } from './constants';

export const getDeviceOrientation = state => state[NAME].status ? (state[NAME].status.landscape ? 'LANDSCAPE' : 'PORTRAIT') : undefined;
export const isLandscape = state => state[NAME].status ? state[NAME].status.landscape : undefined;
export const isRotated = state => state[NAME].status ? state[NAME].status.rotated : undefined;

const publicSelectors = {
  getDeviceOrientation,
  isLandscape,
  isRotated
};

export default publicSelectors;
