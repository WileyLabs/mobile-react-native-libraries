import { call, take, put, select } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as actions from '../actions';
import * as selectors from '../selectors';
import utils from '../utils';

// Creates channel for listening VoiceOver notification
function _createNotificationChannel() {
  return eventChannel(emitter => {
    const listener = status => emitter(status);
    utils.requestStatus(listener);
    utils.beginTrackStatus(listener);
    return () => utils.endTrackNotification(listener);
  });
}

// Track accessibility status saga
export function* watchStatus() {
  const channel = yield call(_createNotificationChannel);
  while (true) {
    const action = yield take(channel);
    const options = yield select(selectors.getOptions);
    if (options.logLevel >= 2) {
      console.log('[A11Y::Status] ', { action });
    }
    yield put(actions.setStatus(options.debug ? true : action));
  }

}
