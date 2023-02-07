import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import { Audio } from 'expo-av';
import { play, pause, resume, playNext } from '../misc/AudioController';

export class AudioList extends Component {
    static contextType = AudioContext;

    constructor(props) {
        super(props);
        this.state = {
            optionModalVisible: false,
        };
        this.currentItem = {};
    }

    layoutProvider = new LayoutProvider((i) => "audio", (type, dim) => {
        dim.width = Dimensions.get("window").width;
        dim.height = 70;
    })

    handleAudioPress = async audio => {
        const { playbackObj, soundObj, currentAudio, updateState } = this.context;
        // play audio for the first time
        if (soundObj === null) {
            const playbackObj = new Audio.Sound();
            const status = await play(playbackObj, audio.uri)
            return updateState(this.context, {
                playbackObj,
                soundObj: status,
                currentAudio: audio,
                isPlaying: true
            })
        }
        // pause audio - use uri instead of id?
        if (soundObj.isLoaded && soundObj.isPlaying
            && currentAudio.id === audio.id) {
            const status = await pause(playbackObj);
            return updateState(this.context, {
                soundObj: status,
                isPlaying: false
            })
        }
        // resume audio
        if (soundObj.isLoaded &&
            !soundObj.isPlaying
            && currentAudio.id === audio.id) {
            const status = await resume(playbackObj);
            return updateState(this.context, {
                soundObj: status,
                isPlaying: true
            });
        }


        // select another audio
        if (soundObj.isLoaded && currentAudio.id !== audio.id) {
            const status = await playNext(playbackObj, audio.uri);
            return updateState(this.context, {
                soundObj: status,
                currentAudio: audio,
                isPlaying: true
            })
        }
    }

    rowRenderer = (type, item, index, extendedState) => {
        return (
            <AudioListItem
                title={item.filename}
                isPlaying={extendedState.isPlaying}
                duration={item.duration}
                onAudioPress={() => this.handleAudioPress(item)}
                onOptionPress={() => {
                    this.currentItem = item;
                    this.setState({ ...this.state, optionModalVisible: true })
                }}
            />
        );
    }

    render() {
        return (
            <AudioContext.Consumer>
                {({ dataProvider, isPlaying }) => {
                    return (
                        <Screen>
                            <RecyclerListView
                                dataProvider={dataProvider}
                                layoutProvider={this.layoutProvider}
                                rowRenderer={this.rowRenderer}
                                extendedState={{isPlaying}}
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


