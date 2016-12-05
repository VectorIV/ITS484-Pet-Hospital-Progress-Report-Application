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
  AsyncStorage,
} from 'react-native';

import * as firebase from 'firebase';

export default class UserScreen extends Component {

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
            user: '',
            tel: '',
            firstName: '',
            lastName: '',
            email: '',
            
            securePass: true,
            isUserEditable: false,
            isInfoEditable: false,
        };
        
    }
  
    // -------------------------
    // Methods Section
    // -------------------------
    
    // Listening for data change, and return data whenever there is change
    listeningDataSourceDB(){
        
        // Add any new children to the list
        this.userObject.once('value', (snapshot) => {
            if (snapshot.val()? true:false){
                let array = snapshot.val();
                this.setState({
                    user: array.user,
                    tel: array.tel,
                    firstName: array.firstName,
                    lastName: array.lastName,
                    email: array.email,
                });
            }
        });
        
    }
    
    pinInfo(){
        this.userObject.set({
            user: this.state.user,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            tel: this.state.tel,
            email: this.state.email,
            }).then().catch((err) => { alert(err); })
        this.setState({isInfoEditable: false});
    }
    
    pinAccount(){
        firebase.auth().currentUser.updatePassword(this.state.password).then().catch((err) => { alert(err); });
        AsyncStorage.setItem('@vus:vup',this.state.password); 
        this.userObject.set({
            user: this.state.user,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            tel: this.state.tel,
            email: this.state.email,
            }).then().catch((err) => { alert(err); })
        this.setState({isUserEditable: false});
    }
    
    // -------------------------
    // Ends Methods Section
    // -------------------------
    
    
    // -------------------------
    // Start Authentication Section
    // -------------------------

    login(){
      firebase.auth().signInWithEmailAndPassword(this.state.email,
         this.state.password).then((user) => {
         console.log("Login user successfully");
         this.userObject = this.database.ref(user.uid+'/user_data');
         this.listeningDataSourceDB();
      }).catch((err) => {
         alert(err);
     });
    }

    checkUser(){
      try {
         AsyncStorage.getItem('@vus:vue').then((email) => {
             AsyncStorage.getItem('@vus:vup').then((password) => {
                 if (email !== null && password !== null){
                     this.setState({email: email, password: password});
                     this.login();
                     console.log("Logged in");
                 }
                 else {
                    this.setState({userModalVisible: true});
                    // References to firebase
                    this.userObject = this.database.ref('TEMP');
                 }
         });});
      }
      catch (err) {
         this.setState({userModalVisible: true});
         // References to firebase
         this.userObject = this.database.ref('TEMP');
      }
      
    }

    signOut(){
       firebase.auth().signOut().then(res => {
         console.log('You have been signed out');
         
         AsyncStorage.removeItem('@vus:vue');
         AsyncStorage.removeItem('@vus:vup'); 
         
       }).catch(err => console.log(err));
    }

    // -------------------------
    // End Authentication Section
    // -------------------------
    
    componentDidMount(){
        this.checkUser();
    }

  render() {
      
    let signOutButton = (
        <TouchableOpacity style={styles.content_button} onPress={() => 
            {this.signOut(); this.props.navigator.push({screen: 'main.WelcomeModal', title: ''});}
         }>
          <Text style={[styles.content_button_text]}>LOGOUT</Text>
        </TouchableOpacity>
      )

    return (
        <View style={styles.rootBackgroundColor}>
            <View style={{flex: 1, margin: 5, marginBottom: 45}}>
                <View style={{flex: 4}}>
                    <View style={styles.content}>
                        <View style={styles.content_label}><Text style={styles.content_text}>User Name:</Text></View>
                        <View style={styles.content_input}><View style={{flex: 1}}><TextInput style={styles.textInput} placeholder={'e.g. john_smith'}
                        placeholderTextColor={placeholder_color} editable={this.state.isUserEditable} defaultValue ={this.state.user? this.state.user:''}
                        onChangeText={(text) => this.setState({user:text})}/></View></View>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.content_label}><Text style={styles.content_text}>Password:</Text></View>
                        <View style={styles.content_input}>
                            <View style={{flex: 9}}>
                                <TextInput style={styles.textInput} placeholder={'e.g. %j0hnsm1th#'} placeholderTextColor={placeholder_color}
                                editable={this.state.isUserEditable} secureTextEntry={this.state.securePass} defaultValue ={this.state.password}
                                onChangeText={(text) => this.setState({password:text})}/>
                            </View>
                            <View style={{flex: 1}}>
                                <TouchableOpacity style={this.state.isUserEditable? styles.password_button:styles.password_button_disabled}
                                disabled={!this.state.isUserEditable} onPress={() => {this.setState({securePass: this.state.securePass? false:true})}}>
                                    <Text style={this.state.isUserEditable? styles.password_button_text:styles.password_button_text_disabled}>*</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{flex: 2, flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.content_button} onPress={() => {this.state.isUserEditable? this.pinAccount():this.setState({isUserEditable: true})}}>
                        <Text style={styles.content_button_text}>{this.state.isUserEditable? 'SAVE':'EDIT'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.content_seperator}/>
                <View style={{flex: 9}}>
                    <View style={styles.content}>
                        <View style={styles.content_label}><Text style={styles.content_text}>First Name:</Text></View>
                        <View style={styles.content_input}><View style={{flex: 1}}><TextInput style={styles.textInput} placeholder={'e.g. John'}
                        placeholderTextColor={placeholder_color} editable={this.state.isInfoEditable} defaultValue ={this.state.firstName? this.state.firstName:''}
                        onChangeText={(text) => this.setState({firstName:text})}/></View></View>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.content_label}><Text style={styles.content_text}>Last Name:</Text></View>
                        <View style={styles.content_input}><View style={{flex: 1}}><TextInput style={styles.textInput} placeholder={'e.g. Smith'}
                        placeholderTextColor={placeholder_color} editable={this.state.isInfoEditable} defaultValue ={this.state.lastName? this.state.lastName:''}
                        onChangeText={(text) => this.setState({lastName:text})}/></View></View>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.content_label}><Text style={styles.content_text}>Telephone:</Text></View>
                        <View style={styles.content_input}><View style={{flex: 1}}>
                            <TextInput style={styles.textInput} placeholder={'0123456789'} placeholderTextColor={placeholder_color}
                            editable={this.state.isInfoEditable} defaultValue ={this.state.tel? this.state.tel:''}
                        onChangeText={(text) => this.setState({tel:text})}/></View>
                        </View>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.content_label}><Text style={styles.content_text}>Contact Email:</Text></View>
                        <View style={styles.content_input}><View style={{flex: 1}}><TextInput style={styles.textInput} placeholder={'e.g. example@gmail.com'}
                        placeholderTextColor={placeholder_color} editable={this.state.isInfoEditable} defaultValue ={this.state.email? this.state.email:''}
                        onChangeText={(text) => this.setState({email:text})}/></View></View>
                    </View>
                </View>
                <View style={{flex: 2, flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.content_button} onPress={() => {this.state.isInfoEditable? this.pinInfo():this.setState({isInfoEditable: true})}}>
                        <Text style={styles.content_button_text}>{this.state.isInfoEditable? 'SAVE':'EDIT'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.content_seperator}/>
                <View style={{flex: 6}}>
                    {signOutButton}
                </View>
            </View>
        </View>
    );
  }
}

const placeholder_color = '#BBB';

const styles = StyleSheet.create({
  rootBackgroundColor:{
    flex: 1,
    backgroundColor: 'white'
  },
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
    margin: 10,
    borderWidth: 1,    
    width: 80,
    height: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'red',
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
    backgroundColor: '#F5FCFF',
    borderWidth: 1,
    borderColor: 'red',
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
