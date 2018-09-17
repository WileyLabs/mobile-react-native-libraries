import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// This function takes a component...
export default function withSize(WrappedComponent) {
  // ...and returns another component...
  return class extends Component {

    static displayName = `WithSize(${getDisplayName(WrappedComponent)})`;

    state = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      onLayoutHandled: false
    };

    _handleLayout = event => {
      const { x, y, width, height } = event.nativeEvent.layout;
      this.setState({ x, y, width, height, onLayoutHandled: true });
    };

    render() {
      const { onLayoutHandled } = this.state;

      if (onLayoutHandled) {
        const { x, y, width, height } = this.state;
        return (
          <WrappedComponent {...this.props} x={x} y={y} width={width} height={height} />
        );
      }
      return (
        <View style={styles.container} onLayout={this._handleLayout} />
      );
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  }
});
