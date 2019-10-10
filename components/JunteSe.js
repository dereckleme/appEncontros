import React, {Component, PropTypes} from 'react';		 	
import {Image} from 'react-native';
import Home from './Home';
import Evento from './Evento';
import { connect } from 'react-redux';

class Main extends Component { 	
    constructor(props) {
      super(props);
    }

    render() {
      if (this.props.store.enterEvent == null) {
        return (
            <Home></Home>
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