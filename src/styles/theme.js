import { Platform, StatusBar } from 'react-native';

export const colors = {
  bg: '#d2d2d2',
  card: '#161B22',
  border: '#30363D',
  text1: '#E6EDF3',
  text2: '#313131',
  dim: '#8B949E',
  cyan: '#61DAFB',
  green: '#3FB950',
  red: '#F85149',
  orange: '#D29922',
};

export const topInset = Platform.select({
  ios: 56,
  android: (StatusBar.currentHeight ?? 24) + 10,
  default: 24,
});
