import { storeAudioForNextOpening } from "./helper";

// play audio
export const play = async (playbackObj, uri, lastPosition) => {
  try {
    if (!lastPosition) return await playbackObj.loadAsync(
      { uri },
      { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
    );

    // if (lastPosition) 
    await playbackObj.loadAsync(
      { uri },
      { progressUpdateIntervalMillis: 1000 }
      );

    return await playbackObj.playFromPositionAsync(lastPosition);

  } catch (error) {
    console.log("error play method", error.message);
  }
};
// pause audio
export const pause = async (playbackObj) => {
  try {
    return await playbackObj.setStatusAsync({
      shouldPlay: false,
    });
  } catch (error) {
    console.log("error pause method", error.message);
  }
};
// resume audio
export const resume = async (playbackObj) => {
  try {
    return await playbackObj.playAsync();
  } catch (error) {
    console.log("error resume method", error.message);
  }
};
// select another audio
export const playNext = async (playbackObj, uri) => {
  try {
    await playbackObj.stopAsync();
    await playbackObj.unloadAsync();
    return await play(playbackObj, uri);
  } catch (error) {
    console.log("error playNext method", error.message);
  }
};

export const selectAudio = async (audio, context, playListInfo) => {
  try {
    const {
      playbackObj,
      soundObj,
      currentAudio,
      updateState,
      audioFiles,
      onPlaybackStatusUpdate
    } = context;
    // play audio for the first time
    if (soundObj === null) {
      const status = await play(playbackObj, audio.uri, audio.lastPosition)
      const index = audioFiles.findIndex(({ id }) => id === audio.id);
      updateState(context, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: index,
        isPlayListRunning: false,
        activePlaylist: [],
        ...playListInfo
      });
      playbackObj.setOnPlaybackStatusUpdate(
        onPlaybackStatusUpdate
      );
      return storeAudioForNextOpening(audio, index);
    }
    // pause audio - use uri instead of id?
    if (soundObj.isLoaded && soundObj.isPlaying
      && currentAudio.id === audio.id) {
      const status = await pause(playbackObj);
      return updateState(context, {
        soundObj: status,
        isPlaying: false,
        playbackPosition: status.positionMillis,
      });
    }
    // resume audio
    if (soundObj.isLoaded &&
      !soundObj.isPlaying
      && currentAudio.id === audio.id) {
      const status = await resume(playbackObj);
      return updateState(context, {
        soundObj: status,
        isPlaying: true
      });
    }

    // select another audio
    if (soundObj.isLoaded && currentAudio.id !== audio.id) {
      const status = await playNext(playbackObj, audio.uri);
      const index = audioFiles.findIndex(({ id }) => id === audio.id);
      updateState(context, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: index,
        isPlayListRunning: false,
        activePlaylist: [],
        ...playListInfo
      });
      return storeAudioForNextOpening(audio, index);
    }

  } catch (error) {
    console.log("error inside selectAudio", error.message)
  }
};

export const selectAudioFromPlaylist = async (context, select) => {
  const { activePlayList, playbackObj, currentAudio, updateState, audioFiles } = context;
  let audio;
  let defaultIndex;
  let nextIndex;

  const indexOnPlayList = activePlayList.audios.findIndex(
    ({ id }) => id === currentAudio.id);

  if (select === "next") {
    nextIndex = indexOnPlayList + 1;
    defaultIndex = 0;
  }

  if (select === "previous") {
    nextIndex = indexOnPlayList - 1;
    defaultIndex = activePlayList.audios.length - 1;
  }

  audio = activePlayList.audios[nextIndex];

  if (!audio) audio = activePlayList.audios[defaultIndex];

  const indexOnAllList = audioFiles.findIndex(
    ({ id }) => id === audio.id);

  const status = await playNext(playbackObj, audio.uri);
  return updateState(context, {
    soundObj: status,
    currentAudio: audio,
    isPlaying: true,
    currentAudioIndex: indexOnAllList
  });
}

export const changeAudio = async (context, select) => {
  const {
    playbackObj,
    currentAudioIndex,
    totalAudioCount,
    audioFiles,
    updateState,
    onPlaybackStatusUpdate,
    isPlayListRunning
  } = context;

  if (isPlayListRunning) return selectAudioFromPlaylist(context, select);
  try {
    const { isLoaded } = await playbackObj.getStatusAsync();
    const isLastAudio = currentAudioIndex + 1 === totalAudioCount; ////
    const isFirstAudio = currentAudioIndex === 0;
    let audio;
    let index;
    let status;

    //for next
    if (select === "next") {
      audio = audioFiles[currentAudioIndex + 1];
      if (!isLoaded && !isLastAudio) {
        status = await play(playbackObj, audio.uri);
        index = currentAudioIndex + 1;
        playbackObj.setOnPlaybackStatusUpdate(
          onPlaybackStatusUpdate
        );
      }

      if (isLoaded && !isLastAudio) {
        status = await playNext(playbackObj, audio.uri);
        index = currentAudioIndex + 1;
      }

      if (isLastAudio) {
        index = 0;
        audio = audioFiles[index];
        if (isLoaded) {
          status = await playNext(playbackObj, audio.uri);
        } else {
          status = await play(playbackObj, audio.uri);
        }
      }
    }
    //for previous
    if (select === "previous") {
      audio = audioFiles[currentAudioIndex - 1];
      if (!isLoaded && !isFirstAudio) {
        status = await play(playbackObj, audio.uri);
        index = currentAudioIndex - 1;
        playbackObj.setOnPlaybackStatusUpdate(
          onPlaybackStatusUpdate
        );
      }

      if (isLoaded && !isFirstAudio) {
        status = await playNext(playbackObj, audio.uri);
        index = currentAudioIndex - 1;
      }

      if (isFirstAudio) {
        index = totalAudioCount - 1;
        audio = audioFiles[index];
        if (isLoaded) {
          status = await playNext(playbackObj, audio.uri);
        } else {
          status = await play(playbackObj, audio.uri);
        }
      }
    }


    updateState(context, {
      soundObj: status,
      currentAudio: audio,
      isPlaying: true,
      currentAudioIndex: index,
      playbackPosition: null,
      playbackDuration: null,
    });
    storeAudioForNextOpening(audio, index);
  } catch (error) {
    console.log("error inside changeAudio", error.message)
  }
}

export const moveAudio = async (context, value) => {
  const { soundObj, isPlaying, playbackObj, updateState } = context;
  if (soundObj === null || !isPlaying)
    return;
  try {
    const status = await playbackObj.setPositionAsync(Math.floor(value * soundObj.durationMillis));
    updateState(context, {
      soundObj: status,
      playbackPosition: status.positionMillis
    })
    await resume(playbackObj);
  } catch (error) {
    console.log("error inside onSlidingComplete callback", error.message)
  }
}

