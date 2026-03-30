import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import type { AppPage, AuthedProps } from '../lib/withAuth';
import { withAuth } from '../lib/withAuth';
import LocationInput, { UserLocation } from '../components/LocationInput';
import MapDisplay from '../components/MapDisplay';
import SearchBox from '../components/SearchBox';
import CareersTab from '../components/CareersTab';
import CollegesTab from '../components/CollegesTab';
import InsightsTab from '../components/InsightsTab';
import { CareerDetailModal } from '../components/CareerDetailModal';
import type { CareerFull } from '../data/careersTypes';
import { getCareersByProvince, getUniversitiesByProvince, getTVETCollegesByProvince, createCareerMarkers, createUniversityMarkers, createTVETMarkers } from '../services/mapService';
import { PROVINCES } from '../data/mapData';

interface MapPageProps extends AuthedProps {}

function MapPageComponent({ user, onNavigate }: MapPageProps) {
  const [step, setStep] = useState<'location' | 'exploring'>('location');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [activeTab, setActiveTab] = useState<'careers' | 'colleges' | 'insights'>('careers');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayers, setActiveLayers] = useState(['demand', 'colleges']);
  const [selectedCareer, setSelectedCareer] = useState<CareerFull | null>(null);
  const [showCareerModal, setShowCareerModal] = useState(false);

  const handleLocationSelect = (location: UserLocation) => {
    console.log('🔹 Location selected:', location);
    console.log('🔹 Setting userLocation:', location);
    setUserLocation(location);
    console.log('🔹 Setting step to exploring');
    setStep('exploring');
    setSearchQuery('');
    setActiveTab('careers');
  };

  const handleLayerToggle = (layer: string) => {
    setActiveLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
  };

  const handleCareerSelect = (career: CareerFull) => {
    setSelectedCareer(career);
    setShowCareerModal(true);
  };

  const handleBackClick = () => {
    setStep('location');
    setUserLocation(null);
    setSearchQuery('');
  };

  // Get safe province
  const province = userLocation?.province || '';

  // Generate map markers based on active tab
  const mapMarkers = useMemo(() => {
    if (!province) {
      console.warn('No province detected');
      return [];
    }

    let markers = [];

    if (activeTab === 'careers') {
      try {
        const careers = getCareersByProvince(province);
        markers = createCareerMarkers(careers.slice(0, 20));
      } catch (e) {
        console.error('Error getting career markers:', e);
      }
    } else if (activeTab === 'colleges') {
      try {
        const unis = getUniversitiesByProvince(province);
        const tvet = getTVETCollegesByProvince(province);
        markers = [...createUniversityMarkers(unis), ...createTVETMarkers(tvet)];
      } catch (e) {
        console.error('Error getting college markers:', e);
      }
    }

    return markers;
  }, [province, activeTab]);

  const tabs = [
    { id: 'careers', label: 'Careers', icon: '💼' },
    { id: 'colleges', label: 'Colleges', icon: '🎓' },
    { id: 'insights', label: 'Insights', icon: '📊' },
  ] as const;

  return (
    <div className="min-h-screen w-full bg-white pt-24">
      <AnimatePresence mode="wait">
        {step === 'location' ? (
          // Step 1: Location Input
          <motion.div
            key="location-step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex items-center justify-center px-4 prospect-auth-bg"
          >
            <div className="text-center max-w-lg w-full">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-5xl font-bold mb-4 uppercase tracking-tight"
                style={{ color: '#1B5E20' }}
              >
                Job Market Map 🗺️
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg mb-12"
                style={{ color: '#64748b' }}
              >
                Discover careers, colleges, and opportunities near you.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-8 rounded-2xl shadow-lg border-2 border-slate-100"
              >
                <LocationInput onLocationSelect={handleLocationSelect} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-4 rounded-lg"
                style={{ backgroundColor: '#F0F7F0', borderLeft: '4px solid #1B5E20' }}
              >
                <p className="text-sm" style={{ color: '#1B5E20' }}>
                  💡 Enter your location to see careers, colleges, and job market insights for your area.
                </p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          // Step 2: Exploring
          <motion.div
            key="exploring-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 pb-8"
          >
            <div className="max-w-7xl mx-auto">
              {/* Header with Back Button */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 pb-4 border-b-2 border-slate-200 flex items-center justify-between"
              >
                <div>
                  <h2 className="text-3xl font-bold mb-2 uppercase tracking-tight" style={{ color: '#1B5E20' }}>
                    📍 {userLocation?.label || 'Unknown'}
                  </h2>
                  <p className="text-sm" style={{ color: '#64748b' }}>
                    Province: <strong>{province || 'Loading...'}</strong>
                  </p>
                </div>
                <motion.button
                  onClick={handleBackClick}
                  whileHover={{ x: -4 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold transition"
                  style={{ backgroundColor: '#1B5E20' }}
                >
                  <ChevronLeft size={20} />
                  Back
                </motion.button>
              </motion.div>

              {/* Two-Row Layout: Map on top, Results below */}
              <div className="space-y-6">
                {/* Map - Full width */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-lg"
                >
                  {userLocation && (
                    <MapDisplay
                      center={[userLocation.lat, userLocation.lng]}
                      zoom={9}
                      userLocation={userLocation}
                      markers={mapMarkers}
                      activeLayers={activeLayers}
                      onLayerToggle={handleLayerToggle}
                    />
                  )}
                </motion.div>

                {/* Results Panel - Full width, scrollable */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col gap-4"
                >
                  {/* Search Box */}
                  <SearchBox
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search careers, cities..."
                  />

                  {/* Tab Navigation */}
                  <div className="flex gap-2 border-b-2 border-slate-200 flex-wrap">
                    {tabs.map((tab) => (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-3 font-semibold text-sm transition rounded-lg flex-1 min-w-fit sm:flex-none ${
                          activeTab === tab.id
                            ? 'text-white'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        style={{
                          backgroundColor: activeTab === tab.id ? '#1B5E20' : 'transparent',
                        }}
                      >
                        {tab.icon} {tab.label}
                      </motion.button>
                    ))}
                  </div>

                  {/* Tab Content - Scrollable */}
                  <motion.div
                    className="bg-white rounded-xl p-6 border-2 border-slate-100 max-h-96 lg:max-h-full overflow-y-auto"
                  >
                    <AnimatePresence mode="wait">
                      {activeTab === 'careers' && province && (
                        <motion.div
                          key="careers"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <CareersTab
                            province={province}
                            searchQuery={searchQuery}
                            onCareerSelect={handleCareerSelect}
                          />
                        </motion.div>
                      )}

                      {activeTab === 'colleges' && province && (
                        <motion.div
                          key="colleges"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <CollegesTab
                            province={province}
                            searchQuery={searchQuery}
                          />
                        </motion.div>
                      )}

                      {activeTab === 'insights' && province && (
                        <motion.div
                          key="insights"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <InsightsTab
                            province={province}
                            city={userLocation?.city}
                          />
                        </motion.div>
                      )}

                      {!province && (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center justify-center py-12"
                        >
                          <div className="text-center">
                            <div className="text-4xl mb-4">🔄</div>
                            <p className="text-slate-600">Detecting your province...</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              </div>

              {/* Footer Note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xs text-center mt-6 font-medium"
                style={{ color: '#64748b' }}
              >
                📊 Data based on 59+ careers, 26 universities, and 50+ TVET colleges across South Africa
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Career Detail Modal */}
      {selectedCareer && province && (
        <CareerDetailModal
          career={selectedCareer}
          isOpen={showCareerModal}
          onClose={() => setShowCareerModal(false)}
          onNavigate={onNavigate}
          allCareers={getCareersByProvince(province)}
        />
      )}
    </div>
  );
}

export default withAuth(MapPageComponent);
