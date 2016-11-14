/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListView,
  Image
} from 'react-native';

export default class UserScreen extends Component {
      
  render() {
    return (
        <View></View>
    );
  }
}

const styles = StyleSheet.create({
  content_tab:{
    backgroundColor: 'lightgray',
    borderWidth: 2,
    borderColor: '#F5FCFF',
    borderRadius: 5,
  },
  content_tab_button:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  content_tab_text:{
    marginTop: 1,
    marginBottom: 3,
    fontSize: 12,
  },
  content_item:{
    flexDirection: 'row',
    height: 50,
  }
});
