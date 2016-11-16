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

    constructor(props) {
        super(props);
        this.database = firebase.database();
        
        const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
       
        const modifiedDataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
            
        // References to firebase
        this.petObject = this.database.ref('Pet');
        
        this.state = {
            loadingSource: 0,
            searchKey: '',
            sort: null,
            dataSource_array: [],
            dataSource: dataSource.cloneWithRowsAndSections({}),
            modifiedDataSource: modifiedDataSource.cloneWithRowsAndSections({})
        };
        
    }
  
  
    // -------------------------
    // Methods Section
    // -------------------------
    
    // Listening for data change, and return data whenever there is change
    listeningDataSourceDB(){
        
        let temp_array = [];
        this.petObject.orderByChild('firstName').on('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                if (!childSnapshot.val().petActive){
                    temp_array.push(childSnapshot.val());
                }
            });
        this.setState({dataSource_array: temp_array || [],
        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertArraytoMap(temp_array || [])),
        loadingSource: 1});
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
                          <TouchableOpacity onPress={()=> this.props.navigator.push({screen: 'main.DetailScreen', title: 'Detail Screen: '+rowData.petName, passProps:{petPointer: rowData.petPointer}})}>
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
    
    
    // -------------------------
    // Component Section
    // -------------------------
    componentDidMount(){
        this.listeningDataSourceDB();
        //this.setState({loadingSource: 0});
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
    
    
    // -------------------------
    // Render screen components
    // -------------------------
    render() {
/*     if (this.state.searchKey && this.state.searchKey.length>0){
    } */
    
    return (
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
    );
  }
}

const styles = StyleSheet.create({
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
