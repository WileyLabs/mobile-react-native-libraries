import { takeEvery, put } from 'redux-saga/effects';
import * as constants from '../constants';
import * as actions from '../actions';
import { logging, helpers } from '../utils';

function* _onError(action) {
  const error = { errCode: action.errCode, details: action.details };
  yield put(actions.setState({ error }));
  if (constants.DEBUG_OUTPUT) {
    logging.error({errCode: error.errCode, message: helpers.getErrorMessage(error) });
  }
}

export function* watchOnError() {
  yield takeEvery(constants.ON_ERROR, _onError);
}
