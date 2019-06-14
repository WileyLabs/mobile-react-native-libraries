import { eventChannel } from 'redux-saga';
import { call, put, take, takeEvery } from 'redux-saga/effects';
import NetInfo from "@react-native-community/netinfo";
import { INIT_REQUEST } from '../constants';
import { setConnected, onConnectionChange, updateRequest } from '../actions';

function _createEventChannel() {
  return eventChannel(emitter => {
    const networkStatusDidChange = connected => emitter(connected);
    NetInfo.isConnected.addEventListener('connectionChange', networkStatusDidChange);
    return () => NetInfo.isConnected.removeEventListener(networkStatusDidChange);
  });
}

function* _initRequest() {
  console.log('----saga networkInfo._initRequest saga----');

  // It will run networkInfo/sagas/updateRequest.js saga to set initial value of "connected" property
  yield put(updateRequest());

  const channel = yield call(_createEventChannel);

  while (true) {
    const connected = yield take(channel);
    console.log(`Internet connected: ${connected}`);
    yield put(setConnected(connected));
    yield put(onConnectionChange(connected));
  }
}

export function* watchInitRequest() {
  yield takeEvery(INIT_REQUEST, _initRequest);
}
