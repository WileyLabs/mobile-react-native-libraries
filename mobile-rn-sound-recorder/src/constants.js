import { Dictionary, fs } from './utils.js';

// Public Constants

export const NAME = 'soundRecorder';

export const PATH_BUNDLE = fs.PATH_BUNDLE;
export const PATH_DOCUMENT = fs.PATH_DOCUMENT;
export const PATH_DATA = fs.PATH_DATA;
export const PATH_TEMP = fs.PATH_TEMP;

// Public Notification Events

export const ON_ERROR             = 'soundRecorder/ON_ERROR';
export const ON_RECORDING_SAVED   = 'soundRecorder/ON_RECORDING_SAVED';

// Public Errors

export const ERROR_NO_ERROR         =  0;   // [private]
export const ERROR_NOT_PERMITTED    = -1;   // 'No recording permissions granted'
export const ERROR_NOT_MOUNTED      = -2;   // 'Component is not mounted'
export const ERROR_RECORDING        = -3;   // 'Internal recording error'
export const ERROR_ALREADY_RUNNING  = -4;   // 'Recording already running'
export const ERROR_FS               = -5;   // 'File system error'

// Exported Public Constants

export const publicConstants = {
  NAME,                   // component name
  PATH_BUNDLE,            // path to main bundle
  PATH_DOCUMENT,          // path to document folder
  PATH_DATA,              // path to data folder
  PATH_TEMP,              // path to temporary folder
  ON_ERROR,               // error notification
  ON_RECORDING_SAVED,     // recording file saved notification
  ERROR_NOT_PERMITTED,    // recording audio is not permitted for application
  ERROR_NOT_MOUNTED,      // component was not properly initialized (call mountRequest first)
  ERROR_RECORDING,        // generic recording error (e.g. format not supported and so on)
  ERROR_ALREADY_RUNNING,  // recording already running (on startRecording)
  ERROR_FS                // file system error
};

export default publicConstants;

// ******************************************************************
// Private Section

// Private Events

export const MOUNT_REQUEST        = 'soundRecorder/MOUNT_REQUEST';
export const UNMOUNT_REQUEST      = 'soundRecorder/UNMOUNT_REQUEST';
export const START_REQUEST        = 'soundRecorder/START_REQUEST';
export const STOP_REQUEST         = 'soundRecorder/STOP_REQUEST';
export const SAVE_AS_FILE_REQUEST = 'soundRecorder/SAVE_AS_FILE_REQUEST';

// Private Constants

export const LOG_LEVEL = 0;        // output debug information: 0 - no, 1, 2 - wordy logging

export const iosAudioSettings = {
  SampleRate: 22050,
  Channels: 1,
  AudioQuality: 'Low',
  AudioEncoding: 'caf',
  OutputFormat: 'mp3',
  AudioEncodingBitRate: 32000
};

export const androidAudioSettings = {
  SampleRate: 22050,
  Channels: 1,
  AudioQuality: 'Low',
  AudioEncoding: 'mp3',
  OutputFormat: 'mp3',
  AudioEncodingBitRate: 32000
};

export const dictionaryEnglish = new Dictionary(new Map([
  ['titleMicrophonePermission', 'Microphone Permission'],
  ['msgMicrophonePermission', 'Application needs access to your microphone so you can record audio']
]), 'eng');

export const dictionaryGerman = new Dictionary(new Map([
  ['titleMicrophonePermission', 'Mikrofon freischalten'],
  ['msgMicrophonePermission', 'App benötigt Zugriff auf Ihr Mikrofon, sodass Sie etwas aufnehmen können'],
]), 'ger');

// Private Constants for Reducer

export const SET_STATE = 'soundRecorder/SET_STATE';
export const SET_INFO = 'soundRecorder/SET_INFO';
export const SET_CURRENT_TIME = 'soundRecorder/SET_CURRENT_TIME';
