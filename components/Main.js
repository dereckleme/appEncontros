import React, {Component, PropTypes} from 'react';		 	
import {Image} from 'react-native';
import Home from './Home';
import { connect } from 'react-redux';
import Login from './Login';
import Modal from './Modal';
import Evento from './Evento';
import EventoCreate from './EventoCreate';
import EventoCreateAddress from './EventoCreateAddress';

class Main extends Component { 	
    constructor(props) {
      super(props);
    }

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

      this.props.dispatch({
        type: 'UPDATE_GPS_POSITION',
        location : location,
        latitude : position.coords.latitude,
        longitude : position.coords.longitude
      });
      let params = {
            deviceId: this.props.store.deviceId
      }

      if (this.props.store.userRegistred) {   
        console.log("UPDATE POSITION");
            this.props.store.eventsEntred.map((eventoId) => {  
              
                this._registerUserPosition(eventoId, params.deviceId);
            });
      }
    } 
    
    _registerUserPosition = (eventoId, deviceId) => {
      console.log("REGISTER EVENT USER POSITION");
      fetch('http://casamentomaynaraedereck.com.br/systemEncontro/app_eventos_server/public/index.php/eventos/register/'+eventoId+'/'+deviceId+"?XDEBUG_SESSION_START=1&latitude="+this.props.store.latitude+"&longitude="+this.props.store.longitude, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }
        });
    }

    render() {
      if (!this.props.store.deviceId) { 
        return (
          <Login></Login>
        );
      } else if (this.props.store.dialogVisible) { 
        return (
          <Modal></Modal>
        );
      } else if(this.props.store.createEvent && this.props.store.createEventSelectedAddress == null) {
        return (
          <EventoCreate></EventoCreate>
        );
      } else if(this.props.store.createEvent && this.props.store.createEventSelectedAddress != null) {
        return (
          <EventoCreateAddress></EventoCreateAddress>
        );
      } else if (this.props.store.enterEvent != null) {
        return (
            <Evento></Evento>
          );
      } else {
        return (
            <Home></Home>
          );
      }
    }
}

export default connect(store => ({store: store.application}))(Main);