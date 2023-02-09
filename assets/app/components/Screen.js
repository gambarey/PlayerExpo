import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import color from '../misc/color';

const Screen = ({ children }) => {
    return (
        <View style={styles.container}>{children}</View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        backgroundColor: color.APP_BG
    },
});

export default Screen;
