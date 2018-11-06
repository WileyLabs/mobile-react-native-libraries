import { takeEvery } from 'redux-saga/effects';
import { LOCK_ORIENTATION_REQUEST } from '../constants';
import { log } from '../utils';
import orientation from '../orientation';

function* _lockOrientationRequest({landscape, rotated}) {
  try {
    if (landscape === undefined) {
      orientation.unlock();
    }
    else {
      orientation.lock(landscape, rotated);
    }
  } catch (err) {
    log(err.message);
  }
}

export function* watchLockOrientationRequest() {
  yield takeEvery(LOCK_ORIENTATION_REQUEST, _lockOrientationRequest);
}
