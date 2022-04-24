import {StyleSheet, SafeAreaView, ViewProps} from 'react-native';
import React from 'react';
import Theme from '../constants/Theme';

const ScreenLayout = (props: ViewProps) => {
  return (
    <SafeAreaView {...props} style={[props.style, styles.container]}>
      {props.children}
    </SafeAreaView>
  );
};

export default ScreenLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
});
