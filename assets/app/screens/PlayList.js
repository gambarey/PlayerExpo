import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import color from '../misc/color';

const PlayList = () => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.playListBanner}>
                <Text>My Favourite</Text>
                <Text style={styles.audioCount}>0 songs</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log("adding to playlist")} style={{marginTop: 15}} >
                <Text style={styles.playListBtn} >+ Add New Playlist</Text>
            </TouchableOpacity>
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
