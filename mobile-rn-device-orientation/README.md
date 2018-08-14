# mobile-rn-device-orientation

A helper module to manage your device orientation state in Redux.

Version 0.0.4, 2018/08/14

## Module Public Interfaces

### Constants

```javascript
import { constants as deviceOrientationConstants } from 'mobile-rn-device-orientation'

// deviceOrientationConstants.NAME - this constant will be used later in app root reducer and module selectors
```

### Action Creators

```javascript
import { actions as deviceOrientationActions,
         constants as deviceOrientationConstants } from 'mobile-rn-device-orientation'

// const options = { lockOrientation: deviceOrientationConstants.mode.PORTRAIT, silent: false };
// options.lockOrientation - immediate call of lockOrientation with provided orientation (default: undefined)
// options.lockSpecificOrientation - immediate call of lockSpecificOrientation with provided specific orientation  (default: undefined)
// options.silent - if false debug information will be added to console log  (default: true)
// deviceOrientationActions.initRequest(options) - dispatch this action on app launch to initialize the module
```

### Selectors
```javascript
import { selectors as deviceOrientationSelectors } from 'mobile-rn-device-orientation'

// deviceOrientationSelectors.isLandscape() - returns true if your device is in landscape orientation; otherwise returns false;
// deviceOrientationSelectors.getDeviceOrientation() - depending on the current orientation, returns one of the following string values:
//   "LANDSCAPE"
//   "PORTRAIT"
//   "PORTRAITUPSIDEDOWN"
//    "UNKNOWN"
```

## Getting started

### Step 1. Install mobile-rn-device-orientation

```
$ npm install mobile-rn-device-orientation --save
# or with yarn
$ yarn add mobile-rn-device-orientation
```

### Step 2. Install react-native-orientation

If you have already installed [react-native-orientation](https://github.com/yamill/react-native-orientation) as a dependency for your project you can skip this step. Otherwise run the following command:

```
$ npm install react-native-orientation --save
# or with yarn
$ yarn add react-native-orientation

# link
$ react-native link react-native-orientation
```

## Initialization (3 steps)

```javascript
// rootReducer.js

import { combineReducers } from 'redux';
import { reducer as deviceOrientationReducer, constants as deviceOrientationConstants } from 'mobile-rn-device-orientation';

const rootReducer = combineReducers({
  ...
   // Step 1. Register deviceOrientationReducer
   [deviceOrientationConstants.NAME]: deviceOrientationReducer,
  ...
});

export default rootReducer;

// rootSaga.js

import { all, call } from 'redux-saga/effects';
import { saga as deviceOrientationSaga } from 'mobile-rn-device-orientation';

export default function* rootSaga() {
  yield all([
    ...
   //  Step 2. Register deviceOrientationSaga
    call(deviceOrientationSaga),
    ...
  ]);
}

OR

import deviceOrientation from 'mobile-rn-device-orientation';

export default function* rootSaga() {
  yield all([
    ...
    call(deviceOrientation.saga),
    ...
  ]);
}

// features/app/sagas/initAppRequest.js

import { put, takeEvery } from 'redux-saga/effects';
import { INIT_APP_REQUEST } from '../constants';
import { actions as deviceOrientationActions } from 'mobile-rn-device-orientation';

function* _initAppRequest({ navigator }) {
  console.log('----saga app._initAppRequest saga-----');

  ...
  // Step 3. Initialize device orientation module
  yield put(deviceOrientationActions.initRequest());

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
import { selectors as deviceOrientationSelectors } from 'mobile-rn-device-orientation';

function mapStateToProps(state) {
  return {
    ...
    // isLandscape() selector returns true when your device is in LANDSCAPE mode; otherwise it will return false
    //
    landscape: deviceOrientationSelectors.isLandscape(state),
    //
    // deviceOrientation() selector returns one of the following string values "LANDSCAPE"|"PORTRAIT"|"PORTRAITUPSIDEDOWN"|"UNKNOWN"
    //
    deviceOrientation: deviceOrientationSelectors.getDeviceOrientation(state)
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
