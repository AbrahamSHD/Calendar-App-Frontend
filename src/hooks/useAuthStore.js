import { useSelector, useDispatch } from "react-redux";
import { calendarApi } from "../api";
import { clearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from "../store";

export const useAuthStore = () => {

  const { 
    errorMessage,
    status,
    user,
  } = useSelector( state => state.auth )
  const dispatch = useDispatch();

  const startLogin = async({ email, password }) => {
    dispatch( onChecking() )
    try {
      const { data } = await calendarApi.post('/auth/login', { email, password })
      
      localStorage.setItem( 'token', data.token );
      localStorage.setItem( 'token-init-date', new Date().getTime() );
      dispatch( onLogin( data.user ) )

    } catch (error) {
      dispatch( onLogout('Credenciales Incorrectas') )
      setTimeout(() => {
        dispatch( clearErrorMessage() )
      }, 10 );
    }
  }

  const startRegister = async({ name, email, password }) => {
    try {

      const { data } = await calendarApi.post('/auth/new', { name, email, password })
      
      localStorage.setItem( 'token', data.token );
      localStorage.setItem( 'token-init-date', new Date().getTime() );
      dispatch( onLogin( data.user ) )

    } catch (error) {

      if ( error.status === 409 ) {
        dispatch( onLogout( error.response.data?.message || 'El usuario ya existe' ) )
        setTimeout(() => {
          dispatch( clearErrorMessage() )
        }, 10 );
        return
      }
      dispatch( onLogout('Algo salió mal') )
      setTimeout(() => {
        dispatch( clearErrorMessage() )
      }, 10 );

    }
  }

  const checkAuthToken = async() => {

    const token = localStorage.getItem('token');

    if ( !token ) return dispatch( onLogout() )

    try {
    
      const { data } = await calendarApi.post('auth/renew');

      localStorage.setItem( 'token', data.token );
      localStorage.setItem( 'token-init-date', new Date().getTime() );
      dispatch( onLogin( data.user ) )
      
    } catch (error) {
      localStorage.clear();
      dispatch( onLogout() );
    }

  }

  const startLogout = () => {

    localStorage.clear();
    dispatch( onLogoutCalendar() )
    dispatch( onLogout() );

  }

  return {
    // * Propiedades
    errorMessage,
    status,
    user,

    // * Métodos
    checkAuthToken,
    startLogin,
    startLogout,
    startRegister,
  }
}
