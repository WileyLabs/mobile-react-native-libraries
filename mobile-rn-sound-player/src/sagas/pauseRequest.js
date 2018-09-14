import { takeEvery, put, select } from 'redux-saga/effects';
import * as constants from '../constants';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { log, helpers } from '../utils';

function* _pauseRequest(action) {

  ((yield select(selectors.getOptions)).logLevel > 1) && log({action});

  if (!(yield select(selectors.isPlaying))) {
    log('Cannot pause playback, as it has not started');
    return;
  }

  let { paused } = action;
  const state = yield select(selectors.getState);

  try {
    if (paused === undefined) {
      paused = !state.isPaused;
    }
    paused ? state.sound.pause() : state.sound.play();
    yield put(actions.setState({ isPaused: paused }));
  }
  catch (err) {
    yield put(actions.onError(helpers.buildError(constants.ERROR_PLAYBACK, err)));
  }

}

export function* watchPauseRequest() {
  yield takeEvery(constants.PAUSE_REQUEST, _pauseRequest);
}
