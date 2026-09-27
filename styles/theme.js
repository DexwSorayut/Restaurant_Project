import { Platform, StatusBar } from 'react-native';

export const colors = {
    // Background
    bg: '#F4F6F8',
    surface: '#FFFFFF',
    card: '#FFFFFF',

    // Border
    border: '#D9DEE5',
    borderLight: '#E9EDF2',

    // Text
    text1: '#1F2937',
    text2: '#374151',
    text3: '#6B7280',
    dim: '#9CA3AF',

    // Primary
    primary: '#2563EB',
    primaryDark: '#1D4ED8',
    primaryLight: '#EFF6FF',

    // Status
    green: '#16A34A',
    greenLight: '#F0FDF4',

    red: '#DC2626',
    redLight: '#FEF2F2',

    orange: '#D97706',
    orangeLight: '#F4A460',

    // Additional
    yellow: '#CA8A04',
    yellowLight: '#FEFCE8',

    purple: '#7C3AED',
    purpleLight: '#F5F3FF',

    cyan: '#0891B2',
    cyanLight: '#ECFEFF',

    // Special
    disabled: '#E5E7EB',
    disabledText: '#9CA3AF',

    white: '#FFFFFF',
    black: '#000000',
};

export const topInset = Platform.select({
    ios: 24,
    android: StatusBar.currentHeight ?? 24,
    default: 24,
});