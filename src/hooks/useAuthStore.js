import { useSelector, useDispatch } from "react-redux";

export const useAuthStore = () => {

  const { 
    errorMessage,
    status,
    user,
  } = useSelector( state => state.auth )
  const dispatch = useDispatch();

  const startLogin = async({ email, password }) => {
    console.log({ email, password })
  }

  return {
    // * Propiedades
    errorMessage,
    status,
    user,
    // * Métodos
    startLogin
  }
}
