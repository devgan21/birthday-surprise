
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Music2, Play, Pause, Gift, Sparkles,
  Flower2, ChevronDown, Volume2, VolumeX
} from 'lucide-react';

const reasons = [
  ['♡', 'Your kind heart', 'The way you make people feel loved.'],
  ['✧', 'The way you care', 'You notice the little things.'],
  ['☺', 'Your beautiful smile', 'My favourite view, every single time.'],
  ['☆', 'Your happiness', 'It makes my whole day brighter.'],
  ['❀', 'Just being you', 'There is nobody quite like you.']
];

const quiz = [
  { q: 'What is my favourite thing about you?', a: ['Your smile', 'Your laugh', 'Your Eyes', 'Everything about you'], correct: 2 },
  { q: 'What would I choose for a perfect day?', a: ['A day with you', 'A day without plans', 'A long nap'], correct: 0 },
  { q: 'How much birthday love are you getting today?', a: ['A little', 'A lot', 'An unlimited amount'], correct: 2 }
];

// SCRATCH CARD
function ScratchCard({ image }) {
  const canvasRef = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const drawing = useRef(false);
  const last = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#d77b9d');
    grad.addColorStop(.5, '#f1b8ca');
    grad.addColorStop(1, '#c96f94');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    for (let i = 0; i < 38; i++) {
      ctx.fillStyle = 'rgba(255,255,255,.28)';
      ctx.beginPath();
      ctx.arc(
        Math.random() * rect.width,
        Math.random() * rect.height,
        Math.random() * 2 + 1,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.fillStyle = '#fff8f8';
    ctx.textAlign = 'center';
    ctx.font = 'italic 26px "Playfair Display"';
    ctx.fillText('Scratch to reveal', rect.width / 2, rect.height / 2 - 5);

    ctx.font = '18px "DM Sans"';
    ctx.fillText('a little memory of us ♡', rect.width / 2, rect.height / 2 + 29);

    ctx.globalCompositeOperation = 'destination-out';
  }, []);

  const point = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const scratch = (e) => {
    if (!drawing.current || revealed) return;

    e.preventDefault();

    const ctx = canvasRef.current.getContext('2d');
    const p = point(e);

    ctx.lineWidth = 34;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();

    if (last.current) {
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(p.x, p.y);
    } else {
      ctx.arc(p.x, p.y, 17, 0, Math.PI * 2);
    }

    ctx.stroke();
    last.current = p;

    const { width, height } = canvasRef.current;
    const pixels = ctx.getImageData(0, 0, width, height).data;

    let clear = 0;

    for (let i = 3; i < pixels.length; i += 32) {
      if (pixels[i] === 0) clear++;
    }

    if (clear / (pixels.length / 32) > .38) {
      setRevealed(true);
    }
  };

  return (
    <div className="scratch-wrap">
      <div className="scratch-photo">
        <img
          className="scratch-reveal-image"
          src={image}
          alt="Our favourite memory together"
          onError={e => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="photo-fallback">
          <br />
        </div>
      </div>

      {!revealed && (
        <canvas
          ref={canvasRef}
          className="scratch-canvas"
          onPointerDown={e => {
            drawing.current = true;
            last.current = null;
            e.currentTarget.setPointerCapture(e.pointerId);
            scratch(e);
          }}
          onPointerMove={scratch}
          onPointerUp={() => {
            drawing.current = false;
            last.current = null;
          }}
          onPointerCancel={() => {
            drawing.current = false;
            last.current = null;
          }}
        />
      )}

      <div className="scratch-caption">
        {revealed
          ? 'A memory I will always keep close ♡'
          : 'Use your finger or mouse to scratch'}
      </div>
    </div>
  );
}

// CATCH HEARTS GAME
function CatchGame() {
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!started) return;

    const id = setInterval(() => {
      setItems(old => [
        ...old.filter(x => Date.now() - x.t < 1700),
        { id: Math.random(), left: 8 + Math.random() * 82, t: Date.now() }
      ]);
    }, 650);

    return () => clearInterval(id);
  }, [started]);

  return (
    <div className="game-box">
      <div className="game-head">
        <span>♡ Catch my love</span>
        <b>{score} hearts</b>
      </div>

      <div className="catch-field">
        {!started ? (
          <div className="game-intro">
            <span className="big-emoji">💗</span>
            <p>Catch as many hearts as you can!</p>
            <button
              className="pill-button"
              onClick={() => {
                setScore(0);
                setStarted(true);
              }}
            >
              Start playing
            </button>
          </div>
        ) : (
          <>
            {items.map(x => (
              <button
                key={x.id}
                className="falling-heart"
                style={{ left: `${x.left}%` }}
                onClick={() => {
                  setScore(s => s + 1);
                  setItems(a => a.filter(y => y.id !== x.id));
                }}
              >
                💗
              </button>
            ))}

            <button className="game-stop" onClick={() => setStarted(false)}>
              Finish
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// BIRTHDAY QUIZ
function BirthdayQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);

  const done = step >= quiz.length;

  return (
    <div className="game-box quiz-box">
      <div className="game-head">
        <span>✧ Birthday quiz</span>
        <b>{done ? 'Finished' : `${step + 1} / ${quiz.length}`}</b>
      </div>

      {done ? (
        <div className="game-intro">
          <span className="big-emoji">🏆</span>
          <h3>You're the birthday star!</h3>
          <p>
            You got {answers.filter(Boolean).length} out of {quiz.length} right.
            But you're always my number one.
          </p>
          <button
            className="pill-button"
            onClick={() => {
              setStep(0);
              setAnswers([]);
            }}
          >
            Play again
          </button>
        </div>
      ) : (
        <div className="quiz-content">
          <h3>{quiz[step].q}</h3>

          {quiz[step].a.map((a, i) => (
            <button
              className="answer-button"
              key={a}
              onClick={() => {
                setAnswers(v => [...v, i === quiz[step].correct]);
                setStep(s => s + 1);
              }}
            >
              {a}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// MYSTERY GIFT GAME
function GiftGame() {
  const [opened, setOpened] = useState([]);

  const gifts = [
    ['🤗', 'A thousand hugs'],
    ['💗', 'A thousand kisses for you'],
    ['🥰', 'A hug that never ends']
  ];

  return (
    <div className="game-box">
      <div className="game-head">
        <span>🎁 Pick a surprise</span>
        <b>{opened.length}/3 opened</b>
      </div>

      <div className="gift-grid">
        {gifts.map(([emoji, msg], i) => (
          <button
            className={`gift-tile ${opened.includes(i) ? 'opened' : ''}`}
            key={i}
            onClick={() => setOpened(a => a.includes(i) ? a : [...a, i])}
          >
            <span>{opened.includes(i) ? emoji : '🎁'}</span>
            <small>{opened.includes(i) ? msg : 'Tap to open'}</small>
          </button>
        ))}
      </div>

      {opened.length === 3 && (
        <p className="sweet-note">
          You deserve every lovely thing in this world ♡
        </p>
      )}
    </div>
  );
}

// MAIN APP
export default function App() {
  // PERFECT SONG
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  // BACKGROUND SONG
  const [backgroundPlaying, setBackgroundPlaying] = useState(false);
  const backgroundAudioRef = useRef(null);

  const [letterOpen, setLetterOpen] = useState(false);
  const [showNote, setShowNote] = useState(false);

  // PERFECT SONG CONTROL
  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setPlaying(true);
      } catch {
        alert('Check that your-song.mp3 is inside public/music.');
      }
    }
  };

  // BACKGROUND SONG CONTROL
  const startBackgroundMusic = async () => {
    if (!backgroundAudioRef.current) return;

    if (backgroundAudioRef.current.paused) {
      try {
        await backgroundAudioRef.current.play();
        setBackgroundPlaying(true);
      } catch {
        // Autoplay may be blocked by the browser.
      }
    }
  };

  const toggleBackgroundMusic = async () => {
    if (!backgroundAudioRef.current) return;

    if (backgroundPlaying) {
      backgroundAudioRef.current.pause();
      setBackgroundPlaying(false);
    } else {
      try {
        await backgroundAudioRef.current.play();
        setBackgroundPlaying(true);
      } catch {
        alert('Check that background-song.mp3 is inside public/music.');
      }
    }
  };

  useEffect(() => {
    startBackgroundMusic();
  }, []);

  return (
    <div
      className="site-shell"
      onClickCapture={e => {
        if (
          !e.target.closest?.('.music-toggle') &&
          !e.target.closest?.('.play-button')
        ) {
          startBackgroundMusic();
        }
      }}
    >
      {/* BACKGROUND SONG */}
      <audio
        ref={backgroundAudioRef}
        src="/music/background-song.mp3"
        loop
        preload="auto"
        onPlay={() => setBackgroundPlaying(true)}
        onPause={() => setBackgroundPlaying(false)}
      />

      {/* PERFECT SONG */}
      <audio
        ref={audioRef}
        src="/music/your-song.mp3"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* NAVIGATION */}
      <nav className="top-nav">
        <a className="brand" href="#home">♡</a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#scratch">Surprise</a>
          <a href="#games">Games</a>
          <a href="#letter">Letter</a>
        </div>

        <button
          className="music-toggle"
          onClick={toggleBackgroundMusic}
          aria-label={backgroundPlaying ? 'Pause background music' : 'Play background music'}
          title={backgroundPlaying ? 'Pause background music' : 'Play background music'}
        >
          {backgroundPlaying ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>
      </nav>

      {/* HERO */}
      <section className="hero hero-video" id="home">
        <video
          className="hero-background-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero-poster.jpg"
        >
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>

        <div className="hero-video-overlay"></div>

        <div className="hero-copy">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            A little world made just for you
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Happy Birthday,
            <br />
            <em>My Cutsiee Girl</em> <span>♡</span>
          </motion.h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Today, the world celebrates the most amazing
            person I know. You deserve all the magic. ♡
          </motion.p>

          <motion.a
            className="hero-button"
            href="#scratch"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            A little surprise for you <span>♡ →</span>
          </motion.a>
        </div>

        <motion.div
          className="scroll-cue"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={18} />
          SCROLL TO EXPLORE
        </motion.div>
      </section>

      {/* BIRTHDAY GIRL */}
      <section className="spotlight section-pad">
        <div className="polaroid">
          <div className="image-placeholder">
            <img
              src="/images/her-photo.jpg"
              alt="Birthday girl"
              onError={e => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span></span>
          </div>
          <p>Birthday girl ♡</p>
        </div>

        <div className="spotlight-copy">
          <p className="eyebrow">The star of today</p>
          <h2>
            Someone incredibly
            <br />
            <em>special was born.</em>
          </h2>
          <p>
            And I feel so lucky that I get to celebrate you.
            You bring so much happiness, warmth and colour into my life.
          </p>
          <p className="script-line">Happy Birthday, Princess ♡</p>
        </div>
      </section>

      {/* SCRATCH CARD */}
      <section className="scratch-section section-pad" id="scratch">
        <p className="eyebrow">Psst... I saved a little something</p>
        <h2>Scratch to <em>reveal</em> ♡</h2>
        <p className="section-intro">
          I have a special picture for you. Scratch the card and see!
        </p>
        <ScratchCard image="/images/our-photo.jpg" />
      </section>

      {/* REASONS */}
      <section className="reasons section-pad">
        <p className="eyebrow">A little reminder</p>
        <h2>A few reasons <em>you're so special</em> ♡</h2>

        <div className="reason-grid">
          {reasons.map(([icon, title, desc], i) => (
            <motion.div
              className="reason-card"
              key={title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <span>{icon}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PERSONAL VIDEO MESSAGE */}
      <section className="video-section section-pad" id="my-message">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="eyebrow">Something from me, just for you ♡</p>
          <h2>A little message <em>from me</em></h2>

          <p className="section-intro">
            I wanted to do more than just write you a letter.
            So here's a little something you can watch whenever you miss me. ♡
          </p>

          <div className="video-frame">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/images/video-poster.jpg"
            >
              <source src="/videos/her-video.mp4" type="video/mp4" />
              Your browser does not support video.
            </video>
          </div>

          <p className="video-personal-note">
            Just you, me, and a little message from my heart. ♡
          </p>
        </motion.div>
      </section>

      {/* PERFECT MUSIC PLAYER */}
      <section className="playlist-section section-pad">
        <div className="playlist-copy">
          <p className="eyebrow">A LITTLE SONG FOR YOU</p>

          <h2>
            Because you're my definition of <em>perfect</em> ♡
          </h2>

          <p>
            If I had to put how I see you into a song, it would be this one.
          </p>
        </div>

        <div className="player-card">
          <div className="album-art">♫</div>

          <div className="track-info">
            <b>Your special song ♡</b>
            <small>A little melody for you</small>
          </div>

          <button className="play-button" onClick={toggleMusic}>
            {playing ? <Pause /> : <Play />}
          </button>

          <div className="track-line">
            <span />
          </div>

          <small className="track-foot">
            Made with love · on repeat
          </small>
        </div>
      </section>

      {/* LOVE LETTER */}
      <section className="letter-section section-pad" id="letter">
        <p className="eyebrow">Words from my heart</p>
        <h2>A letter <em>for you</em> ♡</h2>

        <button
          className={`envelope ${letterOpen ? 'opened' : ''}`}
          onClick={() => setLetterOpen(v => !v)}
        >
          <span className="envelope-heart">♥</span>
          <span>
            {letterOpen ? 'Your letter is open' : 'Tap to open your letter'}
          </span>
        </button>

        <AnimatePresence>
          {letterOpen && (
            <motion.div
              className="letter-paper"
              initial={{ opacity: 0, y: 25, scale: .96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15 }}
            >
              <p>To my cutsieee jaana!!(siddhu),</p>

              <p>
                I wish you could see yourself through my eyes, even just for a
                moment. You'd understand how incredibly beautiful you are,
                not just in the way you look, but in everything that makes you
                YOU.
              </p>

              <p>
                Your smile, your little expressions, your laugh, and all those
                tiny things you do without even realising them — they're all
                reasons why you are so special to me.
              </p>

              <p>
                Today, I hope you feel as special as you truly are. I hope this
                year brings you closer to every dream you've ever had, fills
                your days with happiness, and gives you a thousand reasons
                to smile.
              </p>

              <p>
                Never stop being the wonderful girl you are. And never forget
                that there's someone who feels incredibly lucky to have you
                in his life.
              </p>

              <p className="script-line">
                Happy Birthday, my pretty babygirl. I love yaa!! ♡
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* MINI GAMES */}
      <section className="games-section section-pad" id="games">
        <p className="eyebrow">A tiny birthday arcade</p>
        <h2>Let's play <em>together!</em> ♡</h2>
        <p className="section-intro">
          Three little games, made for the birthday girl.
        </p>

        <div className="games-grid">
          <CatchGame />
          <BirthdayQuiz />
          <GiftGame />
        </div>
      </section>

      {/* BIRTHDAY CAKE */}
      <section className="cake-section section-pad">
        <div className="cake-sparkles">✧　♡　✧</div>
        <p className="eyebrow">Make a wish, birthday girl</p>
        <h2>Your birthday <em>cake</em> ♡</h2>

        <button
          className="cake-emoji"
          onClick={() => setShowNote(v => !v)}
          aria-label="Make a wish"
        >
          🎂
        </button>

        <p>
          {showNote
            ? 'I hope every wish you make finds its way to you. ♡'
            : 'Tap the cake and make a wish!'}
        </p>
      </section>

      {/* FINAL BIRTHDAY MESSAGE */}
      <footer className="finale">
        <div className="finale-deco">🌷　♡　🌷</div>
        <p className="eyebrow">Once again...</p>
        <h2>Happy Birthday! <span>♡</span></h2>

        <p>
          May this year bring you endless happiness, good health,
          beautiful surprises and everything your heart wishes for.
        </p>

        <p>
          Keep shining, keep smiling, and keep being the incredible
          person you are.
        </p>

        <button
          className="hero-button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          A hug from me to you ♡ ↑
        </button>

        <small>Made with love, just for you.</small>
      </footer>

      <div className="floating-heart" aria-hidden="true">♡</div>
    </div>
  );
}
