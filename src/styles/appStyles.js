import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  header: {
    width: '100%',
    paddingHorizontal: 40,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,

    justifyContent: 'center',
  },

  brand: {
    alignItems: 'center',
    marginBottom: 35,
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
    width: '90%',
    maxWidth: 1100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 24,
  },

  menuButton: {
    flex: 1,
    minHeight: 260,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.black,
    paddingHorizontal: 24,
    paddingVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    openTableModal: {
        width: 420,
        backgroundColor: colors.surface,
        borderRadius: 18,
        padding: 30,
    },
    modalTitle: {
        color: colors.text1,
        fontSize: 26,
        fontWeight: '700',
        textAlign: 'center',
    },
    modalDescription: {
        color: colors.text3,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 25,
    },
    modalLabel: {
        color: colors.text2,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    customerInput: {
        height: 55,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 20,
        color: colors.text1,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 25,
    },
    modalCancelButton: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        backgroundColor: colors.disabled,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalCancelText: {
        color: colors.text2,
        fontSize: 16,
        fontWeight: '600',
    },
    modalConfirmButton: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalConfirmText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
});