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
  Modal,
  TextInput,
  Image,
  Alert,
  AsyncStorage,
} from 'react-native';

import * as firebase from 'firebase';
  
export default class WelcomeModal extends Component {
      
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
        
        this.state = {
            isShowLogin: true,
            userModalVisible: true,
            userID: "Undefined",
            email: "",
            password: ""
        };
        
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }
  
    // -------------------------
    // Start Authentication Section
    // -------------------------

    register(){
      firebase.auth().createUserWithEmailAndPassword(this.state.email,
         this.state.password).then((user) => {
         this.setState({isShowLogin: true, userModalVisible: false});
         
         AsyncStorage.setItem('@vus:vue',this.state.email);
         AsyncStorage.setItem('@vus:vup',this.state.password);
         
      }).catch((err) => {
         alert(err);
      })
    }

    login(){
      firebase.auth().signInWithEmailAndPassword(this.state.email,
         this.state.password).then((user) => {
         this.setState({isShowLogin: true, userModalVisible: false});
         console.log("Login user successfully");
         
         AsyncStorage.setItem('@vus:vue',this.state.email);
         AsyncStorage.setItem('@vus:vup',this.state.password);
         
      }).catch((err) => {
         alert(err);
     })
    }

    // -------------------------
    // End Authentication Section
    // -------------------------
    
  render() {
        
    let authUIRegister = (
                <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity style={styles.modal_button} onPress={() => {this.register(); this.props.navigator.pop(); this.props.navigator.switchToTab({tabIndex: 0});}}>
                            <Text style={styles.modal_button_text}>Register</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modal_button}
                        onPress={() => this.setState({isShowLogin: true})}>
                                <Text style={styles.modal_button_text}>Already have an account?</Text>
                        </TouchableOpacity>
                   </View>
        );
        
    let authUILogin = (
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.modal_button} onPress={() => {this.login(); this.props.navigator.pop(); this.props.navigator.switchToTab({tabIndex: 0});}}>
                        <Text style={styles.modal_button_text}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modal_button}
                    onPress={() => this.setState({isShowLogin: false})}>
                        <Text style={styles.modal_button_text}>Don't have any account?</Text>
                    </TouchableOpacity>
               </View>
        );
    
    let authUI = (
          <View>
            <Text style={styles.modal_title}>Welcome!</Text>
                <View style={styles.modal_content}>
                    <View style={{flex: 1}}><Text style={styles.modal_text}>E-mail: </Text></View>
                    <View style={styles.modal_input_box}><TextInput keyboardType="email-address" autoCapitalize="none"
                          style={styles.textInput}
                          onChangeText={(text) => this.setState({email: text})}></TextInput></View>
                </View>
                <View style={styles.modal_content}>
                    <View style={{flex: 1}}><Text style={styles.modal_text}>Password: </Text></View>
                    <View style={styles.modal_input_box}><TextInput secureTextEntry={true} style={styles.textInput}
                      onChangeText={(text) => {this.setState({password: text}); console.log(text);}}></TextInput></View>
                </View>
                <View style={styles.modal_content}>
                    {this.state.isShowLogin? authUILogin:authUIRegister}
                </View>
          </View>
        );

    let modalUI = (
            <Modal animationType={"fade"} transparent={false} visible={this.state.userModalVisible}>
                  <View style={styles.modal}>
                    <View style={styles.modal_box}>
                        <View style={{justifyContent: 'center', alignItems: 'center'}}>
                            <Image style={{width:80,height:80}} source={require('./img/icon_inv.png')}/>
                        </View>
                        {authUI}
                    </View>
                  </View>
            </Modal>
            );
            
    return (
        <View style={{flex: 1, backgroundColor: 'red'}}>
        {/** Render the login modal */}
        {modalUI}
        </View>
    );
  }
}

const styles = StyleSheet.create({

  modal: {
    flex: 1,
    backgroundColor: 'red',
  },
  modal_box:{
    height: 250,
    marginVertical: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal_content:{
    flex: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modal_title:{
    marginTop: 10,
    marginBottom: 12,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#F5FCFF',
  },
  modal_input_box:{
    flex: 3,
    backgroundColor: '#F5FCFF',
    borderWidth: 2,
    borderColor: '#F5FCFF',
    borderRadius: 5,
    height: 40,
  },
  modal_text:{
    marginTop: 1,
    marginBottom: 3,
    fontSize: 12,
    color: '#F5FCFF',
  },
  modal_button:{
    margin: 4,
    backgroundColor: '#F5FCFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 125, height: 35,
  },
  modal_button_text:{
    marginTop: 1,
    marginBottom: 3,
    fontSize: 12,
    textAlign: 'center',
    color: 'black',
  },
});
