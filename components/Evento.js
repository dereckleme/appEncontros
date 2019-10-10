import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Platform, StyleSheet, Text, View, FlatList, Button, Image, TextInput, TouchableHighlight, TouchableOpacity} from 'react-native';
import { Avatar, Badge, Icon, withBadge, Header, List, ListItem, SearchBar, Bottom } from 'react-native-elements'
import MapView from 'react-native-maps'

class Evento extends Component { 				 	
    constructor(props) {
      super(props);
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

    _createEvent =  () => {
      this.props.dispatch({
        type: 'CREATE_EVENT',
        createEvent: true
        });
    }

    _junteseaction = () => {
        evento = this.props.store.selectedEventoCoords;
        
        if (this.props.store.eventsEntred.indexOf(this.props.store.selectedEventoCoords.id) == "-1") {
            this._registerUserEvent(this.props.store.eventoIdSelected, this.props.store.deviceId);
        }
    }

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
        let messageButton;
        if (this.props.store.eventsEntred.indexOf(this.props.store.selectedEventoCoords.id) == "-1") {
            messageButton = "Junte-se ao Evento"
        } else {
            messageButton = "Sair do Evento"
        }

        return (
            <View style={styles.container}>
             <Header
                leftComponent={{ text: "N°"+this.props.store.selectedEventoCoords.totalPessoas,style: { color: '#fff', fontSize: 14 }}}
                centerComponent={{ text: this.props.store.selectedEventoCoords.titulo, style: { color: '#fff', fontSize: 14 }  }}
                rightComponent={{ icon: 'room', color: '#fff' }}
                />
                <MapView style={{flex: 1}} initialRegion={{
                    latitude: parseFloat(this.props.store.selectedEventoCoords.latitude),
                    longitude: parseFloat(this.props.store.selectedEventoCoords.longitude),
                    latitudeDelta: 0.020,
                    longitudeDelta: 0.020,
                }}> 
                    <MapView.Marker  coordinate={{latitude: parseFloat(this.props.store.selectedEventoCoords.latitude),
                        longitude: parseFloat(this.props.store.selectedEventoCoords.longitude)}}  title={"Local do Evento: " + this.props.store.selectedEventoCoords.titulo}>
                        <Image source={require('../assets/flag-blue.png')} style={{height: 80, width:80 }} />
                        </MapView.Marker>

                        {this.props.store.pesssoasEvento.map(marker => { 
                            return(
                            <MapView.Marker coordinate={{latitude: parseFloat(marker.latitude),
                            longitude: parseFloat(marker.longitude)}}  title={marker.nome}>
                            <Image source={require('../assets/icons8-web-accessibility-50.png')} style={{height: 45, width:45 }} />
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
                                onPress={this._backToHome}
                        />
                        </View>
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
    }
});

export default connect(store => ({store: store.application}))(Evento);