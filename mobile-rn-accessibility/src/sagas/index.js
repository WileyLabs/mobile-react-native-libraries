import { all } from 'redux-saga/effects';
import { watchNavigation } from './navigateRequest';
import { watchInitRequest } from './initRequest';

// Root accessibility saga
export default function* accessibilitySaga() {
  yield all([
    watchNavigation(),
    watchInitRequest()
  ]);
}
