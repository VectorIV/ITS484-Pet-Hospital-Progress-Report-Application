/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListView,
  Image
} from 'react-native';

{/** Import page components */}
import MenuBar from './MenuBar.js';

export default class Main extends Component {
    constructor(props) {
    super(props);
   
    const dataSource = new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
   
    {/** Initialise the list. Used for testing only. */}
    {/** *This should be empited in the release* */}
    const initialList = [
    {firstName:'Tom',lastName:'JustTom',petName:'Jerry',petType:'Dog'},{firstName:'Tim',lastName:'Drake',petName:'Boi',petType:'Cat'},
    {firstName:'John',lastName:'Smith',petName:'Meat',petType:'Cat'}
    ];
    
    this.state = {
    dataSource: dataSource.cloneWithRowsAndSections(this.convertArraytoMap(initialList)),
    };
   
  }
  
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
    
  sourceChecker(dataSource) {
  {/** Determine whether the page is empty or not, and display the proper components */}
     if(dataSource.getRowCount()==0){
         return <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}><Text>Your list is empty right now.</Text></View>
         
     }
     else {
         return <View><ListView
                    dataSource={dataSource}
                    enableEmptySections={true}
                    renderRow={(rowData) =>
                          <TouchableOpacity>
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
                        <TouchableOpacity style={styles.content_tab_button}>
                        <Text style={styles.content_tab_text}> • {firstName.charAt(0)} </Text>
                        <Text style={styles.content_tab_text}> Hide </Text>
                        </TouchableOpacity>
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
  {/** Determine the pet icon */}
     if (type == 'Dog'){
         return  <Image style={{width:40,height:40}} source={require('./img/dog.png')}/>
     }
     else if (type == 'Cat'){
         return  <Image style={{width:40,height:40}} source={require('./img/cat.png')}/>
     }
  }
  
  render() {
    return (
      <View style={styles.container}>
          <View style={styles.menu_bar}>
            <MenuBar/>
          </View>
          <View style={styles.content_area}>
          
          {this.sourceChecker(this.state.dataSource)}
              
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  menu_bar: {
    flex: 1,
  },
  content_area: {
    flex: 9,
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
  }
});

AppRegistry.registerComponent('Vitality', () => Main);
