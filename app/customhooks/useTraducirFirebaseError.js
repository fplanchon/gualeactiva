import { useReducer } from "react";

export const useTraducirFirebaseError = () => {
    const initialState = false;

    function reducer(state, action) {
        //console.log('action', action)
        switch (action.type) {
            case '':
            case null:
                return false
            case 'auth/email-already-in-use':
                return 'Email registrado por otro usuario'
            case 'auth/invalid-email':
                return 'Formato de email incorrecto'
            case 'auth/wrong-password':
                return 'Contraseña incorrecta'
            default:
                return action.type
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState);

    return { state, dispatch }
}