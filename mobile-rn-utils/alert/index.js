import { Alert } from 'react-native';

export function alert(title, message, okButtonTitle = 'OК') {
  return new Promise((resolve/*, reject*/) => {
    Alert.alert(title, message,
      [ { text: okButtonTitle, onPress: () => resolve() } ],
      { cancelable: false }
    );
  });
}

export function confirm(title, message, confirmButtonTitle = 'OК', cancelButtonTitle = 'Cancel') {
  return new Promise((resolve/*, reject*/) => {
    Alert.alert(title, message,
      [
        { text: cancelButtonTitle, onPress: () => resolve(false), style: 'cancel' },
        { text: confirmButtonTitle, onPress: () => resolve(true) }
      ],
      { cancelable: false }
    );
  });
}

export default {
  alert,
  confirm
};
