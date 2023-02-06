import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import { Audio } from 'expo-av';

export class AudioList extends Component {
    static contextType = AudioContext;

    constructor(props) {
        super(props);
        this.state = {
            optionModalVisible: false
        };
        this.currentItem = {};
    }

    layoutProvider = new LayoutProvider((i) => "audio", (type, dim) => {
        dim.width = Dimensions.get("window").width;
        dim.height = 70;
    })

    handleAudioPress = audio => {
        const playbackObject = new Audio.Sound();
        try {
            playbackObject.loadAsync({ uri: audio.uri }, {shouldPlay: true})
        } catch (error) {
            console.log(error);
        }
    }

    rowRenderer = (type, item) => {
        return <AudioListItem
            title={item.filename}
            duration={item.duration}
            onAudioPress={() => this.handleAudioPress(item)}
            onOptionPress={() => {
                this.currentItem = item;
                this.setState({ ...this.state, optionModalVisible: true })
            }}
        />
    }

    render() {
        return (
            <AudioContext.Consumer>
                {({ dataProvider }) => {
                    return (
                        <Screen>
                            <RecyclerListView
                                dataProvider={dataProvider}
                                layoutProvider={this.layoutProvider}
                                rowRenderer={this.rowRenderer}
                            />
                            <OptionModal
                                onPlayPress={() => {
                                    console.log("Play Pressed");
                                }}
                                onPlaylistPress={() => {
                                    console.log("Playlist Pressed");
                                }}
                                currentItem={this.currentItem}
                                onClose={() => this.setState({ ...this.state, optionModalVisible: false })} visible={this.state.optionModalVisible} />
                        </Screen>
                    );
                }}
            </AudioContext.Consumer>
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


