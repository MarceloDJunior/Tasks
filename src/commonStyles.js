import { Platform, StatusBar } from 'react-native'

export default {
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    fontFamily: 'Lato',
    colors: {
        today: '#B13B44',
        tomorrow: '#C9742E',
        week: '#15721E',
        month: '#1631BE',
        secondary: '#FFF',
        mainText: '#222',
        subText: '#555',
    }
}