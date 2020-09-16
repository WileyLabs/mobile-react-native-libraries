import { call, put, takeEvery } from 'redux-saga/effects';
import NetInfo from "@react-native-community/netinfo";
import { UPDATE_REQUEST } from '../constants';
import { setNetInfoState } from '../actions';

async function _netInfoFetch() {
  return await NetInfo.fetch();
}

function* _updateRequest() {
  console.log('----saga mobile-rn-network-info._updateRequest saga----');
  try {
    const netInfoState = yield call(_netInfoFetch);
    console.log('NetInfo state:', netInfoState);
    yield put(setNetInfoState(netInfoState));
  } catch (error) {
    console.log('mobile-rn-network-info error: ', error);
  }
}

export function* watchUpdateRequest() {
  yield takeEvery(UPDATE_REQUEST, _updateRequest);
}
