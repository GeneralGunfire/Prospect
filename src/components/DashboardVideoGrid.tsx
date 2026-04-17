import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Clock } from 'lucide-react';

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
    description: 'Learn about bursary eligibility, application process, and how to get funding for your studies.',
    duration: '2:00',
  },
];

export function DashboardVideoGrid() {
  const [modalVideo, setModalVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalVideo(null);
    };
    if (modalVideo) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [modalVideo]);

  return (
    <>
      <section className="mb-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 mb-5" style={{ color: '#64748b' }}>
          <span className="w-1 h-4 rounded-full inline-block" style={{ backgroundColor: '#3B5A7F' }} />
          Learn How It Works
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.35, ease: 'easeOut' }}
              onClick={() => setModalVideo(video)}
              className="group bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-250 cursor-pointer flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden aspect-video bg-gradient-to-br from-[#1E3A5F] to-[#0d2240] flex items-center justify-center">
                {/* Subtle texture */}
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #3B5A7F 0%, transparent 60%)' }} />

                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors duration-200">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.94 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: '#F9A825' }}
                  >
                    <Play size={26} className="text-white fill-white ml-1" />
                  </motion.div>
                </div>

                {/* Duration badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold tracking-wide">
                  <Clock className="w-3 h-3 opacity-80" />
                  {video.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h4 className="font-bold text-sm text-slate-800 mb-1.5 group-hover:text-[#1E3A5F] transition-colors leading-snug">
                  {video.title}
                </h4>
                <p className="text-xs text-slate-500 flex-grow line-clamp-2 leading-relaxed">
                  {video.description}
                </p>

                {/* CTA */}
                <button
                  onClick={e => { e.stopPropagation(); setModalVideo(video); }}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 text-white"
                  style={{ backgroundColor: '#1E3A5F' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#152a45'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1E3A5F'; }}
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
            <motion.div
              key={`backdrop-${modalVideo.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setModalVideo(null)}
              className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
            />
            <motion.div
              key={`modal-${modalVideo.id}`}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90vw] md:max-w-5xl bg-black rounded-2xl z-50 overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setModalVideo(null)}
                className="absolute top-3 right-3 p-2.5 rounded-xl z-10 bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close video"
              >
                <X size={20} className="text-white" />
              </button>
              <video
                src={modalVideo.src}
                controls
                autoPlay
                className="w-full aspect-video"
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
