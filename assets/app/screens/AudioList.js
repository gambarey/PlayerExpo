//import liraries
import React, { Component } from 'react';
import { ScrollView, Text, StyleSheet, Dimensions } from 'react-native';
import { AudioContext } from '../context/AudioProvider';
import { RecyclerListView, LayoutProvider } from 'recyclerlistview';

// create a component
export class AudioList extends Component {
    static contextType = AudioContext

    layoutProvider = new LayoutProvider((i) => "audio", (type, dim) => {
        dim.width = Dimensions.get("window").width;
        dim.height = 70;
    })

    rowRenderer = (type, item) => {
        return <Text>{item.filename}</Text>
    }

    render() {
        return (
            <AudioContext.Consumer>
                {({ dataProvider }) => {
                    return <RecyclerListView dataProvider={dataProvider}
                        layoutProvider={this.layoutProvider}
                        rowRenderer={this.rowRenderer} />
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


