import { all, call } from 'redux-saga/effects';

import { watchMountRequest } from './mountRequest';
import { watchUnmountRequest } from './unmountRequest';
import { watchStartRequest } from './startRequest';
import { watchStopRequest } from './stopRequest';
import { watchResetRequest } from './resetRequest';
import { watchPauseRequest } from './pauseRequest';
import { watchSetPosRequest } from './setPosRequest';
import { watchVolumeRequest } from './volumeRequest';
import { watchOnError } from './onError';

export default function* voiceRecorderSaga() {
  yield all([
    call(watchMountRequest),
    call(watchUnmountRequest),
    call(watchStartRequest),
    call(watchStopRequest),
    call(watchResetRequest),
    call(watchPauseRequest),
    call(watchSetPosRequest),
    call(watchVolumeRequest),
    call(watchOnError),
  ]);
}
