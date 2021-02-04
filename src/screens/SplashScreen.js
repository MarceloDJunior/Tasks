import React from 'react'
import {ImageBackground, StyleSheet } from 'react-native'

export default props => {
    return (
        <ImageBackground source={null} style={styles.container} />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})