# mobile-rn-app-state

A helper module to manage app state (active/inactive) in Redux.

## Module Public Interfaces

### Constants

```javascript
import { constants as appStateConstants } from 'mobile-rn-app-state'

// appStateConstants.NAME - this constant will be used later in app root reducer and module selectors
// appStateConstants.ON_APP_STATE_CHANGE - subscribe to this action type if you want to be notified when app is resumed or suspended
```

### Action Creators

```javascript
import { actions as appStateActions } from 'mobile-rn-app-state'

// appStateActions.initRequest() - dispatch this action on app launch to initialize the module
```

### Selectors
```javascript
import { selectors as appStateSelectors } from 'mobile-rn-app-state'

// appStateSelectors.isActive() - returns true when app is resumed (active); otherwise returns false
// appStateSelectors.getAppState() - returns one of null|active|background|inactive (see React Native AppState module for details)
```

## Getting started

### Install mobile-rn-app-state

```
$ npm install mobile-rn-app-state --save
# or with yarn
$ yarn add mobile-rn-app-state
```

## Initialization (3 steps)

```javascript
// rootReducer.js

import { combineReducers } from 'redux';
import { reducer as appStateReducer, constants as appStateConstants } from 'mobile-rn-app-state';

const rootReducer = combineReducers({
  ...
   // Step 1. Register appStateReducer
   [appStateConstants.NAME]: appStateReducer,
  ...
});

export default rootReducer;

// rootSaga.js

import { all, call } from 'redux-saga/effects';
import { saga as appStateSaga } from 'mobile-rn-app-state';

export default function* rootSaga() {
  yield all([
    ...
   //  Step 2. Register appStateSaga
    call(appStateSaga),
    ...
  ]);
}

// features/app/sagas/initAppRequest.js

import { put, takeEvery } from 'redux-saga/effects';
import { INIT_APP_REQUEST } from '../constants';
import { actions as appStateActions } from 'mobile-rn-app-state';

function* _initAppRequest({ navigator }) {
  console.log('----saga app._initAppRequest saga-----');

  ...
  // Step 3. Initialize app state module
  yield put(appStateActions.initRequest());

  // Put your app init logic here
  ...
}

export function* watchInitAppRequest() {
  yield takeEvery(INIT_APP_REQUEST, _initAppRequest);
}

```

## Usage in Sagas

```javascript
// features/app/sagas/onAppStateChange.js

import { takeLatest } from 'redux-saga/effects';
import { constants as appStateConstants } from 'mobile-rn-app-state';

function* _onAppStateChange({ appState }) {
  console.log(`----saga app._onAppStateChange appState=${appState} saga----`);

  if (appState === 'active') {
    // Do whatever your need when application resumed
  }
}

export function* watchOnAppStateChange() {
  yield takeLatest(appStateConstants.ON_APP_STATE_CHANGE, _onAppStateChange);
}
```
