import { useSelector, useDispatch } from "react-redux";
import { calendarApi } from "../api";
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store";

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
      dispatch( onLogin({ user: data.user.email }) )

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
      dispatch( onLogin({ user: data.user.name }) )

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

  return {
    // * Propiedades
    errorMessage,
    status,
    user,
    // * Métodos
    startLogin,
    startRegister,
  }
}