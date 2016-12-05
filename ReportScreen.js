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
  Image,
} from 'react-native';

import { SegmentedControls } from 'react-native-radio-buttons';

import * as firebase from 'firebase';

export default class ReportScreen extends Component {
      
    // Used for styling the navigator
    static navigatorStyle = {
      navBarButtonColor: '#ffffff',
      navBarTextColor: '#ffffff',
      navBarBackgroundColor: '#ff0000',
      navBarHideOnScroll: true,
    };
    
    constructor(props) {
        super(props);
        this.database = firebase.database();
    }

  render() {
    return (
        <View style={styles.rootBackgroundColor}>
            <View style={{flex: 1, margin: 10, marginBottom: 60}}>
                <View style={styles.content_box}>
                    <View style={{flex: 1}}><Text style={styles.title}>Date:</Text></View>
                    <View style={{flex: 4}}><TextInput style={styles.input} editable={false}
                    keyboardType='numeric' value={this.props.repDate}/></View>
                    <View style={{flex: 1}}><Text style={styles.title}>Time:</Text></View>
                    <View style={{flex: 4}}><TextInput style={styles.input} editable={false}
                    keyboardType='numeric' value={this.props.repTime}/></View>
                </View>
                
                <View style={styles.content_box}>
                    <View style={styles.content_box_title}><Text style={styles.title}>Type:</Text></View>
                    <View style={{flex: 4,height: 35}}>
                        <SegmentedControls
                          tint = {'red'}
                          options = {['Email','SMS']}
                          enabled = {false}
                          selectedOption = {this.props.repType}
                          allowFontScaling = {true}
                          optionContainerStyle={{borderRadius: 10}}/>
                     </View>
                     <View style={{flex: 3}}/>
                </View>
                <View style={styles.content_seperator}/>
                
                <View style={styles.content_box}>
                  <View style={{flex: 2}}><Text style={styles.title}>* Symptom:</Text></View>
                  <View style={{flex: 6}}><TextInput style={styles.input}
                    keyboardType='default' editable={false} value={this.props.repSymptom}/>
                  </View>
                </View>
                
                <View style={styles.content_box}>
                  <View style={{flex: 3}}><Text style={styles.title}>* Diagnosis Disease:</Text></View>
                  <View style={{flex: 5}}><TextInput style={styles.input}
                    keyboardType='default' editable={false} value={this.props.repDiagnosis}/>
                  </View>
                </View>
            
                <View style={styles.content_box}>
                  <View style={{flex: 2}}><Text style={styles.title}>* Treatment:</Text></View>
                  <View style={{flex: 6}}><TextInput style={styles.input}
                    keyboardType='default' editable={false} value={this.props.repTreatment}/>
                  </View>
                </View>
                
                <View style={styles.content_box}>
                  <View style={{flex: 1}}><Text style={styles.title}>Remark:</Text></View>
                  <View style={{flex: 5}}><TextInput style={styles.input}
                    keyboardType='default' editable={false} value={this.props.repRemark}/>
                  </View>
                </View>
                    
                <View style={styles.footer}> 
                </View> 
            </View>
        </View>
    );
  }
}


const styles = StyleSheet.create({
  rootBackgroundColor:{
    flex: 1,
    backgroundColor: 'white'
  },
  footer: {
    flex:1, 
    flexDirection:'row',
    flexWrap:'wrap', 
    justifyContent: 'center',
  },  
  content_box: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  content_box_title: {
    flex: 1,
    marginRight: 5
  },
  content_seperator:{
    height:1,
    marginVertical: 5,
    backgroundColor: 'lightgray',
  },
  
  button: {
    margin: 10,
    borderWidth: 1,    
    width: 60,
    height: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'red',
  },
  buttonText: {
    fontSize: 12
  },
  input: {
    fontSize: 12,
    height: 40
   },
  title: {
    fontSize: 12,
  },
  picker: {
      height: 25, width: 150
  }
});
