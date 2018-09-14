import { takeEvery, put, select } from 'redux-saga/effects';
import * as constants from '../constants';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { log } from '../utils';

function* _unmountRequest(action) {

  ((yield select(selectors.getOptions)).logLevel > 1) && log({action});

  yield put(actions.resetRequest());
  yield put(actions.setState({ isMounted: false }));

}

export function* watchUnmountRequest() {
  yield takeEvery(constants.UNMOUNT_REQUEST, _unmountRequest);
}
