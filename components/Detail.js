import React, { Component, useState } from 'react';
import { Text, StyleSheet, View, Button, Image, TouchableOpacity, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import fb from './firebase';

export default function Detail({ route, navigation }) {
    const { item } = route.params;
    const [liked, setliked] = useState(false);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: item.title
        })
    })



    return (
        <View style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <Image source={{ uri: item.image }} style={{ justifyContent:'center',alignSelf:'center',width: 200, height: 70, borderRadius: 10 }} />
                <Text style={styles.content}>{item.content}</Text>
            <View style={styles.commentContent}>
                <TouchableOpacity onPress={() => setliked(!liked)} style={{ position: 'absolute', margin: 10, right: 20, top: 410 }}>
                    <Image source={liked == true ? require('./images/liked.png') : require('./images/like.png')} resizeMode='cover' style={{ width: 30, height: 30 }} />
                </TouchableOpacity>

            </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    image: { marginHorizontal: 10, borderRadius: 10, marginTop: 10 },
    content: { fontSize: 18, marginHorizontal: 10, justifyContent: 'space-evenly', marginTop: 50 },
    commentContent: {
        position: 'absolute', bottom: 0, backgroundColor: "#f00", flex: 1
    }
})