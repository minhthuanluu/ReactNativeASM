import React, { Component,useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import fb from './firebase';

const Login = ({navigation}) => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');

    const login = (email,password) => {
        try{
            fb.auth().signInWithEmailAndPassword(email,password)
              .then(() => navigation.navigate('Home'))
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
            <TextInput style={{borderWidth:1,borderColor:'#ccc'}} placeholder="Email" onChangeText={(email) => setEmail(email)}/>
            <TextInput secureTextEntry={true} style={{borderWidth:1,borderColor:'#ccc',marginTop:15}} placeholder="Pass" onChangeText={(password) => setPassword(password)}/>
            <TouchableOpacity style={{padding:10,alignSelf:'center',marginTop:15}} onPress={() => login(email,password)}>
                <Text>SIGN IN</Text>
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


export default Login;