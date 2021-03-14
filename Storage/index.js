import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';

export const storeNote = async (value) => {
    try {
      await AsyncStorage.setItem('@notes', JSON.stringify(value))
    } catch (e) {
      Alert.alert(e)
    }
  }

export const getNotes = async () => {
  try {
    const value = await AsyncStorage.getItem('@notes')
    
    if(value !== null) {
      return JSON.parse(value);
    }
  } catch(e) {
    Alert.alert(e)
  }
}
