import { all, call } from 'redux-saga/effects';

import { watchInitRequest } from './initRequest';

export default function* deviceOrientationSaga() {
  yield all([
    call(watchInitRequest)
  ]);
}
