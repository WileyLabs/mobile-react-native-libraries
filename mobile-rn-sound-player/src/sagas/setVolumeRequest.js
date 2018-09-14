import { takeEvery, put, select } from 'redux-saga/effects';
import * as constants from '../constants';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { log, helpers } from '../utils';

function* _setVolumeRequest(action) {

  ((yield select(selectors.getOptions)).logLevel > 1) && log({action});

  const state = yield select(selectors.getState);
  const mute = helpers.getField(action, 'volume.mute', state.volume.mute);
  const level = helpers.putWithin(helpers.getField(action, 'volume.level', state.volume.level), 0, 1);

  try {
    if (state.sound !== undefined) {
      state.sound.setVolume(mute ? 0.0 : level);
    }
    yield put(actions.setVolume({ mute, level }));
  }
  catch (err) {
    yield put(actions.onError(helpers.buildError(constants.ERROR_PLAYBACK, err, { sound: state.sound })));
    yield put(actions.resetRequest());
  }

}

export function* watchSetVolumeRequest() {
  yield takeEvery(constants.SET_VOLUME_REQUEST, _setVolumeRequest);
}
