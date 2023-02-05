//import liraries
import React, { Component, createContext, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import * as MediaLibrary from "expo-media-library";

export const AudioContext = createContext()
export class AudioProvider extends Component {

    constructor(props) {
        super(props)
        this.state = {
            audioFiles: [],
            permissionError: false
        }
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
        let media = await MediaLibrary.getAssetsAsync({
            mediaType: "audio",
        });
        media = await MediaLibrary.getAssetsAsync({
            mediaType: "audio",
            first: media.totalCount,
        });
        this.setState({ ...this.state, audioFiles: media.assets })
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

    render() {
        if (this.state.permissionError)
            return
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
<Text style={{fontSize: 24, textAlign: 'center'}}>
    You haven´t allowed the app to access files on your device
</Text>
        </View>
    return(
            <AudioContext.Provider value = {{ audioFiles: this.state.audioFiles }}>
    { this.props.children }
            </AudioContext.Provider >
        );
    }
}

//make this component available to the app
export default AudioProvider;
