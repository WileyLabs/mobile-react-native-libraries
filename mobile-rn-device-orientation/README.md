
# mobile-rn-device-orientation

A helper module to manage your device orientation state in Redux.

## Getting started

### Step 1. Install mobile-rn-device-orientation

`$ npm install mobile-rn-device-orientation --save`
or
`$ yarn add mobile-rn-device-orientation`

### Step 2. Install react-native-orientation

If you have already installed react-native-orientation as a dependency for your project you can skip this step. Otherwise run the following command:

`$ npm install react-native-orientation --save`
or
`$ yarn add react-native-orientation`

and then
`$ react-native link react-native-orientation`

## Initialization (3 steps)

```javascript
// rootReducer.js
import { combineReducers } from 'redux';
import { reducer as deviceOrientationReducer, constants as deviceOrientationConstants } from 'mobile-rn-device-orientation';

const rootReducer = combineReducers({
  ...
   // Register deviceOrientationReducer
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
   // Register deviceOrientationSaga
    call(deviceOrientationSaga),
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
  // Initialize device orientation module
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
    landscape: deviceOrientationSelectors.isLandscape(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
```
