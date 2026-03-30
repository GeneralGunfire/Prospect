import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play } from 'lucide-react';

interface VideoItem {
  id: string;
  src: string;
  title: string;
  description: string;
  duration: string;
}

const videos: VideoItem[] = [
  {
    id: 'bursaries',
    src: '/videos/Bursaries.mp4',
    title: 'How Bursaries & Funding Work',
    description: 'Learn about bursary eligibility, application process, and how to get funding',
    duration: '2:00'
  }
];

export function DashboardVideoGrid() {
  const [modalVideo, setModalVideo] = useState<VideoItem | null>(null);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setModalVideo(null);
      }
    };

    if (modalVideo) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [modalVideo]);

  return (
    <>
      {/* Video Grid Section */}
      <section className="mb-10">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 mb-6" style={{ color: '#1e293b' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#64748b' }} />
          Learn How It Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setModalVideo(video)}
              className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-prospect-green transition-all duration-300 cursor-pointer flex flex-col h-full"
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden bg-gradient-to-br from-prospect-green to-[#0d3f1f] aspect-video flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
                    style={{ backgroundColor: '#F9A825' }}
                  >
                    <Play size={32} className="text-white fill-white" style={{ marginLeft: '4px' }} />
                  </motion.div>
                </div>

                {/* Duration Badge */}
                <div
                  className="absolute top-3 right-3 px-3 py-1 rounded-full text-white text-[10px] font-bold"
                  style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                >
                  {video.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col h-full">
                <h4 className="font-bold text-base mb-2 group-hover:text-prospect-green transition-colors" style={{ color: '#1e293b' }}>
                  {video.title}
                </h4>
                <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-2">
                  {video.description}
                </p>

                {/* Watch Now Button */}
                <button
                  className="mt-auto w-full py-3 px-4 rounded-xl font-bold text-sm transition-all"
                  style={{
                    backgroundColor: '#1B5E20',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0d3f1f';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1B5E20';
                  }}
                >
                  Watch Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {modalVideo && (
          <>
            {/* Backdrop */}
            <motion.div
              key={`backdrop-${modalVideo.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalVideo(null)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />

            {/* Modal Panel */}
            <motion.div
              key={`modal-${modalVideo.id}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90vw] md:max-w-5xl bg-black rounded-[8px] z-50 flex flex-col"
            >
              {/* Close Button */}
              <button
                onClick={() => setModalVideo(null)}
                className="absolute top-4 right-4 p-3 rounded-xl z-10 transition-all"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
                }}
              >
                <X size={24} className="text-white" />
              </button>

              {/* Video Player */}
              <video
                src={modalVideo.src}
                controls
                autoPlay
                className="w-full aspect-video rounded-[8px]"
                title={modalVideo.title}
                aria-label={modalVideo.title}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
