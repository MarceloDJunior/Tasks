import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Platform
} from 'react-native'

import Swipeable from 'react-native-gesture-handler/Swipeable'
import Icon from 'react-native-vector-icons/FontAwesome'

import moment from 'moment'
import 'moment/locale/pt-br'

import commonStyles from '../commonStyles'
import Loading from './Loading'

export default props => {

    const doneOrNotStyle = props.doneAt != null ?
        { textDecorationLine: 'line-through' } : {}

    // const date = props.doneAt ? props.doneAt : props.estimateAt
    const date = props.estimateAt

    const formattedDate = moment(date).locale('pt-br').format('ddd, D [de] MMMM')

    const getRightContent = () => {
        return (
            <TouchableOpacity style={styles.right}
                onPress={() => props.onDelete && props.onDelete(props.id)}>
                <Icon name="trash" size={30} color='#FFF' />
            </TouchableOpacity>
        )
    }

    const getLeftContent = () => {
        return (
            <View style={styles.left}>
                <Icon name="trash" size={20} color='#FFF' style={styles.excludeIcon} />
                <Text style={styles.excludeText}>Excluir</Text>
            </View>
        )
    }

    return (
        <Swipeable
            renderRightActions={getRightContent}
            renderLeftActions={getLeftContent}
            onSwipeableLeftOpen={() => props.onDelete && props.onDelete(props.id)}>
            <View style={styles.container}>
                <TouchableWithoutFeedback
                    onPress={() => props.isToggling ? null : props.onToggleTask(props.id)}>
                    <View style={styles.checkContainer}>
                        {getCheckView(props.doneAt, props.isToggling)}
                    </View>
                </TouchableWithoutFeedback>
                <View>
                    <Text style={[styles.desc, doneOrNotStyle]}>{props.desc}</Text>
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>
            </View>
        </Swipeable>
    )
}

function getCheckView(doneAt, isToggling) {
    if (isToggling) {
        return (
            <View style={styles.pending}>
                <Loading size={Platform.OS === 'ios' ? 8 : 18 } />
            </View>
        )
    } else {
        if (doneAt != null) {
            return (
                <View style={styles.done}>
                    <Icon name='check' size={20} color={commonStyles.colors.secondary}></Icon>
                </View>
            )
        } else {
            return (
                <View style={styles.pending}></View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderColor: '#AAA',
        borderBottomWidth: 1,
        alignItems: 'center',
        paddingVertical: 14,
        backgroundColor: '#FFF'
    },
    checkContainer: {
        width: '20%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pending: {
        height: 34,
        width: 34,
        borderRadius: 17,
        borderWidth: 1,
        borderColor: '#555'
    },
    done: {
        height: 34,
        width: 34,
        borderRadius: 17,
        backgroundColor: '#4D7031',
        alignItems: 'center',
        justifyContent: 'center'
    },
    desc: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 16
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.subText,
        fontSize: 13
    },
    right: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20
    },
    left: {
        backgroundColor: 'red',
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    excludeText: {
        fontFamily: commonStyles.fontFamily,
        color: '#FFF',
        fontSize: 20,
        margin: 10
    },
    excludeIcon: {
        marginLeft: 10
    }
})