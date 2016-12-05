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
  Modal,
  Alert,
  AsyncStorage,
} from 'react-native';

  import * as firebase from 'firebase';
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDT6_4A73KNDr22Z2XR2aCje-KEnJPM6mw",
    authDomain: "vitality-pet-edition.firebaseapp.com",
    databaseURL: "https://vitality-pet-edition.firebaseio.com",
    storageBucket: "vitality-pet-edition.appspot.com",
    messagingSenderId: "866202889763"
  };
  firebase.initializeApp(config);
  
export default class ListViewScreen extends Component{
    
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
            
            isShowLogin: true,
            userModalVisible: false,
            userID: "Undefined",
            email: "",
            password: ""
        };
        
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
    }
  
  
    // -------------------------
    // Methods Section
    // -------------------------
    
    // For testing purpose only!
    initialiseDB(){
        this.petObject.set([
        {objectID:0,firstName:'Tom',lastName:'JustTom',address:"House",email:'justtom@mail.com',tel:'0898968996',petID:1,petName:'Jerry',petType:'Mouse',petGender:'Male',petDateIn:'11/11/2016',petTimeIn:'12:00:00',petActive:true},
        {objectID:1,firstName:'Tim',lastName:'Drake',address:"Wanye's Manor",email:'robin@mail.com',tel:'0891111111',petID:2,petName:'Boi',petType:'Rabbit',petGender:'Male',petDOB:'01/02/2016',petDateIn:'11/11/2016',petTimeIn:'12:00:00',petDateOut:'12/11/2016',petTimeOut:'13:11:56',petActive:true},
        {objectID:2,firstName:'John',lastName:'Smith',address:"Smith's",email:'smith@mail.com',tel:'0892222222',petID:3,petName:'Meat',petType:'Cat',petGender:'Male',petDOB:'01/03/2016',petActive:true},
        {objectID:3,firstName:'Bruce',lastName:'Wayne',address:"Wanye's Manor",email:'notbatman@mail.com',tel:'0893333333',petID:4,petName:'Dick',petType:'Bird',petGender:'Male',petDOB:'01/04/2016',petActive:false},
        {objectID:4,firstName:'Shaggy',lastName:'JustShaggy',address:"Scoopy's",email:'scoop@mail.com',tel:'0894444444',petID:5,petName:'Scoop',petType:'Dog',petGender:'Male',petDOB:'01/05/2016',petActive:true},
        {objectID:5,firstName:'Shade',lastName:'Blue',address:"Donut's",email:'donut@mail.com',tel:'0895555555',petID:6,petName:'Donut',petType:'Others',petOtherString:'Tiger',petGender:'Male',petDOB:'01/06/2016',petActive:false}
        ]);
    }
    
    dataSourceHandling(temp_array){
        this.setState({dataSource_array: temp_array || [],
        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertArraytoMap(temp_array || [])),
        loadingSource: 1});
    }
    
    // Listening for data change, and return data whenever there is change
    listeningDataSourceDB(){
        
        this.petObject = this.database.ref(this.state.userID+'/pet_data');
        let temp_array = [];
        this.dataSourceHandling(temp_array);

        // Add any new children to the list
        this.petObject.on('child_added', (snapshot, prevChildKey) => {
                temp_array = this.state.dataSource_array;
                if (snapshot.val().petActive){
                    temp_array.push(snapshot.val());
                }
                this.dataSourceHandling(temp_array);
        });
        
        // When a child is removed, refresh the list
        this.petObject.on('child_removed', (snapshot) => {
            let temp_array = [];
            this.petObject.orderByChild('firstName').once('value', (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.val().petActive){
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
                    if (childSnapshot.val().petActive){
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
        console.log(rowCount)
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
            return <View style={{flex: 10}}><ListView
                    dataSource={dataSource}
                    enableEmptySections={false}
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
                              
                              pageType: 1
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
    
    // -------------------------
    // End Methods Section
    // -------------------------
    
    
    // -------------------------
    // Start Authentication Section
    // -------------------------

    register(){
      firebase.auth().createUserWithEmailAndPassword(this.state.email,
         this.state.password).then((user) => {
         this.setState({isShowLogin: true, userModalVisible: false});
         
         this.setState({userID: user.uid});
         
         AsyncStorage.setItem('@vus:vue',this.state.email);
         AsyncStorage.setItem('@vus:vup',this.state.password);
         
         this.listeningDataSourceDB();
      }).catch((err) => {
         alert(err);
      })
    }

    login(){
      firebase.auth().signInWithEmailAndPassword(this.state.email,
         this.state.password).then((user) => {
         this.setState({isShowLogin: true, userModalVisible: false});
         console.log("Login user successfully");
         
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
    // End Authentication Section
    // -------------------------
    
    
    // -------------------------
    // Component Section
    // -------------------------
    
    componentDidMount(){
        this.checkUser();
    }
    // Known bug: when relogged in, the list won't update

    shouldComponentUpdate(nextProps, nextState){
         if ((nextState.dataSource == this.state.dataSource)
        && (nextState.modifiedDataSource == this.state.modifiedDataSource)
        && (nextState.isShowLogin == this.state.isShowLogin)
        && (nextState.userModalVisible == this.state.userModalVisible)
        && (nextState.loadingSource == this.state.loadingSource)){
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
        
    let authUIRegister = (
                <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity style={styles.modal_button} onPress={this.register}>
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
                    <TouchableOpacity style={styles.modal_button} onPress={this.login}>
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
        <View style={styles.rootBackgroundColor}>
            {/** Render the login modal */}
            {modalUI}
                    
            <View style={{marginTop: 5, marginBottom: 50, flex: 1, justifyContent: 'space-between'}}>
            
                {/** Render search bar */}
                <View style={{flexDirection: 'row', alignItems: 'center', flex:1}}>
                    <View style={{flex: 12}}>
                        <TextInput style={styles.textInput} onChangeText={(text) => {this.setState({searchKey: text}); this.searchDataSourceDB(text)}}
                         placeholder='Search' underlineColorAndroid='#ff0000'/>{/** Android exclusive */}
                    </View>
                    {/** Temporarily set flex:2 for testing*/}
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        {/** Temporary used for initialising starter data in firebase */}
                        <TouchableOpacity onPress={() => this.searchDataSourceDB(this.state.searchKey)}><Image style={{width:20,height:20}} source={require('./img/search.png')}/></TouchableOpacity>
                        {/**<TouchableOpacity onPress={() => this.initialiseDB()}><Image style={{width:20,height:20}} source={require('./img/test.png')}/></TouchableOpacity>*/}
                    </View>
                </View>
                {/** Render item list or empty message */}
                {this.sourceChecker()}
                <View style={{marginTop: 5, flex:2}}>
                    <TouchableOpacity onPress={()=> this.props.navigator.push({screen: 'main.AddScreen', title: 'Add Pet',
                    passProps: { userID: this.state.userID }})}>
                        <View style={styles.content_item_add}>
                            {/** Icon column */}
                            <View style={{flex:3,justifyContent:'center',alignItems:'center'}}>
                                <Image style={{width:40,height:40}} source={require('./img/plus.png')}/>
                            </View>
                            {/** Text column */}
                            <View style={{flex:10, padding: 10, justifyContent:'center'}}>
                              <Text>Add a new pet </Text>
                            </View>
                            {/** Arrow column */}
                            <View style={{flex:1, justifyContent:'center'}}>
                                 <Text></Text>
                            </View>
                         </View>
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
  content_button:{
    marginVertical: 4,
    backgroundColor: 'lightgray',
    borderWidth: 2,
    borderColor: '#F5FCFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 125, height: 35,
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
  },
  imageIcon:{
    width: 40,
    height: 40,
  },
  
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
