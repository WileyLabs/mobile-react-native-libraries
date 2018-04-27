import { NAME } from './constants';

export const getDeviceOrientation = state => state[NAME].orientation;

export const isLandscape = state => state[NAME].orientation === 'LANDSCAPE';

const publicSelectors = {
  getDeviceOrientation,
  isLandscape
};

export default publicSelectors;
