import React, { Component } from 'react'
import {
    Modal,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TextInput,
    Text,
    Platform
} from 'react-native'

import moment from 'moment'
import 'moment/locale/pt-br'

import DateTimePicker from '@react-native-community/datetimepicker'
import { Dialog } from 'react-native-simple-dialogs';

import commonStyles from '../commonStyles'

const initialState = {
    desc: '',
    date: new Date(),
    showDatePicker: false
}

export default class AddTask extends Component {

    state = { ...initialState }

    save = () => {
        const newTask = {
            desc: this.state.desc,
            date: this.state.date
        }

        if (this.props.onSave) {
            this.props.onSave(newTask)
            this.setState({ ...initialState })
        }
    }

    getDatePicker = () => {
        let datePicker = <DateTimePicker value={this.state.date}
            onChange={(_, date) => this.setState({ date, showDatePicker: false })}
            mode='date' />

        const dateString = moment(this.state.date).locale('pt-br').format('ddd, D [de] MMMM [de] YYYY')

        if (Platform.OS === 'android') {
            datePicker = (
                <View>
                    <TouchableOpacity onPress={() => this.setState({ showDatePicker: true })}>
                        <Text style={styles.date}>
                            {dateString}
                        </Text>
                    </TouchableOpacity>
                    {this.state.showDatePicker && datePicker}
                </View>
            )
        }

        return datePicker
    }

    render() {
        return (
            // <Modal transparent={true} visible={this.props.isVisible}
            //     onRequestClose={this.props.onCancel}
            //     animationType='fade'>
            //     <TouchableWithoutFeedback
            //         onPress={this.props.onCancel}>
            //         <View style={styles.background}>
            //             <View style={styles.container}>
            //                 <TouchableWithoutFeedback onPress={null}>
            //                     <View>
            //                         <Text style={[styles.header, { backgroundColor: this.props.color }]}>Nova tarefa</Text>
            //                         <TextInput style={styles.input}
            //                             placeholder="Informe a descrição..."
            //                             onChangeText={desc => this.setState({ desc })}
            //                             value={this.state.desc} />
            //                         {this.getDatePicker()}
            //                         <View style={styles.buttons}>
            //                             <TouchableOpacity onPress={this.props.onCancel}>
            //                                 <Text style={[styles.button, { color: this.props.color }]}>Cancelar</Text>
            //                             </TouchableOpacity>
            //                             <TouchableOpacity onPress={this.save}>
            //                                 <Text style={[styles.button, { color: this.props.color }]}>Salvar</Text>
            //                             </TouchableOpacity>
            //                         </View>
            //                     </View>
            //                 </TouchableWithoutFeedback>
            //             </View>
            //         </View>
            //     </TouchableWithoutFeedback>
            // </Modal>

            <Dialog 
                visible={this.props.isVisible}
                animationType='fade'
                onTouchOutside={this.props.onCancel}
                title="Nova tarefa">

                <View style={styles.container}>
                    <TextInput style={styles.input}
                        placeholder="Informe a descrição..."
                        onChangeText={desc => this.setState({ desc })}
                        value={this.state.desc} />
                    {this.getDatePicker()}
                    <View style={styles.buttons}>
                        <TouchableOpacity onPress={this.props.onCancel}>
                            <Text style={[styles.button, { color: this.props.color }]}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.save}>
                            <Text style={[styles.button, { color: this.props.color, fontWeight: 'bold' }]}>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Dialog>
        )
    }
}

const styles = StyleSheet.create({
    // background: {
    //     flex: 1,
    //     backgroundColor: 'rgba(0, 0, 0, 0.7)',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     paddingLeft: 20,
    //     paddingRight: 20
    // },
    container: {
        width: '100%',
    },
    // header: {
    //     fontFamily: commonStyles.fontFamily,
    //     backgroundColor: commonStyles.colors.today,
    //     color: commonStyles.colors.secondary,
    //     textAlign: 'center',
    //     padding: 15,
    //     fontSize: 18
    // },
    input: {
        fontFamily: commonStyles.fontFamily,
        margin: 15,
        height: 40,
        marginTop: 10,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 6,
        paddingHorizontal: 15
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    button: {
        marginTop: 20,
        marginLeft: 20,
        color: commonStyles.colors.today
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 15,
    }
})