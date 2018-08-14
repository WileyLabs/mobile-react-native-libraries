import { all, call } from 'redux-saga/effects';

import { watchInitRequest } from './initRequest';
import { watchOnOrientationChange } from './onOrientationChange';
import { watchLockOrientationRequest } from './lockOrientationRequest';
import { watchOnSpecificOrientationChange } from './onSpecificOrientationChange';
import { watchLockSpecificOrientationRequest } from './lockSpecificOrientationRequest';

export default function* deviceOrientationSaga() {
  yield all([
    call(watchInitRequest),
    call(watchOnOrientationChange),
    call(watchLockOrientationRequest),
    call(watchOnSpecificOrientationChange),
    call(watchLockSpecificOrientationRequest)
  ]);
}
