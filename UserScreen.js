/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ListView,
  Image
} from 'react-native';

export default class UserScreen extends Component {
      
    // Used for styling the navigator
    static navigatorStyle = {
      navBarButtonColor: '#ffffff',
      navBarTextColor: '#ffffff',
      navBarBackgroundColor: '#ff0000',
      navBarHideOnScroll: true,
    };

  render() {
    return (
        <View style={{flex: 1, margin: 5, marginBottom: 45}}>
            <View style={{flex: 4}}>
                <View style={styles.content}>
                    <View style={styles.content_label}><Text style={styles.content_text}>User Name:</Text></View>
                    <View style={styles.content_input}><View style={{flex: 1}}><TextInput style={styles.textInput} placeholder={'e.g. john_smith'} placeholderTextColor={placeholder_color} editable={false}/></View></View>
                </View>
                <View style={styles.content}>
                    <View style={styles.content_label}><Text style={styles.content_text}>Password:</Text></View>
                    <View style={styles.content_input}>
                        <View style={{flex: 9}}><TextInput style={styles.textInput} placeholder={'e.g. %j0hnsm1th#'} placeholderTextColor={placeholder_color} editable={false} secureTextEntry={true}/></View>
                        <View style={{flex: 1}}><TouchableOpacity style={styles.password_button_disabled} disabled={true}><Text style={styles.password_button_text_disabled}>*</Text></TouchableOpacity></View>
                    </View>
                </View>
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
                <TouchableOpacity style={styles.content_button}><Text style={styles.content_button_text}>Edit</Text></TouchableOpacity>
            </View>
            <View style={styles.content_seperator}/>
            <View style={{flex: 9}}>
                <View style={styles.content}>
                    <View style={styles.content_label}><Text style={styles.content_text}>First Name:</Text></View>
                    <View style={styles.content_input}><View style={{flex: 1}}><TextInput style={styles.textInput} placeholder={'e.g. John'} placeholderTextColor={placeholder_color} editable={false}/></View></View>
                </View>
                <View style={styles.content}>
                    <View style={styles.content_label}><Text style={styles.content_text}>Last Name:</Text></View>
                    <View style={styles.content_input}><View style={{flex: 1}}><TextInput style={styles.textInput} placeholder={'e.g. Smith'} placeholderTextColor={placeholder_color} editable={false}/></View></View>
                </View>
                <View style={styles.content}>
                    <View style={styles.content_label}><Text style={styles.content_text}>Telephone:</Text></View>
                    <View style={styles.content_input}>
                        <View style={{flex: 2}}><TextInput style={styles.textInput} placeholder={'012'} placeholderTextColor={placeholder_color} editable={false}/></View>
                        <View style={{flex: 1}}><Text style={styles.content_text}>    - </Text></View>
                        <View style={{flex: 2}}><TextInput style={styles.textInput} placeholder={'345'} placeholderTextColor={placeholder_color} editable={false}/></View>
                        <View style={{flex: 1}}><Text style={styles.content_text}>    - </Text></View>
                        <View style={{flex: 3}}><TextInput style={styles.textInput} placeholder={'6789'} placeholderTextColor={placeholder_color}  editable={false}/></View>
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={styles.content_label}><Text style={styles.content_text}>Email:</Text></View>
                    <View style={styles.content_input}><View style={{flex: 1}}><TextInput style={styles.textInput} placeholder={'e.g. example@gmail.com'} placeholderTextColor={placeholder_color} editable={false}/></View></View>
                </View>
            </View>
            <View style={{flex: 2, flexDirection: 'row'}}>
                <TouchableOpacity style={styles.content_button}><Text style={styles.content_button_text}>Edit</Text></TouchableOpacity>
            </View>
            <View style={styles.content_seperator}/>
            <View style={{flex: 6}}>
            </View>
        </View>
    );
  }
}

const placeholder_color = '#BBB';

const styles = StyleSheet.create({
  textInput:{
    marginTop: 1,
    marginBottom: 1,
    fontSize: 12,
    textAlign: 'center',
  },
  textInput:{
    marginTop: 1,
    marginBottom: 1,
    fontSize: 12,
    textAlign: 'center',
  },
  content_text:{
    marginTop: 1,
    marginBottom: 3,
    fontSize: 12,
  },
  content:{
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
  },
  content_label:{
      flex: 3,
  },
  content_input:{
      flex: 9,
      flexDirection: 'row',
      alignItems: 'center',
  },
  content_button:{
    marginVertical: 4,
    backgroundColor: 'lightgray',
    borderWidth: 2,
    borderColor: '#F5FCFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100, height: 25,
  },
  content_button_text:{
    marginTop: 1,
    marginBottom: 3,
    fontSize: 12,
  },
  content_seperator:{
    height:1,
    marginVertical: 5,
    backgroundColor: 'lightgray',
  },
  password_button:{
    margin: 2,
    backgroundColor: 'lightgray',
    borderWidth: 2,
    borderColor: '#F5FCFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 25, height: 25,
  },
  password_button_disabled:{
    margin: 2,
    backgroundColor: '#EEE',
    borderWidth: 2,
    borderColor: '#F5FCFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 25, height: 25,
  },
  password_button_text:{
    color: '#AAA'
  },
  password_button_text_disabled:{
    color: '#CCC'
  },
});
