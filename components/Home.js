  import React, {Component} from 'react';
  import {Platform, StyleSheet, Text, View, FlatList, Button, Image, TextInput, TouchableHighlight, TouchableOpacity} from 'react-native';
  import { Avatar, Badge, Icon, withBadge, Header, List, ListItem, SearchBar, Bottom } from 'react-native-elements'
  import MapView from 'react-native-maps'
  import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
  import Dialog from "react-native-dialog";
  import { GoogleSignin, GoogleSigninButton, statusCodes } from 'react-native-google-signin';

  class Home extends Component { 				 	
      static propTypes = {									
			 teste: 'aew'						
      }; 	

      state = {
        eventos: [],
        location: null,
        latitude: -23.550520,
        longitude: -46.633308,
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

      render() {
        return (
           <View style={styles.container}>
                <Header
                          centerComponent={{ text: 'ENCONTRE UM EVENTO', style: { color: '#fff', fontSize: 14 } }}
                          rightComponent={{ icon: 'explore', color: '#fff' }}
                        />
                <View style={{
            minHeight: '0%',
            maxHeight: 250,
                        }}>
                    <FlatList
                    data={this.state.eventos}
                    ItemSeparatorComponent={this.renderSeparator}
                    renderItem={({ item }) => (
                      <ListItem
                        rigthIcon={{ name: 'room' }}
                        onPress={() => this.clickEvent(item.id)}
                        leftIcon={{ name: 'room' }}
                        roundAvatar
                        keyExtractor={item => item.name}
                        title={`${item.name}`}
                        badge={{ value: item.totalPessoas }}
                        subtitle={
                        <View style={styles.subtitleView}>
                          <Text style={styles.ratingText}>Expira em 2 horas</Text>
                        </View>
                      }
                      />
                    )}
                  />
                </View> 
                <View style={{flex: 0.1}}>
                        <Button
                                title="Criar Evento"
                                color="red"
                                name="criar_evento"
                                onPress={this._createEvent}
                          />
                    </View> 
                <View style={{flex: 1}}>
                      <MapView style={{flex: 1}} initialRegion={{
                            latitude: this.state.latitude,
                            longitude: this.state.longitude,
                            latitudeDelta: 0.503,
                            longitudeDelta: 0.503
                             }}>

                        <MapView.Marker coordinate={{latitude: this.state.latitude,
                                longitude: this.state.longitude}}  title="Minha Posição">
                                  <Image source={require('../assets/flag-mi.png')} style={{height: 80, width:80 }} />
                                      </MapView.Marker>
                                {this.state.eventos.map(marker => { 
                                    return(
                                      <MapView.Marker coordinate={{latitude: parseFloat(marker.latitude),
                                      longitude: parseFloat(marker.longitude)}}  title={marker.name}>
                                      <Image source={require('../assets/flag-blue.png')} style={{height: 80, width:80 }} />
                                      </MapView.Marker>
                                    );
                                  })}
                              </MapView>
                </View>
                <View style={{flex:0.05, justifyContent: 'center', alignItems: 'center'}}>
                                <Text>ENCONTRE EVENTOS PROXIMO A SUA LOCALIZAÇÃO</Text>
                              </View>
          </View>
        );
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

 export default Home;