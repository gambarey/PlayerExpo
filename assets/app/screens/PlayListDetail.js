import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Modal, FlatList, Dimensions } from 'react-native';
import color from '../misc/color';
import AudioListItem from '../components/AudioListItem';
import { AudioContext } from '../context/AudioProvider';
import { selectAudio } from '../misc/AudioController';
import OptionModal from '../components/OptionModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PlayListDetail = (props) => {
  const context = useContext(AudioContext);
  const playList = props.playList; ////// props.playList / props.route.params

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [audios, setAudios] = useState(playList.audios);

  const playAudio = async audio => {
    await selectAudio(audio, context, {
      activePlayList: playList,
      isPlayListRunning: true
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem({});
  };

  const removeAudio = async () => {
    let isPlaying = context.isPlaying;
    let isPlayListRunning = context.isPlayListRunning;
    let activePlayList = context.activePlayList;
    let playbackPosition = context.playbackPosition;
    let soundObj = context.soundObj;

    if (context.isPlayListRunning && selectedItem.id === context.currentAudio.id) {
      await context.playbackObj.stopAsync();
      await context.playbackObj.unloadAsync();
      isPlaying = false;
      isPlayListRunning = false;
      activePlayList = [];
      playbackPosition = 0;
      soundObj = null;
    }

    const newAudios = audios.filter(audio => audio.id !== selectedItem.id);
    const result = await AsyncStorage.getItem('playlist');
    if (result !== null) {
      const oldPlayLists = JSON.parse(result);
      const updatedPlayLists = oldPlayLists.filter(item => {
        if (item.id === playList.id) {
          item.audios = newAudios
        }

        return item
      })

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

  return (
    // console.log(playList.title)
    <>
      <View style={styles.container}>
        <Text style={styles.title}>{playList.title}</Text>
        {audios.length ?
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
          : <Text
            style={{
              fontWeight: "bold",
              color: color.FONT_LIGHT,
              fontSize: 25,
              paddingTop: 50,
              textAlign: 'center'
            }}>No audio found</Text>
        }

      </View>
      <OptionModal
        visible={modalVisible}
        onClose={closeModal}
        options={[{ title: "Remove from playlist", onPress: removeAudio }]}
        currentItem={selectedItem} />
    </>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  //////just alignCenter and remove line above width and height
  container: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    width: width - 15,
    height: height - 250,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  listContainer: {
    padding: 20
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    paddingVertical: 5,
    fontWeight: 'bold',
    color: color.ACTIVE_BG
  }
});

export default PlayListDetail;
