import { Navigation } from 'react-native-navigation';

// Import page components
import ListViewScreen from './ListViewScreen.js';
import DetailScreen from './DetailScreen.js';
import ArchiveScreen from './ArchiveScreen.js';
import UserScreen from './UserScreen.js';

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent('main.ListViewScreen', () => ListViewScreen);
  Navigation.registerComponent('main.DetailScreen', () => DetailScreen);
  Navigation.registerComponent('main.ArchiveScreen', () => ArchiveScreen);
  Navigation.registerComponent('main.UserScreen', () => UserScreen);
}