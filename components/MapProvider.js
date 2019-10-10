import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, FlatList, Button, Image, TextInput, TouchableHighlight, TouchableOpacity} from 'react-native';
import { Avatar, Badge, Icon, withBadge, Header, List, ListItem, SearchBar, Bottom } from 'react-native-elements'
import MapView from 'react-native-maps'
import { connect } from 'react-redux';

class MapProvider extends Component { 	
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <View style={{flex: 1}}>
                      <MapView style={{flex: 1}} initialRegion={{
                            latitude: parseFloat(this.props.initialRegion.latitude),
                            longitude: parseFloat(this.props.initialRegion.longitude),
                            latitudeDelta: 0.503,
                            longitudeDelta: 0.503
                             }}>

                        <MapView.Marker coordinate={{latitude: parseFloat(this.props.initialRegion.latitude),
                                longitude: parseFloat(this.props.initialRegion.longitude)}}  title="Minha Posição">
                                  <Image source={require(this.props.imagePrimaryMarker)} style={{height: 80, width:80 }} />
                                      </MapView.Marker>
                                {this.props.marckers.map(marker => { 
                                    return(
                                      <MapView.Marker coordinate={{latitude: parseFloat(marker.latitude),
                                      longitude: parseFloat(marker.longitude)}}  title={marker.name}>
                                      <Image source={require(this.props.imageMarkers)} style={{height: 80, width:80 }} />
                                      </MapView.Marker>
                                    );
                                  })}
                              </MapView>
                </View>
      )
    }
}

export default connect(store => ({store: store.application}))(MapProvider);