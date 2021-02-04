import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { DrawerItems } from 'react-navigation-drawer'
import { Gravatar } from 'react-native-gravatar'
import commonStyles from '../commonStyles'
import { SafeAreaView } from 'react-navigation'

import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'
import { ConfirmDialog } from 'react-native-simple-dialogs'

const initialState = {
    isLogoutDialogVisible: false
}

export default class Menu extends Component {

    state = {
        ...initialState
    }

    optionsGravatar = {
        email: this.props.navigation.getParam('email'),
        secure: true
    }

    logout = () => {
        delete axios.defaults.headers.common['Authorization']
        AsyncStorage.removeItem('userData')
        this.props.navigation.navigate('AuthOrApp')
    }

    hideLogoutDialog = () => {
        this.setState({ isLogoutDialogVisible: false })
    }

    render() {
        return (
            <ScrollView style={styles.container}>

                <ConfirmDialog
                    animationType='fade'
                    title="Sair"
                    message="Deseja realmente sair?"
                    visible={this.state.isLogoutDialogVisible}
                    onTouchOutside={this.hideLogoutDialog}
                    positiveButton={{
                        title: "Sim",
                        onPress: this.logout,
                        titleStyle: styles.buttons
                    }}
                    negativeButton={{
                        title: "Não",
                        onPress: this.hideLogoutDialog,
                        titleStyle: styles.buttons
                    }}
                />
                <SafeAreaView style={[commonStyles.safeArea, styles.header]}>
                    <Gravatar style={styles.avatar}
                        options={this.optionsGravatar} />
                    <View style={styles.userInfo}>
                        <Text style={styles.name}>{this.props.navigation.getParam('name')}</Text>
                        <Text style={styles.email}>{this.props.navigation.getParam('email')}</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.setState({ isLogoutDialogVisible: true })}>
                        <View style={styles.logoutIcon}>
                            <Text style={styles.logoutText}>Sair</Text>
                            <Icon name='sign-out' size={30} color={commonStyles.colors.secondary} />
                        </View>
                    </TouchableOpacity>
                </SafeAreaView>
                <DrawerItems {...this.props} />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderColor: '#333',
        backgroundColor: '#333'
    },
    avatar: {
        width: 100,
        height: 100,
        borderWidth: 3,
        borderRadius: 50,
        margin: 16,
        backgroundColor: '#CCC'
    },
    userInfo: {
        marginLeft: 16,
    },
    name: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginBottom: 5,
        color: commonStyles.colors.secondary
    },
    email: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 15,
        color: commonStyles.colors.secondary,
        marginBottom: 10
    },
    logoutIcon: {
        marginLeft: 16,
        marginBottom: 10,
        flexDirection: 'row'
    },
    logoutText: {
        color: commonStyles.colors.secondary,
        paddingRight: 5,
        paddingTop: 5
    },
    drawerItems: {
        backgroundColor: '#fff'
    },
    buttons: {
        color: commonStyles.colors.today
    }
})