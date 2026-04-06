import React, { createContext, useContext, ReactNode } from 'react';
import { useDataSaverMode } from '../hooks/useDataSaverMode';

interface DataSaverContextType {
  dataSaverMode: boolean | null;
  setMode: (mode: boolean) => void;
  toggleMode: () => void;
}

const DataSaverContext = createContext<DataSaverContextType | undefined>(undefined);

export const DataSaverProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { dataSaverMode, setMode, toggleMode } = useDataSaverMode();

  return (
    <DataSaverContext.Provider value={{ dataSaverMode, setMode, toggleMode }}>
      {children}
    </DataSaverContext.Provider>
  );
};

export const useDataSaver = () => {
  const context = useContext(DataSaverContext);
  if (context === undefined) {
    throw new Error('useDataSaver must be used within a DataSaverProvider');
  }
  return context;
};
