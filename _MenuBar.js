import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';

export default class MenuBar extends Component {
  render() {

    return (
      <View style={styles.container}>
          <View style={styles.menu}>
              <TouchableOpacity style={styles.button}>
                <Image style={styles.button_image} source={require('./img/home.png')}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Image style={styles.button_image} source={require('./img/arc_inv.png')}/>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Image style={styles.button_image} source={require('./img/user_inv.png')}/>
              </TouchableOpacity>
          </View>
          <View style={styles.menu_line}>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menu:{
    flex:19,
    flexDirection: 'row',
    justifyContent:'flex-end',
    backgroundColor:'red'
  },
  menu_line:{
    flex:1,
    backgroundColor:'darkred'
  },
  button:{
    margin: 5,
    height: 40,
    justifyContent:'center',
  },
  button_image:{
    width: 40,
    height: 40,
    justifyContent:'center',
  }
});
