/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, Button, Image, TextInput, TouchableHighlight, TouchableOpacity} from 'react-native';
import { Avatar, Badge, Icon, withBadge, Header, List, ListItem, SearchBar, Bottom } from 'react-native-elements'
import MapView from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Dialog from "react-native-dialog";
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { Provider } from 'react-redux';
import { Store } from './store';
import Main from './components/Main';

export default class App extends Component<Props> {
  render() {
    return (
      <Provider store={Store}>
         <Main></Main>
      </Provider>   
   );
  }
}