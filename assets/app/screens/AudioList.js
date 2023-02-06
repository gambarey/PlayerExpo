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
            optionModalVisible: false,
            playbackObj: null,
            soundObj: null,
            currentAudio: {}
        };
        this.currentItem = {};
    }

    layoutProvider = new LayoutProvider((i) => "audio", (type, dim) => {
        dim.width = Dimensions.get("window").width;
        dim.height = 70;
    })

    handleAudioPress = async audio => {
        // play audio for the first time
        if (this.state.soundObj === null) {
            const playbackObject = new Audio.Sound();
            const status = await playbackObject.loadAsync(
                { uri: audio.uri },
                { shouldPlay: true }
            );
            return this.setState({
                ...this.state,
                currentAudio: audio,
                playbackObj: playbackObject,
                soundObj: status
            });
        }
        // pause audio
        if (this.state.soundObj.isLoaded && this.state.soundObj.isPlaying 
            && this.state.currentAudio.id === audio.id) {
            const status = await this.state.playbackObj.setStatusAsync( { shouldPlay: false });
            return this.setState({
                ...this.state,
                soundObj: status
            });
        }
        // resume audio
        if (this.state.soundObj.isLoaded && !this.state.soundObj.isPlaying 
            && this.state.currentAudio.id === audio.id) {
            const status = await this.state.playbackObj.setStatusAsync( { shouldPlay: true });
            return this.setState({
                ...this.state,
                soundObj: status
            });
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


