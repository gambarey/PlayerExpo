import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeAudioForNextOpening = async (audio, index, lastPosition) => {
  try {
    await AsyncStorage.setItem('previousAudio',
      JSON.stringify({ audio: { ...audio, lastPosition }, index }));
  } catch (error) {
    console.log("error storeAudioForNextOpening method", error.message);
  }
};

export const convertTime = minutes => {
  if (minutes) {
    const h = minutes / 60;
    const minute = h.toString().split('.')[0];
    const percent = parseInt(h.toString().split('.')[1].slice(0, 2));
    const sec = Math.ceil((percent * 60) / 100);

    if (parseInt(minute) < 10 && sec < 10) {
      return `0${minute}:0${sec}`;
    }
    if (sec == 60) {
      return `${minute + 1}:00`;
    }
    if (parseInt(minute) < 10) {
      return `0${minute}:${sec}`;
    }
    if (seconds < 10) {
      return `${minute}:0${sec}`;
    }
    else {
      return `${minute}:${sec}`;
    }
  };
};