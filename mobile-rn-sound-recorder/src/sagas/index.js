import { all, call } from 'redux-saga/effects';

import { watchMountRequest } from './mountRequest';
import { watchUnmountRequest } from './unmountRequest';
import { watchStartRequest } from './startRequest';
import { watchStopRequest } from './stopRequest';
import { watchSaveAsFileRequest } from './saveAsFileRequest';
import { watchOnError } from './onError';

export default function* soundRecorderSaga() {
  yield all([
    call(watchMountRequest),
    call(watchUnmountRequest),
    call(watchStartRequest),
    call(watchStopRequest),
    call(watchSaveAsFileRequest),
    call(watchOnError)
  ]);
}
