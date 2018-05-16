import { put, takeEvery, select } from 'redux-saga/effects';
import * as constants from '../constants';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { logging, helpers } from '../utils';
import Sound from 'react-native-sound';

/**
 * Initialize (Mount) Component
 * @param options.updateFrequency update period for current pos in ms
 * @param options.logLevel logging level (0 - no debug info, default; 1; 2 - wordy log)
*/
function* _mountRequest(action) {

  if ((yield select(selectors.getLogLevel)) > 0) {
    logging.log({action});
  }

  const stateUpdate = { isMounted: false, isPlaying: false, isPaused: false,
                        currentTime: 0.0, volume: { mute: false, level: 1.0 },
                        error: constants.ERROR_NO_ERROR,
                        options: {...action.options}};
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
