import { NAME } from './constants';

export const getDeviceOrientation = state => state[NAME].orientation;
export const isLandscape = state => state[NAME].orientation === 'LANDSCAPE';

export const getOrientation = state => state[NAME].orientation;
export const getOrientationLock = state => state[NAME].orientationLock;
export const getSpecificOrientation = state => state[NAME].specificOrientation;
export const getSpecificOrientationLock = state => state[NAME].specificOrientationLock;
export const getSilent = state => state[NAME].silent;

const publicSelectors = {
  getDeviceOrientation,
  isLandscape,
  getOrientation,
  getOrientationLock,
  getSpecificOrientation,
  getSpecificOrientationLock,
  getSilent
};

export default publicSelectors;
