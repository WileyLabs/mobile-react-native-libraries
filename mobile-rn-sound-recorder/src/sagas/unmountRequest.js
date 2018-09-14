import { takeEvery, select, put } from 'redux-saga/effects';
import * as constants from '../constants';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { log, fs } from '../utils';

function* _unmountRequest(action) {

  ((yield select(selectors.getOptions)).logLevel > 1) && log({action});

  // Stop if running
  (yield select(selectors.isRecording)) && (yield put(actions.stopRequest(false)));

  // Cleanup temporary file
  yield fs.awaitDeleteFile((yield select(selectors.getState)).recordingFile);

  // Reset states
  const state = { isMounted: false,
    isRecording: false,
    isReadyToSave: false,
    currentTime: 0.0,
    hasPermission: undefined,
    error: constants.ERROR_NO_ERROR,
    recordingFile: '',
    options: { logLevel: constants.LOG_LEVEL }
  };

  yield put(actions.setState(state));
}

export function* watchUnmountRequest() {
  yield takeEvery(constants.UNMOUNT_REQUEST, _unmountRequest);
}
