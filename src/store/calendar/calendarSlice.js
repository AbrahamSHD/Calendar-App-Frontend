import { createSlice } from '@reduxjs/toolkit';


export const calendarSlice = createSlice({
  name: 'calendar', 
  initialState: {
    isLoadingEvents: true,
    events: [],
    activeEvent: null,
  },
  reducers: {
    onSetActiveEvent: ( state, { payload } ) => {
      state.activeEvent = payload;
    },
    onAddNewEvent: ( state, { payload } ) => {
      state.events.push( payload );
      state.activeEvent = null;
    },
    onUpdateEvent: ( state, { payload } ) => {
      state.events = state.events.map( event => {

        if ( event._id === payload._id ) {
          return payload;
        }

        return event;
      });
    },
    onDeleteEvent: ( state ) => {
      if ( state.activeEvent ) {
        state.events = state.events.filter( event => event._id !== state.activeEvent._id );
        state.activeEvent = null;
      }
    },
    onLoadEvents: ( state, { payload = [] } ) => {
      state.isLoadingEvents = false;
      state.events = payload;
      payload.forEach( event => {

        const exists = state.events.some( dbEvent => dbEvent.id === event.id );

        if ( !exists ) {
          state.events.push( event )
        }

      })
    },
  }
});


// Action creators are generated for each case reducer function
export const { 
  onAddNewEvent, 
  onDeleteEvent,
  onLoadEvents, 
  onSetActiveEvent, 
  onUpdateEvent, 
} =  calendarSlice.actions;