BIRTHDAY SURPRISE WEBSITE — QUICK START

1. Install Node.js if you don't already have it.
2. Extract this ZIP.
3. Open the birthday-surprise folder in VS Code.
4. Open Terminal in VS Code and run:
   npm install
   npm run dev
5. Open the localhost URL Vite prints (usually http://localhost:5173).

ADD YOUR MEDIA
Put these files in the matching folders inside public:
- public/images/her-photo.jpg       (her portrait — currently placeholder)
- public/images/our-photo.jpg       (your photo together — scratch card reveal)
- public/videos/her-video.mp4      (her video clip)
- public/music/your-song.mp3       (your song)

IMPORTANT:
- The scratch card uses /images/our-photo.jpg. It starts covered and scratches away to reveal your photo.
- The video section expects /videos/her-video.mp4.
- The music player expects /music/your-song.mp3.
- The her-photo.jpg placeholder area is currently a styled placeholder. To use her image, edit the image-placeholder div in src/App.jsx and set its backgroundImage to url('/images/her-photo.jpg').
- Edit the birthday letter in src/App.jsx to make it personal.
- All games work locally. The Catch My Love game runs until she taps Finish.
- Replace the generic birthday wording and nickname in src/App.jsx whenever ready.

BUILD FOR DEPLOYMENT:
npm run build
The production site is created in the dist folder.
