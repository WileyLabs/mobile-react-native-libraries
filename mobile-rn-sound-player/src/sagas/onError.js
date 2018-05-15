import { takeEvery, put } from 'redux-saga/effects';
import * as constants from '../constants';
import * as actions from '../actions';
import { logging } from '../utils';

function* _onError(action) {
  const { error }  = action;
  logging.error({ error });
  yield put(actions.setState({ error }));
}

export function* watchOnError() {
  yield takeEvery(constants.ON_ERROR, _onError);
}
