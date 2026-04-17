import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Map as MapIcon, MapPin, BarChart2, Loader2, GraduationCap } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import type { AppPage, AuthedProps } from '../lib/withAuth';
import { withAuth } from '../lib/withAuth';
import LocationInput, { UserLocation } from '../components/LocationInput';
import MapDisplay from '../components/MapDisplay';
import SearchBox from '../components/SearchBox';
import CollegesTab from '../components/CollegesTab';
import InsightsTab from '../components/InsightsTab';
import AppHeader from '../components/AppHeader';
import { CareerDetailModal } from '../components/CareerDetailModal';
import type { CareerFull } from '../data/careersTypes';
import { getCareersByProvince, getUniversitiesByProvince, getTVETCollegesByProvince, createCareerMarkers, createUniversityMarkers, createTVETMarkers } from '../services/mapService';
import { PROVINCES } from '../data/mapData';

interface MapPageProps extends AuthedProps {}

function MapPageComponent({ user, onNavigate }: MapPageProps) {
  const [step, setStep] = useState<'location' | 'exploring'>('location');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [activeTab, setActiveTab] = useState<'colleges' | 'insights'>('colleges');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLayers, setActiveLayers] = useState(['demand', 'colleges']);
  const [selectedCareer, setSelectedCareer] = useState<CareerFull | null>(null);
  const [showCareerModal, setShowCareerModal] = useState(false);

  const handleLocationSelect = (location: UserLocation) => {
    setUserLocation(location);
    setStep('exploring');
    setSearchQuery('');
    setActiveTab('colleges');
  };

  const handleLayerToggle = (layer: string) => {
    setActiveLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
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
    { id: 'colleges', label: 'Colleges', icon: GraduationCap },
    { id: 'insights', label: 'Insights', icon: BarChart2 },
  ] as const;

  return (
    <div className="min-h-screen w-full bg-white">
      <AppHeader currentPage="map" user={user} onNavigate={onNavigate} mode="career" />
      <AnimatePresence mode="wait">
        {step === 'location' ? (
          // Step 1: Location Input
          <motion.div
            key="location-step"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="min-h-screen flex items-center justify-center px-4 pt-20 bg-slate-50"
          >
            <div className="text-center max-w-lg w-full">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-prospect-green flex items-center justify-center mx-auto mb-6 shadow-md">
                  <MapIcon size={26} className="text-white" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">Explore SA</p>
                <h1 className="text-3xl lg:text-4xl font-black text-navy mb-3" style={{ letterSpacing: '-0.015em' }}>
                  Job Market Map
                </h1>
                <p className="text-sm text-secondary leading-relaxed">
                  Discover careers, colleges, and opportunities near you.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, ease: 'easeOut' }}
                className="bg-white p-7 rounded-2xl shadow-sm border border-slate-100"
              >
                <LocationInput onLocationSelect={handleLocationSelect} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mt-5 p-4 rounded-xl flex items-center gap-3 bg-prospect-green/5 border border-prospect-green/10"
              >
                <MapPin size={16} className="text-prospect-green shrink-0" />
                <p className="text-xs text-prospect-green font-medium text-left">
                  Enter your location to see careers, colleges, and job market insights for your area.
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
            className="px-4 pb-8 pt-24"
          >
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 pb-5 border-b border-slate-100 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-prospect-green flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-navy leading-tight" style={{ letterSpacing: '-0.01em' }}>
                      {userLocation?.label || 'Unknown'}
                    </h2>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">
                      Province: {province || 'Loading...'}
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={handleBackClick}
                  whileHover={{ x: -2 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold uppercase tracking-wider transition-all bg-navy hover:bg-prospect-blue-accent shrink-0"
                >
                  <ChevronLeft size={14} />
                  Change
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
                          backgroundColor: activeTab === tab.id ? '#1E3A5F' : 'transparent',
                        }}
                      >
                        <tab.icon size={18} className="inline-block mr-2" />
                        {tab.label}
                      </motion.button>
                    ))}
                  </div>

                  {/* Tab Content - Scrollable */}
                  <motion.div
                    className="bg-white rounded-xl p-6 border-2 border-slate-100 max-h-96 lg:max-h-full overflow-y-auto"
                  >
                    <AnimatePresence mode="wait">
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
                            <Loader2 size={48} className="animate-spin mx-auto mb-4 text-slate-400" />
                            <p className="text-slate-600">Detecting your province...</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              </div>

              {/* Footer Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xs text-center mt-6 font-medium flex items-center justify-center gap-2"
                style={{ color: '#64748b' }}
              >
                <BarChart2 size={14} />
                <p>Data based on 59+ careers, 26 universities, and 50+ TVET colleges across South Africa</p>
              </motion.div>
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
