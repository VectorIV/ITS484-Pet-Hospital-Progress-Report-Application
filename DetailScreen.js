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

import DialogBox from 'react-native-dialogbox';

import * as firebase from 'firebase';

export default class DetailScreen extends Component {
      
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
         
        const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
       
        const modifiedDataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
            
        this.state = {
            loadingSource: 0,
            searchKey: '',
            sort: null,
            dataSource_array: [],
            dataSource: dataSource.cloneWithRowsAndSections({}),
            modifiedDataSource: modifiedDataSource.cloneWithRowsAndSections({}),
            
            isShowLogin: true,
            userModalVisible: false,
            userID: "Undefined",
            email: "",
            password: ""
        };
        
    }
    
    
    // -------------------------
    // Methods Section
    // -------------------------
    
    dataSourceHandling(temp_array){
        console.log(temp_array);
        this.setState({dataSource_array: temp_array || [],
        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertArraytoMap(temp_array || [])),
        loadingSource: 1});
    }
    
    // Listening for data change, and return data whenever there is change
    listeningDataSourceDB(){
        let temp_array = [];
        this.dataSourceHandling(temp_array);

        // Add any new children to the list
        this.petObject.on('child_added', (snapshot, prevChildKey) => {
                temp_array = this.state.dataSource_array;
                temp_array.push(snapshot.val());
                this.dataSourceHandling(temp_array);
        });
        
        // When a child is removed, refresh the list
        this.petObject.on('child_removed', (snapshot) => {
            let temp_array = [];
            this.petObject.orderByChild('repOrder').once('value', (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                temp_array.push(childSnapshot.val());
                });
                this.dataSourceHandling(temp_array);
            });
                
        });
        
        // When a child is modified, refresh the list
        this.petObject.on('child_changed', (snapshot) => {
            let temp_array = [];
            this.petObject.orderByChild('repOrder').once('value', (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                temp_array.push(childSnapshot.val());
                });
                this.dataSourceHandling(temp_array);
            });
                
        });
        
    }
    
    // Magically convert array into map
    convertArraytoMap(array){
        let map = {};
        array.forEach((item) => {
            let index = item.repDate;
            if (!map[index]){
                map[index] = [];
            }
            map[index].push(item);
        });
        return  map;
    }
    
    // Determine whether the page is empty or not, and display the proper components
    sourceChecker() {
        let dataSource = this.state.dataSource;
        
        let rowCount = dataSource.getRowCount();
        console.log(rowCount)
        // Display the message below
        if (this.state.loadingSource == 0){
            return <View style={styles.content_message_box}><Text>Fetching data{"\n"}{"\n"}</Text>
            <Image style={{width:30,height:30}} source={require('./img/ajax-loader.gif')}/>
            <Text>{"\n"}Please wait ...</Text></View>
        }
        else if (rowCount == 0) {
            return <View style={styles.content_message_box}><Text>Your list is empty right now. Try adding a new report!</Text></View>
        }
        // Display ListView of data
        else {
            return <View style={{flex: 10}}><ListView
                    dataSource={dataSource}
                    enableEmptySections={true}
                    renderRow={(rowData) =>
                          <TouchableOpacity onPress={()=> this.props.navigator.push({screen: 'main.ReportScreen', title: 'Report Details',
                          passProps:{
                              repSymptom: rowData.repSymptom,
                              repDiagnosis: rowData.repDiagnosis,
                              repTreatment: rowData.repTreatment,
                              repRemark: rowData.repRemark,
                              repType: rowData.repType,
                              repTime: rowData.repTime,
                              repDate: rowData.repDate,
                              }})}>
                          <View style={styles.content_item}>
                              {/** Text column */}
                              <View style={{flex:10, paddingHorizontal: 10}}>
                                <Text style={{fontSize: 12}}>Symptom: {rowData.repSymptom}</Text>
                                <Text style={{fontSize: 12}}>Date: {rowData.repDate} Time: {rowData.repTime}</Text>
                              </View>
                              {/** Arrow column */}
                              <View style={{flex:1, justifyContent:'center'}}>
                                <Text>></Text>
                              </View>
                          </View>
                        </TouchableOpacity>
                    }
                    renderSectionHeader={(sectionData,sectionID) => 
                        <View style={styles.content_tab}>
                        {/** Section name. Divide the rows based on first character of user's name */}
                        <View style={styles.content_tab_button}>
                        <Text style={styles.content_tab_text}> • {sectionID} </Text>
                        {/** <Text style={styles.content_tab_text}> Hide </Text> */}
                        </View>
                        </View>
                    }
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>
                      <View key={rowID} style={{height:1, backgroundColor: 'lightgray'}}/>
                    }
                    />
                
                </View>
                
        }
    }
    
    // Determine the pet icon
    iconSelector(type) {
        if (type == 'Dog'){
            return  <Image style={styles.imageIcon} source={require('./img/dog.png')}/>
        }
        else if (type == 'Cat'){
           return  <Image style={styles.imageIcon} source={require('./img/cat.png')}/>
        }
        else if (type == 'Rabbit'){
           return  <Image style={styles.imageIcon} source={require('./img/rabbit.png')}/>
        }
        else if (type == 'Bird'){
           return  <Image style={styles.imageIcon} source={require('./img/bird.png')}/>
        }
        else if (type == 'Mouse'){
           return  <Image style={styles.imageIcon} source={require('./img/mouse.png')}/>
        }
        else{
           return  <Image style={styles.imageIcon} source={require('./img/pet.png')}/>
        }
    }
    
    // Determine the exit
    exitDeterminer(date, time){
        if (date && time) {
            return <Text style={styles.content_text}>Discharge Date: {date} {time}</Text>
        }
    }
    
    unPinData(){
        this.dialogbox.confirm({
            content: 'Are you sure that you would like to delete this pet?',
            ok: {
                text: 'Confirm',
                callback: () => {
                    this.petObject = this.database.ref(this.props.userID+'/pet_data/'+this.props.objectID);
                    this.petObject.set(null);
                    this.props.navigator.pop();}
            },
            cancel: {text: 'Cancel'}
        });

    }
    
    deactivatePet(){
        this.dialogbox.confirm({
            content: 'Are you sure that you would like to archive this pet?',
            ok: {
                text: 'Confirm',
                callback: () => {
                    this.petObject = this.database.ref(this.props.userID+'/pet_data/'+this.props.objectID);
                    this.petObject.update({petActive: false});
                    this.props.navigator.pop();}
            },
            cancel: {text: 'Cancel'}
        });
    }
    
    renderArchiveButton(){
        return (
            <View>
                <TouchableOpacity style={styles.content_button} onPress={() => {this.deactivatePet();}}>
                    <Text style={styles.content_button_text}>ARCHIVE</Text>
                </TouchableOpacity>
            </View>
            );
    }
    
    // -------------------------
    // Ends Methods Section
    // -------------------------
    
    componentDidMount(){
        this.petObject = this.database.ref(this.props.userID+'/pet_data/'+this.props.objectID+'/rep_data')
        this.listeningDataSourceDB();
    }

  render() {
    return (
        <View style={styles.rootBackgroundColor}>
        <View style={{margin: 10, marginBottom: 90, flex: 1}}>
            <View style={{flex: 15, flexDirection: 'row'}}>
                <View style={{margin: 5, flex: 1, alignItems: 'center'}}>
                    {this.iconSelector(this.props.petType)}
                    <TouchableOpacity style={styles.content_button_disabled /*this.props.pageType? styles.content_button:styles.content_button_disabled*/} disabled={true /*!this.props.pageType*/}>
                        <Text style={[styles.content_button_text,this.props.pageType? {}:{color:'lightgrey'}]}>EDIT</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.content_button} onPress={() => {this.unPinData();}}>
                        <Text style={styles.content_button_text}>REMOVE</Text>
                    </TouchableOpacity>
                    {this.props.pageType? this.renderArchiveButton():null}
                </View>
                <View style={{margin:5, flex: 2, flexDirection: 'column'}}>
                    <View style={{flex: 2}}>
                        <Text style={styles.content_text}>HN: {this.props.petID}</Text>
                        <Text style={styles.content_text}>Admission Date: {this.props.petDateIn? this.props.petDateIn:' - / - / - '} {this.props.petTimeIn? this.props.petTimeIn:' - : - : - '}</Text>
                        {this.exitDeterminer(this.props.petDateOut, this.props.petTimeOut)}
                    </View>
                    <View style={{flex: 5}}>
                        <View style={styles.content_seperator}/>
                        <Text style={styles.content_text}>Pet Name: {this.props.petName || ' - '}</Text>
                        <Text style={styles.content_text}>Type: {this.props.petType} {this.props.petOtherString? ('('+this.props.petOtherString+')'):''}</Text>
                        <Text style={styles.content_text}>Gender: {this.props.petGender}</Text>
                        <Text style={styles.content_text}>Date of Birth: {this.props.petDOB? this.props.petDOB:' - '}</Text>
                    </View>
                    <View style={{flex: 7}}>
                        <View style={styles.content_seperator}/>
                        <View style={{flex: 1}}><Text style={styles.content_text}>First Name: {this.props.firstName}</Text></View>
                        <View style={{flex: 1}}><Text style={styles.content_text}>Last Name: {this.props.lastName}</Text></View>
                        <View style={{flex: 2}}><Text style={styles.content_text}>Address: {this.props.address? this.props.address:' - '}</Text></View>
                        <View style={{flex: 1}}><Text style={styles.content_text}>Telephone: {this.props.tel}</Text></View>
                        <View style={{flex: 1}}><Text style={styles.content_text}>Email: {this.props.email}</Text></View>
                    </View>
                </View>
            </View>
            <View style={{flex: 1}}><View style={styles.content_seperator}/></View>
            <View style={{flex: 9,justifyContent: 'space-between'}}>
                {this.sourceChecker()}
                <View style={{flex: 1, alignItems: 'center'}}><TouchableOpacity style={styles.content_button} onPress={() => this.props.navigator.push({screen: 'main.AddReportScreen', title: 'Add Report',
                passProps:{
                      objectID: this.props.objectID,
                      userID: this.props.userID,
                       
                      petID: this.props.petID,
                      email: this.props.email,
                      tel: this.props.tel,
                      }})}>
                    <Text style={styles.content_button_text}>CREATE</Text>
                </TouchableOpacity></View>
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
    height: 40,
  },
  content_message_box:{
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  content_text:{
    marginTop: 1,
    marginBottom: 3,
    fontSize: 12,
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
  content_button_disabled:{
    margin: 10,
    borderWidth: 1,    
    width: 80,
    height: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'lightgrey',
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
  imageIcon:{
    width: 100,
    height: 100,
  },

});
