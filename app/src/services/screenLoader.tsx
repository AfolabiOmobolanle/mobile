import React, {
  useContext,
  createContext,
  useState,
  useCallback,
  ReactElement,
} from 'react';

import ScreenLoader from '../components/common/screenLoader';

const ScreenLoaderContext = createContext({
  visible: false,
  show: () => {},
  hide: () => {},
});

interface IScreenLoaderProviderProps {
  children: ReactElement;
}

export const ScreenLoaderProvider: React.FC<IScreenLoaderProviderProps> = ({
  children,
}) => {
  const [visible, setVisible] = useState(false);

  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);

  return (
    <ScreenLoaderContext.Provider value={{ visible, show, hide }}>
      {visible && <ScreenLoader />}
      {children}
    </ScreenLoaderContext.Provider>
  );
};

export const useScreenLoader = () => {
  return useContext(ScreenLoaderContext);
};
