import { useState, useEffect } from 'react';

export const useDataSaverMode = () => {
  const [dataSaverMode, setDataSaverMode] = useState<boolean | null>(null);

  const setMode = (mode: boolean) => {
    setDataSaverMode(mode);
    localStorage.setItem('prospectSA_dataSaverMode', String(mode));
  };

  const toggleMode = () => {
    if (dataSaverMode !== null) {
      setMode(!dataSaverMode);
    }
  };

  return { dataSaverMode, setMode, toggleMode };
};
