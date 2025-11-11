import { useTheme } from './theme';
import { useFont } from './font';

export const useStyleConfig = (stylesheetFn: (options: Object) => Object) => {
  const { themeConfig } = useTheme();
  const { fontSize } = useFont();

  return stylesheetFn({ theme: themeConfig, fontSize });
};
