import * as constants from './constants';

// Public Action Creators for Sagas

/**
 * Initializes component (should be called first)
 * @param options reserved
 */
export const mountRequest = (options) => ({ type: constants.MOUNT_REQUEST, options });

/**
 * Shutdowns component
 */
export const unmountRequest = () => ({ type: constants.UNMOUNT_REQUEST });

/**
 * Starts playback
 * @param source.uri sound file name or http uri (required)
 * @param source.basePath file path (if applicable)
 * @param options.paused initial paused state (by default isPaused = false)
 * @param options.repeat repetition counter (-1 for infinite loop, 1 by default)
 * @param options.pos initial position in secs (0.0 y default)
 */
export const startRequest = (source, options = { paused: false, repeat: 1, pos : 0.0}) => ({
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
 *  @param paused true to set paused state, false to continue playback, undefined to revert current state
 */
export const pauseRequest = (paused) => ({ type: constants.PAUSE_REQUEST, paused });

/**
 * Sets position within file
 * @param pos position in secs (0 <= pos < duration)
 */
export const setPosRequest = (pos = 0.0) => ({ type: constants.SET_POS_REQUEST, pos });

// Exported Public Actions

export const publicActions = {
  mountRequest,         // initializes component
  unmountRequest,       // shutdowns component
  startRequest,         // starts recording
  stopRequest,          // stops recording
  pauseRequest,         // pauses/resumes playback
  setPosRequest         // sets playback position
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
