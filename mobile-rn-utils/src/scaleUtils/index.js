import { PixelRatio } from 'react-native';
import { deviceWidth, deviceHeight, baselineDeviceWidth, baselineDeviceHeight } from '../constants';

const hScale = deviceWidth / baselineDeviceWidth;
const vScale = deviceHeight / baselineDeviceHeight;

export const scale = size /* : number */ => /* : number */ PixelRatio.roundToNearestPixel(size * hScale);

export const verticalScale = size /* : number */ => /* : number */ PixelRatio.roundToNearestPixel(size * vScale);

export const moderateScale = (size /* : number */ , factor /* : number */ = 0.5) => /* : number */ PixelRatio.roundToNearestPixel(size + (scale(size) - size) * factor);

export const widthFromPercentage = widthInPercent /* : string */ => /* : number */ PixelRatio.roundToNearestPixel(deviceWidth * parseFloat(widthInPercent) / 100);

export const heightFromPercentage = heightInPercent /* : string */ => /* : number */ PixelRatio.roundToNearestPixel(deviceHeight * parseFloat(heightInPercent) / 100);

export default {
  normalizeSize,
  scale,
  verticalScale,
  moderateScale,
  widthFromPercentage,
  heightFromPercentage
};
