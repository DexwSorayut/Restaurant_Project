import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';

export default function KitchenScreen() {
  return (
    <View style={{flex: 1}}>
      <Text>Kitchen Screen</Text>
      <StatusBar style="auto" />
    </View>
  );
}
