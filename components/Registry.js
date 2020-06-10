import React, { Component,useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import fb, { db } from './firebase';

const Registry = ({navigation}) => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [name,setName] = useState('');
    const [error,setError] = useState('');

    const addUser = async (email) => {
        const timestamp = Date.now();
        db.ref().child('users/').child(timestamp).set({
            email:email,
            name: name
        }).then(() => navigation.navigate('Home'));
    }

    const registry = async (email,password) => {
        try{
            await fb.auth().createUserWithEmailAndPassword(email,password)
              .then(() => addUser(email))
              .catch(error => {   
                setError(error.message);
             })
           }catch(err){
            setError(err);
           }
    }
    return (
        <View style={styles.container}>
            <Text style={{color:'#f00',marginBottom:10}}>{error}</Text>
            <TextInput style={{borderWidth:1,borderColor:'#ccc'}} placeholder="Name" onChangeText={(name) => setName(name)}/>
            <TextInput style={{borderWidth:1,borderColor:'#ccc'}} placeholder="Email" onChangeText={(email) => setEmail(email)}/>
            <TextInput secureTextEntry={true} style={{borderWidth:1,borderColor:'#ccc',marginTop:15}} placeholder="Pass" onChangeText={(password) => setPassword(password)}/>
            <TouchableOpacity style={{padding:10,alignSelf:'center',marginTop:15}} onPress={() => registry(email,password)}>
                <Text>SIGN UP</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        marginHorizontal:20
    }
})


export default Registry;