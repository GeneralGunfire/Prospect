import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { useDataSaver } from '../contexts/DataSaverContext';
import { NetflixLoader } from './NetflixLoader';
import { ModeSelector } from './ModeSelector';
import { DataSaverLandingPage } from './DataSaverLandingPage';
import AppContent from '../AppContent';

export const LandingPageWrapper: React.FC = () => {
  const { dataSaverMode, setMode } = useDataSaver();
  const [loading, setLoading] = useState(true);
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    const hasChosen = localStorage.getItem('prospect_sa_mode_chosen');
    if (!loading && !hasChosen) {
      setShowSelector(true);
    }
  }, [loading]);

  const handleLoaderComplete = () => {
    setLoading(false);
  };

  const handleSelectMode = (mode: boolean) => {
    setMode(mode);
    localStorage.setItem('prospect_sa_mode_chosen', 'true');
    setShowSelector(false);
  };

  return (
    <div className="min-h-screen bg-surface">
      <AnimatePresence mode="wait">
        {loading && (
          <NetflixLoader key="loader" onComplete={handleLoaderComplete} />
        )}
        
        {!loading && showSelector && (
          <ModeSelector key="selector" onSelect={handleSelectMode} />
        )}

        {!loading && !showSelector && (
          dataSaverMode ? (
            <DataSaverLandingPage key="data-saver" />
          ) : (
            <AppContent key="normal-mode" />
          )
        )}
      </AnimatePresence>
    </div>
  );
};
