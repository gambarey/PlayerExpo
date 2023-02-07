import React, { useContext } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import color from '../misc/color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProvider';

const { width } = Dimensions.get('window');

const Player = () => {
    const context = useContext(AudioContext);
    const { playbackPosition, playbackDuration } = context;

    const calculateSeekBar = () => {
        if (playbackPosition !== null && playbackDuration !== null) {
            return playbackPosition / playbackDuration;
        }
        return 0;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.audioIndex}>{`${context.currentAudioIndex + 1} / ${context.totalAudioCount}`}</Text>
            <View style={styles.midBannerContainer}>
                <MaterialCommunityIcons
                    name="music-circle"
                    size={300}
                    color={context.isPlaying ? color.ACTIVE_BG : color.FONT_LIGHT} />
            </View>
            <View style={styles.audioPlayerContainer}>
                <Text numberOfLines={1} style={styles.audioTitle} >{context.currentAudio.filename}</Text>
                <Slider
                    style={{ width: width, height: 40 }}
                    minimumValue={0}
                    maximumValue={1}
                    value={calculateSeekBar()}
                    minimumTrackTintColor={color.FONT_MEDIUM}
                    maximumTrackTintColor={color.ACTIVE_BG}
                />
                <View style={styles.audioControllers}>
                    <PlayerButton iconType="backward" />
                    <PlayerButton onPress={() => console.log("play pressed")} iconType={context.isPlaying ? "pause" : "play"} />
                    <PlayerButton iconType="forward" />
                </View>
            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    audioControllers: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 20,
        marginHorizontal: 60
    },
    audioCount: {
        color: color.FONT_LIGHT,
        padding: 15,
        textAlign: 'right',
        fontSize: 14
    },
    midBannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    audioTitle: {
        color: color.FONT,
        fontSize: 16,
        padding: 15
    },
});

//make this component available to the app
export default Player;
