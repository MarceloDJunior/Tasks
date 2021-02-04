import React, { Component } from 'react'
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Alert
} from 'react-native'

import asyncStorage from "@react-native-community/async-storage"
import Icon from 'react-native-vector-icons/FontAwesome'
import IonIcons from 'react-native-vector-icons/Ionicons'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/pt-br'

import { server, showError } from './../common'
import commonStyles from '../commonStyles'

import todayImage from '../../assets/imgs/today.jpg'
import tomorrowImage from '../../assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/imgs/week.jpg'
import monthImage from '../../assets/imgs/month.jpg'

import Task from '../components/Task'
import Loading from '../components/Loading'
import AddTask from './AddTask'
import AsyncStorage from '@react-native-community/async-storage'

const initialState = {
    showDoneTasks: true,
    showAddTask: false,
    visibleTasks: [],
    tasks: [],
    isLoading: true
}

export default class TaskList extends Component {

    state = {
        ...initialState
    }

    componentDidMount = () => {
        this.getData()
    }

    getData = async () => {
        const stateString = await AsyncStorage.getItem('tasksState')
        const savedState = JSON.parse(stateString) || initialState
        this.setState({
            showDoneTasks: savedState.showDoneTasks,
        }, this.filterTasks)

        this.loadTasks()
    }

    loadTasks = async () => {
        try {
            const maxDate = moment().add({ days: this.props.daysAhead }).format('YYYY-MM-DD 23:59:59')
            const res = await axios.get(`${server}/tasks?date=${maxDate}`)

            const tasks = [...res.data]

            tasks.forEach(task => {
                task.isToggling = false
            })

            this.setState({ tasks }, this.filterTasks)
        } catch (e) {
            showError(e)
        }
        this.setState({ isLoading: false })
    }

    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks)
    }

    isPending = task => {
        return task.doneAt === null
    }

    filterTasks = () => {
        let visibleTasks = null
        if (this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks]
        } else {
            visibleTasks = this.state.tasks.filter(this.isPending)
        }

        this.setState({ visibleTasks })
        AsyncStorage.setItem('tasksState', JSON.stringify({
            showDoneTasks: this.state.showDoneTasks
        }))
    }

    toggleTask = async taskId => {
        // const tasks = [...this.state.tasks]

        // tasks.forEach(task => {
        //     if (task.id === taskId) {
        //         task.doneAt = task.doneAt ? null : new Date()
        //     }
        // })

        // this.setState({ tasks }, this.filterTasks)

        const tasks = [...this.state.tasks]

        tasks.forEach(task => {
            if (task.id === taskId) {
                task.isToggling = true
            }
        })

        this.setState({ tasks })

        try {
            await axios.put(`${server}/tasks/${taskId}/toggle`)
            this.loadTasks()
        } catch (e) {
            showError(e)
        }
    }

    addTask = async newTask => {
        if (!newTask.desc || !newTask.desc.trim()) {
            Alert.alert('Dados inválidos', 'Descrição não informada!')
            return
        }

        try {
            await axios.post(`${server}/tasks`, {
                desc: newTask.desc,
                estimateAt: newTask.date
            })

            this.setState({ showAddTask: false, isLoading: true }, this.loadTasks)
        } catch (e) {
            showError(e)
        }
    }

    deleteTask = taskId => {
        // const tasks = this.state.tasks.filter(task => task.id !== id)

        // this.setState({ tasks }, this.filterTasks) 

        const tasks = this.state.tasks.filter(task => task.id !== taskId)

        this.setState({ tasks },
            () => {
                this.filterTasks();
                this.deleteTaskFromServer(taskId);
            }
        )

    }

    deleteTaskFromServer = async taskId => {
        try {
            await axios.delete(`${server}/tasks/${taskId}`)
        } catch (e) {
            showError(e)

            this.loadTasks()
        }
    }

    getImage = () => {
        switch (this.props.daysAhead) {
            case 0: return todayImage
            case 1: return tomorrowImage
            case 7: return weekImage
            default: return monthImage
        }
    }

    getColor = () => {
        switch (this.props.daysAhead) {
            case 0: return commonStyles.colors.today
            case 1: return commonStyles.colors.tomorrow
            case 7: return commonStyles.colors.week
            default: return commonStyles.colors.month
        }
    }

    render() {
        const today = moment().locale('pt-br').format('ddd, D [de] MMMM')
        return (
            <View style={styles.container}>
                <AddTask isVisible={this.state.showAddTask}
                    onCancel={() => this.setState({ showAddTask: false })}
                    onSave={this.addTask} color={this.getColor()} />
                <ImageBackground source={this.getImage()} style={styles.background}>
                    <SafeAreaView style={commonStyles.safeArea}>
                        <View style={styles.iconBar}>
                            <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                                <IonIcons name='md-menu'
                                    size={26} color={commonStyles.colors.secondary} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.toggleFilter}>
                                <Icon name={this.state.showDoneTasks ? "eye" : "eye-slash"}
                                    size={24} color={commonStyles.colors.secondary} />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>{this.props.title}</Text>
                        <Text style={styles.subTitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    {this.state.isLoading ?
                        <Loading />
                        :
                        <FlatList
                            data={this.state.visibleTasks}
                            keyExtractor={item => `${item.id}`}
                            renderItem={({ item }) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTask} />}
                        />
                    }
                </View>
                <TouchableOpacity style={[styles.addButton, { backgroundColor: this.getColor() }]}
                    activeOpacity={0.7}
                    onPress={() => this.setState({ showAddTask: true })}>
                    <Icon name="plus" size={20}
                        color={commonStyles.colors.secondary} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    background: {
        height: 220
    },
    taskList: {
        flex: 1
    },
    titleBar: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 20,
        marginTop: 20
    },
    subTitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30
    },
    iconBar: {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'space-between',
        marginTop: 14
    },
    menuIcon: {
        marginTop: 1
    },
    addButton: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    }
})