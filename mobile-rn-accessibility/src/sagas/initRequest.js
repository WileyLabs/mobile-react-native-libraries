import { put, select, takeEvery, call, take, fork } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as constants from '../constants';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { defaultState } from '../reducer';
import helpers from '../utils/helpers';
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
export function* _watchStatus() {
  const channel = yield call(_createNotificationChannel);
  while (true) {
    const action = yield take(channel);
    const options = yield select(selectors.getOptions);
    options.logLevel >= 2 && console.log('[A11Y::Status] ', { action });
    yield put(actions.setStatus(options.debug ? true : action));
  }
}

function* _initRequest(action) {
  helpers.getField(action, 'options.logLevel', (yield select(selectors.getOptions)).logLevel) >= 2 && console.log('[A11Y::Init]', {action});
  yield put(actions.setState({...defaultState , ...(action.options && {options: action.options})}));
  yield fork(_watchStatus);
}

export function* watchInitRequest() {
  yield takeEvery(constants.INIT_REQUEST, _initRequest);
}
