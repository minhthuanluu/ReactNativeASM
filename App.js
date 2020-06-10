import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './components/Main';
import Splash from './components/Splash';
import Post from './components/Post';
import Login from './components/Login';
import Detail from './components/Detail';
import EditPost from './components/EditPost';
import Registry from './components/Registry';

function HomeScreen({ navigation }) {
  return <Main navigation={navigation}/>
}

function LoginScreen({ navigation }) {
  return <Login navigation={navigation}/>
}

function RegistryScreen({ navigation }) {
  return <Registry navigation={navigation}/>
}

function SplashScreen({ navigation }) {
  return <Splash navigation={navigation}/>
}

function PostScreen({ navigation }) {
  return (
    <Post navigation={navigation}/>
  );
}

function EditScreen({ route, navigation }) {
  return (
    <EditPost route = {route} navigation={navigation}/>
  );
}

function DetailScreen({route, navigation}) {
  return(
    <Detail route = {route} navigation={navigation}/>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Splash" component={SplashScreen} options={{headerShown: false}}/>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} options={{headerLeft:false}}/>
        <Stack.Screen name="Post" component={PostScreen} />
        <Stack.Screen name="EditPost" component={EditScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Registry" component={RegistryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
