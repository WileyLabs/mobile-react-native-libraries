import { takeEvery, put } from 'redux-saga/effects';
import * as constants from '../constants';
import * as actions from '../actions';
import { log, helpers } from '../utils';

function* _onError(action) {
  const { error }  = action;
  const message = helpers.getErrorMessage(error);
  log({ error, message });
  yield put(actions.setState({ error }));
}

export function* watchOnError() {
  yield takeEvery(constants.ON_ERROR, _onError);
}
