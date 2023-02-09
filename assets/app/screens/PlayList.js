import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import PlayListInputModal from '../components/PlayListInputModal';
import color from '../misc/color';
import { AudioContext } from '../context/AudioProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlayList = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const context = useContext(AudioContext)
    const { playList, addToPlayList, updateState } = context;

    const createPlayList = async playlistName => {
        const result = await AsyncStorage.getItem('playlist');
        if (result !== null) {
            const audios = [];
            if (addToPlayList) {
                audios.push(addToPlayList);
            }
            const newList = {
                id: Date.now(),
                title: playlistName,
                audios: audios
            }

            const updatedList = [...playList, newList];
            updateState(context, { addToPlayList: null, playList: updatedList });
            await AsyncStorage.setItem('playlist', JSON.stringify(updatedList));
        }
        setModalVisible(false);
    }

    const renderPlayList = async () => {
        //         const keys = await AsyncStorage.getAllKeys();
        // await AsyncStorage.multiRemove(keys);
        const result = await AsyncStorage.getItem('playlist');
        if (result === null) {
            const defaultPlayList = {
                id: Date.now(),
                title: 'My Favourite',
                audios: []
            }

            const newPlayList = [...playList, defaultPlayList];
            updateState(context, { playList: newPlayList });
            return await AsyncStorage.setItem('playlist', JSON.stringify([...newPlayList]));
        }
        updateState(context, { playList: JSON.parse(result) });
    }

    useEffect(() => {
        if (!playList.length) {
            renderPlayList();
        }
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {playList.length
                ? playList.map(item => (
                    <TouchableOpacity
                        key={item.id.toString()}
                        style={styles.playListBanner}
                    >
                        <Text>{item.title}</Text>
                        <Text style={styles.audioCount}>
                            {item.audios.length === 1
                                ? `${item.audios.length} Song`
                                : `${item.audios.length} Songs`
                            }
                        </Text>
                    </TouchableOpacity>
                ))
                : null
            }

            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{ marginTop: 15 }} >
                <Text style={styles.playListBtn} >+ Add New Playlist</Text>
            </TouchableOpacity>
            <PlayListInputModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={(playlistName) => createPlayList(playlistName)}
            />
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
        borderRadius: 5,
        marginBottom: 15
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

export default PlayList;


