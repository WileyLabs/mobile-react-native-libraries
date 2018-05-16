import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isAndroid = Platform.OS === 'android'; // Device is Android
export const isIOS = Platform.OS === 'ios'; // Device is iOS
export const deviceWidth = Math.min(width, height); // Device screen width
export const deviceHeight = Math.max(width, height); // Device screen height
export const isSmallScreen = isIOS ? (deviceWidth <= 320) : (deviceWidth <= 360); // Device has small screen
export const isShortScreen = deviceHeight <= 600; // Device has short screen

export const monospaceFontFamily = isIOS ? 'Courier' : 'monospace'; // "Courier" font family on iOS and 'monospace" font family on Android

export const baselineDeviceWidth = 350; // iPhone 5 screen width
export const baselineDeviceHeight = 680; // iPhone 5 screen height

export default {
  isAndroid,
  isIOS,
  deviceWidth,
  deviceHeight,
  isSmallScreen,
  isShortScreen,
  monospaceFontFamily,
  baselineDeviceWidth,
  baselineDeviceHeight
};
