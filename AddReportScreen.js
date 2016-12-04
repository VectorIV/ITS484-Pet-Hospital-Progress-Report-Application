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

import DialogBox from 'react-native-dialogbox';
import { SegmentedControls } from 'react-native-radio-buttons';
import moment from 'moment';

import * as firebase from 'firebase';

export default class AddReportScreen extends Component {
      
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
            
            //repID: 0,
            repType: 'Email',
            repSymptom: '',
            repDiagnosis: '',
            repTreatment: '',
            repRemark: '',
            repDate: '',
            repTime: '',
            repOrder: '',
        };
    }
    
    
    // -------------------------
    // Methods Section
    // -------------------------
    
    pinData(){        
        this.dialogbox.confirm({
            content: 'Are you sure that you would like to send this report?',
            ok: {
                text: 'Confirm',
                callback: () => {
                    let currentDate = moment(new Date()).format('DD/MM/YYYY');
                    let currentTime = moment(new Date()).format('HH:mm:ss')
                    let keyID = this.petObject.push().getKey();
                    this.petObject = this.database.ref(this.props.userID+'/pet_data/'+this.props.objectID+'/rep_data/'+keyID);
                    this.petObject.set({
                        objectID: keyID,
                        
                        //repID: this.state.repID,
                        repSymptom: this.state.repSymptom,
                        repDiagnosis: this.state.repDiagnosis,
                        repTreatment: this.state.repTreatment,
                        repRemark: this.state.repRemark,
                        repType: this.state.repType,
                        repDate: currentDate,
                        repTime: currentTime,
                        repOrder: currentDate+'-'+currentTime,
                        });
                   this.props.navigator.pop();
                }
            },
            cancel: {text: 'Cancel'}
        });

    }
    
    renderContactInfo(state){
        if((state == 'SMS')){
            return (
                       <View style={{flex: 4}}><TextInput style={styles.input}
                       keyboardType='numeric' editable={false}
                       value={this.props.tel}/></View>
                   );
        }
        return (
                   <View style={{flex: 4}}><TextInput style={styles.input}
                   keyboardType='default' editable={false}
                   value={this.props.email}/></View>
        );
    }
    
    // -------------------------
    // Ends Methods Section
    // -------------------------
    
    
    componentDidMount(){
        this.petObject = this.database.ref(this.props.userID+'/pet_data/'+this.props.objectID+'/rep_data/');
    }

    shouldComponentUpdate(nextProps,nextState){
        if(nextState.repType != this.state.petType){
            return true;
        }
        return false;
    }

    
  render() {
    return (
        <View style={styles.rootBackgroundColor}>
            <View style={{flex: 1, margin: 10, marginBottom: 60}}>
                <View style={styles.content_box}>
                    <View style={{flex: 1}}><Text style={styles.title}>HN:</Text></View>
                    <View style={{flex: 4}}><TextInput style={styles.input} editable={false}
                    keyboardType='numeric' value={this.props.petID}/></View>
                    <View style={{flex: 1, marginLeft: 10}}><Text style={styles.title}>{this.state.repType=='Email'? 'Email:':'Tel:'}</Text></View>
                    {this.renderContactInfo(this.state.repType)}
                </View>
                
                <View style={styles.content_box}>
                    <View style={styles.content_box_title}><Text style={styles.title}>Type:</Text></View>
                    <View style={{flex: 4,height: 35}}>
                        <SegmentedControls
                          tint = {'red'}
                          options = {['Email','SMS']}
                          onSelection = {(repType) => this.setState({repType})}
                          selectedOption = {this.state.repType}
                          allowFontScaling = {true}
                          optionContainerStyle={{borderRadius: 10}}/>
                    </View>
                     <View style={{flex: 3}}/>
                </View>
                
                <View style={styles.content_seperator}/>
                
                <View style={styles.content_box}>
                  <View style={{flex: 2}}><Text style={styles.title}>* Symptom:</Text></View>
                  <View style={{flex: 6}}><TextInput style={styles.input}
                    keyboardType='default'
                    onChangeText={(repSymptom) => this.setState({repSymptom})}/>
                  </View>
                </View>
                
                <View style={styles.content_box}>
                  <View style={{flex: 3}}><Text style={styles.title}>* Diagnosis Disease:</Text></View>
                  <View style={{flex: 5}}><TextInput style={styles.input}
                    keyboardType='default'
                    onChangeText={(repDiagnosis) => this.setState({repDiagnosis})}/>
                  </View>
                </View>
            
                <View style={styles.content_box}>
                  <View style={{flex: 2}}><Text style={styles.title}>* Treatment:</Text></View>
                  <View style={{flex: 6}}><TextInput style={styles.input}
                    keyboardType='default'
                    onChangeText={(repTreatment) => this.setState({repTreatment})}/>
                  </View>
                </View>
                
                <View style={styles.content_box}>
                  <View style={{flex: 1}}><Text style={styles.title}>Remark:</Text></View>
                  <View style={{flex: 5}}><TextInput style={styles.input}
                    keyboardType='default'
                    onChangeText={(repRemark) => this.setState({repRemark})}/>
                  </View>
                </View>
                    
                <View style={styles.footer}> 
                    <TouchableOpacity style={styles.button}
                      onPress={() => {this.pinData()}}>
                      <Text style={styles.buttonText}>SEND</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}
                      onPress={() => this.props.navigator.pop()}>
                      <Text style={styles.buttonText}>CANCEL</Text>
                    </TouchableOpacity>
                </View> 
            </View>
        <DialogBox ref={(dialogbox) => { this.dialogbox = dialogbox }}/>
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
