import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from "../store"
import { calendarApi } from "../api";
import { convertEventsToDateEvents } from "../helpers";


export const useCalendarStore = () => {

  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector( state => state.calendar );
  const { user } = useSelector( state => state.auth );

  const setActiveEvent = ( calendarEvent ) => {
    dispatch( onSetActiveEvent( calendarEvent ) )
  }

  const startSavingEvent = async( calendarEvent ) => {

    // TODO: Update Event
    if ( calendarEvent._id ) {
      // Actualizando
      dispatch( onUpdateEvent({ ...calendarEvent }) );
    } else {
      // Creando
      const { data } = await calendarApi.post('/events', calendarEvent);
      console.log({data})

      dispatch( onAddNewEvent({ ...calendarEvent, id: data.event._doc._id, user: user }) );
    }
  }

  const startDeletingEvent = async() => {
    // TODO: llegar al backend
    dispatch( onDeleteEvent() );
  }

  const startLoadingEvents = async() => {

    try {
      
      const { data } = await calendarApi.get('/events');
      const eventsArray = Object.values(data.events);
      const events = convertEventsToDateEvents( eventsArray );

    } catch (error) {
      console.log(error)
    }

  }

  return {
    // * Propiedades
    events,
    activeEvent,
    hasEventSelected: !!activeEvent,

    // * Métodos
    setActiveEvent,
    startDeletingEvent,
    startLoadingEvents,    
    startSavingEvent,
  }
}
