import React, { Component, useEffect, useState } from 'react';
import { TextInput, View, Text, StyleSheet, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import fb, { firestorage, db } from './firebase';
import ImagePicker from 'react-native-image-picker';

const EditPost = ({ route, navigation }) => {
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    const [filePath, setFilePath] = useState('');
    const [choose, setChoose] = useState(false);
    const { item, editTitle } = route.params;

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: editTitle,
        })
    })

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

    const EditPostWithNewImage = async (title,content) => {
        const remoteUri = await uploadPhoto(filePath);
        db.ref('posts/' + item.id).update({
            id:item.id,
            title: title,
            content: content,
            image: remoteUri,
            username:item.username
        }).then(() => navigation.navigate('Home'));
    }

    const EditPostWithOldImage = async (title,content) => {
        db.ref('posts/').child(item.id).update({
            id:item.id,
            title: title,
            content: content,
            image: item.image,
            username:item.username
    }).then(() => navigation.navigate('Home'));
    }

    const editPost = async (title, content) => {
        chooseFile==true ? EditPostWithNewImage(title,content) : EditPostWithOldImage(title,content)
    }

    return (
        <ScrollView style={{margin: 15}} showsVerticalScrollIndicator={false}>
            <TextInput
                style={{ borderWidth: 1, borderColor: '#ccc'}}
                defaultValue={item.title}
                onChangeText={(title) => setNewTitle(title)} />
            <TouchableOpacity onPress={() => [setChoose(true), chooseFile()]}>
                <Image
                    source={{ uri: choose == false ? item.image : filePath }}
                    style={styles.image}
                />
            </TouchableOpacity>
            <TextInput
                style={{ borderWidth: 1, borderColor: '#ccc', marginTop: 10 }}
                numberOfLines={10}
                multiline={true}
                placeholder="Content"
                defaultValue={item.content}
                onChangeText={(content) => setNewContent(content)}
            />
            <TouchableOpacity style={{ position: 'absolute', right: 10, top: 5, alignItems: 'flex-end', justifyContent: 'flex-end' }} onPress={() => editPost(newTitle,newContent)}>
                <Image source={require('./images/send.png')} resizeMode={'cover'} style={{ width: 40, height: 40 }} />
            </TouchableOpacity>
        </ScrollView>
    );
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
    image: { width: 300, height: 250, marginTop: 10, alignSelf: 'center' }
})


export default EditPost;