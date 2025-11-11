const defaultFontSizes = {
  h1: 50,
  h2: 35,
  h3: 22,
  p: 18,
  p1: 15,
  p2: 12,
};

const scaleFontSizes = (scale: number) => {
  return Object.keys(defaultFontSizes).reduce(
    (acc, size: string) => ({ ...acc, [size]: defaultFontSizes[size] * scale }),
    {}
  );
};

const fontSizes = {
  small: scaleFontSizes(0.8),
  medium: defaultFontSizes,
  large: scaleFontSizes(1.2),
};

export const fontScales = ['small', 'medium', 'large'];

export const getFontSize = (scale: 'small' | 'medium' | 'large') =>
  fontSizes[scale];

const font = {
  bold: 'SourceSansPro_700Bold',
  regular: 'SourceSansPro_400Regular',
  light: 'SourceSansPro_300Light',
};

export default font;
