import { takeEvery, put, select } from 'redux-saga/effects';
import * as constants from '../constants';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { log } from '../utils';

function* _resetRequest(action) {

  ((yield select(selectors.getOptions)).logLevel > 1) && log({action});

  if ((yield select(selectors.isPlaying))) {
    const error = yield select(selectors.getError);
    yield put(actions.stopRequest(error.errCode === constants.ERROR_NO_ERROR));
  }

  const stateUpdate = { isPlaying: false, isPaused: false, currentTime: 0.0, sound: undefined };
  yield put(actions.setState(stateUpdate));

}

export function* watchResetRequest() {
  yield takeEvery(constants.RESET_REQUEST, _resetRequest);
}
