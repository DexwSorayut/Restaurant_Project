import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function TableScreen() {
  return (
    <View style={{flex: 1}}>
      <Text>Table Screen</Text>
      <StatusBar style="auto" />
    </View>
  );
}
