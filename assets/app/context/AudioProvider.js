import React, { Component, createContext, useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from 'recyclerlistview';

export const AudioContext = createContext()
export class AudioProvider extends Component {

    constructor(props) {
        super(props)
        this.state = {
            audioFiles: [],
            permissionError: false,
            dataProvider: new DataProvider((r1, r2) => r1 !== r2),
            playbackObj: null,
            soundObj: null,
            currentAudio: {},
            isPlaying: false,
            currentAudioIndex: null,
        };
        this.totalAudioCount = 0
    }

    permissionAlert = () => {
        Alert.alert("Permission Required", "This app needs permission to read audio files",
            [{
                text: "Ok",
                onPress: () => this.getPermission()
            }, {
                text: "Cancel",
                onPress: () => this.permissionAlert()
            }])
    }

    getAudioFiles = async () => {
        const { dataProvider, audioFiles } = this.state
        let media = await MediaLibrary.getAssetsAsync({
            mediaType: "audio",
        });
        media = await MediaLibrary.getAssetsAsync({
            mediaType: "audio",
            first: media.totalCount,
        });
        this.totalAudioCount = media.totalCount

        this.setState({
            ...this.state,
            dataProvider: dataProvider.cloneWithRows([...audioFiles, ...media.assets]),
            audioFiles: [...audioFiles, ...media.assets]
        });
    };

    getPermission = async () => {
        // { 
        // "canAskAgain": true, 
        // "expires": "never", 
        // "granted": false, 
        // "status": "undetermined" 
        // }
        const permission = await MediaLibrary.getPermissionsAsync()
        if (permission.granted) {
            this.getAudioFiles()
        }

        if (!permission.canAskAgain && !permission.granted) {
            this.setState({ ...this.state, permissionError: true });
        }
        if (!permission.granted && permission.canAskAgain) {
            const { status, canAskAgain } = await
                MediaLibrary.requestPermissionsAsync();
            if (status === "denied" && canAskAgain) {
                this.permissionAlert()
            }
            if (status === "granted") {
                this.getAudioFiles()
            }
            if (status === "denied" && !canAskAgain) {
                this.setState({ ...this.state, permissionError: true })
            }
        }
    }

    componentDidMount() {
        this.getPermission()
    }

    updateState = (prevState, newState) => {
        this.setState({ ...prevState, ...newState })
    }

    render() {
        const {
            audioFiles,
            dataProvider,
            permissionError,
            playbackObj,
            soundObj,
            currentAudio,
            isPlaying,
            currentAudioIndex,
        } = this.state;
        // if (permissionError)
        //     return (
        // <View style={{
        //     flex: 1,
        //     justifyContent: 'center',
        //     alignItems: 'center'
        // }}>
        //     <Text style={{ fontSize: 24, textAlign: 'center' }}>
        //         You haven´t allowed the app to access files on your device
        //     </Text>
        //     <TouchableOpacity style={{marginTop: 20, backgroundColor: "green", borderRadius: 5, padding: 10}} onPress={this.permissionAlert}>
        //         <Text style={{ fontSize: 18, textAlign: 'center' }}>Grant permissions</Text>
        //     </TouchableOpacity>
        // </View>
        // );
        return (
            <AudioContext.Provider
                value={{
                    audioFiles,
                    dataProvider,
                    playbackObj,
                    soundObj,
                    currentAudio,
                    isPlaying,
                    currentAudioIndex,
                    updateState: this.updateState,
                    totalAudioCount: this.totalAudioCount,
                }}
            >
                {this.props.children}
            </AudioContext.Provider >
        );
    }
}

export default AudioProvider;
