import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, Button, Image, TextInput, TouchableHighlight, TouchableOpacity} from 'react-native';
import { Avatar, Badge, Icon, withBadge, Header, List, ListItem, SearchBar, Bottom } from 'react-native-elements'
import MapView from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Dialog from "react-native-dialog";
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { connect } from 'react-redux';

class Login extends Component { 
    constructor(props) {
      super(props);
    }

    _signIn = async () => {
      try {
        await GoogleSignin.hasPlayServices//({ autoResolve: true });
        await GoogleSignin.configure();
  
        const userInfo = await GoogleSignin.signIn();
        const isSignedIn = await GoogleSignin.isSignedIn();
  
        if (isSignedIn) {
          var eventoId = this.props.store.eventoIdSelected;
            this.props.dispatch({
              type: 'SIGNEDIN',
              junteseEvento : false,
              deviceId: userInfo.user.email,
              userRegistred: true
            });
            this._registerUserEvent(eventoId, userInfo.user.email);
        }
  
      } catch (err) {
        alert(err.message);
      }
    };

    _registerUserEvent = (eventoId, deviceId) => {
      this._registerUserPosition(eventoId, deviceId);
      this.props.dispatch({
        type: 'ENTER_EVENT',
        eventoId : eventoId,
        eventsEntred : this.props.store.eventsEntred
      });
    }

    _registerUserPosition = (eventoId, deviceId) => {
      fetch('http://casamentomaynaraedereck.com.br/systemEncontro/app_eventos_server/public/index.php/eventos/register/'+eventoId+'/'+deviceId+"?XDEBUG_SESSION_START=1&latitude="+this.props.store.latitude+"&longitude="+this.props.store.longitude, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        });
     }

    render() {
      return (
        <View style={styles.container_login}>
          <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={this._signIn}
        disabled={this.props.store.isSigninInProgress} />

                <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this._anonimoAction()}>
                  <Text style={styles.loginText}>Acesso anonimo?</Text>
                </TouchableHighlight>
          </View>
          )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  container_login: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1'
  },
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5
  },

  inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      width:250,
      height:45,
      marginBottom:20,
      flexDirection: 'row',
      alignItems:'center'
  },
  inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
  },
  inputIcon:{
    width:30,
    height:30,
    marginLeft:15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
  },
  container_login: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
  },
});

export default connect(store => ({store: store.application}))(Login);