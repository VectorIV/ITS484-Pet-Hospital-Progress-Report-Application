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
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

import * as firebase from 'firebase';

export default class AddScreen extends Component {
      
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
            objectID: 0,
            
            firstName: '',
            lastName: '',
            address: '',
            tel: '',
            email: '',
            
            petID: 0,
            petName: '',
            petType: 'Dog',
            petGender: 'Male',
            petDOB: moment(new Date()).format('DD/MM/YYYY'),
            petActive: true,
            petDateIn: '',
            petTimeIn: '',
            petOtherString: '',
        };
    }
    
    
    // -------------------------
    // Methods Section
    // -------------------------
    
    writeOther(state){
        if((state == 'Other')){
            return <View style={{flex: 6, flexDirection: 'row', alignItems: 'center'}}>
                       <View style={{flex: 1, marginLeft: 10}}><Text style={styles.title}>Specify:</Text></View>
                       <View style={{flex: 2}}><TextInput style={styles.input}
                       keyboardType='default'
                       onChangeText={(petOtherString) => this.setState({petOtherString})}/></View>
                   </View>
        }
        return <View style={{flex: 6}}/>
    }
    
    pinData(){
        let currentDate = moment(new Date()).format('DD/MM/YYYY');
        let currentTime = moment(new Date()).format('HH:mm:ss')
        let keyID = this.petObject.push().getKey();
        this.petObject = this.database.ref(this.props.userID+'/pet_data/'+keyID);
        this.petObject.set({
            objectID: keyID,
            
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            tel: this.state.tel,
            email: this.state.email,
            
            petID: this.state.petID,
            petName: this.state.petName,
            petType: this.state.petType,
            petGender: this.state.petGender,
            petDOB: this.state.petDOB,
            petOtherString: this.state.petOtherString,
            
            petActive: this.state.petActive,
            petDateIn: currentDate,
            petTimeIn: currentTime,
            });
    }
    
    // -------------------------
    // Ends Methods Section
    // -------------------------
    
    
    componentDidMount(){
        this.petObject = this.database.ref(this.props.userID+'/pet_data');
        
    }

    shouldComponentUpdate(nextProps,nextState){
        if(nextState.petType != this.state.petType
        || nextState.petGender != this.state.petGender
        || nextState.petDOB != this.state.petDOB){
            return true;
        }
        return false;
    }

  render() {
    return (
        <View style={styles.rootBackgroundColor}>
            <View style={{flex: 1, margin: 10, marginBottom: 60}}>
                <View style={styles.content_box}>
                    <View style={{flex: 1}}><Text style={styles.title}>* HN:</Text></View>
                    <View style={{flex: 4}}><TextInput style={styles.input}
                    keyboardType='numeric'
                    onChangeText={(petID) => this.setState({petID})}/></View>
                    <View style={{flex: 2, marginLeft: 15}}><Text style={styles.title}>Pet Name:</Text></View>
                    <View style={{flex: 4}}><TextInput style={styles.input}
                    keyboardType='default'
                    onChangeText={(petName) => this.setState({petName})}/></View>
                </View>
                
                <View style={styles.content_box}>
                    <View style={styles.content_box_title}><Text style={styles.title}>Type:</Text></View>
                    <View style={{flex: 8,height: 35}}>
                        <SegmentedControls
                          tint = {'red'}
                          options = {['Dog','Cat','Rabbit','Bird','Mouse','Other']}
                          onSelection = {(petType) => this.setState({petType})}
                          selectedOption = {this.state.petType}
                          allowFontScaling = {true}
                          optionContainerStyle={{borderRadius: 10}}/>
                    </View>
                </View>
                
                <View style={styles.content_box}>
                    <View style={styles.content_box_title}><Text style={styles.title}>Sex:</Text></View>
                    <View style={{flex: 6,height: 35}}>
                        <SegmentedControls
                          tint = {'red'}
                          options = {['Male','Female']}
                          onSelection = {(petGender) => this.setState({petGender})}
                          selectedOption = {this.state.petGender}
                          allowFontScaling={true}
                          optionContainerStyle={{borderRadius: 10}}/>
                    </View>
                    {this.writeOther(this.state.petType)}
                </View>
                
                <View style={styles.content_box}>
                  <View style={{flex: 1}}><Text style={styles.title }>Birthdate : </Text></View>
                    <View style={{flex: 4}}><DatePicker style={{width: 150}} date={this.state.petDOB} mode="date" showIcon={false}
                    placeholder="Select Date" format="DD/MM/YYYY" minDate="01-01-1900" maxDate={moment(new Date()).format("DD-MM-YYYY")} confirmBtnText="Confirm" cancelBtnText="Cancel"
                    customStyles={{
                      dateInput: {
                        borderColor: 'red',
                        borderRadius: 10
                      },
                      dateText: {
                        color: 'red'  
                      }
                    }}
                    onDateChange={(date) => {this.setState({petDOB: date})}}/>
                    </View>
                </View>
                
                <View style={styles.content_seperator}/>
                
                <View style={styles.content_box}>
                  <View style={{flex: 4}}><Text style={styles.title}>* First Name:</Text></View>
                  <View style={{flex: 5}}><TextInput style={styles.input}
                    keyboardType='default'
                    onChangeText={(firstName) => this.setState({firstName})}/>
                  </View>
                  <View style={{flex: 4}}><Text style={styles.title}>* Last Name:</Text></View>
                  <View style={{flex: 5}}><TextInput style={styles.input}
                    keyboardType='default'
                    onChangeText={(lastName) => this.setState({lastName})}/>
                  </View>
                </View>
            
                <View style={styles.content_box}>
                  <View style={{flex: 1}}><Text style={styles.title}>Address:</Text></View>
                  <View style={{flex: 5}}><TextInput style={styles.input}
                    keyboardType='default'
                    onChangeText={(address) => this.setState({address})}/>
                  </View>
                </View>
                
                <View style={styles.content_box}>
                  <View style={{flex: 1}}><Text style={styles.title}>* Email:</Text></View>
                  <View style={{flex: 3}}>
                      <TextInput style={styles.input}
                        keyboardType='email-address'
                        maxLength={30}
                        onChangeText={(email) => this.setState({email})}/>
                  </View>
                  <View style={{flex: 1}}><Text style={styles.title}>* Tel:</Text></View>
                  <View style={{flex: 2}}>
                  <TextInput style={styles.input}
                    keyboardType='numeric'
                    onChangeText={(tel) => this.setState({tel})}/>
                  </View>
                </View>
                    
                <View style={styles.footer}> 
                    <TouchableOpacity style={styles.button}
                      onPress={() => {this.pinData(); this.props.navigator.pop();}}>
                      <Text style={styles.buttonText}>SAVE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}
                      onPress={() => this.props.navigator.pop()}>
                      <Text style={styles.buttonText}>CANCEL</Text>
                    </TouchableOpacity>
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
