import { takeEvery, put, select, call } from 'redux-saga/effects';
import { AudioRecorder } from 'react-native-audio';
import * as constants from '../constants';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { fs, logging } from '../utils';

function* _stopRequest(action) {

  if ((yield select(selectors.getLogLevel)) > 0) {
    logging.log({action});
  }

  // If not recording now, just exit
  if (!(yield select(selectors.isRecording))) {
    logging.log('Cannot stop recording, as it has not started');
    return false;
  }

  let isReadyToSave = action.success;
  let duration = 0.0;
  let size = 0.0;

  if (isReadyToSave) {
    const filePath = (yield select(selectors.getState)).recordingFile;
    yield call(AudioRecorder.stopRecording);
    const stats = yield call(fs.awaitGetFileStats, filePath);
    isReadyToSave = stats.size > 0;
    if (isReadyToSave) {
      duration = yield select(selectors.getCurrentTime);
      size = stats.size;
    }
  }

  yield put(actions.setState({ isReadyToSave, isRecording: false }));
  yield put(actions.setInfo({ duration, size }));

}

export function* watchStopRequest() {
  yield takeEvery(constants.STOP_REQUEST, _stopRequest);
}
