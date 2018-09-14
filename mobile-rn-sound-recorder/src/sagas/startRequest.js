import { takeEvery, call, select, take, race, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { AudioRecorder } from 'react-native-audio';
import * as constants from '../constants';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { helpers, log } from '../utils';

// Creates channel for listening AudioRecorder notification onProgress
function _createProgressChannel() {
  return eventChannel(emitter => {
    AudioRecorder.onProgress = data => emitter(data);
    return () => { AudioRecorder.onProgress = null; };
  });
}

// Creates channel for verification that recording has been started
// NOTE It is a fix for 'react-native-audio' (check the latest)
// The next condition verified: recording time in 3 secs should be greater than 1 sec, otherwise stop recording with failure flag
// (Applicable only if the User will pass audioSettings that differ from defaults)
function _createVerificationChannel() {
  return eventChannel(emitter => {
    const timeout = setTimeout(() => { emitter(timeout); }, 3000);
    return () => { clearTimeout(timeout); };
  });
}

// Verifies current State before recording starts, returns true if State is OK, false otherwise
function* _verifyState() {
  const verify = [
    (yield select(selectors.isRecording)) === false,    // Recording should be Off
    yield select(selectors.isMounted),                  // Component should be mounted
    yield select(selectors.hasPermission)               // Permissions should be acquired
  ];
  const index = verify.indexOf(false);
  const verified = index < 0;
  if (verified) {
    return true;
  }

  // Verification failed
  const errors = [ { code: constants.ERROR_ALREADY_RUNNING, message: 'Recording already running' },
                   { code: constants.ERROR_NOT_MOUNTED, message: 'Component is not initialized' },
                   { code: constants.ERROR_NOT_PERMITTED, message: 'No recording permissions granted'}
                 ];
  yield put(actions.onError(helpers.buildError(errors[index].code, new Error(errors[index].message))));

  return false;
}

function* _startRequest(action) {

  ((yield select(selectors.getOptions)).logLevel > 1) && log({action});

  if (!(yield call(_verifyState))) {
    return;
  }

  yield put(actions.setState({ isRecording: true, isReadyToSave: false, currentTime: 0.0, error: '', info: constants.defaultInfo }));

  try {
    let state = yield select(selectors.getState);
    AudioRecorder.prepareRecordingAtPath(state.recordingFile, state.audioSettings);
    yield call(AudioRecorder.startRecording);

    const channels = [ yield call(_createProgressChannel), yield call(_createVerificationChannel)];
    let currentTime = 0;

    while (true) {
      let [ stopped, progress, verification ] = yield race([
        take(constants.STOP_REQUEST),
        take(channels[0]),
        take(channels[1])
      ]);

      if (stopped !== undefined) {
        break;
      }

      if (progress !== undefined) {
        currentTime = progress.currentTime;
        yield put(actions.setCurrentTime(currentTime));
      }
      else if (verification !== undefined) {
        if (currentTime < 1.0) {
          yield put(actions.onError(helpers.buildError(constants.ERROR_RECORDING, new Error('Verify recording options and file path'))));
          yield put(actions.stopRequest(false));
          break;
        }
      }
    }
    channels.forEach(channel => channel.close());
  }
  catch (err) {
    yield put(actions.onError(helpers.buildError(constants.ERROR_RECORDING, new Error(err.message))));
    yield put(actions.setState({ isRecording: false, isReadyToSave: false, currentTime: 0.0 }));
  }

}

export function* watchStartRequest() {
  yield takeEvery(constants.START_REQUEST, _startRequest);
}
