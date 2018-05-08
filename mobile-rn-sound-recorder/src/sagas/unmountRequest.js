import { takeEvery, select, put } from 'redux-saga/effects';
import * as constants from '../constants';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { logging, fs } from '../utils';

function* _unmountRequest(action) {

  if (constants.DEBUG_OUTPUT) {
    logging.log({action});
  }

  // Stop if running
  if ((yield select(selectors.isRecording))) {
    yield put(actions.stopRequest(false));
  }

  // Cleanup temporary file(s)
   yield fs.awaitDeleteFile((yield select(selectors.getState)).recordingFile);

}

export function* watchUnmountRequest() {
  yield takeEvery(constants.UNMOUNT_REQUEST, _unmountRequest);
}
