import { put, takeEvery } from 'redux-saga/effects';
import * as constants from '../constants';
import * as actions from '../actions';
import { logging, helpers } from '../utils';

import Sound from 'react-native-sound';

/**
 * Initialize (Mount) Component
*/
function* _mountRequest(action) {
  if (constants.DEBUG_OUTPUT) {
    logging.log({action});
  }

  const stateUpdate = { isMounted: false, isPlaying: false, isPaused: false, currentTime: 0.0, error: constants.ERROR_NO_ERROR };
  yield put(actions.setState(stateUpdate));

  try {
    Sound.enable(true);
    Sound.setCategory('Playback', true);
    yield put(actions.setState({ isMounted: true }));
  }
  catch (err) {
    yield put(actions.onError(helpers.buildError(constants.ERROR_PLAYBACK, err)));
  }

}

export function* watchMountRequest() {
  yield takeEvery(constants.MOUNT_REQUEST, _mountRequest);
}
