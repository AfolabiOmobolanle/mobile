import colors from './colors';
import images from './images';

// theme defs
const theme = {
  dark: {
    logo: images.logoPrimary,
    textDefault: colors.white,
    textSub: colors.white,
    textCaption: colors.white,
    backgroundDefault: '#383838',
    backgroundLight: '#202020',
  },
  light: {
    logo: images.logoPrimary,
    textDefault: colors.dark,
    textSub: colors.darkLighter,
    textCaption: colors.darkLighest,
    backgroundDefault: colors.white,
    backgroundLight: '#f2f2f2',
  },
};

export default theme;

export const getThemeConfig = (scheme: 'light' | 'dark') => theme[scheme];
