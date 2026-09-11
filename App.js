import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, Text, Touchable, TouchableOpacity } from "react-native";
import { styles } from "./src/styles/appStyles";
import { colors , topInset } from "./src/styles/theme";
import TableScreen from "./src/screen/table/TableScreen";
import KitchenScreen from "./src/screen/kitchen/KitchenScreen";


export default function App() {

  const [tab,setTab] = useState('Table')
  const [favorite, setFavorie] = useState([]);

  const toggle = (id) =>{
    setFavorie((prev) => prev.includes(id)? prev.filter((x) => x !==id) : [...prev, id])
  }

  return (
    <View style={styles.root}>
      <ExpoStatusBar style="light" />

      <View style={[ styles.header , { paddingTop: topInset + 10 } ]}>
        <Text style={styles.title}>
          {tab === 'Table' ? 'Table' : 'Kitchen'}
        </Text>
      </View>

      <View style={styles.body}>
        {tab === 'Table' 
          ? ( <TableScreen onToggle = {toggle} favorite = {favorite} /> ) 
          : ( <KitchenScreen onToggle = {toggle} favorite = {favorite} /> )}
      </View> 

      <View style={styles.tabbar}>
        <TabButton label='Table' onPress={() => setTab('Table')} active = {tab === 'Table'} /> 
        <TabButton label='Kitchen' onPress={() => setTab('Kitchen')} active = {tab === 'Kitchen'} />
      </View>
    </View>
  );
}

const TabButton = ({ label , onPress , active }) => {
  return (
    <TouchableOpacity style={styles.tab} onPress={onPress}>
      <Text style={[styles.tabText , active && styles.tabActive]}>{label}</Text>
    </TouchableOpacity>
  );
};

