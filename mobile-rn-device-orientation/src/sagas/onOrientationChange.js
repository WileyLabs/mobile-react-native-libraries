import { select, put, takeEvery } from 'redux-saga/effects';
import Orientation from 'react-native-orientation';
import { ON_ORIENTATION_CHANGE } from '../constants';
import constants from '../constants';
import selectors  from '../selectors';
import { setOrientation } from '../actions';
import { log } from '../constants';

function* _onOrientationChange({orientation}) {
  // check if processed already
  if ((yield select(selectors.getOrientation)) === orientation) {
    return;
  }
  const silent = yield select(selectors.getSilent);
  silent || log('Orientation changed to ' + orientation);
  // store
  yield put(setOrientation(orientation));
  // verify lock
  const orientationLock = yield select(selectors.getOrientationLock);
  if (orientationLock && (orientationLock !== orientation)) {
    orientationLock === constants.mode.portrait && Orientation.lockToPortrait();
    orientationLock === constants.mode.landscape && Orientation.lockToLandscape();
  }
}

export function* watchOnOrientationChange() {
  yield takeEvery(ON_ORIENTATION_CHANGE, _onOrientationChange);
}


