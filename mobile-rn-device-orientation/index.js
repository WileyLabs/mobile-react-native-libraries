import reducer from './src/reducer';
import saga from './src/sagas';
import selectors from './src/selectors';
import constants from './src/constants';
import orientation from './src/orientation';
import actions from './src/actions';

const { NAME, ON_ORIENTATION_CHANGED } = constants;
const { getDeviceOrientation, isLandscape, isRotated } = selectors;
const { lockOrientationRequest } = actions;
const { lock, unlock, getParams, lockToPortrait, lockToLandscape, unlockAllOrientations } = orientation;

export default {
  reducer, saga,
  NAME, ON_ORIENTATION_CHANGED,                   // constants
  getDeviceOrientation, isLandscape, isRotated,   // selectors
  lockOrientationRequest,                         // action
  lockToPortrait, lockToLandscape, unlockAllOrientations,     // compatibility functions
  lock, unlock, getParams                         // functions
};

export {
  reducer,
  saga,
  selectors,
  constants,
  actions
};
