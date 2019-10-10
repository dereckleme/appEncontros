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
import Home from './components/Home';
import Login from './components/Login';
import { Provider } from 'react-redux';
import { Store } from './store';

type Props = {};
export default class App extends Component<Props> {

  eventsEntred = [];
  liveUpdatePessoas = null;
  xxxx = Store.getState();
  state = {
      eventos: [],
      location: null,
      latitude: 0,
      longitude: 0,
      pesssoasEvento: [],
      selectedEvento: null,
      selectedEventoCoords: {latitude:0, longitude: 0, id: null},
      enterEvent: null ,
      deviceId: null,
      junteseEvento:false,
      userRegistred:false,
      createEvent:false,
      createEventSelectedAddress:null,
      createEventName:null,
      dialogVisible: false
    };

  constructor(props) {
    super(props); 
    this._getEvents();
  }

  _getEvents = () => {
    fetch('http://casamentomaynaraedereck.com.br/systemEncontro/app_eventos_server/public/index.php/eventos')
      .then((response) => response.json())
      .then((responseJson) => {
          this.setState({ eventos : responseJson });
      })
      .catch((error) =>{ alert(error)});
  }

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices//({ autoResolve: true });
      await GoogleSignin.configure();

      const userInfo = await GoogleSignin.signIn();
      const isSignedIn = await GoogleSignin.isSignedIn();

      if (isSignedIn) {
        var eventoId = this.state.selectedEventoCoords.id;
          this.setState({ 
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

  getCurrentUser = async () => {
  const currentUser = await GoogleSignin.getCurrentUser();
  this.setState({ currentUser });
  };


  componentDidMount() {    
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this._setDataPosition(position);

                navigator.geolocation.watchPosition((position) => {
                    this._setDataPosition(position);
                });
            },
            (error) => {alert("Não conseguimos obter sua posição por GPS.")},
            { enableHighAccuracy: false, timeout: 90000, maximumAge: 1000 }
        );
    };

  _setDataPosition(position) {
      const location = position;

                this.setState({ 
                      location : location,
                      latitude : position.coords.latitude,
                      longitude : position.coords.longitude,
                    });
                let params = {
                      deviceId: this.state.deviceId
                    }

                if (this.state.userRegistred) {
                     this.eventsEntred.map((eventoId) => {
                          this._registerUserPosition(eventoId, params.deviceId);
                      });
                }
  }  

  backToHome = () => {
     this._getEvents();
     this.setState({ 
          enterEvent: false,
          createEvent: false,
          createEventSelectedAddress: null
        });
     clearInterval(this.liveUpdatePessoas);
  }

  _junteseaction = () => {
      evento = this.state.selectedEventoCoords;
      
      if (this.eventsEntred.indexOf(this.state.selectedEventoCoords.id) == "-1") {
          this.setState({ junteseEvento : true });
      }
  }

  _anonimoAction = () => {
    if (this.state.deviceId == null) {
      var hash = this._generateHash();
    } else {
      var hash = this.state.deviceId;
    }
    
    var eventoId = this.state.selectedEventoCoords.id;
    this.setState({ 
      junteseEvento : false,
       deviceId: hash,
       userRegistred: true
    });
    this._registerUserEvent(eventoId, hash);
  }

  _registerEvent = () => {
      fetch("http://casamentomaynaraedereck.com.br/systemEncontro/app_eventos_server/public/index.php/eventos/create?latitude="+this.state.createEventSelectedAddress.lat+"&longitude="+this.state.createEventSelectedAddress.lng+"&titulo="+this.state.createEventName, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      }).then((response) => {
          this._getEvents();
          this.setState({ 
              enterEvent: false,
              createEvent: false,
              createEventSelectedAddress: null,
              dialogVisible: false
            });
      });
  }

  _registerUserEvent = (eventoId, deviceId) => {
      this._registerUserPosition(eventoId, deviceId);
      this.eventsEntred.push(eventoId);
   }

   _registerUserPosition = (eventoId, deviceId) => {
    fetch('http://casamentomaynaraedereck.com.br/systemEncontro/app_eventos_server/public/index.php/eventos/register/'+eventoId+'/'+deviceId+"?XDEBUG_SESSION_START=1&latitude="+this.state.latitude+"&longitude="+this.state.longitude, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
      });
   }

  _generateHash() {
      return '_' + Math.random().toString(36).substr(2, 9);
  };

  _createEvent =  () => {
      this.setState({ 
      createEvent : true
    });
  }

  _createEventSelectedAddress =  (data) => {
      this.setState({ 
      createEventSelectedAddress : data
    });
  }

  showDialog = () => {
    this.setState({ dialogVisible: true });
  };

  render() {
    
          if (!this.state.deviceId && this.state.junteseEvento) {
            return (
                <View style={styles.container_login}>
                  <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={this._signIn}
          disabled={this.state.isSigninInProgress} />

                  <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} onPress={() => this._anonimoAction()}>
                    <Text style={styles.loginText}>Acesso anonimo?</Text>
                  </TouchableHighlight>
            </View>
            ) 
          } else if (this.state.dialogVisible) {
              return ( <View>
                <Dialog.Container visible={true}>
                          <Dialog.Title>Criação do Evento</Dialog.Title>
                          <Dialog.Input placeholder="Informe o titulo do Evento" onChangeText={(tituloEvento : string) => {
                              this.setState({
                                createEventName: tituloEvento
                              })
                          }}
                          ></Dialog.Input>
                          <Dialog.Button label="Cadastrar Evento" onPress={this._registerEvent} />
                      </Dialog.Container>
              </View> );
          } else if (this.state.createEvent && this.state.createEventSelectedAddress != null) {
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
                            flex:0.1
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
                     <MapView style={{flex: 1}} initialRegion={{
                          latitude: this.state.createEventSelectedAddress.lat,
                          longitude: this.state.createEventSelectedAddress.lng,
                          latitudeDelta: 0.003,
                          longitudeDelta: 0.003
                           }}>

                      <MapView.Marker coordinate={{latitude: this.state.latitude,
                              longitude: this.state.longitude}}  title="Minha Posição"/>

                              {this.state.eventos.map(marker => { 
                                  return(
                                    <MapView.Marker coordinate={{latitude: this.state.createEventSelectedAddress.lat,
                                    longitude: this.state.createEventSelectedAddress.lng}}  title={marker.name}>
                                    <Image source={require('./assets/flag-blue.png')} style={{height: 80, width:80 }} />
                                    </MapView.Marker>
                                  );
                                })}
                            </MapView>
                            <Button style={{ width: '100%',
                        paddingTop: 20,
                        height: '30%',
                        justifyContent: 'center',
                        alignItems: 'center' }}
                              title="Confirmar Evento"
                              color="red"
                              onPress={this.showDialog}
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
          } else if(this.state.createEvent && this.state.createEventSelectedAddress == null) {
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
          } else if (this.state.enterEvent && this.state.selectedEventoCoords != null && this.state.junteseEvento == false) {
            let messageButton;
              if (this.eventsEntred.indexOf(this.state.selectedEventoCoords.id) == "-1") {
                  messageButton = "Junte-se ao Evento"
              } else {
                  messageButton = "Sair do Evento"
              }

      return (
            <View style={styles.container}>
            <Header
                leftComponent={{ text: "N°"+this.state.selectedEventoCoords.totalPessoas,style: { color: '#fff', fontSize: 14 }}}
                centerComponent={{ text: this.state.selectedEventoCoords.titulo, style: { color: '#fff', fontSize: 14 }  }}
                rightComponent={{ icon: 'room', color: '#fff' }}
              />
              <MapView style={{flex: 1}} initialRegion={{
                  latitude: parseFloat(this.state.selectedEventoCoords.latitude),
                  longitude: parseFloat(this.state.selectedEventoCoords.longitude),
                  latitudeDelta: 0.020,
                  longitudeDelta: 0.020,
              }}> 
                  <MapView.Marker  coordinate={{latitude: parseFloat(this.state.selectedEventoCoords.latitude),
                        longitude: parseFloat(this.state.selectedEventoCoords.longitude)}}  title={"Local do Evento: " + this.state.selectedEventoCoords.titulo}>
                        <Image source={require('./assets/flag-blue.png')} style={{height: 80, width:80 }} />
                        </MapView.Marker>

                        {this.state.pesssoasEvento.map(marker => { 
                          return(
                            <MapView.Marker coordinate={{latitude: parseFloat(marker.latitude),
                            longitude: parseFloat(marker.longitude)}}  title={marker.nome}>
                            <Image source={require('./assets/icons8-web-accessibility-50.png')} style={{height: 45, width:45 }} />
                            </MapView.Marker>
                          );
                        })}


                  </MapView>

                   <View style={{flex: 0.13}}>
                         <Button style={{ width: '100%',
                                          height: '30%',
                                          justifyContent: 'center',
                                          alignItems: 'center' }}
                              title={messageButton}
                              color="red"
                              onPress={this._junteseaction}
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
            </View>
            )
          } else if (this.state.enterEvent && this.state.selectedEventoCoords == null) {
                    return (<View style={{flex: 1}}>
                    <Text>Carregando...</Text>    
                </View>);
              } else {
          return (
             <Provider store={Store}>
                <Home></Home>
             </Provider>   
          );
        }
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
