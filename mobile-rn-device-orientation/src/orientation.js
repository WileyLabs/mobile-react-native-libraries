/**
 * Orientation utilities
*/
import Orientation from 'react-native-orientation';
import { log } from './utils';

let currParams = {
  landscape: undefined,
  rotated: undefined
};

let lockParams = {
  landscape: undefined,
  rotated: undefined
};

const isEqual = (s1, s2) => s1.landscape === s2.landscape && s1.rotated === s2.rotated;

let cbOrientationDidChange;
let specificOrientationSupported;

export const getParams = () => currParams;
export const getLockParams = () => lockParams;
export const setNotificationCallback = cb => { cbOrientationDidChange = cb; };

export const lockToPortrait = () => lock(false, false);
export const lockToLandscape = () => lock(true);
export const unlockAllOrientations = () => unlock();

function translateOrientation(orientation, status = {...currParams}) {
  if (orientation === 'LANDSCAPE') {
    status.landscape = true;
  }
  else if (orientation !== 'UNKNOWN'){
    status.landscape = false;
    status.rotated = orientation === 'PORTRAITUPSIDEDOWN';
  }
  return status;
}

function translateSpecificOrientation(specificOrientation, status = {...currParams}) {
  if (specificOrientation === 'LANDSCAPE-LEFT' || specificOrientation === 'LANDSCAPE-RIGHT') {
    status.landscape = true;
    status.rotated = specificOrientation === 'LANDSCAPE-RIGHT';
  }
  else if (specificOrientation !== 'UNKNOWN'){
    status.landscape = false;
    status.rotated = specificOrientation === 'PORTRAITUPSIDEDOWN';
  }
  return status;
}

const isLockNecessary = status => {
  if (lockParams.landscape === undefined) {
    return false;
  }
  if (status.landscape !== lockParams.landscape) {
    return true;
  }
  if (lockParams.rotated !== undefined && specificOrientationSupported) {
    return (lockParams.rotated !== status.rotated);
  }
  return false;
};

const orientationUpdated = (nextStatus, updateLock)  => {
  if (updateLock && isLockNecessary(nextStatus)) {
    if (!specificOrientationSupported) {
      cbOrientationDidChange && cbOrientationDidChange(nextStatus);
    }
    lock(lockParams.landscape, lockParams.rotated);
  }
  else {
    if (!isEqual(nextStatus, currParams)) {
      currParams = {...nextStatus};
    }
    else {
      return;
    }
  }
  cbOrientationDidChange && cbOrientationDidChange(currParams);
};

const orientationDidChange = orientation => {
  const nextStatus = translateOrientation(orientation);
  orientationUpdated(nextStatus, !specificOrientationSupported);
};

const specificOrientationDidChange = specificOrientation => {
  const nextStatus = translateSpecificOrientation(specificOrientation);
  orientationUpdated(nextStatus, specificOrientationSupported);
};

const specificOrientationCallback = (err, specificOrientation) => {
  if (!err) {
    specificOrientationDidChange(specificOrientation);
  }
};

export const lock = (landscape, rotated) => {
  if (!landscape) {
    Orientation.lockToPortrait();
    lockParams = { landscape, rotated };
  }
  else {
    if (rotated === undefined) {
      Orientation.lockToLandscape();
      lockParams = { landscape, rotated: undefined };
    }
    else {
      rotated ? Orientation.lockToLandscapeLeft() : Orientation.lockToLandscapeRight();
      lockParams = { landscape, rotated };
    }
  }
  currParams = {...lockParams};
  log('Orientation locked to', lockParams);
};

export const unlock = () => {
  Orientation.unlockAllOrientations();
  lockParams = { landscape: undefined, rotated: undefined };
  log('Orientation unlocked');
};

function initializeModule() {
  try {
    Orientation.getSpecificOrientation(specificOrientationCallback);
    specificOrientationSupported = true;
  } catch (err) {
    specificOrientationSupported = false;
    log('Warning: getSpecificOrientation function is not supported');
  }
  currParams = translateOrientation(Orientation.getInitialOrientation());
  Orientation.addOrientationListener(orientationDidChange);
  specificOrientationSupported && Orientation.addSpecificOrientationListener(specificOrientationDidChange);
}

initializeModule();

export default {
  getParams, getLockParams,
  lock, unlock,
  lockToPortrait, lockToLandscape, unlockAllOrientations
};
