//import liraries
import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import * as MediaLibrary from expo - media - library;

// create a component
export class AudioProvider extends Component {

constructor(props) {
    super(props)
}

permissionAlert = () => {
    Alert.alert("Permission Required", "This app needs permission to read audio files",
    [{
        text: "Ok",
        onPress: () => this.getPermission( )
    }, {
        text: "Cancel",
        onPress: () => this.permissionAlert()
    }])
}

getPermission = async () => {
     // { 
    // "canAskAgain": true, 
    // "expires": "never", 
    // "granted": false, 
    // "status": "undetermined" 
    // }
    const permission = await MediaLibrary.getPermissionsAsync()
    if (!permission.granted && permission.canAskAgain){
        requestPermissionsAsync();
        if (status === "denied" && canAskAgain){
            this.permissionAlert()
        }
        if (status === "granted"){

        }
        if (status === "denied" && !canAskAgain)
    }
}

componentDidMount() {
    this.getPermission()
}

render() {
    return (
        <View style={styles.container}>
            <Text>AudioProvider</Text>
        </View>
    );
}
}

//make this component available to the app
export default AudioProvider;
