import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store"
import { calendarApi } from "../api";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";


export const useCalendarStore = () => {

  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector( state => state.calendar );
  const { user } = useSelector( state => state.auth );

  const setActiveEvent = ( calendarEvent ) => {
    dispatch( onSetActiveEvent( calendarEvent ) )
  }

  const startSavingEvent = async( calendarEvent ) => {

    try {

      if ( calendarEvent._id ) {
  
        const { __v, _id, user, ...eventWithoutMeta } = calendarEvent;
  
        await calendarApi.patch(`/events/${calendarEvent._id}`, eventWithoutMeta);
        dispatch(onUpdateEvent({ ...eventWithoutMeta, user }));
        startLoadingEvents();
  
        return;
  
      }
  
      const { data } = await calendarApi.post('/events', calendarEvent);
      dispatch( onAddNewEvent({ ...calendarEvent, id: data.event._doc._id, user: user }) );
    } catch (error) {
      console.log(error);
      Swal.fire('Error al guardar', error.response.data.msg, 'error');
    }

  }

  const startDeletingEvent = async() => {

    await calendarApi.delete(`/events/${ activeEvent._id }`)

    dispatch( onDeleteEvent() );
  }

  const startLoadingEvents = async() => {

    try {
      
      const { data } = await calendarApi.get('/events');
      const eventsArray = Object.values(data.events);
      const events = convertEventsToDateEvents( eventsArray );
      dispatch( onLoadEvents( events ) )

    } catch (error) {
      console.log(error)
      Swal.fire('Error al eliminar', error.response.data.msg, 'error');
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
