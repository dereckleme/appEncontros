import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, Button, Image, TextInput, TouchableHighlight, TouchableOpacity} from 'react-native';
import { Avatar, Badge, Icon, withBadge, Header, List, ListItem, SearchBar, Bottom } from 'react-native-elements'
import MapView from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Dialog from "react-native-dialog";
import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';
import { connect } from 'react-redux';

class EventoCreate extends Component { 	
    constructor(props) {
      super(props);
    }

    _createEventSelectedAddress =  (data) => {
      this.props.dispatch({
        type: 'CREATE_EVENT_SELECTED_ANDRESS',
        createEventSelectedAddress : data
        });
    }

    _backToHome = () => {
      this.props.dispatch({
          type: 'BACK_TO_HOME',
           enterEvent: null,
           createEvent: false,
           createEventSelectedAddress: null
          });
      /* LIVE PESSOAS REFACTOR
        clearInterval(this.liveUpdatePessoas);
        */   
    }

    render() {
      return (
        <View style={styles.container}>
        <Header
        centerComponent={{ text: "CRIAR EVENTO", style: { color: '#fff', fontSize: 14 }  }}
        rightComponent={{ icon: 'room', color: '#fff' }}
      />
            <GooglePlacesAutocomplete
                placeholder='Endereço do Evento'
                minLength={2} // minimum length of text to search
                autoFocus={false}
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
                listViewDisplayed='false'    // true/false/undefined
                fetchDetails={true}
                renderDescription={row => row.description} // custom description render
                 onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    this._createEventSelectedAddress(details.geometry.location);
                  }}

                getDefaultValue={() => ''}

                query={{
                  // available options: https://developers.google.com/places/web-service/autocomplete
                  key: 'AIzaSyDRqytt_CLYCV1kQ3gz9kF8BzqTORmStSU',
                  language: 'pt-br', // language of the results
                  types: 'geocode' // default: 'geocode'
                }}

                styles={{
                  container: {
                    
                  },
                  textInputContainer: {
                    width: '100%'
                  },
                  description: {
                    fontWeight: 'bold'
                  },
                  predefinedPlacesDescription: {
                    color: '#1faadb'
                  }
                }}

                currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
                currentLocationLabel="Sua posição"
                nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                GoogleReverseGeocodingQuery={{
                  // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                }}
                GooglePlacesSearchQuery={{
                  // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                  rankby: 'distance',
                  type: 'address'
                }}
                
                GooglePlacesDetailsQuery={{
                  // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                  fields: 'formatted_address',
                }}

                filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                debounce={200} 
              />
              <Button style={{ width: '100%',
                paddingTop: 20,
                height: '30%',
                justifyContent: 'center',
                alignItems: 'center' }}
                      title="Voltar"
                      onPress={this.backToHome}
                />
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

export default connect(store => ({store: store.application}))(EventoCreate);