import * as constants from './constants';

// Public Action Creators for Sagas

/**
 * Initializes component (should be called first)
 * @param options.updateFrequency update period for current pos in ms
 * @param options.logLevel logging level (0 - no debug info, default; 1; 2 - wordy log)
 */
export const mountRequest = (options) => ({ type: constants.MOUNT_REQUEST, options });

/**
 * Shutdowns component
 */
export const unmountRequest = () => ({ type: constants.UNMOUNT_REQUEST });

/**
 * Starts playback
 * @param source.uri sound file name or http url (required)
 * @param source.basePath path (if 'uri' is a file; may contain special path PATH_(...))
 * @param options.paused initial paused state (by default isPaused = false)
 * @param options.repeat repetition counter (-1 for infinite loop, 1 by default)
 * @param options.pos initial position in secs (0.0 by default)
 * @param options.volume initial volume (0.0 - 1.0, 1.0 by default)
 */
export const startRequest = (source, options = { paused: false, repeat: 1, pos : 0.0, volume: { mute: false, level: 1.0 }}) => ({
  type: constants.START_REQUEST,
  source,
  options
});

/**
 * Stops playback
 * @param success false if stopped by error, true otherwise (true by default)
 */
export const stopRequest = (success = true) => ({ type: constants.STOP_REQUEST, success });

/**
 * Pauses/Resumes playback
 * @param paused true to set paused state, false to continue playback, undefined to revert current state
 */
export const pauseRequest = (paused) => ({ type: constants.PAUSE_REQUEST, paused });

/**
 * Sets position within sound
 * @param pos position in secs (0 <= pos < duration)
 */
export const setPosRequest = (pos = 0.0) => ({ type: constants.SET_POS_REQUEST, pos });

/**
 * Sets volume
 * @param volume volume descriptor
 */
export const setVolumeRequest = (volume = { mute: false, level: 1.0} ) => ({ type: constants.SET_VOLUME_REQUEST, volume });

// Exported Public Actions

export const publicActions = {
  mountRequest,         // initializes component
  unmountRequest,       // shutdowns component
  startRequest,         // starts recording
  stopRequest,          // stops recording
  pauseRequest,         // pauses/resumes playback
  setPosRequest,        // sets playback position
  setVolumeRequest      // sets volume
};

export default publicActions;

// ******************************************************************
// Private Section

// Private Action Creators for Notification

export const onError = (error) => ({ type: constants.ON_ERROR, error });
export const resetRequest = () => ({ type: constants.RESET_REQUEST });

// Private Action Creators for Reducer

export const setState = params => ({ type: constants.SET_STATE, params });
export const setInfo = info => ({ type: constants.SET_INFO, info });
export const setCurrentTime = currentTime => ({ type: constants.SET_CURRENT_TIME, currentTime });
export const setVolume = volume => ({ type: constants.SET_VOLUME, volume });
