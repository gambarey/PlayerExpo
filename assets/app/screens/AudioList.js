//import liraries
import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { AudioContext } from '../context/AudioProvider';

// create a component
export class AudioList extends Component {
    static contextType = AudioContext
    render() {
        return (
            <ScrollView>
                {this.context.audioFiles.map(item => <Text style={{
                    padding: 10,
                    borderBottomColor: "gray",
                    borderBottomWidth: 1
                }}
                    key={item.id}>{item.filename}
                </Text>)}
            </ScrollView>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

export default AudioList


