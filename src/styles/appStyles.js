import { StyleSheet } from 'react-native';
import { colors, topInset } from './theme';

export const styles = StyleSheet.create({
  root: { 
    flex:1 , 
    backgroundColor: colors.bg
  },
  header: { 
    paddingHorizontal: 16 , 
    paddingBottom: 14 , 
    borderBottomColor: colors.border , 
    borderWidth: 1
  },
  title: { 
    color: colors.text2 , 
    fontSize: 22 , 
    fontWeight: '700'
  },
  body: { 
    flex: 1
  },
  tabbar: { 
    flexDirection: 'row' , 
    borderBottomWidth: 1 , 
    borderBottomColor: colors.border , 
    backgroundColor: colors.card
  },
  tab: { 
    flex: 1 , 
    paddingVertical: 14 , 
    alignItems: 'center'
  },
  tabText: { 
    color: colors.text1 , 
    fontSize: 16 , 
    fontWeight: '600'
  },
  tabActive: { 
    color: colors.red ,
  },
});

  
