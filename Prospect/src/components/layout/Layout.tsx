import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useDataSaver } from '../../contexts/DataSaverContext';

export const Layout: React.FC = () => {
  const location = useLocation();
  const { dataSaverMode } = useDataSaver();
  
  // Don't show header/footer on landing page
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return <Outlet />;
  }

  return (
    <div className={`min-h-screen flex flex-col bg-surface ${dataSaverMode ? 'data-saver' : ''}`}>
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
