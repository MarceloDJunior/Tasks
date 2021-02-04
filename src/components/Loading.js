import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
export default props => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={props.size ? props.size : 'large'} color={props.color ? props.color : '#000'} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})