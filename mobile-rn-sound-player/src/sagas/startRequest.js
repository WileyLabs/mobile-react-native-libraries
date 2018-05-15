import { takeEvery, call, select, take, race, put } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import * as constants from '../constants';
import * as actions from '../actions';
import * as selectors from '../selectors';
import { helpers, logging, fs, publicUtils as utils } from '../utils';

import Sound from 'react-native-sound';

// Creates channel for listening AudioRecorder notification onProgress
function _createProgressChannel(sound) {
  return eventChannel(emitter => {
    const interval = setInterval(() => sound.getCurrentTime(seconds => emitter(seconds)), constants.CURRENT_TIME_UPDATE_MS);
    return () => { clearTimeout(interval); };
  });
}

// Creates start channel
// these timeouts are a hacky workaround for some issues with react-native-sound.
// see https://github.com/zmxv/react-native-sound/issues/89.
function _createLoadSoundChannel(url, basePath = '') {
  return eventChannel(emitter => {
    const timeout = setTimeout(() => { const sound = new Sound(url, basePath, (error) => emitter(sound) ); }, 100);
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

// Verifies current State before recording starts, returns true if State is OK, false otherwise
function* _verifyState(action) {
  const verify = [ yield select(selectors.isMounted),                  // Component should be mounted
                   helpers.isDefined(action.source.url)                // Url should be specified
                 ];
  const index = verify.indexOf(false);
  if (index < 0) {
    return true;
  }
  // Verification failed
  const errors = [ { code: constants.ERROR_NOT_MOUNTED, message: 'Component is not initialized' },
                   { code: constants.ERROR_SOURCE_URL, message: 'Source url is not specified' }
                 ];
  yield put(actions.onError(helpers.buildError(errors[index].code, new Error(errors[index].message))));

  return false;
}

// Starts request
function* _startRequest(action) {
  if (constants.DEBUG_OUTPUT) {
    logging.log({action});
  }

  if (!(yield call(_verifyState, action))) {
    return;
  }

  yield put(actions.resetRequest());

  let { url, basePath } = action.source;
  basePath = fs.parsePath(basePath);

  const info = { ...constants.defaultInfo, url, basePath };
  const { options } = action;
  let errCode = constants.ERROR_PLAYBACK;

  yield put(actions.setState({ isPlaying: true, isPaused: false, currentTime: 0.0, error: '', info }));

  try {
    const loadChannel = yield call(_createLoadSoundChannel, url, basePath); // load sound
    const sound = yield take(loadChannel);
    const duration = sound.getDuration();
    loadChannel.close();
    if (duration === -1) {
      errCode = constants.ERROR_SOURCE_URL;
      throw new Error('Cannot load sound from ' + utils.getSourceUrl(info));
    }

    const channels = [
      yield call(_createPlaybackChannel, sound),
      yield call(_createProgressChannel, sound),
      yield call(_createAutoResetChannel, sound, options)
    ];

    if (!(yield take(channels[0]))) { // start playback
      errCode = constants.ERROR_SOURCE_URL;
      throw new Error('Cannot start playback of ' + utils.getSourceUrl(info));
    }

    const state = yield select(selectors.getState);
    let started = false, isPaused = options.paused, updateCurrentTime = true;

    state.info.duration = duration;
    state.info.size = (yield fs.awaitGetFileStats(fs.buildPath(basePath, url))).size; // -1 for http source
    state.sound = sound;

    yield put(actions.setState(state));

    if (options.paused === true) {
      yield put(actions.pauseRequest(true));
    }

    if (options.repeat > 1) {
      sound.setNumberOfLoops(options.repeat - 1);
    }

    if (options.pos > 0.0) {
      yield put(actions.setPosRequest(options.pos));
    }

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
    yield put(actions.onError(helpers.buildError(errCode, err, { url, basePath })));
    yield put(actions.resetRequest());
  }

}

export function* watchStartRequest() {
  yield takeEvery(constants.START_REQUEST, _startRequest);
}
