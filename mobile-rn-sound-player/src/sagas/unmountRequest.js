import { takeEvery, put, select } from 'redux-saga/effects';
import * as constants from '../constants';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { logging } from '../utils';

function* _unmountRequest(action) {

  if ((yield select(selectors.getLogLevel)) > 0) {
    logging.log({action});
  }

  yield put(actions.resetRequest());
  yield put(actions.setState({ isMounted: false }));

}

export function* watchUnmountRequest() {
  yield takeEvery(constants.UNMOUNT_REQUEST, _unmountRequest);
}
