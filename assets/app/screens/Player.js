import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import color from '../misc/color';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProvider';
import { play, pause, resume, playNext, selectAudio, changeAudio, moveAudio } from '../misc/AudioController';
import { convertTime, storeAudioForNextOpening } from '../misc/helper';

const { width } = Dimensions.get('window');

const Player = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const context = useContext(AudioContext);
  const { playbackPosition, playbackDuration } = context;

  const calculateSeekBar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }
    return 0;
  }

  useEffect(() => {
    context.loadPreviousAudio();
  }, []);

  const handlePlayPause = async () => {
    // play audio
    await selectAudio(context.currentAudio, context);
  }

  const handleNext = async () => {
    await changeAudio(context, 'next');
  }

  const handlePrevious = async () => {
    await changeAudio(context, "previous");
  }

  if (!context.currentAudio) {
    return null;
  }

  const renderCurrentTime = () => {
    return convertTime(context.playbackPosition / 1000);
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
        <Text numberOfLines={1}
          style={styles.audioTitle} >
          {context.currentAudio.filename}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 15
          }}
        >
          <Text>{convertTime(context.currentAudio.duration)}</Text>
          <Text>{currentPosition ? currentPosition : renderCurrentTime()}</Text>
        </View>
        <Slider
          style={{ width: width, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={calculateSeekBar()}
          minimumTrackTintColor={color.FONT_MEDIUM}
          maximumTrackTintColor={color.ACTIVE_BG}
          onValueChange={value => {
            setCurrentPosition(
              convertTime(value * context.currentAudio.duration));
          }}
          onSlidingStart={async () => {
            if (!context.isPlaying)
              return;
            try {
              await pause(context.playbackObj);
            } catch (error) {
              console.log("error inside onSlidingStart callback", error.message)
            }
          }}
          onSlidingComplete={async value => {
            await moveAudio(context, value);
            setCurrentPosition(0);
          }}
        />
        <View style={styles.audioControllers}>
          <PlayerButton
            onPress={handlePrevious}
            iconType="backward" />
          <PlayerButton
            onPress={handlePlayPause}
            iconType={context.isPlaying ? "pause" : "play"} />
          <PlayerButton
            onPress={handleNext}
            iconType="forward" />
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
