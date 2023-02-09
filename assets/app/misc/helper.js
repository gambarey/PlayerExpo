import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeAudioForNextOpening = async (audio, index) => {
    try {
        await AsyncStorage.setItem('previousAudio', JSON.stringify({ audio, index }));
    } catch (error) {
        console.log("error storeAudioForNextOpening method", error.message);
    }
};