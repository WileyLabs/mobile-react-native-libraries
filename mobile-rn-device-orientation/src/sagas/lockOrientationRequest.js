import { put, takeEvery, select } from 'redux-saga/effects';
import Orientation from 'react-native-orientation';
import { LOCK_ORIENTATION_REQUEST, mode, log } from '../constants';
import { setOrientationLock }  from '../actions';
import selectors  from '../selectors';

function* _lockOrientationRequest({orientation}) {
  if (!orientation) {
    yield put(setOrientationLock(undefined));
    Orientation.unlockAllOrientations();
    return;
  }
  const silent = yield select(selectors.getSilent);
  const index = Object.values(mode).indexOf(orientation);
  if (index >= 0 && index <= 1) {
    yield put(setOrientationLock(orientation));
    orientation === mode.PORTRAIT && Orientation.lockToPortrait();
    orientation === mode.LANDSCAPE && Orientation.lockToLandscape();
    silent || log('Orientation locked to ' + orientation);
  }
  else {
    silent || log('Orientation lock mode ' + orientation + ' is not supported');
  }
}

export function* watchLockOrientationRequest() {
  yield takeEvery(LOCK_ORIENTATION_REQUEST, _lockOrientationRequest);
}
