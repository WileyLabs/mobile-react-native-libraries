import { eventChannel } from 'redux-saga';
import { call, put, take, takeEvery } from 'redux-saga/effects';
import NetInfo from "@react-native-community/netinfo";
import { INIT_REQUEST } from '../constants';
import { setNetInfoState, onConnectionChange, updateRequest } from '../actions';

function _createEventChannel() {
  return eventChannel((emitter) => NetInfo.addEventListener((state) => emitter(state)));
}

function* _initRequest() {
  console.log('----saga mobile-rn-network-info._initRequest saga----');

  const channel = yield call(_createEventChannel);

  // It will run networkInfo/sagas/updateRequest.js saga to set initial value of "connected" property
  yield put(updateRequest());

  while (true) {
    const netInfoState = yield take(channel);
    console.log('NetInfo status changed:', netInfoState);
    // Update internal module state
    yield put(setNetInfoState(netInfoState));
    // Notify "external world" about any changes in network connection
    // We dispatch action { ON_CONNECTION_CHANGE, connected, type, netInfoState }
    yield put(onConnectionChange({
      connected: netInfoState.isConnected,
      isConnected: netInfoState.isConnected,
      isWifi: netInfoState.type === 'wifi',
      isCellular:netInfoState.type === 'cellular',
      connectionType: netInfoState.type,
      netInfoState}));
  }
}

export function* watchInitRequest() {
  yield takeEvery(INIT_REQUEST, _initRequest);
}
