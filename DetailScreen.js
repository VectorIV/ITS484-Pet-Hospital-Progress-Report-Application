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

export default class DetailScreen extends Component {
      
    // Used for styling the navigator
    static navigatorStyle = {
      navBarButtonColor: '#ffffff',
      navBarTextColor: '#ffffff',
      navBarBackgroundColor: '#ff0000',
      navBarHideOnScroll: true,
    };

    
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
    
  render() {
    return (
        <View style={{marginTop: 5, marginBottom: 50, flex: 1}}>
            <View style={{flex: 3, flexDirection: 'row'}}>
                <View style={{margin: 5, flex: 1, alignItems: 'center'}}>
                    {this.iconSelector(this.props.petType)}
                    <TouchableOpacity style={styles.content_button}>
                        <Text style={styles.content_button_text}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.content_button}>
                        <Text style={styles.content_button_text}>Remove</Text>
                    </TouchableOpacity>
                </View>
                <View style={{margin:5, flex: 2, flexDirection: 'column'}}>
                    <View>
                        <Text style={styles.content_text}>HN: {this.props.petID}</Text>
                        <Text style={styles.content_text}>Admission Date: {this.props.petDateIn? this.props.petDateIn:' - / - / - '} {this.props.petTimeIn? this.props.petTimeIn:' - : - : - '}</Text>
                        {this.exitDeterminer(this.props.petDateOut, this.props.petTimeOut)}
                    </View>
                    <View style={styles.content_seperator}/>
                    <View>
                        <Text style={styles.content_text}>Pet Name: {this.props.petName || ' - '}</Text>
                        <Text style={styles.content_text}>Type: {this.props.petType} {this.props.petOtherString? ('('+this.props.petOtherString+')'):''}</Text>
                        <Text style={styles.content_text}>Gender: {this.props.petGender}</Text>
                        <Text style={styles.content_text}>Date of Birth: {this.props.petDOB? this.props.petDOB:' - '}</Text>
                    </View>
                    <View style={styles.content_seperator}/>
                    <View>
                        <Text style={styles.content_text}>First Name: {this.props.firstName}</Text>
                        <Text style={styles.content_text}>Last Name: {this.props.lastName}</Text>
                        <Text style={styles.content_text}>Address: {this.props.address? this.props.address:' - '}</Text>
                        <Text style={styles.content_text}>Telephone: {this.props.tel}</Text>
                        <Text style={styles.content_text}>Email: {this.props.email}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.content_seperator}/>
            <View style={{flex: 2, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.content_text}>Report list placeholder</Text>
                <TouchableOpacity style={styles.content_button}>
                    <Text style={styles.content_button_text}>Create</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  content_text:{
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
    width: 100, height: 25,
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
