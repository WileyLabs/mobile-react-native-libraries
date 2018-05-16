# mobile-rn-sound-player

Redux/Saga wrapper for react-native-sound component.

Version 0.0.5

## Module Public Interfaces

### Constants

```
import { constants as soundPlayerConstants } from 'mobile-rn-sound-player'

General:

  NAME                    - component name (for reducer)

Pre-defined pathes

  PATH_BUNDLE             - main bundle path
  PATH_DOCUMENT           - document path
  PATH_DATA               - path for data (inter-session) files 
  PATH_TEMP               - path for temporary (session) files

Notification actions:

  ON_ERROR                - action invoked on processing error

Error codes:

  ERROR_NOT_MOUNTED       - component was not properly initialized
  ERROR_SOURCE_URI        - Sound source is either not specified or not accessible 
                            (details: { uri, basePath})
  ERROR_PLAYBACK          - generic playback error

```

### Action Creators

```
import { actions as soundPlayerActions } from 'mobile-rn-sound-player'
 
Init/Shut

/**
 * Initializes component (should be called first)
 * @param options.updateFrequency update period for current pos in ms
 * @param options.logLevel logging level (0 - no debug info, default; 1; 2 - wordy log)
 */
const mountRequest = (options) => ({ type: constants.MOUNT_REQUEST, options });

/**
 * Shutdowns component
 */
const unmountRequest = () => ({ type: constants.UNMOUNT_REQUEST });

Start/Stop/Pause/Set Position/Set Volume

/**
 * Starts playback
 * @param source.uri sound file name or http url (required)
 * @param source.basePath path (if 'uri' is a file, may contain special path PATH_(...))
 * @param options.paused initial paused state (by default isPaused = false)
 * @param options.repeat repetition counter (-1 for infinite loop, 1 by default)
 * @param options.pos initial position in secs (0.0 by default)
 * @param options.volume initial volume (0.0 - 1.0, 1.0 by default)
 */
const startRequest = (source, options = { paused: false, repeat: 1, pos : 0.0, 
                                          volume: { mute: false, level: 1.0 }}) => ({
  type: constants.START_REQUEST,
  source,
  options
});

/**
 * Stops playback
 * @param success false if stopped by error, true otherwise (true by default)
 */
const stopRequest = (success = true) => ({ type: constants.STOP_REQUEST, success });

/**
 * Pauses/Resumes playback
 * @param paused true to set paused state, false to continue playback, 
                 undefined to revert current state
 */
const pauseRequest = (paused) => ({ type: constants.PAUSE_REQUEST, paused });

/**
 * Sets position within file
 * @param pos position in secs (0 <= pos < duration)
 */
const setPosRequest = (pos = 0.0) => ({ type: constants.SET_POS_REQUEST, pos });

/**
 * Sets volume
 * @param volume volume descriptor
 */
const setVolumeRequest = (volume = { mute: false, level: 1.0} ) => ({ 
  type: constants.SET_VOLUME_REQUEST, 
  volume
});
 
```

### Selectors
```
import { selectors as soundPlayerSelectors } from 'mobile-rn-sound-player'

soundPlayerSelectors.isMounted()        - true if component is ready for recording (mounted)
soundPlayerSelectors.isPlaying()        - true if playback is in progress (between start & stop requests)
soundPlayerSelectors.isPaused()         - true if playback is paused (isPlaying is 'true')
soundPlayerSelectors.getCurrentTime()   - current time in secs [Real Number]
soundPlayerSelectors.getInfo()          - descriptor of the last loaded sound *
soundPlayerSelectors.getDuration()      - duration in secs of the last loaded sound
soundPlayerSelectors.getVolume()        - volume descriptor, e.g. { mute: false, level: 1.0 }
soundPlayerSelectors.getError()         - last error descriptor **

// * Info object:

  const defaultInfo = {
    uri: '',                    // file uri
    basePath: '',               // base path (if applicable)
    size: 0.0,                  // file size in bytes, -1 for http source
    duration: 0.0               // sound duration in secs (if available)
  };

// ** Error object:

  const error = { 
    errCode: 0,                 // error code, one of soundPlayerConstants.ERROR_(...) constants
    details: {                  // arbitrary additional information
      error: new Error(message) // default Error object with optional message
      ...                       // additional error-specific data
    } 
  };

```

## Getting started

### Step 1. Install mobile-rn-sound-player

```
$ npm install mobile-rn-sound-player --save
# or with yarn
$ yarn add mobile-rn-sound-player
```

### Step 2. Install react-native-sound

If you have already installed [react-native-sound](https://github.com/zmxv/react-native-sound) as a dependency for your project you can skip this step. Otherwise please follow instructions provided here https://github.com/zmxv/react-native-sound.

## Project Integration (2 steps)

### Step 1. Add sound player's reducer to the root reducer
```javascript
// rootReducer.js

import { combineReducers } from 'redux';
import { reducer as soundPlayerReducer, 
         constants as soundPlayerConstants } from 'mobile-rn-sound-player';

const rootReducer = combineReducers({
  ...
   [soundPlayerConstants.NAME]: soundPlayerReducer,
  ...
});

export default rootReducer;
```

### Step 2. Initialize & run sound player's saga
```javascript
// rootSaga.js

import { all, call } from 'redux-saga/effects';
import { saga as soundPlayerSaga } from 'mobile-rn-sound-player';

export default function* rootSaga() {
  yield all([
    ...
    call(soundPlayerSaga),
    ...
  ]);
}
```

## Usage in React Native components

### Step 1. Screen
```javascript
// components/VoicePlayer/VoicePlayerContainer.js

import VoicePlayer from './VoicePlayer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectors as soundPlayerSelectors, 
         actions as soundPlayerActions } from 'mobile-rn-sound-player';

function mapStateToProps(state) {
  return {
    isPlaying: soundPlayerSelectors.isPlaying(state),
    isPaused: soundPlayerSelectors.isPaused(state),
    currentTime: soundPlayerSelectors.getCurrentTime(state),
    ...
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    mountRequest: soundPlayerActions.mountRequest,
    unmountRequest: soundPlayerActions.unmountRequest,
    startRequest: soundPlayerActions.startRequest,
    stopRequest: soundPlayerActions.stopRequest,
    pauseRequest: soundPlayerActions.pauseRequest,
    ...
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(VoicePlayer);
```

```javascript
// components/VoicePlayer/VoicePlayer.js

import { constants as soundPlayerConstants } from 'mobile-rn-sound-player';

class VoicePlayer extends Component {

  static propTypes = {
    ...
    isPlaying: PropTypes.bool,
    isPaused: PropTypes.bool,
    currentTime: PropTypes.number,
    mountRequest: PropTypes.func.isRequired,
    unmountRequest: PropTypes.func.isRequired,
    startRequest: PropTypes.func.isRequired,
    stopRequest: PropTypes.func.isRequired,
    pauseRequest: PropTypes.func.isRequired,
    ...
  };

  static defaultProps = {
    ...
    isPlaying: false,
    isPaused: false,
    currentTime: 0.0
  };

  componentDidMount() {
    const options = { updateFrequency: 150, logLevel: 1 }; // optional, if differs from defaults
    this.props.mountRequest(options);
  }

  componentWillUnmount() {
    this.props.unmountRequest();
  }

  ...

  handleStart = () => {
    const source = {
      uri: fileName,                                // file name (or url)
      basePath: soundPlayerConstants.PATH_DOCUMENT  // base path (required for files, n/a for urls)
    };
    const options = {                               // optional, if differs from defaults
      volume: { level: 0.5 }                        // set volume level 0.5, mute = false
    }
    this.props.startRequest(source, options);
  }

  handleStop = () => {
    this.props.stopRequest();
  }

  handlePause = () => {
    this.props.pauseRequest();
  }

  render() {
    ...
  }
}
...

export default VoicePlayer;
```

### Step 2. Saga
```javascript
// saga/onSoundPlayer.js

import { Alert } from 'react-native';
import { takeLatest, call, select, put, all } from 'redux-saga/effects';
import { constants as soundPlayerConstants } from 'mobile-rn-sound-player';

function* _onSoundError(action) {
  try {
    const { errCode, details } = action.error;
    switch (errCode) {
      case soundPlayerConstants.ERROR_SOURCE_URI:
        Alert.alert('Attention',
                    `Sound source is either not found or not accessible (${details.uri})`,
                    [{text: 'OK'}], { cancelable: false });
        break;
    }
  }
  catch (err) {
  }
}

export function* watchOnSoundError() {
  yield takeLatest(soundPlayerConstants.ON_ERROR, _onSoundError);
}

export function* watchOnSoundPlayer() {
  yield all([
    call(watchOnSoundError)
  ]);
}
```
