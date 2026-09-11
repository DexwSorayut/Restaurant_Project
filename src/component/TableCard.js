import { StyleSheet, Text, View , Image , FlatList , TouchableOpacity } from 'react-native';
import { color } from "../theme";
import { useState } from 'react';

const SingerCard = ({ SINGER , isFav , onToggle }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: SINGER.uri }} style={styles.Image} />
        <View style={styles.footer}>
          <Text style={styles.title}>{SINGER.name}</Text>
            <TouchableOpacity onPress={() => onToggle(SINGER.id)}>
              <Text style={[styles.heart, isFav && styles.heartON]}>🩷</Text>
            </TouchableOpacity>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fecbcb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  TextTitle: {
    paddingTop: 60,
    fontSize: 24,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 14,
  },
  row: {
    justifyContent:'space-between'
  },
  card: {
    width:'48%',
     marginBottom:16,
     backgroundColor: color.surface,
     borderWidth: 1,
     borderColor: color.border,
     borderRadius: 12,
     overflow:'hidden'
  },
  Image:{
    width:"100%",
    aspectRatio:1,
    objectPosition: 'Top',
    borderRadius: 12,
  },
  footer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    paddingVertical:14,
    paddingHorizontal:8,
  },
  title:{
    flex: 1,
    color: color.text,
    fontSize: 18,
    marginRight: 8,
    fontWeight: 900

  },
  heart:{
    fontSize: 17,
    color: color.muted,
    opacity: 0.3
  },
  heartON: {
    fontSize: 17,
    fontWeight: 900,
    color: color.heart,
    opacity: 1
  }

});

export default SingerCard