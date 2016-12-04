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
  Image,
  TextInput,
  AsyncStorage,
} from 'react-native';

import * as firebase from 'firebase';
  
export default class ArchiveScreen extends Component {
      
    // Used for styling the navigator
    static navigatorStyle = {
      navBarButtonColor: '#ffffff',
      navBarTextColor: '#ffffff',
      navBarBackgroundColor: '#ff0000',
      navBarHideOnScroll: true,
    };

    static navigatorButtons = {
      rightButtons: [
        {
          icon: require('./img/refresh_inv.png'), // for a textual button, provide the button title (label)
          id: 'refresh', // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
        },
      ]
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
            
            userID: "Undefined",
        };
        
    }
  
  
    // -------------------------
    // Methods Section
    // -------------------------
    
    dataSourceHandling(temp_array){
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
                if (!snapshot.val().petActive){
                    temp_array.push(snapshot.val());
                }
                this.dataSourceHandling(temp_array);
        });
        
        // When a child is removed, refresh the list
        this.petObject.on('child_removed', (snapshot) => {
            let temp_array = [];
            this.petObject.orderByChild('firstName').once('value', (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    if (!childSnapshot.val().petActive){
                        temp_array.push(childSnapshot.val());
                    }
                });
                this.dataSourceHandling(temp_array);
            });
                
        });
        
        // When a child is modified, refresh the list
        this.petObject.on('child_changed', (snapshot) => {
            let temp_array = [];
            this.petObject.orderByChild('firstName').once('value', (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    if (!childSnapshot.val().petActive){
                        temp_array.push(childSnapshot.val());
                    }
                });
                this.dataSourceHandling(temp_array);
            });
                
        });
        
    }
    
    // Filter engine. It filters firstName, lastName, petName and petID
    searchDataSourceDB(searchKey){
        let temp_array = [];
        this.state.dataSource_array.forEach((item) => {
            if (item.firstName.toLowerCase().indexOf(searchKey.toLowerCase()) != -1 ||
                 item.lastName.toLowerCase().indexOf(searchKey.toLowerCase()) != -1 ||
                 item.petName.toLowerCase().indexOf(searchKey.toLowerCase()) != -1  ||
                 JSON.stringify(item.petID).indexOf(searchKey) != -1){
                temp_array.push(item);
            }
        });
        this.setState({modifiedDataSource: this.state.modifiedDataSource.cloneWithRowsAndSections(this.convertArraytoMap(temp_array || []))});
        console.log(temp_array);
    }
    
    // Magically convert array into map
    convertArraytoMap(array){
        let map = {};
        array.forEach((item) => {
            let index = item.firstName.charAt(0);
            if (!map[index]){
                map[index] = [];
            }
            map[index].push(item);
        });
        return  map;
    }
    
    // Determine whether the page is empty or not, and display the proper components
    sourceChecker() {
        let dataSource = '';
        
        if (this.state.searchKey != ''){
            dataSource = this.state.modifiedDataSource;
            // console.log('Modified source displayed');
        }
        else {
            dataSource = this.state.dataSource;
            // console.log('Original source displayed');
        }
        
        let rowCount = dataSource.getRowCount();
        // Display the message below
        if (this.state.loadingSource == 0){
            return <View style={styles.content_message_box}><Text>Fetching data{"\n"}{"\n"}</Text>
            <Image style={{width:30,height:30}} source={require('./img/ajax-loader.gif')}/>
            <Text>{"\n"}Please wait ...</Text></View>
        }
        else if (rowCount == 0&& this.state.searchKey == '') {
            return <View style={styles.content_message_box}><Text>Your list is empty right now. Try adding a new pet!</Text></View>
        }
        else if(rowCount == 0 && this.state.searchKey != '') {
            return <View style={styles.content_message_box}><Text>No record has been found.</Text><Text>Try searching using different term!</Text></View>
        }
        // Display ListView of data
        else {
            return <View style={{flex: 12}}><ListView
                    dataSource={dataSource}
                    enableEmptySections={true}
                    renderRow={(rowData) =>
                          <TouchableOpacity onPress={()=> this.props.navigator.push({screen: 'main.DetailScreen', title: 'Pet Details',
                          passProps:{
                              objectID: rowData.objectID,
                              userID: this.state.userID,
                              
                              petID: rowData.petID,
                              petName: rowData.petName,
                              petType: rowData.petType,
                              petGender: rowData.petGender,
                              petDOB: rowData.petDOB,
                              petOtherString: rowData.petOtherString,
                              petDateIn: rowData.petDateIn,
                              petTimeIn: rowData.petTimeIn,
                              petDateOut: rowData.petDateOut,
                              petTimeOut: rowData.petTimeOut,
                              
                              firstName: rowData.firstName,
                              lastName: rowData.lastName,
                              email: rowData.email,
                              tel: rowData.tel,
                              address: rowData.address,
                              
                              pageType: 0
                              }})}>
                          <View style={styles.content_item}>
                              {/** Icon column */}
                              <View style={{flex:3,justifyContent:'center',alignItems:'center'}}>
                                  {this.iconSelector(rowData.petType)}
                              </View>
                              {/** Text column */}
                              <View style={{flex:10, paddingHorizontal: 10}}>
                                <Text style={{fontSize: 12}}>HN: {rowData.petID}</Text>
                                <Text style={{fontSize: 12}}>Owner name: {rowData.firstName} {rowData.lastName}</Text>
                                <Text style={{fontSize: 12}}>      Pet name: {rowData.petName}</Text>
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
                        <Text style={styles.content_tab_text}> • {sectionID.charAt(0)} </Text>
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
            return  <Image style={{width:40,height:40}} source={require('./img/dog.png')}/>
        }
        else if (type == 'Cat'){
           return  <Image style={{width:40,height:40}} source={require('./img/cat.png')}/>
        }
        else if (type == 'Rabbit'){
           return  <Image style={{width:40,height:40}} source={require('./img/rabbit.png')}/>
        }
        else if (type == 'Bird'){
           return  <Image style={{width:40,height:40}} source={require('./img/bird.png')}/>
        }
        else if (type == 'Mouse'){
           return  <Image style={{width:40,height:40}} source={require('./img/mouse.png')}/>
        }
        else{
           return  <Image style={{width:40,height:40}} source={require('./img/pet.png')}/>
        }
    }
    // -------------------------
    // End Methods Section
    // -------------------------
    
    login(){
      firebase.auth().signInWithEmailAndPassword(this.state.email,
         this.state.password).then((user) => {
         this.setState({isShowLogin: true, userModalVisible: false});
         console.log("Login user successfully");
         
         this.petObject = this.database.ref(user.uid+'/pet_data');
         this.setState({userID: user.uid});
         
         AsyncStorage.setItem('@vus:vue',this.state.email);
         AsyncStorage.setItem('@vus:vup',this.state.password);
         
         this.listeningDataSourceDB();
      }).catch((err) => {
         alert(err);
     })
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
                    this.petObject = this.database.ref('TEMP');
                 }
         });});
      }
      catch (err) {
         this.setState({userModalVisible: true});
         // References to firebase
         this.petObject = this.database.ref('TEMP');
      }
      
    }

    // -------------------------
    // Component Section
    // -------------------------
    componentDidMount(){
        this.checkUser();
    }

    shouldComponentUpdate(nextProps, nextState){
        if (nextState.dataSource == this.state.dataSource
        && nextState.modifiedDataSource == this.state.modifiedDataSource){
            return false;
        }
        return true;
    }
    // -------------------------
    // End Component Section
    // -------------------------
    

  onNavigatorEvent(event) { // this is the onPress handler for the two buttons together
    if (event.type == 'NavBarButtonPress') { // this is the event type for button presses
      if (event.id == 'refresh') { // this is the same id field from the static navigatorButtons definition
        this.setState({loadingSource: 0});
        this.listeningDataSourceDB();
      }
    }
  }
  
    
    // -------------------------
    // Render screen components
    // -------------------------
    render() {
    
    return (
        <View style={styles.rootBackgroundColor}>
            <View style={{marginTop: 5, marginBottom: 50, flex: 1, justifyContent: 'space-between'}}>
                {/** Render search bar */}
                <View style={{flexDirection: 'row', alignItems: 'center', flex:1}}>
                    <View style={{flex: 12}}>
                        <TextInput style={styles.textInput} onChangeText={(text) => {this.setState({searchKey: text}); this.searchDataSourceDB(this.state.searchKey)}}
                         placeholder='Search' underlineColorAndroid='#ff0000'/>{/** Android exclusive */}
                    </View>
                    {/** Temporarily set flex:2 for testing*/}
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {/** Temporary used for initialising starter data in firebase */}
                        <TouchableOpacity onPress={() => this.searchDataSourceDB(this.state.searchKey)}><Image style={{width:20,height:20}} source={require('./img/search.png')}/></TouchableOpacity>
                    </View>
                </View>
                {/** Render item list or empty message */}
                {this.sourceChecker()}
                
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
  textInput:{
    marginTop: 1,
    marginBottom: 1,
    fontSize: 12,
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
    height: 50,
  },
  content_item_add:{
    margin: 5,
    flexDirection: 'row',
    height: 50,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 5,
  },
  content_message_box:{
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
