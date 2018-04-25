import { eventChannel } from 'redux-saga';
import { call, put, take, takeEvery } from 'redux-saga/effects';
import Orientation from 'react-native-orientation';
import { INIT_REQUEST } from '../constants';
import { setOrientation } from '../actions';

function _createEventChannel() {
  return eventChannel(emitter => {
    const orientationDidChange = orientation => emitter(orientation);
    Orientation.addOrientationListener(orientationDidChange);
    return () => Orientation.removeOrientationListener(orientationDidChange);
  });
}

function* _initRequest(action) {
  // console.log('----saga deviceOrientation._initRequest saga----');

  const channel = yield call(_createEventChannel);

  while (true) {
    let orientation = yield take(channel);
    yield put(setOrientation(orientation));
  }
}

export function* watchInitRequest() {
  yield takeEvery(INIT_REQUEST, _initRequest);
}
