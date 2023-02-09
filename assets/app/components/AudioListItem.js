import React from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import color from '../misc/color';

const convertTime = minutes => {
    if (minutes) {
        const h = minutes / 60;
        const minute = h.toString().split('.')[0];
        const percent = parseInt(h.toString().split('.')[1].slice(0, 2));
        const seconds = Math.ceil((percent * 60) / 100);

        if (parseInt(minute) < 10 && seconds < 10) {
            return `0${minute}:0${seconds}`;
        }
        else if (parseInt(minute) < 10) {
            return `0${minute}:${seconds}`;
        }
        else if (seconds < 10) {
            return `${minute}:0${seconds}`;
        }
        else {
            return `${minute}:${seconds}`;
        }
    };
};

const renderPlayPauseIcon = (isPlaying) => {
    if (isPlaying) {
        return (
            <Entypo name="controller-paus" size={24} color={color.ACTIVE_FONT} />
        );
    }
    else {
        return (
            <Entypo name="controller-play" size={24} color={color.ACTIVE_FONT} />
        );
    }
};


const AudioListItem = ({
    title,
    duration,
    onOptionPress,
    onAudioPress,
    isPlaying,
    activeListItem
}) => {
    return (
        <>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={onAudioPress}>
                    <View style={styles.leftContainer}>
                        <View style={[styles.thumbnail, {backgroundColor: 
                        activeListItem ? color.ACTIVE_BG : color.FONT_LIGHT}]}>
                            {activeListItem ? renderPlayPauseIcon(isPlaying)
                                : <Text style={styles.thumbnailText}>{title[0]}</Text>}
                        </View>
                        <View style={styles.titleContainer}>
                            <Text numberOfLines={1} style={styles.title}>{title}</Text>
                            <Text style={styles.timeText}>{convertTime(duration)}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.rightContainer}>
                    <Entypo style={{ padding: 10 }} onPress={onOptionPress} name="dots-three-vertical" size={20} color={color.FONT_MEDIUM} />
                </View>
            </View>
            <View style={styles.separator} />
        </>
    )
};

const { width } = Dimensions.get('window')
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: width - 80
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    rightContainer: {
        flexBasis: 50,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
    thumbnail: {
        height: 50,
        width: 50,
        backgroundColor: color.FONT_LIGHT,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        flexBasis: 50
    },
    thumbnailText: {
        color: color.FONT,
        fontSize: 22,
        fontWeight: 'bold',
    },
    titleContainer: {
        width: width - 180,
        paddingLeft: 10,
    },
    title: {
        color: color.FONT,
        fontSize: 16
    },
    separator: {
        width: width - 80,
        backgroundColor: "#333",
        opacity: 0.3,
        height: 0.5,
        alignSelf: 'center',
        marginTop: 10
    },
    timeText: {
        color: color.FONT_LIGHT,
        fontSize: 14
    }
});

export default AudioListItem;