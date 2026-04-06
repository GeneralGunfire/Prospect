import { useRef, useEffect } from 'react';
import { motion } from 'motion/react';

interface VideoPlayerProps {
  src: string;
  title: string;
  description: string;
  startTime?: number;
  poster?: string;
}

export function VideoPlayer({ src, title, description, startTime = 0, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Set initial currentTime when video is loaded
  useEffect(() => {
    const video = videoRef.current;
    if (!video || startTime === 0) return;

    const handleLoadedMetadata = () => {
      video.currentTime = startTime;
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
  }, [startTime]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-16 lg:py-20 px-4 lg:px-10 bg-white"
    >
      <div className="max-w-[900px] mx-auto">
        {/* Video Container */}
        <div className="rounded-[8px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)] bg-[#f5f5f5] mb-8">
          <video
            ref={videoRef}
            src={src}
            controls
            poster={poster}
            className="w-full aspect-video"
            title={title}
            aria-label={title}
          />
        </div>

        {/* Title and Description */}
        <div className="text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-3" style={{ color: '#1e293b' }}>
            {title}
          </h2>
          <p className="text-gray-600 text-lg">
            {description}
          </p>
        </div>
      </div>
    </motion.section>
  );
}
