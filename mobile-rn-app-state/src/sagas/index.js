import { all, call } from 'redux-saga/effects';

import { watchInitRequest } from './initRequest';

export default function* reactNativeActivityLifecycleSaga() {
  yield all([
    call(watchInitRequest)
  ]);
}
