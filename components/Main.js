import React, { Component, useState, useEffect } from 'react';
import { Text, StyleSheet, View, Button, Image, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import fb, { firestorage, postRef } from "./firebase";
import * as firebase from 'firebase';
import Swipeout from 'react-native-swipeout';

require("firebase/auth");
require("firebase/firestore");

export default function Main({ navigation }) {
    const [login, setLogin] = useState();
    const [database, setDatabase] = useState('');
    const [loading, setLoading] = useState(true);
    const [buttonTitle, setButtonTitle] = useState('');

    const logout = () => {
        firebase.auth().signOut();
        setLogin(false);
    }

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: '',
            headerStyle: {
                backgroundColor: '#eee',
            },
            headerRight: () => <View style={{ marginRight: 10 }}>
                {fb.auth().currentUser === null
                    ? <Button onPress={() => navigation.navigate('Login')} title={"Sign in"} />
                    : <Button onPress={() => logout()} title={"Sign Out"} />
                }</View>,
        });
        getData();
    }, [navigation, setLogin, setButtonTitle]);

    //di chuyển đến màn hình thêm bài post mới
    const gotoAdd = () => {
        navigation.navigate('Post');
    }

    //lấy dữ liệu của một bài post
    const getOneItemData = (item) => {
        firebase.database().ref('posts/' + item.id).once('value', function (snapshot) {
            snapshot.val();
            navigation.navigate('Detail', { item });
        });
    }

    //lấy dữ liệu từ firebase xuống
    const getData = () => {
        firebase.database().ref('posts/').once('value', function (snapshot) {
            setDatabase(Object.values(snapshot.val()))
            setLoading(false);
            // console.log(database)
        });
    }

    const gotoEdit = (item) => {
        navigation.navigate('EditPost', { item: item, editTitle: "Edit Post" })
    }

    const del = (item) => {
        setLoading(true)
        firebase.database().ref('posts').child(item.id).remove();
        setLoading(false);
    }

    //xóa item đồng thời xóa hình ảnh của item đó trong storage
    const deleteData = (item) => {
        Alert.alert(
            "Xóa sản phẩm",
            item.title.toString(),
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "OK", onPress: () => del(item) }
            ],
            { cancelable: false }
        );
    }

    const swipeBtns = (item) => [{
        text: 'Delete',
        backgroundColor: 'red',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => { deleteData(item) },
    },
    {
        text: 'Edit',
        backgroundColor: 'blue',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => { gotoEdit(item) }
    }];

    //render dữ liệu 1 item đối với admin
    const renderAdminItem = (item) => {
        return <Swipeout
            right={swipeBtns(item)}
            sectionId
            key={item.id}
            autoClose={true}
            backgroundColor='transparent'
            swipeData={database.length}><TouchableOpacity key={item.id} style={{ flexDirection: 'row', marginTop: 10 }} onPress={() => getOneItemData(item)}>
                <Image source={{ uri: item.image }} style={{ width: 80, height: 70, borderRadius: 10 }} />
                <View style={styles.content}>
                    <Text style={styles.renderItemTitle}>{item.title}</Text>
                    <Text style={{color:'#f00'}}>{item.username}</Text>
                    <Text>{item.content.substring(0, 100)}...</Text>
                </View>
            </TouchableOpacity></Swipeout>
    }

    const renderItem = (item) => {
        return <TouchableOpacity key={item.id} style={{ flexDirection: 'row', marginTop: 10 }} onPress={() => getOneItemData(item)}>
            <Image source={{ uri: item.image }} style={{ width: 80, height: 70, borderRadius: 10 }} />
            <View style={styles.content}>
                <Text style={styles.renderItemTitle}>{item.title}</Text>
                <Text style={{color:'#f00'}}>{item.username}</Text>
                <Text>{item.content.substring(0, 100)}...</Text>
            </View>
        </TouchableOpacity>
    }



    //khi load trang home => tiến hành load dữ liệu từ database
    useEffect(() => getData());
    return (
        <View style={{ flex: 1, margin: 15 }}>

            {
                loading == false ?
                    <FlatList
                        data={database}
                        renderItem={({ item }) => fb.auth().currentUser.email != item.username ? renderAdminItem(item) : renderItem(item)}
                        keyExtractor={(item) => item.key}
                        key={(item) => item.key} />
                    :
                    <ActivityIndicator size="small" />
            }
            {fb.auth().currentUser != null ?
                <TouchableOpacity style={{ position: 'absolute', right: 0, bottom: 0 }} onPress={() => gotoAdd()} >
                    <Image source={require('./images/add.png')}
                        resizeMode="contain"
                        style={{ width: 50, height: 50 }}
                    />
                </TouchableOpacity> : <View></View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        marginLeft: 5
    },
    renderItemTitle: {
        color: '#00f',
        fontWeight: 'bold',
        marginRight: 10
    }
})
