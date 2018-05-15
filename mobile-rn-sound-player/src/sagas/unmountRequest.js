import { takeEvery, put } from 'redux-saga/effects';
import * as constants from '../constants';
import * as actions from '../actions';
import { logging } from '../utils';

function* _unmountRequest(action) {
  if (constants.DEBUG_OUTPUT) {
    logging.log({action});
  }

  yield put(actions.resetRequest());
  yield put(actions.setState({ isMounted: false }));

}

export function* watchUnmountRequest() {
  yield takeEvery(constants.UNMOUNT_REQUEST, _unmountRequest);
}
