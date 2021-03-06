import { fs } from './utils/fs';

// Public Constants

export const NAME = 'mobile-rn-sound-player';

export const PATH_BUNDLE = fs.PATH_BUNDLE;
export const PATH_DOCUMENT = fs.PATH_DOCUMENT;
export const PATH_DATA = fs.PATH_DATA;
export const PATH_TEMP = fs.PATH_TEMP;

export const INFINITE_LOOP = -1;

// Public Notification Events
const buildName = (name) => NAME + '/' + name;

export const ON_ERROR           = buildName('ON_ERROR');

// Public Errors
export const ERROR_NO_ERROR           =  0;   // [private]
export const ERROR_NOT_MOUNTED        = -1;   // Component not mounted
export const ERROR_SOURCE_URI         = -2;   // Sound source (uri and/or basePath) is either not specified or not accessible
export const ERROR_PLAYBACK           = -3;   // Playback error

// Exported Public Constants
export const publicConstants = {
  NAME,
  PATH_BUNDLE,              // path to main bundle
  PATH_DOCUMENT,            // path to document folder
  PATH_DATA,                // path to data folder
  PATH_TEMP,                // path to temporary folder
  ON_ERROR,                 // error notification
  ERROR_NOT_MOUNTED,        // component was not properly initialized (call mountRequest first)
  ERROR_SOURCE_URI,         // cannot find sound source (details: { uri, basePath})
  ERROR_PLAYBACK            // generic playback error
};

export default publicConstants;

// ******************************************************************
// Private Section

// Private Events
export const MOUNT_REQUEST      = buildName('MOUNT_REQUEST');
export const UNMOUNT_REQUEST    = buildName('UNMOUNT_REQUEST');
export const START_REQUEST      = buildName('START_REQUEST');
export const STOP_REQUEST       = buildName('STOP_REQUEST');
export const PAUSE_REQUEST      = buildName('PAUSE_REQUEST');
export const RESET_REQUEST      = buildName('RESET_REQUEST');
export const SET_POS_REQUEST    = buildName('SET_POS_REQUEST');
export const SET_VOLUME_REQUEST = buildName('SET_VOLUME_REQUEST');

// Private Constants
export const LOG_LEVEL = 0;                 // output debug information: 0 - no, 1, 2 - wordy
export const DEFAULT_UPDATE_MS = 250;       // ms period of requesting current time

// Private Constants for Reducer
export const SET_STATE          = buildName('SET_STATE');
export const SET_INFO           = buildName('SET_INFO');
export const SET_CURRENT_TIME   = buildName('SET_CURRENT_TIME');
export const SET_VOLUME         = buildName('SET_VOLUME');

export const defaultInfo = {
  uri: '',                    // file uri
  basePath: '',               // base path (if applicable)
  size: 0.0,                  // file size in bytes
  duration: 0.0               // sound duration in secs
};
