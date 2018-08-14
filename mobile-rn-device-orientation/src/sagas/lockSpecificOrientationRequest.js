import { put, takeEvery, select } from 'redux-saga/effects';
import Orientation from 'react-native-orientation';
import { LOCK_SPECIFIC_ORIENTATION_REQUEST, specificMode, log } from '../constants';
import { setSpecificOrientationLock }  from '../actions';
import selectors  from '../selectors';

function* _lockSpecificOrientationRequest({specific}) {
  if (!specific) {
    yield put(setSpecificOrientationLock(undefined));
    Orientation.unlockAllOrientations();
    return;
  }
  const silent = yield select(selectors.getSilent);
  const index = Object.values(specificMode).indexOf(specific);
  if (index >= 0 && index <= 2) {
    yield put(setSpecificOrientationLock(specific));
    specific === specificMode.PORTRAIT && Orientation.lockToPortrait();
    specific === specificMode.LANDSCAPELEFT && Orientation.lockToLandscapeLeft();
    specific === specificMode.LANDSCAPERIGHT && Orientation.lockToLandscapeRight();
    silent || log('Specific orientation locked to ' + specific);
  }
  else {
    silent || log('Specific orientation lock mode ' + specific + ' is not supported');
  }
}

export function* watchLockSpecificOrientationRequest() {
  yield takeEvery(LOCK_SPECIFIC_ORIENTATION_REQUEST, _lockSpecificOrientationRequest);
}
