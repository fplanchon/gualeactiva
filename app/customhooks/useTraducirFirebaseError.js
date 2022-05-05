export const useTraducirFirebaseError = (error, defaultError = '') => {
    const [msjFbError, setMsjFbError] = useState(false);

    switch (error.code) {
        case '':
            setMsjFbError(false)
            break
        case 'auth/email-alredy-in-use':
            setMsjFbError('Email registrado por otro usuario')
            break
        case 'auth/invalid-email':
            setMsjFbError('Formato de email incorrecto')
            break
        case 'auth/wrong-password':
            setMsjFbError('Contraseña incorrecta')
            break
        default:
            if (defaultError !== '') {
                setMsjFbError(defaultError);
            } else {
                setMsjFbError(error.code)
            }

            break;
    }

    return { msjFbError }
}