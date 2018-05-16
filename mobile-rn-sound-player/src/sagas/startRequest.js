import { takeEvery, call, select, take, race, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as constants from '../constants';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { helpers, logging, fs, publicUtils as utils } from '../utils';

import Sound from 'react-native-sound';

// Creates channel for update progress (state.currentTime)
function _createProgressChannel(sound, componentOptions) {
  return eventChannel(emitter => {
    const updateFrequency = helpers.getField(componentOptions, 'updateFrequency', constants.DEFAULT_UPDATE_MS);
    const interval = setInterval(() => sound.getCurrentTime(seconds => emitter(seconds)), updateFrequency);
    return () => { clearTimeout(interval); };
  });
}

// Creates start channel
// these timeouts are a hacky workaround for some issues with react-native-sound.
// see https://github.com/zmxv/react-native-sound/issues/89.
function _createLoadSoundChannel(uri, basePath = '') {
  return eventChannel(emitter => {
    const timeout = setTimeout(() => { const sound = new Sound(uri, basePath, (error) => emitter(sound) ); }, 100);
    return () => { clearTimeout(timeout); };
  });
}

// Creates play channel
function _createPlaybackChannel(sound) {
  return eventChannel(emitter => {
      const timeout = setTimeout(() => {
        try { // on success emitted at the end of playback, on failure emitted immediately
          sound.play((success) => { emitter(success); });
          emitter(true);
        }
        catch (err) {
          emitter(false);
        }
      }, 100);
    return () => { clearTimeout(timeout); };
  });
}

// Creates channel for auto-reset
// for short sound files, success is not invoked, so we verify that playback is stopped
function _createAutoResetChannel(sound, options) {
  return eventChannel(emitter => {
    const repeat = options.repeat === constants.INFINITE_LOOP ? 0 : options.repeat;
    const autoResetTime = repeat ? sound.getDuration() * 1000 * repeat + 500 : 0;
    const timeout = setTimeout(() => { emitter(timeout); }, autoResetTime);
    return () => { clearTimeout(timeout); };
  });
}

// Verifies current State before playback starts, returns true if State is OK, false otherwise
function* _verifyState(action) {
  const verify = [ yield select(selectors.isMounted),                  // Component should be mounted
                   helpers.isDefined(action.source.uri)                // Uri should be specified
                 ];
  const index = verify.indexOf(false);
  if (index < 0) {
    return true;
  }
  // Verification failed
  const errors = [ { code: constants.ERROR_NOT_MOUNTED, message: 'Component is not initialized' },
                   { code: constants.ERROR_SOURCE_URI, message: 'Sound uri is not specified' }
                 ];
  yield put(actions.onError(helpers.buildError(errors[index].code, new Error(errors[index].message))));

  return false;
}

/**
 * Starts playback
 * @param source.uri sound file name or http url (required)
 * @param source.basePath path (if 'uri' is a file; may contain special path PATH_(...))
 * @param options.paused initial paused state (by default isPaused = false)
 * @param options.repeat repetition counter (-1 for infinite loop, 1 by default)
 * @param options.pos initial position in secs (0.0 by default)
 * @param options.volume initial volume (0.0 - 1.0, 1.0 by default)
 */
function* _startRequest(action) {

  if ((yield select(selectors.getLogLevel)) > 0) {
    logging.log({action});
  }

  if (!(yield call(_verifyState, action))) {
    return;
  }

  yield put(actions.resetRequest());

  let { uri, basePath } = action.source;

  basePath = fs.parsePath(basePath);  // parse special chars in path

  const info = { ...constants.defaultInfo, uri, basePath };
  const { options } = action;
  let errCode = constants.ERROR_PLAYBACK;

  yield put(actions.setState({ isPlaying: true, isPaused: false, currentTime: 0.0, error: '', info }));

  try {
    const loadChannel = yield call(_createLoadSoundChannel, uri, basePath); // load sound
    const sound = yield take(loadChannel);
    const duration = sound.getDuration();
    loadChannel.close();

    if (duration === -1) {
      errCode = constants.ERROR_SOURCE_URI;
      throw new Error('Cannot load sound from ' + utils.getSourceUri(info));
    }

    const state = yield select(selectors.getState);
    const componentOptions = state.options;

    state.info.duration = duration;
    state.info.size = (yield fs.awaitGetFileStats(fs.buildPath(basePath, uri))).size; // -1 for http source
    state.sound = sound;

    yield put(actions.setState(state));

    yield put(actions.setVolumeRequest(options.volume));

    if (options.paused === true) {
      yield put(actions.pauseRequest(true));
    }

    if (options.repeat > 1) {
      sound.setNumberOfLoops(options.repeat - 1);
    }

    if (options.pos > 0.0) {
      yield put(actions.setPosRequest(options.pos));
    }

    const channels = [
      yield call(_createPlaybackChannel, sound),
      yield call(_createProgressChannel, sound, componentOptions),
      yield call(_createAutoResetChannel, sound, options)
    ];

    if (!(yield take(channels[0]))) { // start playback
      errCode = constants.ERROR_SOURCE_URI;
      throw new Error('Cannot start playback of ' + utils.getSourceUri(info));
    }

    let started = false, isPaused = options.paused, updateCurrentTime = true;

    while (true) {

      let [ stopped, paused, played, currentTime, reset ] = yield race([
            take(constants.STOP_REQUEST),
            take(constants.PAUSE_REQUEST),
            take(channels[0]),
            take(channels[1]),
            take(channels[2])
      ]);

      if (stopped !== undefined) {
        break;
      }

      if (currentTime !== undefined) {
        if (currentTime === 0 && started) {
          currentTime = duration;
        }
        started = true;
        if (updateCurrentTime) {
          yield put(actions.setCurrentTime(currentTime));
          if (isPaused) {
            updateCurrentTime = false;
          }
        }
      }
      else if (played !== undefined) {
        if (played) {
          yield put(actions.setCurrentTime(duration));
        }
        yield put(actions.stopRequest());
        break;
      }
      else if ((reset !== undefined) && (options.loops !== constants.INFINITE_LOOP)) {
        yield put(actions.resetRequest());
        break;
      }
      else if (paused) {
        isPaused = (yield select(selectors.getState)).isPaused;
        if (!isPaused) {
          updateCurrentTime = true;
        }
      }
    }

    channels.forEach(channel => channel.close());
  }
  catch (err) {
    yield put(actions.onError(helpers.buildError(errCode, err, { uri, basePath })));
    yield put(actions.resetRequest());
  }

}

export function* watchStartRequest() {
  yield takeEvery(constants.START_REQUEST, _startRequest);
}
