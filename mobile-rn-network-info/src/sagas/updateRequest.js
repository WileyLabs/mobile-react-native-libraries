import { call, put, takeEvery } from 'redux-saga/effects';
import NetInfo from "@react-native-community/netinfo";
import { UPDATE_REQUEST } from '../constants';
import { setConnected } from '../actions';

async function _isConnected() {
  return await NetInfo.isConnected.fetch();
}

function* _updateRequest() {
  // console.log('----saga networkInfo._updateRequest saga----');
  let connected = yield call(_isConnected);

  console.log(`Internet connected: ${connected}`);

  yield put(setConnected(connected));
}

export function* watchUpdateRequest() {
  yield takeEvery(UPDATE_REQUEST, _updateRequest);
}
