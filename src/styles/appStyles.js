import { StyleSheet } from 'react-native';
import { colors, topInset } from './theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  header: {
    paddingTop: topInset + 12,
    paddingBottom: 16,
    paddingLeft: 20,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },

  brand: {
    alignItems: 'center',
    marginBottom: 20,
  },

  shopName: {
    color: colors.text1,
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
  },

  shopSubtitle: {
    marginTop: 5,
    marginBottom: 20,
    color: colors.text3,
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
  },

  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    gap: 20,
    padding: 20,
  },

  menuButton: {
    width: '45%',
    height: 220,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },  

  menuIcon: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 18,
  },

  menuTitle: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },

  menuDescription: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.9,
  },
});