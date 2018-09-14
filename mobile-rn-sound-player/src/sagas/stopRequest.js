import { takeEvery, put, select } from 'redux-saga/effects';
import * as constants from '../constants';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { log, helpers } from '../utils';

function* _stopRequest(action) {

  ((yield select(selectors.getOptions)).logLevel > 1) && log({action});

  if (!(yield select(selectors.isPlaying))) {
    log('Cannot stop playback, as it has not started');
    return false;
  }

  const state = yield select(selectors.getState);
  const sound = state.sound;

  try {
    if (sound !== undefined) {
      state.sound.stop();
      state.sound.reset();
    }
    yield put(actions.setState({ isPlaying: false, isPaused: false }));
  }
  catch (err) {
    yield put(actions.onError(helpers.buildError(constants.ERROR_PLAYBACK, err, { sound })));
    yield put(actions.resetRequest());
  }

}

export function* watchStopRequest() {
  yield takeEvery(constants.STOP_REQUEST, _stopRequest);
}
