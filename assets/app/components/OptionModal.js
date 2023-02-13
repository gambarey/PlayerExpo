//import liraries
import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import color from '../misc/color';

const OptionModal = ({
    visible,
    onClose,
    currentItem,
    onPlayPress,
    onPlaylistPress,
    options
}) => {
    const { filename } = currentItem;

    return (
        <>
            <StatusBar hidden />
            <Modal animationType='slide' transparent visible={visible}>
                <View style={styles.modal}>
                    <Text numberOfLines={2} style={styles.title}>
                        {filename}
                    </Text>
                    <View style={styles.optionContainer}>
                        {options.map(option => {
                            return (
                                <TouchableWithoutFeedback
                                    key={option.title}
                                    onPress={option.onPress}
                                >
                                    <Text style={styles.option}>
                                        {option.title}
                                    </Text>
                                </TouchableWithoutFeedback>
                            );
                        })}
                        {/* <TouchableWithoutFeedback onPress={onPlayPress}>
                            <Text style={styles.option}>Play</Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={onPlaylistPress}>
                            <Text style={styles.option}>Add to Playlist</Text>
                        </TouchableWithoutFeedback> */}
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.modalBg} />
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
};

// define your styles
const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: color.APP_BG,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        zIndex: 1000
    },
    optionContainer: {
        padding: 20
    },
    title: {
        color: color.FONT_MEDIUM,
        fontSize: 18,
        fontWeight: 'bold',
        padding: 20,
        paddingBottom: 0
    },
    option: {
        color: color.FONT,
        fontSize: 16,
        paddingVertical: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    modalBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: color.MODAL_BG
    }
});

//make this component available to the app
export default OptionModal;
