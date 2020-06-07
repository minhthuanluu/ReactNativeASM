import React, { Component } from 'react';
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native';

export default Splash = ({navigation}) => {
    setTimeout(() => {
        navigation.navigate('Home')
    }, 3000);
    return (
        <View>
            <ActivityIndicator size="small"/>
        </View>
    )
}

const styles = StyleSheet.create({})
