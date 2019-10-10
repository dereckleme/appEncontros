const initialState = {
  eventoIdSelected: null,
  eventos: [],
  eventsEntred: [],
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

export const application = (state = initialState, action) => {
  
  switch (action.type) {
    case 'EVENTOS_UPDATE':
      return {...state, eventos:action.eventos};
    case 'EVENTO_ID_SELECTED':
      return {...state, eventoIdSelected:action.eventoId};  
    case 'EVENTO_ENTER':
      console.log("ENTROU NO EVENTO");
      return {...state, enterEvent:action.enterEvent};  
    case 'CREATE_EVENT':
      console.log("CREATE_EVENT");
      return {...state, createEvent:action.createEvent};      
    case 'COORDS_EVENTO':
      console.log("COORDS_EVENTO");
      return {...state, selectedEventoCoords:action.selectedEventoCoords};     
    case 'JUNTE_SE_AO_EVENTO':
      console.log("JUNTE_SE_AO_EVENTO");
      return {...state, junteseEvento:action.junteseEvento};  
    case 'EVENT_CREATED_TITULO':
      console.log("EVENT_CREATED_TITULO");
      return {...state, createEventName:action.createEventName};    
    case 'SHOW_DIALOG_CONFIRM_EVENT':
      console.log("SHOW_DIALOG_CONFIRM_EVENT");
      return {...state, dialogVisible:action.dialogVisible};  
    case 'EVENT_CREATED':
      console.log("EVENT_CREATED");
      return {...state,
        enterEvent: action.enterEvent, 
        createEvent: action.createEvent, 
        createEventSelectedAddress: action.createEventSelectedAddress, 
        dialogVisible: action.dialogVisible}; 
    case 'ENTER_EVENT':
      console.log("ENTER_EVENT");
      state.eventsEntred.push(action.eventoId);
      return {...state};    
    case 'CREATE_EVENT_SELECTED_ANDRESS':
      console.log("CREATE_EVENT_SELECTED_ANDRESS");
      return {...state, createEventSelectedAddress:action.createEventSelectedAddress};       
    case 'SIGNEDIN':
      console.log("SIGNEDIN");
      return {...state, deviceId:action.deviceId, userRegistred:action.userRegistred};
    case 'CREATE_EVENT':
      console.log("CREATE_EVENT");
      return {...state, createEvent:action.createEvent};  
    case 'UPDATE_GPS_POSITION':
      console.log("UPDATE_GPS_POSITION");
      return {...state, location:action.location, latitude:action.latitude, longitude:action.longitude};    
    case 'BACK_TO_HOME':
      console.log("BACK_TO_HOME");
      return {...state, enterEvent: action.enterEvent, createEvent: action.enterEvent, createEventSelectedAddress: action.createEventSelectedAddress};    
    case 'COORDS_EVENTO_PESSOAS':
      console.log("COORDS_EVENTO_PESSOAS");
      return {...state, pesssoasEvento:action.EventoCoordsPessoas};     
    default:
      return state;
  }
}