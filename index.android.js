/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  StatusBar,
  TouchableHighlight,
  Image,
} from 'react-native';

import {Navigation} from 'react-native-navigation';

import {registerScreens} from './ScreenFunctions';
registerScreens();

// start the app
Navigation.startTabBasedApp({
  tabs: [
    {
      screen: 'main.ListViewScreen', // this is a registered name for a screen
      icon: require('./img/home_inv.png'),
      selectedIcon: require('./img/home.png'),
      title: 'Home'
    },
    {
      screen: 'main.ArchiveScreen',
      icon: require('./img/arc_inv.png'),
      selectedIcon: require('./img/arc.png'),
      title: 'Archive'
    },
    {
      screen: 'main.UserScreen',
      icon: require('./img/user_inv.png'),
      selectedIcon: require('./img/user.png'),
      title: 'User'
    }
  ],
  tabsStyle: { // optional, add this if you want to style the tab bar beyond the defaults
    // since 'selectedIcon' isn't supported on Android, use colour to indicate selected and non-selected instead
    tabBarButtonColor: '#aaaaaa',
    tabBarSelectedButtonColor: '#ffffff',
    tabBarBackgroundColor: '#ff0000',
  },
  animationType: 'fade' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
});
