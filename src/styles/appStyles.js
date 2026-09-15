import { StyleSheet } from 'react-native';
import { colors, topInset } from './theme';

export const styles = StyleSheet.create({
  root: { 
    flex:1 , 
    backgroundColor: colors.bg
  },
  header: { 
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 16 , 
    paddingBottom: 14 , 
    borderBottomColor: colors.border , 
    borderWidth: 1 ,
    alignItems: 'center',
    justifyContent: 'space-between' ,
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
    height: 60,
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
  settingsButton: {
    marginLeft: 'auto',
    width: 30,
    height: 30,
    alignItems: 'center',
},

settingsIcon: {
    color: colors.text2,
    fontSize: 24,
    fontWeight: 'bold',
},
});

  
