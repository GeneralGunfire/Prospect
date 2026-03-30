import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create a simple placeholder PNG (2x2 green pixels representing video thumbnail)
const thumbnailDir = path.join(__dirname, 'public/thumbnails');
if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir, { recursive: true });
}

// Minimal PNG for a placeholder (green background 2x2 pixels)
const pngData = Buffer.from([
  137, 80, 78, 71, 13, 10, 26, 10,
  0, 0, 0, 13, 73, 72, 68, 82,
  0, 0, 0, 2, 0, 0, 0, 2, 8, 2, 0, 0, 0, 73, 184, 230, 227,
  0, 0, 0, 31, 73, 68, 65, 84,
  120, 156, 99, 248, 207, 192, 192, 192, 192, 192, 192, 192, 192, 192,
  192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192, 192,
  192, 0, 0, 25, 1, 3, 248, 164, 53, 27,
  0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130
]);

fs.writeFileSync(path.join(thumbnailDir, 'video1-poster.png'), pngData);
console.log('✓ Placeholder thumbnail created at public/thumbnails/video1-poster.png');
console.log('\nTo extract the actual thumbnail from video1.mp4 at 40 seconds, run:');
console.log('ffmpeg -ss 40 -i public/videos/video1.mp4 -vframes 1 -q:v 2 public/thumbnails/video1-poster.png');
