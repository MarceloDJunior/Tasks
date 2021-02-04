import { Alert } from 'react-native'

const server = 'https://tasks-marcelo.herokuapp.com'

function showError(err) {
    if (err.response && err.response.data) {
        Alert.alert('Ops! Ocorreu um problema!', `Mensagem: ${err.response.data}`)
    } else {
        Alert.alert('Ops! Ocorreu um problema!', `Mensagem: Ocorreu um erro inesperado. Tente novamente mais tarde.`)
    }
}

function showSuccess(msg) {
    Alert.alert('Sucesso!', msg)
}

export { server, showError, showSuccess }