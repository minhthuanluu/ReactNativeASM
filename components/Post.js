import React, { Component, useState } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import fb, { firestorage, db } from './firebase';

const width = Dimensions.get("screen").width;

const Post = ({ route, navigation }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [filePath, setFilePath] = useState('');

    const uploadPhoto = async uri => {
        var metadata = {
            contentType: 'image/jpeg'
        };

        const path = `photos/${Date.now()}.jpg`
        return new Promise(async (res, rej) => {
            const response = await fetch(uri)
            const file = await response.blob()
            let upload = firestorage.ref(path).put(file)
            upload.on('state_changed', snapshot => {

            }, err => {
                rej(err)
            }, async () => {
                const url = await upload.snapshot.ref.getDownloadURL()
                res(url)
            })
        })
    }
    // db.ref().child('posts').push().key
    const addPost = async (title, content) => {
        const timestamp = Date.now();
        const remoteUri = await uploadPhoto(filePath);
        db.ref('posts/').child(timestamp).set({
            id: timestamp,
            username: fb.auth().currentUser.email,
            title: title,
            content: content,
            image: remoteUri
        }).then(() => navigation.navigate('Home'));
    }

    const chooseFile = () => {
        var options = {
            title: 'Select Image',
            customButtons: [
                { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
            ],
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, response => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let source = response.uri;
                setFilePath(source);
            }
        });
    };

    return (
        <View style={styles.container}>
            <TextInput style={{ borderWidth: 1, borderColor: '#ccc' }} placeholder="Title" onChangeText={(title) => setTitle(title)} />
            <TouchableOpacity onPress={() => chooseFile()}>
                <Image
                    source={{ uri: filePath }}
                    style={styles.image}
                />
            </TouchableOpacity>
            <TextInput style={{ borderWidth: 1, borderColor: '#ccc', marginTop: 10 }} numberOfLines={10} multiline={true} placeholder="Content" onChangeText={(content) => setContent(content)} />
            <TouchableOpacity style={{ position: 'absolute', right: 10, top: 5, alignItems: 'flex-end', justifyContent: 'flex-end' }} onPress={() => addPost(title, content)}>
                <Image source={require('./images/send.png')} resizeMode={'cover'} style={{ width: 40, height: 40 }} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 15
    },
    button: {
        padding: 10,
        backgroundColor: '#00f',
        alignContent: 'center',
        marginVertical: 10
    },
    noImgText: {
        position: 'absolute',
        top: 130,
        alignSelf: 'center'
    },
    image: {width:width-30, height: 250, marginTop: 10, alignSelf: 'center',backgroundColor:'#eaeaea' }
})

export default Post
