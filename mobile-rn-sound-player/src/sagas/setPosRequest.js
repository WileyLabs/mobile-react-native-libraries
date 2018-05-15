import { takeEvery, put, select } from 'redux-saga/effects';
import * as constants from '../constants';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { logging, helpers } from '../utils';

function* _setPosRequest(action) {
  if (constants.DEBUG_OUTPUT) {
    logging.log({action});
  }

  let currentTime;
  const state = yield select(selectors.getState);

  try {
    currentTime = helpers.putWithin(action.pos, 0, state.info.duration - 0.01);
    state.sound.setCurrentTime(currentTime);
    yield put(actions.setState({ currentTime }));
  }
  catch (err) {
    yield put(actions.onError(helpers.buildError(constants.ERROR_PLAYBACK, err)));
  }

}

export function* watchSetPosRequest() {
  yield takeEvery(constants.SET_POS_REQUEST, _setPosRequest);
}
