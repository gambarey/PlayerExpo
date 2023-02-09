import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import PlayListInputModal from '../components/PlayListInputModal';
import color from '../misc/color';

const PlayList = () => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.playListBanner}>
                <Text>My Favourite</Text>
                <Text style={styles.audioCount}>0 songs</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{ marginTop: 15 }} >
                <Text style={styles.playListBtn} >+ Add New Playlist</Text>
            </TouchableOpacity>
            <PlayListInputModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)} />
        </ScrollView>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    playListBanner: {
        backgroundColor: 'rgba(204,204,204,0.3)',
        padding: 5,
        borderRadius: 5
    },
    audioCount: {
        marginTop: 3,
        opacity: 0.5,
        fontSize: 14
    },
    playListBtn: {
        color: color.ACTIVE_BG,
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        padding: 5
    }

});

//make this component available to the app
export default PlayList;
