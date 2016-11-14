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

// Import Realm Database
import Realm from 'realm';

export default class ListViewScreen extends Component{
    
    // Used for styling the navigator
    static navigatorStyle = {
      navBarButtonColor: '#ffffff',
      navBarTextColor: '#ffffff',
      navBarBackgroundColor: '#ff0000',
      navBarHideOnScroll: true,
    };

    constructor(props) {
    super(props);
   
    const dataSource = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
   
    // Initialise the list. Used for testing only
    // *This should be empited in the release*
    const initialList = [
    {firstName:'Tom',lastName:'JustTom',petName:'Jerry',petType:'Dog'},{firstName:'Tim',lastName:'Drake',petName:'Boi',petType:'Cat'},
    {firstName:'John',lastName:'Smith',petName:'Meat',petType:'Cat'}
    ];
    
    this.state = {
    dataSource: dataSource.cloneWithRowsAndSections(this.convertArraytoMap(initialList)),
    };
   
  }
  
    convertArraytoMap(array){
    // Magically convert array into map
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
    
  sourceChecker(dataSource) {
  // Determine whether the page is empty or not, and display the proper components */}
     if(dataSource.getRowCount()==0){
         return <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}><Text>Your list is empty right now.</Text></View>
         
     }
     else {
         return <View><ListView
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
                              <View style={{flex:10, padding: 10}}>
                                <Text>{rowData.firstName} {rowData.lastName}</Text>
                                <Text>      Pet Name: {rowData.petName}</Text>
                              </View>
                              {/** Arrow column */}
                              <View style={{flex:1, justifyContent:'center'}}>
                                <Text>></Text>
                              </View>
                          </View>
                        </TouchableOpacity>
                    }
                    renderSectionHeader={(sectionData,firstName) => 
                        <View style={styles.content_tab}>
                        {/** Section name. Divide the rows based on first character of user's name */}
                        <View style={styles.content_tab_button}>
                        <Text style={styles.content_tab_text}> • {firstName.charAt(0)} </Text>
                        {/** <Text style={styles.content_tab_text}> Hide </Text> */}
                        </View>
                        </View>
                    }
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>
                      <View key={rowID} style={{height:1, backgroundColor: 'lightgray'}}/>
                    }
                  />
                  <View key='end-list' style={{height:1, backgroundColor: 'lightgray'}}/>
                  </View>
                
     }
  }
  
  iconSelector(type) {
  // Determine the pet icon
     if (type == 'Dog'){
         return  <Image style={{width:40,height:40}} source={require('./img/dog.png')}/>
     }
     else if (type == 'Cat'){
         return  <Image style={{width:40,height:40}} source={require('./img/cat.png')}/>
     }
  }
  
  render() {
      // Define Realm schema
      let realm = new Realm({
      schema: [
        {
          name: 'Owner',
          properties: {
            firstName: 'string',
            lastName: 'string',
            tel: 'integer',
            email: 'string',
            petObject: {type: 'list', objectType: 'Pet'}
          }
        },
        {
          name: 'Vet',
          properties: {
            firstName: 'string',
            lastName: 'string',
            tel: 'integer',
            email: 'string',
          }
        },
        {
          name: 'Pet',
          properties: {
              petName: 'string',
              petType: 'string',
              petTypeExtra: {type: 'string', optional: true},
              petSex: 'string',
              petDOB: 'string',
              petActive: 'boolean',
              petOwner: {type: 'Owner'}
              petReport: {type: 'list', objectType: 'Report'}
          }
        },
          name: 'Report',
          properties: {
              reportDataTime: 'string',
              reportSymptom: 'string',
              reportDianosis: 'string',
              reportTreatment: 'string',
              reportSummary: 'string',
              reportRemark: 'string'
              reportPet: {type: 'Pet'}
          }
      ],
      schemaVersion: 3
});
      
  // Render screen components
    return (
        <View style={{marginTop: 5}}>
            {/** Render search bar */}
            
            {/** Render item list or empty message */}
            {this.sourceChecker(this.state.dataSource)}
        </View>
    );
  }
}

const styles = StyleSheet.create({
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
  }
});