import { all, call } from 'redux-saga/effects';

import { watchInitRequest } from './initRequest';

import { watchUpdateRequest } from './updateRequest';

export default function* networkInfoSaga() {
  yield all([
    call(watchInitRequest),
    call(watchUpdateRequest)
  ]);
}
