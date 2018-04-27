# mobile-rn-network-info

A helper module to manage network info state in Redux.

## Module Public Interfaces

### Constants

```javascript
import { constants as networkInfoConstants } from 'mobile-rn-network-info'

// networkInfoConstants.NAME - this constant will be used later in app root reducer and module selectors
// networkInfoConstants.ON_CONNECTION_CHANGE - subscribe to this action type if you want to be notified about connection change
```

### Action Creators

```javascript
import { actions as networkInfoActions } from 'mobile-rn-network-info'

// networkInfoActions.initRequest() - dispatch this action on app launch to initialize the module
// networkInfoActions.updateRequest() - dispatch this action to request module updating its state 
```

### Selectors
```javascript
import { selectors as networkInfoSelectors } from 'mobile-rn-network-info'

// deviceOrientationSelectors.isConnected() - returns true when your device has network connection; otherwise returns false
```

## Getting started

### Install mobile-rn-network-info

```
$ npm install mobile-rn-network-info --save
# or with yarn
$ yarn add mobile-rn-network-info
```

## Initialization (3 steps)

```javascript
// rootReducer.js

import { combineReducers } from 'redux';
import { reducer as networkInfoReducer, constants as networkInfoConstants } from 'mobile-rn-network-info';

const rootReducer = combineReducers({
  ...
   // Step 1. Register networkInfoReducer
   [networkInfoConstants.NAME]: networkInfoReducer,
  ...
});

export default rootReducer;

// rootSaga.js

import { all, call } from 'redux-saga/effects';
import { saga as networkInfoSaga } from 'mobile-rn-network-info';

export default function* rootSaga() {
  yield all([
    ...
   //  Step 2. Register networkInfoSaga
    call(networkInfoSaga),
    ...
  ]);
}

// features/app/sagas/initAppRequest.js

import { put, takeEvery } from 'redux-saga/effects';
import { INIT_APP_REQUEST } from '../constants';
import { actions as networkInfoActions } from 'mobile-rn-network-info';

function* _initAppRequest({ navigator }) {
  console.log('----saga app._initAppRequest saga-----');

  ...
  // Step 3. Initialize network info module
  yield put(networkInfoActions.initRequest());

  // Put your app init logic here
  ...
}

export function* watchInitAppRequest() {
  yield takeEvery(INIT_APP_REQUEST, _initAppRequest);
}

```

## Usage in React Native components

```javascript
// HomeContainer.js

import Home from './Home';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectors as networkInfoSelectors } from 'mobile-rn-network-info';

function mapStateToProps(state) {
  return {
    ...
    // isConnected() selector returns true when your device has network connection; otherwise returns false
    //
    connected: networkInfoSelectors.isConnected(state),
    ...
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...
    ...
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
```

## Usage in Sagas

```javascript
// features/app/sagas/onAppStateChange.js

import { takeLatest, put } from 'redux-saga/effects';
import { constants as appStateConstants } from 'appStateFeature';
import { actions as networkInfoActions } from 'mobile-rn-network-info';

function* _onAppStateChange({ appState }) {
  console.log(`----saga app._onAppStateChange appState=${appState} saga----`);

  if (appState === 'active') {
    // When application resumed, request network info module to update its connected state
    yield put(networkInfoActions.updateRequest());
  }
}

export function* watchOnAppStateChange() {
  yield takeLatest(appStateConstants.ON_APP_STATE_CHANGE, _onAppStateChange);
}
```
