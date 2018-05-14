# mobile-rn-utils

A collection of helper modules for react native applications.

## alert

alert - a helper module for redux-saga; it wraps react native Alert.alert() to use within sagas (generator functions). It exports two functions: alert() and confirm().

```javascript
// Example 1 - alert() usage
//
import { call, takeLatest } from 'redux-saga/effects';
import { alert } from 'mobile-rn-utils/alert';
import { ON_APP_ERROR } from './constants';

function* _onAppError(action) {
  console.log('----saga _onAppError saga----');

  yield call(alert, action.title, action.message);
}

export function* watchOnRestorePurchasesError() {
  yield takeLatest(ON_APP_ERROR, _onAppError);
}

// Example 2 - confirm() usage
//
import { call, takeLatest } from 'redux-saga/effects';
import { confirm } from 'mobile-rn-utils/alert';
import { ON_DELETE_REQUEST } from './constants';

function* _onDeleteRequest(action) {
  console.log('----saga _onAppError saga----');

  const isDeleteConfirmed = yield call(confirm, 'Delete', `Do you really want to delete ${action.name}?`);
  
  if (isDeleteConfirmed) {
    // Delete logic goes here
  }
}

export function* watchOnRestorePurchasesError() {
  yield takeLatest(ON_DELETE_REQUEST, _onDeleteRequest);
}
```
