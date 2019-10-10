import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, Button, Image, TextInput, TouchableHighlight, TouchableOpacity} from 'react-native';
import { Avatar, Badge, Icon, withBadge, Header, List, ListItem, SearchBar, Bottom } from 'react-native-elements'
import MapView from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Dialog from "react-native-dialog";
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { connect } from 'react-redux';

class Modal extends Component { 	
    constructor(props) {
      super(props);
    }

    _registerEvent = () => {
      fetch("http://casamentomaynaraedereck.com.br/systemEncontro/app_eventos_server/public/index.php/eventos/create?latitude="+this.props.store.createEventSelectedAddress.lat+"&longitude="+this.props.store.createEventSelectedAddress.lng+"&titulo="+this.props.store.createEventName, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }).then((response) => {
          this._getEvents();
          this.props.dispatch({
            type: 'EVENT_CREATED',
            enterEvent: null,
            createEvent: false,
            createEventSelectedAddress: null,
            dialogVisible: false
          });   
      });
    }

    _getEvents = () => {
      fetch('http://casamentomaynaraedereck.com.br/systemEncontro/app_eventos_server/public/index.php/eventos')
        .then((response) => response.json())
        .then((responseJson) => {
            this.props.dispatch({
              type: 'EVENTOS_UPDATE',
              eventos: responseJson
            });
        })
        .catch((error) =>{ alert(error)});
    }

    render() {
      return (
        <View>
                <Dialog.Container visible={true}>
                          <Dialog.Title>Criação do Evento</Dialog.Title>
                          <Dialog.Input placeholder="Informe o titulo do Evento" onChangeText={(tituloEvento : string) => {
                              this.props.dispatch({
                                type: 'EVENT_CREATED_TITULO',
                                createEventName: tituloEvento
                              });
                          }}
                          ></Dialog.Input>
                          <Dialog.Button label="Cadastrar Evento" onPress={this._registerEvent} />
                      </Dialog.Container>
              </View> 
      )
    }
}

export default connect(store => ({store: store.application}))(Modal);