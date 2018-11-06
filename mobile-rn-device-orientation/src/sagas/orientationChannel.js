import { put, take } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import orientation, { setNotificationCallback } from '../orientation';
import { setStatus, onOrientationChanged } from '../actions';
import { log } from '../utils';

function _createOrientationListener() {
  return eventChannel(emitter => {
    const orientationDidChange = status => emitter(status);
    setNotificationCallback(orientationDidChange);
    return () => setNotificationCallback();
  });
}

export function* orientationChannel() {
  try {
    let params = orientation.getParams();
    yield put(setStatus(params));
    const channel = _createOrientationListener();
    while (true) {
      params = yield take(channel);
      yield put(setStatus(params));
      yield put(onOrientationChanged(params));
      log(params);
    }
  } catch (err) {
    log(err.message);
  }
}
