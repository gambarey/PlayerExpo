import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import color from '../misc/color';
import AudioListItem from '../components/AudioListItem';
import { AudioContext } from '../context/AudioProvider';
import { selectAudio } from '../misc/AudioController';
import OptionModal from '../components/OptionModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlayListDetail = props => {
  const context = useContext(AudioContext);
  const playList = props.route.params; ////// props.playList / props.route.params

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [audios, setAudios] = useState(playList.audios);

  const playAudio = async audio => {
    await selectAudio(audio, context, {
      activePlayList: playList,
      isPlayListRunning: true,
    });
  };

  const closeModal = () => {
    setSelectedItem({});
    setModalVisible(false);
  };

  const removeAudio = async () => {
    let isPlaying = context.isPlaying;
    let isPlayListRunning = context.isPlayListRunning;
    let soundObj = context.soundObj;
    let playbackPosition = context.playbackPosition;
    let activePlayList = context.activePlayList;

    if (
      context.isPlayListRunning &&
      context.currentAudio.id === selectedItem.id
    ) {
      await context.playbackObj.stopAsync();
      await context.playbackObj.unloadAsync();
      isPlaying = false;
      isPlayListRunning = false;
      soundObj = null;
      playbackPosition = 0;
      activePlayList = [];
    }

    const newAudios = audios.filter(audio => audio.id !== selectedItem.id);
    const result = await AsyncStorage.getItem('playlist');
    if (result !== null) {
      const oldPlayLists = JSON.parse(result);
      const updatedPlayLists = oldPlayLists.filter(item => {
        if (item.id === playList.id) {
          item.audios = newAudios;
        }

        return item;
      });

      AsyncStorage.setItem('playlist', JSON.stringify(updatedPlayLists));
      context.updateState(context, {
        playList: updatedPlayLists,
        isPlayListRunning,
        activePlayList,
        playbackPosition,
        isPlaying,
        soundObj
      });
    }

    setAudios(newAudios);
    closeModal();
  };

  const removePlaylist = async () => {
    let isPlaying = context.isPlaying;
    let isPlayListRunning = context.isPlayListRunning;
    let soundObj = context.soundObj;
    let playbackPosition = context.playbackPosition;
    let activePlayList = context.activePlayList;

    if (context.isPlayListRunning &&
      activePlayList.id === playList.id) {
      await context.playbackObj.stopAsync();
      await context.playbackObj.unloadAsync();
      isPlaying = false;
      isPlayListRunning = false;
      soundObj = null;
      playbackPosition = 0;
      activePlayList = [];
    }

    const result = await AsyncStorage.getItem('playlist');
    if (result !== null) {
      const oldPlayLists = JSON.parse(result);
      const updatedPlayLists = oldPlayLists.filter(
        item => item.id !== playList.id
      );

      AsyncStorage.setItem('playlist', JSON.stringify(updatedPlayLists));
      context.updateState(context, {
        playList: updatedPlayLists,
        isPlayListRunning,
        activePlayList,
        playbackPosition,
        isPlaying,
        soundObj,
      });
    }

    props.navigation.goBack();
  };

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: color.BORDER
          }}
        >
          <Text style={styles.title}>{playList.title}</Text>
          <TouchableOpacity onPress={removePlaylist}>
            <Text style={[styles.title, { 
              backgroundColor: color.FONT_LIGHT, 
              padding: 15, 
              borderRadius: 5, 
              fontSize: 12 }]}>Remove PlayList</Text>
          </TouchableOpacity>
        </View>
        {audios.length ? (
          <FlatList
            contentContainerStyle={styles.listContainer}
            data={audios}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{ marginBottom: 10 }}>
                <AudioListItem
                  title={item.filename}
                  duration={item.duration}
                  isPlaying={context.isPlaying}
                  activeListItem={item.id === context.currentAudio.id}
                  onAudioPress={() => playAudio(item)}
                  onOptionPress={() => {
                    setSelectedItem(item);
                    setModalVisible(true);
                  }}
                />
              </View>
            )}
          />
        ) : (
          <Text
            style={{
              fontWeight: "bold",
              color: color.FONT_LIGHT,
              fontSize: 25,
              paddingTop: 50,
              textAlign: 'center'
            }}>No audio found</Text>
        )
        }
        <Text
          style={{
            color: color.FONT_LIGHT
          }}>Press "back" to see all Playlists</Text>
      </View>
      <OptionModal
        visible={modalVisible}
        onClose={closeModal}
        options={[{ title: "Remove from playlist", onPress: removeAudio }]}
        currentItem={selectedItem} />
    </>
  );
};

// const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  //////just alignCenter and remove line above width and height
  container: {
    // position: 'absolute',
    // bottom: 0,
    alignItems: 'center',
    // width: width - 15,
    // height: height - 350,
    // backgroundColor: 'white',
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
  },
  listContainer: {
    padding: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    paddingVertical: 5,
    fontWeight: 'bold',
    color: color.ACTIVE_BG,
  },
});

export default PlayListDetail;
