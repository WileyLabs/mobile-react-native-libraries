# mobile-rn-utils

A collection of helper modules for react native applications.

## alert

alert - a helper module for redux-saga; it wraps react native [Alert.alert()](https://facebook.github.io/react-native/docs/alert.html) to use within sagas (generator functions). It exports two functions: alert() and confirm().

### alert API

### `alert(title: string, message: string, okButtonTitle?: string = 'OK'): Promise<void>`

Displays react native Alert.alert() with given title, message, and one 'positive' button. Returns nothing.

### `confirm(title: string, message: string, confirmButtonTitle?: string = 'OK', cancelButtonTitle?: string = 'Cancel'): Promise<boolean>`

Displays react native Alert.alert() with given title, message, and two buttons (one 'positive' and one 'negative'. If user press 'positive' button, returns true. Otherwise returns false.

```javascript
// Example 1 - alert() usage in saga
//
import { call, takeLatest } from 'redux-saga/effects';
import { alert } from 'mobile-rn-utils/alert';
import { ON_APP_ERROR } from './constants';

function* _onAppError(action) {
  console.log('----saga _onAppError saga----');

  yield call(alert, action.title, action.message);
}

export function* watchOnAppError() {
  yield takeLatest(ON_APP_ERROR, _onAppError);
}

// Example 2 - confirm() usage in saga
//
import { call, takeLatest } from 'redux-saga/effects';
import { confirm } from 'mobile-rn-utils/alert';
import { ON_DELETE_REQUEST } from './constants';

function* _onDeleteRequest(action) {
  console.log('----saga _onDeleteRequest saga----');

  const isDeleteConfirmed = yield call(confirm, 'Delete', `Do you really want to delete ${action.name}?`);
  
  if (isDeleteConfirmed) {
    // Delete logic goes here
  }
}

export function* watchOnDeleteRequest() {
  yield takeLatest(ON_DELETE_REQUEST, _onDeleteRequest);
}
```
