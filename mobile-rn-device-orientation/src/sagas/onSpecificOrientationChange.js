import { select, put, takeEvery } from 'redux-saga/effects';
import Orientation from 'react-native-orientation';
import { ON_SPECIFIC_ORIENTATION_CHANGE } from '../constants';
import constants from '../constants';
import selectors  from '../selectors';
import { setSpecificOrientation } from '../actions';
import { log } from '../constants';

function* _onSpecificOrientationChange({specific}) {
  // check if processed already
  if ((yield select(selectors.getSpecificOrientation)) === specific) {
    return;
  }
  const silent = yield select(selectors.getSilent);
  silent || log('Specific orientation changed to ' + specific);
  // store
  yield put(setSpecificOrientation(specific));
  // verify lock
  const orientationLock = yield select(selectors.getSpecificOrientationLock);
  if (orientationLock && (orientationLock !== specific)) {
    orientationLock === constants.specificMode.portrait && Orientation.lockToPortrait();
    orientationLock === constants.specificMode.landscapeLeft && Orientation.lockToLandscapeLeft();
    orientationLock === constants.specificMode.landscapeRight && Orientation.lockToLandscapeRight();
  }
}

export function* watchOnSpecificOrientationChange() {
  yield takeEvery(ON_SPECIFIC_ORIENTATION_CHANGE, _onSpecificOrientationChange);
}


