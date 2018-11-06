import { all, call } from 'redux-saga/effects';
import { orientationChannel } from './orientationChannel';
import { watchLockOrientationRequest } from './lockOrientationRequest';

export default function* deviceOrientationSaga() {
  yield all([
    call(orientationChannel),
    call(watchLockOrientationRequest)
  ]);
}
