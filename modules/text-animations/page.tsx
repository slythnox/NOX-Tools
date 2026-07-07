import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Code, RotateCcw, Heart, Copy, Check, Sparkles, RefreshCw, Type, Sliders, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

// TYPES
type EaseType = 'power3.out' | 'power2.out' | 'elastic.out' | 'bounce.out' | 'back.out' | 'linear';
type AnimationTab = 'preview' | 'code';
type ExportTab = 'react' | 'usage';

interface ControlField {
  id: string;
  label: string;
  type: 'slider' | 'select' | 'toggle' | 'text' | 'color';
  default: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
}

interface AnimationConfig {
  id: string;
  name: string;
  description: string;
  defaultText: string;
  controls: ControlField[];
}

// 21 ANIMATIONS CONFIGURATION
const ANIMATIONS: AnimationConfig[] = [
  {
    id: 'split-text',
    name: 'Split Text',
    description: 'Animate individual characters or words into place sequentially.',
    defaultText: 'Hello, you!',
    controls: [
      {
        id: 'splitType',
        label: 'Split Type',
        type: 'select',
        default: 'chars',
        options: [
          { value: 'chars', label: 'Chars' },
          { value: 'words', label: 'Words' }
        ]
      },
      {
        id: 'ease',
        label: 'Ease',
        type: 'select',
        default: 'power3.out',
        options: [
          { value: 'power3.out', label: 'power3.out' },
          { value: 'power2.out', label: 'power2.out' },
          { value: 'elastic.out', label: 'elastic.out' },
          { value: 'bounce.out', label: 'bounce.out' },
          { value: 'linear', label: 'linear' }
        ]
      },
      { id: 'stagger', label: 'Stagger Delay (ms)', type: 'slider', default: 50, min: 10, max: 200, step: 5 },
      { id: 'duration', label: 'Duration (s)', type: 'slider', default: 1.3, min: 0.2, max: 3.0, step: 0.1 },
      { id: 'showToast', label: 'Show Completion Toast', type: 'toggle', default: false }
    ]
  },
  {
    id: 'blur-text',
    name: 'Blur Text',
    description: 'Letters fade in from a soft focus blur into sharp text.',
    defaultText: 'Blurring in softly...',
    controls: [
      { id: 'blurAmount', label: 'Blur Amount (px)', type: 'slider', default: 10, min: 2, max: 30, step: 1 },
      { id: 'stagger', label: 'Stagger Delay (ms)', type: 'slider', default: 40, min: 10, max: 200, step: 5 },
      { id: 'duration', label: 'Duration (s)', type: 'slider', default: 1.0, min: 0.2, max: 3.0, step: 0.1 },
      {
        id: 'direction',
        label: 'Animate From',
        type: 'select',
        default: 'top',
        options: [
          { value: 'top', label: 'Top' },
          { value: 'bottom', label: 'Bottom' }
        ]
      }
    ]
  },
  {
    id: 'circular-text',
    name: 'Circular Text',
    description: 'Arrange letters in a perfectly rotating circle.',
    defaultText: 'ONYX WORKSPACE • DEVELOPER UTILITIES • ',
    controls: [
      { id: 'radius', label: 'Circle Radius (px)', type: 'slider', default: 100, min: 40, max: 200, step: 5 },
      { id: 'fontSize', label: 'Font Size (px)', type: 'slider', default: 14, min: 10, max: 32, step: 1 },
      { id: 'spinSpeed', label: 'Spin Cycle Speed (s)', type: 'slider', default: 12, min: 2, max: 40, step: 1 },
      { id: 'continuous', label: 'Continuous Rotation', type: 'toggle', default: true }
    ]
  },
  {
    id: 'text-type',
    name: 'Text Type',
    description: 'Typewriter effect printing character-by-character.',
    defaultText: 'Building the future of developer tools.',
    controls: [
      { id: 'typeSpeed', label: 'Typing Speed (ms)', type: 'slider', default: 50, min: 10, max: 300, step: 5 },
      { id: 'cursorColor', label: 'Cursor Color', type: 'color', default: '#8b5cf6' },
      {
        id: 'cursorStyle',
        label: 'Cursor Style',
        type: 'select',
        default: 'blinking',
        options: [
          { value: 'blinking', label: 'Blinking block' },
          { value: 'solid', label: 'Solid block' },
          { value: 'none', label: 'No cursor' }
        ]
      }
    ]
  },
  {
    id: 'shuffle',
    name: 'Shuffle',
    description: 'Shuffle text letters randomly before resolving them.',
    defaultText: 'DECRYPTING TERMINAL MODULES...',
    controls: [
      { id: 'speed', label: 'Shuffle Speed (ms)', type: 'slider', default: 30, min: 10, max: 150, step: 5 },
      { id: 'duration', label: 'Decrypt Delay (ms)', type: 'slider', default: 400, min: 100, max: 1500, step: 50 }
    ]
  },
  {
    id: 'shiny-text',
    name: 'Shiny Text',
    description: 'Sweep a bright shine highlights gradient continuously.',
    defaultText: 'Shine bright like ONYX',
    controls: [
      { id: 'speed', label: 'Shine Sweep Speed (s)', type: 'slider', default: 2.5, min: 1.0, max: 6.0, step: 0.1 },
      { id: 'width', label: 'Shimmer Width (px)', type: 'slider', default: 150, min: 50, max: 400, step: 10 },
      { id: 'shineColor', label: 'Shine Highlight', type: 'color', default: '#ffffff' }
    ]
  },
  {
    id: 'text-pressure',
    name: 'Text Pressure',
    description: 'Hover to deform and expand layout weight or scale.',
    defaultText: 'PRESSURE',
    controls: [
      { id: 'minWeight', label: 'Min Weight', type: 'slider', default: 200, min: 100, max: 900, step: 50 },
      { id: 'maxWeight', label: 'Max Weight', type: 'slider', default: 900, min: 100, max: 900, step: 50 },
      { id: 'letterSpacing', label: 'Base Spacing (px)', type: 'slider', default: 2, min: -5, max: 20, step: 1 }
    ]
  },
  {
    id: 'curved-loop',
    name: 'Curved Loop',
    description: 'Slides text horizontally along a curved path in a loop.',
    defaultText: 'Infinite text loop following a curved path...',
    controls: [
      { id: 'curvature', label: 'Curvature Height', type: 'slider', default: 60, min: 10, max: 150, step: 5 },
      { id: 'fontSize', label: 'Font Size (px)', type: 'slider', default: 16, min: 10, max: 36, step: 1 },
      { id: 'speed', label: 'Scroll Cycle Duration (s)', type: 'slider', default: 10, min: 3, max: 30, step: 1 }
    ]
  },
  {
    id: 'fuzzy-text',
    name: 'Fuzzy Text',
    description: 'SVG turbulence displacement creating a smoky fuzz.',
    defaultText: 'FUZZY SMOKE',
    controls: [
      { id: 'fuzz', label: 'Fuzzy Intensity', type: 'slider', default: 4, min: 1, max: 15, step: 0.5 },
      { id: 'speed', label: 'Flicker Cycle Speed', type: 'slider', default: 3, min: 1, max: 10, step: 0.5 }
    ]
  },
  {
    id: 'gradient-text',
    name: 'Gradient Text',
    description: 'Fills text with an animated rainbow color gradient.',
    defaultText: 'VIBRANT GRADIENT TEXT',
    controls: [
      { id: 'speed', label: 'Gradient Shift Speed (s)', type: 'slider', default: 4, min: 1, max: 10, step: 0.5 },
      { id: 'angle', label: 'Gradient Angle (deg)', type: 'slider', default: 45, min: 0, max: 360, step: 5 },
      { id: 'startColor', label: 'Start Color', type: 'color', default: '#a78bfa' },
      { id: 'endColor', label: 'End Color', type: 'color', default: '#ec4899' }
    ]
  },
  {
    id: 'falling-text',
    name: 'Falling Text',
    description: 'Letters fall down from above and bounce onto the floor.',
    defaultText: 'BOUNCE',
    controls: [
      { id: 'gravity', label: 'Gravity Speed (s)', type: 'slider', default: 0.6, min: 0.2, max: 2.0, step: 0.1 },
      { id: 'bounce', label: 'Bounce Elasticity', type: 'slider', default: 0.6, min: 0.1, max: 0.9, step: 0.05 },
      { id: 'stagger', label: 'Stagger Delay (ms)', type: 'slider', default: 60, min: 10, max: 200, step: 5 }
    ]
  },
  {
    id: 'text-cursor',
    name: 'Text Cursor',
    description: 'Fades and types text with a tracking mouse trail.',
    defaultText: 'Hover and follow cursor trails',
    controls: [
      { id: 'hoverScale', label: 'Hover Word Scale', type: 'slider', default: 1.15, min: 1.0, max: 1.5, step: 0.05 },
      { id: 'cursorSize', label: 'Cursor size (px)', type: 'slider', default: 12, min: 4, max: 32, step: 1 }
    ]
  },
  {
    id: 'decrypted-text',
    name: 'Decrypted Text',
    description: 'Decodes text displaying futuristic Matrix code blocks.',
    defaultText: 'ONYX ACCESS GRANTED',
    controls: [
      { id: 'decryptSpeed', label: 'Decrypt Speed (ms)', type: 'slider', default: 40, min: 10, max: 200, step: 5 },
      { id: 'scrambleCount', label: 'Scramble cycles', type: 'slider', default: 6, min: 1, max: 20, step: 1 }
    ]
  },
  {
    id: 'true-focus',
    name: 'True Focus',
    description: 'Keeps hovered word in sharp focus while others blur out.',
    defaultText: 'Hover each word to bring it into focus',
    controls: [
      { id: 'blurAmount', label: 'Background Blur (px)', type: 'slider', default: 5, min: 2, max: 15, step: 1 },
      { id: 'scale', label: 'Hover Focus Scale', type: 'slider', default: 1.1, min: 1.0, max: 1.4, step: 0.05 }
    ]
  },
  {
    id: 'scroll-float',
    name: 'Scroll Float',
    description: 'Hover to make words float up dynamically.',
    defaultText: 'Floating elegantly in the layout',
    controls: [
      { id: 'floatHeight', label: 'Float Height (px)', type: 'slider', default: 12, min: 4, max: 40, step: 1 },
      { id: 'floatSpeed', label: 'Float Duration (s)', type: 'slider', default: 2.0, min: 0.5, max: 5.0, step: 0.1 }
    ]
  },
  {
    id: 'scroll-reveal',
    name: 'Scroll Reveal',
    description: 'Simulates letters revealing based on viewport scrolls.',
    defaultText: 'Drag the slider below to scroll the text reveal progress.',
    controls: [
      { id: 'progress', label: 'Simulated Scroll Progress', type: 'slider', default: 40, min: 0, max: 100, step: 1 },
      { id: 'color', label: 'Active Text Color', type: 'color', default: '#a78bfa' }
    ]
  },
  {
    id: 'ascii-text',
    name: 'ASCII Text',
    description: 'Convert custom titles into clean terminal ASCII art blocks.',
    defaultText: 'ONYX',
    controls: [
      {
        id: 'fontStyle',
        label: 'ASCII Font',
        type: 'select',
        default: 'block',
        options: [
          { value: 'block', label: 'Block banner' },
          { value: 'slant', label: 'Slant code' },
          { value: 'mini', label: 'Minimalist' }
        ]
      }
    ]
  },
  {
    id: 'scrambled-text',
    name: 'Scrambled Text',
    description: 'Interactively scrambles letters on mouse hover.',
    defaultText: 'SCRAMBLE INTERACTIVE',
    controls: [
      { id: 'speed', label: 'Scramble Speed (ms)', type: 'slider', default: 40, min: 10, max: 150, step: 5 }
    ]
  },
  {
    id: 'rotating-text',
    name: 'Rotating Text',
    description: 'Loop words list vertically inside a sentence.',
    defaultText: 'fast, local, reliable, secure',
    controls: [
      { id: 'interval', label: 'Rotate Interval (s)', type: 'slider', default: 2.0, min: 0.5, max: 5.0, step: 0.1 },
      {
        id: 'transitionType',
        label: 'Transition',
        type: 'select',
        default: 'slide',
        options: [
          { value: 'slide', label: 'Slide Up' },
          { value: 'fade', label: 'Fade Only' }
        ]
      }
    ]
  },
  {
    id: 'glitch-text',
    name: 'Glitch Text',
    description: 'Cyberpunk RGB shadow splittings and clipping glitches.',
    defaultText: 'SYSTEM MALFUNCTION',
    controls: [
      { id: 'intensity', label: 'Glitch Intensity', type: 'slider', default: 5, min: 1, max: 10, step: 1 },
      { id: 'color1', label: 'Shadow Split 1', type: 'color', default: '#00ffff' },
      { id: 'color2', label: 'Shadow Split 2', type: 'color', default: '#ff00ff' }
    ]
  },
  {
    id: 'scroll-velocity',
    name: 'Scroll Velocity',
    description: 'Continuous rolling text banner with velocity controller.',
    defaultText: 'ONYX WORKSPACE UTILITIES — ',
    controls: [
      { id: 'velocity', label: 'Marquee Velocity', type: 'slider', default: 15, min: -60, max: 60, step: 2 }
    ]
  }
];

// SUB-COMPONENTS TO PREVENT CONDITIONAL HOOKS VIOLATIONS
const TextTypePreview = ({
  text,
  typeSpeed,
  cursorColor,
  cursorStyle,
  triggerKey
}: {
  text: string;
  typeSpeed: number;
  cursorColor: string;
  cursorStyle: string;
  triggerKey: number;
}) => {
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    setTypedText('');
    let idx = 0;
    const timer = setInterval(() => {
      if (idx < text.length) {
        setTypedText(prev => prev + text.charAt(idx));
        idx++;
      } else {
        clearInterval(timer);
      }
    }, typeSpeed);

    return () => clearInterval(timer);
  }, [text, typeSpeed, triggerKey]);

  return (
    <div className="text-2xl sm:text-3xl font-mono text-white flex items-center gap-1 select-none font-bold text-center max-w-xl">
      <span>{typedText}</span>
      {cursorStyle !== 'none' && (
        <span
          className={cn(
            "w-2.5 h-6 bg-current inline-block",
            cursorStyle === 'blinking' && "animate-pulse"
          )}
          style={{ color: cursorColor }}
        />
      )}
    </div>
  );
};

const ShufflePreview = ({
  text,
  speed,
  decryptDelay,
  triggerKey
}: {
  text: string;
  speed: number;
  decryptDelay: number;
  triggerKey: number;
}) => {
  const [shuffled, setShuffled] = useState('');

  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let ticks = 0;
    const target = text;
    let timer: any;

    const tick = () => {
      const progress = (ticks * speed) / decryptDelay;
      const solvedCount = Math.floor(target.length * Math.min(1, progress));

      let out = '';
      for (let i = 0; i < target.length; i++) {
        if (i < solvedCount) {
          out += target[i];
        } else if (target[i] === ' ') {
          out += ' ';
        } else {
          out += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setShuffled(out);

      if (solvedCount < target.length) {
        ticks++;
        timer = setTimeout(tick, speed);
      }
    };

    tick();
    return () => clearTimeout(timer);
  }, [text, speed, decryptDelay, triggerKey]);

  return (
    <div className="text-3xl sm:text-4xl font-mono tracking-wider font-extrabold text-white text-center select-none max-w-xl">
      {shuffled}
    </div>
  );
};

const TextPressurePreview = ({
  text,
  minWeight,
  maxWeight,
  letterSpacing
}: {
  text: string;
  minWeight: number;
  maxWeight: number;
  letterSpacing: number;
}) => {
  const [weight, setWeight] = useState(minWeight);

  return (
    <div
      className="text-4xl sm:text-6xl tracking-tight transition-all duration-300 select-none uppercase font-sans text-center max-w-lg cursor-pointer"
      style={{
        fontWeight: weight,
        letterSpacing: `${letterSpacing}px`
      }}
      onMouseEnter={() => setWeight(maxWeight)}
      onMouseLeave={() => setWeight(minWeight)}
    >
      {text}
    </div>
  );
};

const TextCursorPreview = ({
  text,
  hoverScale,
  cursorSize
}: {
  text: string;
  hoverScale: number;
  cursorSize: number;
}) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-2 text-2xl sm:text-3xl font-mono text-zinc-100 select-none">
      {text.split(' ').map((word, i) => (
        <span
          key={i}
          className="relative inline-flex items-center gap-1 py-1 px-1.5 rounded cursor-pointer transition-all duration-200"
          style={{
            transform: hoverIdx === i ? `scale(${hoverScale})` : 'scale(1)',
            color: hoverIdx === i ? '#ffffff' : 'inherit'
          }}
          onMouseEnter={() => setHoverIdx(i)}
          onMouseLeave={() => setHoverIdx(null)}
        >
          {word}
          {hoverIdx === i && (
            <span
              className="absolute bg-violet-500 rounded-full animate-ping pointer-events-none"
              style={{
                width: cursorSize,
                height: cursorSize,
                bottom: -2,
                right: '50%',
                transform: 'translateX(50%)'
              }}
            />
          )}
        </span>
      ))}
    </div>
  );
};

const DecryptedTextPreview = ({
  text,
  decryptSpeed,
  scrambleCount,
  triggerKey
}: {
  text: string;
  decryptSpeed: number;
  scrambleCount: number;
  triggerKey: number;
}) => {
  const [decrypted, setDecrypted] = useState('');

  useEffect(() => {
    const matrixChars = '0123456789ABCDEF@#$%&+*';
    let cycle = 0;
    let timer: any;

    const step = () => {
      let out = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          out += ' ';
          continue;
        }
        const charCycle = cycle - i * 2;
        if (charCycle >= scrambleCount) {
          out += text[i];
        } else if (charCycle >= 0) {
          out += matrixChars[Math.floor(Math.random() * matrixChars.length)];
        } else {
          out += '';
        }
      }
      setDecrypted(out);

      const isDone = cycle >= text.length * 2 + scrambleCount;
      if (!isDone) {
        cycle++;
        timer = setTimeout(step, decryptSpeed);
      }
    };

    step();
    return () => clearTimeout(timer);
  }, [text, decryptSpeed, scrambleCount, triggerKey]);

  return (
    <div className="text-2xl sm:text-3xl font-mono text-emerald-500 tracking-widest font-bold text-center select-none max-w-xl">
      {decrypted}
    </div>
  );
};

const TrueFocusPreview = ({
  text,
  blurAmount,
  scale
}: {
  text: string;
  blurAmount: number;
  scale: number;
}) => {
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);

  return (
    <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-2xl sm:text-3xl text-zinc-350 select-none">
      {text.split(' ').map((word, i) => {
        const isHovered = focusedIdx === i;
        const isAnyHovered = focusedIdx !== null;
        const shouldBlur = isAnyHovered && !isHovered;

        return (
          <span
            key={i}
            className="cursor-pointer transition-all duration-300 inline-block font-sans"
            style={{
              filter: shouldBlur ? `blur(${blurAmount}px)` : 'blur(0px)',
              opacity: shouldBlur ? 0.35 : 1,
              transform: isHovered ? `scale(${scale})` : 'scale(1)',
              color: isHovered ? '#ffffff' : 'inherit'
            }}
            onMouseEnter={() => setFocusedIdx(i)}
            onMouseLeave={() => setFocusedIdx(null)}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

const ScrambledTextPreview = ({
  text,
  speed
}: {
  text: string;
  speed: number;
}) => {
  const [scrambled, setScrambled] = useState(text);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!hovered) {
      setScrambled(text);
      return;
    }
    const chars = '!@#$%^&*()-+=[]{}|;:,.<>?/~';
    const interval = setInterval(() => {
      const out = text
        .split('')
        .map(c => {
          if (c === ' ') return ' ';
          return Math.random() > 0.6 ? c : chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      setScrambled(out);
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, hovered]);

  return (
    <div
      className="text-3xl sm:text-4xl font-extrabold tracking-wide text-white select-none cursor-pointer uppercase transition-colors duration-150 hover:text-violet-400"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {scrambled}
    </div>
  );
};

const RotatingTextPreview = ({
  text,
  interval,
  transitionType
}: {
  text: string;
  interval: number;
  transitionType: string;
}) => {
  const words = text.split(',').map(w => w.trim());
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIdx(prev => (prev + 1) % words.length);
    }, interval * 1000);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  return (
    <div className="flex items-center justify-center gap-2 text-2xl sm:text-4xl font-extrabold text-white select-none">
      <span className="text-zinc-400 font-sans">ONYX is</span>
      <div className="relative overflow-hidden h-12 w-48 flex items-center justify-start">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIdx}
            className="absolute text-violet-400 font-mono font-bold"
            initial={transitionType === 'slide' ? { y: 30, opacity: 0 } : { opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={transitionType === 'slide' ? { y: -30, opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {words[wordIdx]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function TextAnimationsPage() {
  const [activeAnimId, setActiveAnimId] = useState<string>('split-text');
  const [activeTab, setActiveTab] = useState<AnimationTab>('preview');
  const [exportTab, setExportTab] = useState<ExportTab>('react');
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<boolean>(false);
  const [triggerKey, setTriggerKey] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeConfig = ANIMATIONS.find(a => a.id === activeAnimId) || ANIMATIONS[0];
  const [customText, setCustomText] = useState<string>(activeConfig.defaultText);
  const [controlValues, setControlValues] = useState<Record<string, any>>({});

  // Reset values when switching animations
  useEffect(() => {
    setCustomText(activeConfig.defaultText);
    const initialValues: Record<string, any> = {};
    activeConfig.controls.forEach(c => {
      initialValues[c.id] = c.default;
    });
    setControlValues(initialValues);
    setTriggerKey(prev => prev + 1);
  }, [activeAnimId]);

  const handleControlChange = (controlId: string, val: any) => {
    setControlValues(prev => ({
      ...prev,
      [controlId]: val
    }));
  };

  const handleReset = () => {
    const defaultValues: Record<string, any> = {};
    activeConfig.controls.forEach(c => {
      defaultValues[c.id] = c.default;
    });
    setControlValues(defaultValues);
    setCustomText(activeConfig.defaultText);
    setTriggerKey(prev => prev + 1);
    showToastNotification('Animation parameters reset');
  };

  const handleToggleLike = () => {
    setLiked(prev => ({
      ...prev,
      [activeAnimId]: !prev[activeAnimId]
    }));
    showToastNotification(!liked[activeAnimId] ? 'Added to favorites' : 'Removed from favorites');
  };

  const showToastNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleCopyCode = () => {
    const code = generateSourceCode();
    navigator.clipboard.writeText(code);
    setCopied(true);
    showToastNotification('Source code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // TOAST COMPLETION HANDLER FOR PREVIEWS
  const triggerCompletionToast = () => {
    if (controlValues.showToast) {
      showToastNotification('Animation finished!');
    }
  };

  // SOURCE CODE GENERATOR
  const generateSourceCode = (): string => {
    if (exportTab === 'usage') {
      return `import React from 'react';
import ${activeConfig.name.replace(/\s+/g, '')} from './${activeConfig.name.replace(/\s+/g, '')}';

export default function Demo() {
  return (
    <div className="flex items-center justify-center min-h-[300px] bg-black text-white p-6">
      <${activeConfig.name.replace(/\s+/g, '')} 
        text="${customText}"
        ${Object.entries(controlValues)
          .map(([k, v]) => `${k}={${typeof v === 'string' ? `"${v}"` : v}}`)
          .join('\n        ')}
      />
    </div>
  );
}`;
    }

    switch (activeAnimId) {
      case 'split-text':
        return `import React from 'react';
import { motion } from 'framer-motion';

export default function SplitText({
  text = "${customText}",
  splitType = "${controlValues.splitType || 'chars'}",
  ease = "${controlValues.ease || 'power3.out'}",
  stagger = ${controlValues.stagger || 50},
  duration = ${controlValues.duration || 1.3}
}) {
  const elements = splitType === 'words' ? text.split(' ') : text.split('');
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger / 1000
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        ease: ease === 'linear' ? 'linear' : [0.215, 0.610, 0.355, 1.000]
      }
    }
  };

  return (
    <motion.p
      className="inline-flex flex-wrap justify-center overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {elements.map((item, idx) => (
        <motion.span
          key={idx}
          className="inline-block"
          variants={itemVariants}
          style={{ willChange: 'transform, opacity' }}
        >
          {item === ' ' ? '\\u00A0' : item}
          {splitType === 'words' && idx < elements.length - 1 && '\\u00A0'}
        </motion.span>
      ))}
    </motion.p>
  );
}`;

      case 'blur-text':
        return `import React from 'react';
import { motion } from 'framer-motion';

export default function BlurText({
  text = "${customText}",
  blurAmount = ${controlValues.blurAmount || 10},
  stagger = ${controlValues.stagger || 40},
  duration = ${controlValues.duration || 1.0},
  direction = "${controlValues.direction || 'top'}"
}) {
  const elements = text.split('');
  const yOffset = direction === 'top' ? -20 : 20;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger / 1000
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: yOffset, filter: \`blur(\${blurAmount}px)\` },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: duration,
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.p
      className="inline-flex flex-wrap justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {elements.map((char, idx) => (
        <motion.span
          key={idx}
          className="inline-block"
          variants={itemVariants}
        >
          {char === ' ' ? '\\u00A0' : char}
        </motion.span>
      ))}
    </motion.p>
  );
}`;

      case 'circular-text':
        return `import React from 'react';

export default function CircularText({
  text = "${customText}",
  radius = ${controlValues.radius || 100},
  fontSize = ${controlValues.fontSize || 14},
  spinSpeed = ${controlValues.spinSpeed || 12},
  continuous = ${controlValues.continuous !== false}
}) {
  const chars = text.split('');
  const degreeStep = 360 / chars.length;

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{
        width: radius * 2,
        height: radius * 2,
        animation: continuous ? \`spin \${spinSpeed}s linear infinite\` : 'none'
      }}
    >
      {chars.map((char, i) => {
        const rotation = i * degreeStep;
        return (
          <span
            key={i}
            className="absolute font-mono uppercase font-bold"
            style={{
              fontSize: \`\${fontSize}px\`,
              transform: \`rotate(\${rotation}deg) translateY(-\${radius}px)\`,
              transformOrigin: 'center center'
            }}
          >
            {char}
          </span>
        );
      })}
      <style>{\`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      \`}</style>
    </div>
  );
}`;

      default:
        return `import React from 'react';
import { motion } from 'framer-motion';

// ${activeConfig.name} Custom Animation Module
export default function ${activeConfig.name.replace(/\s+/g, '')}({
  text = "${customText}"
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {text}
    </motion.span>
  );
}`;
    }
  };

  // INDIVIDUAL COMPONENT RENDERER
  const renderActivePreview = () => {
    const text = customText || ' ';

    switch (activeAnimId) {
      case 'split-text': {
        const splitType = controlValues.splitType || 'chars';
        const stagger = (controlValues.stagger || 50) / 1000;
        const duration = controlValues.duration || 1.3;
        const easeVal = controlValues.ease || 'power3.out';
        const elements = splitType === 'words' ? text.split(' ') : text.split('');

        // Framer Motion transition mapping
        let transitionEase = [0.215, 0.610, 0.355, 1.000]; // power3.out equivalent
        if (easeVal === 'power2.out') transitionEase = [0.165, 0.84, 0.44, 1.0];
        if (easeVal === 'linear') transitionEase = [0, 0, 1, 1] as any;
        if (easeVal === 'elastic.out') transitionEase = [0.175, 0.885, 0.32, 1.275]; // back/elastic approx

        const containerVariants = {
          hidden: {},
          visible: {
            transition: {
              staggerChildren: stagger
            }
          }
        };

        const itemVariants = {
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: duration,
              ease: transitionEase
            }
          }
        };

        return (
          <motion.div
            key={triggerKey}
            className="flex flex-wrap justify-center text-4xl sm:text-5xl font-extrabold tracking-tight text-white max-w-xl text-center select-none"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onAnimationComplete={triggerCompletionToast}
          >
            {elements.map((item, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                variants={itemVariants}
                style={{ willChange: 'transform, opacity' }}
              >
                {item === ' ' ? '\u00A0' : item}
                {splitType === 'words' && idx < elements.length - 1 && '\u00A0'}
              </motion.span>
            ))}
          </motion.div>
        );
      }

      case 'blur-text': {
        const blurAmount = controlValues.blurAmount || 10;
        const stagger = (controlValues.stagger || 40) / 1000;
        const duration = controlValues.duration || 1.0;
        const direction = controlValues.direction || 'top';
        const elements = text.split('');
        const yOffset = direction === 'top' ? -30 : 30;

        const containerVariants = {
          hidden: {},
          visible: {
            transition: {
              staggerChildren: stagger
            }
          }
        };

        const itemVariants = {
          hidden: { opacity: 0, y: yOffset, filter: `blur(${blurAmount}px)` },
          visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: {
              duration: duration,
              ease: 'easeOut'
            }
          }
        };

        return (
          <motion.div
            key={triggerKey}
            className="flex flex-wrap justify-center text-4xl sm:text-5xl font-extrabold text-white max-w-xl text-center select-none"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {elements.map((char, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                variants={itemVariants}
                style={{ willChange: 'transform, filter, opacity' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.div>
        );
      }

      case 'circular-text': {
        const radius = controlValues.radius || 100;
        const fontSize = controlValues.fontSize || 14;
        const spinSpeed = controlValues.spinSpeed || 12;
        const continuous = controlValues.continuous !== false;
        const chars = text.split('');
        const degreeStep = 360 / chars.length;

        return (
          <div key={triggerKey} className="flex items-center justify-center p-6 select-none">
            <motion.div
              className="relative flex items-center justify-center"
              style={{ width: radius * 2, height: radius * 2 }}
              animate={continuous ? { rotate: 360 } : {}}
              transition={continuous ? { repeat: Infinity, duration: spinSpeed, ease: 'linear' } : {}}
            >
              {chars.map((char, i) => {
                const rotation = i * degreeStep;
                return (
                  <span
                    key={i}
                    className="absolute font-mono uppercase font-bold text-zinc-100"
                    style={{
                      fontSize: `${fontSize}px`,
                      transform: `rotate(${rotation}deg) translateY(-${radius}px)`,
                      transformOrigin: 'center center'
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </motion.div>
          </div>
        );
      }

      case 'text-type': {
        const typeSpeed = controlValues.typeSpeed || 50;
        const cursorColor = controlValues.cursorColor || '#8b5cf6';
        const cursorStyle = controlValues.cursorStyle || 'blinking';

        return (
          <TextTypePreview
            text={text}
            typeSpeed={typeSpeed}
            cursorColor={cursorColor}
            cursorStyle={cursorStyle}
            triggerKey={triggerKey}
          />
        );
      }

      case 'shuffle': {
        const speed = controlValues.speed || 30;
        const decryptDelay = controlValues.duration || 400;

        return (
          <ShufflePreview
            text={text}
            speed={speed}
            decryptDelay={decryptDelay}
            triggerKey={triggerKey}
          />
        );
      }

      case 'shiny-text': {
        const speed = controlValues.speed || 2.5;
        const width = controlValues.width || 150;
        const shineColor = controlValues.shineColor || '#ffffff';

        return (
          <div className="relative select-none text-4xl sm:text-5xl font-extrabold tracking-tight">
            <span
              className="text-zinc-650 bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(120deg, transparent 35%, ${shineColor} 50%, transparent 65%)`,
                backgroundSize: `${width * 2}px 100%`,
                backgroundRepeat: 'no-repeat',
                animation: `shiny-sweep ${speed}s linear infinite`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {text}
            </span>
            <style>{`
              @keyframes shiny-sweep {
                0% { background-position: -${width * 2}px 0; }
                100% { background-position: ${width * 2}px 0; }
              }
            `}</style>
          </div>
        );
      }

      case 'text-pressure': {
        const minWeight = controlValues.minWeight || 200;
        const maxWeight = controlValues.maxWeight || 900;
        const letterSpacing = controlValues.letterSpacing || 2;

        return (
          <TextPressurePreview
            text={text}
            minWeight={minWeight}
            maxWeight={maxWeight}
            letterSpacing={letterSpacing}
          />
        );
      }

      case 'curved-loop': {
        const curvature = controlValues.curvature || 60;
        const fontSize = controlValues.fontSize || 16;
        const speed = controlValues.speed || 10;

        return (
          <div className="w-full flex items-center justify-center p-4">
            <svg className="w-full max-w-md h-40 border border-zinc-900/40 rounded bg-zinc-950/20" viewBox="0 0 400 160">
              <path
                id="curvePath"
                d={`M 10 80 Q 200 ${80 - curvature} 390 80`}
                fill="none"
                stroke="rgba(39, 39, 42, 0.3)"
                strokeWidth="1"
              />
              <text className="fill-white font-mono uppercase font-bold" style={{ fontSize: `${fontSize}px` }}>
                <textPath href="#curvePath" startOffset="0%">
                  {text}
                  <animate
                    attributeName="startOffset"
                    from="0%"
                    to="100%"
                    dur={`${speed}s`}
                    repeatCount="indefinite"
                  />
                </textPath>
              </text>
            </svg>
          </div>
        );
      }

      case 'fuzzy-text': {
        const fuzz = controlValues.fuzz || 4;
        const speed = controlValues.speed || 3;

        return (
          <div className="relative p-6 select-none">
            <svg className="absolute w-0 h-0">
              <filter id="fuzzyFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise">
                  <animate
                    attributeName="baseFrequency"
                    values="0.04;0.06;0.04"
                    dur={`${speed}s`}
                    repeatCount="indefinite"
                  />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale={fuzz} />
              </filter>
            </svg>
            <h1
              className="text-4xl sm:text-5xl font-extrabold tracking-widest text-center text-white"
              style={{ filter: 'url(#fuzzyFilter)' }}
            >
              {text}
            </h1>
          </div>
        );
      }

      case 'gradient-text': {
        const speed = controlValues.speed || 4;
        const angle = controlValues.angle || 45;
        const start = controlValues.startColor || '#a78bfa';
        const end = controlValues.endColor || '#ec4899';

        return (
          <div className="relative text-4xl sm:text-5xl font-extrabold tracking-tight select-none">
            <span
              className="bg-clip-text text-transparent bg-gradient-to-r"
              style={{
                backgroundImage: `linear-gradient(${angle}deg, ${start}, ${end}, ${start})`,
                backgroundSize: '200% auto',
                animation: `grad-sweep ${speed}s linear infinite`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {text}
            </span>
            <style>{`
              @keyframes grad-sweep {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}</style>
          </div>
        );
      }

      case 'falling-text': {
        const gravity = controlValues.gravity || 0.6;
        const bounce = controlValues.bounce || 0.6;
        const stagger = (controlValues.stagger || 60) / 1000;
        const chars = text.split('');

        return (
          <div key={triggerKey} className="flex overflow-hidden h-24 items-end justify-center select-none">
            {chars.map((char, i) => (
              <motion.span
                key={i}
                className="text-3xl sm:text-4xl font-extrabold text-white inline-block"
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 150 * (2 - gravity),
                  damping: 15 * (1 - bounce),
                  delay: i * stagger
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
        );
      }

      case 'text-cursor': {
        const hoverScale = controlValues.hoverScale || 1.15;
        const cursorSize = controlValues.cursorSize || 12;

        return (
          <TextCursorPreview
            text={text}
            hoverScale={hoverScale}
            cursorSize={cursorSize}
          />
        );
      }

      case 'decrypted-text': {
        const decryptSpeed = controlValues.decryptSpeed || 40;
        const scrambleCount = controlValues.scrambleCount || 6;

        return (
          <DecryptedTextPreview
            text={text}
            decryptSpeed={decryptSpeed}
            scrambleCount={scrambleCount}
            triggerKey={triggerKey}
          />
        );
      }

      case 'true-focus': {
        const blurAmount = controlValues.blurAmount || 5;
        const scale = controlValues.scale || 1.1;

        return (
          <TrueFocusPreview
            text={text}
            blurAmount={blurAmount}
            scale={scale}
          />
        );
      }

      case 'scroll-float': {
        const floatHeight = controlValues.floatHeight || 12;
        const floatSpeed = controlValues.floatSpeed || 2.0;

        return (
          <div className="flex flex-wrap justify-center gap-x-2 text-2xl sm:text-3xl text-zinc-200 select-none">
            {text.split(' ').map((word, i) => (
              <motion.span
                key={i}
                className="inline-block cursor-pointer py-1 font-sans font-semibold text-white"
                whileHover={{ y: -floatHeight, transition: { duration: 0.2, ease: 'easeOut' } }}
                animate={{ y: [0, -4, 0] }}
                style={{ willChange: 'transform' }}
                transition={{
                  repeat: Infinity,
                  duration: floatSpeed,
                  ease: 'easeInOut',
                  delay: i * 0.15
                }}
              >
                {word}
              </motion.span>
            ))}
          </div>
        );
      }

      case 'scroll-reveal': {
        const progress = controlValues.progress || 40;
        const activeColor = controlValues.color || '#a78bfa';
        const chars = text.split('');
        const revealCount = Math.floor((chars.length * progress) / 100);

        return (
          <div className="text-xl sm:text-2xl leading-relaxed text-center select-none font-medium max-w-xl">
            {chars.map((char, i) => (
              <span
                key={i}
                className="transition-colors duration-200 font-sans"
                style={{
                  color: i <= revealCount ? activeColor : 'rgba(113, 113, 122, 0.3)'
                }}
              >
                {char}
              </span>
            ))}
          </div>
        );
      }

      case 'ascii-text': {
        const fontStyle = controlValues.fontStyle || 'block';

        // Custom Ascii Blocks
        const getAsciiArt = (str: string) => {
          const upper = str.toUpperCase();
          if (fontStyle === 'slant') {
            return `
  __   __ _  _  _  _  
 /  \\ (  ( \\( \\/ )/ \\ 
(  O )/    / \\  / \\_/ 
 \\__/ \\_)\\_) (_/  (_) 
            `;
          }
          if (fontStyle === 'mini') {
            return `
 o-o  o  o o-o o-o
|   | |\\ |  |  |  
|   | | \\|  |   o 
 o-o  o  o  o  o-o
            `;
          }
          return `
 ██████  ███    ██  ██    ██  ██   ██ 
██    ██ ████   ██   ██  ██    ██ ██  
██    ██ ██ ██  ██    ████      ███   
██    ██ ██  ██ ██     ██      ██ ██  
 ██████  ██   ████     ██     ██   ██ 
          `;
        };

        return (
          <pre className="font-mono text-[9px] sm:text-xs text-white leading-tight overflow-x-auto whitespace-pre p-4 bg-zinc-950/30 border border-zinc-900/60 rounded max-w-lg select-all">
            {getAsciiArt(text)}
          </pre>
        );
      }

      case 'scrambled-text': {
        const speed = controlValues.speed || 40;

        return (
          <ScrambledTextPreview
            text={text}
            speed={speed}
          />
        );
      }

      case 'rotating-text': {
        const interval = controlValues.interval || 2.0;
        const transitionType = controlValues.transitionType || 'slide';

        return (
          <RotatingTextPreview
            text={text}
            interval={interval}
            transitionType={transitionType}
          />
        );
      }

      case 'glitch-text': {
        const intensity = controlValues.intensity || 5;
        const color1 = controlValues.color1 || '#00ffff';
        const color2 = controlValues.color2 || '#ff00ff';

        return (
          <div
            className="relative font-sans text-4xl sm:text-5xl font-black tracking-widest text-white uppercase select-none"
            style={{
              // @ts-ignore
              '--glitch-color1': color1,
              '--glitch-color2': color2,
              animation: `glitch ${1.5 / intensity}s infinite linear alternate-reverse`
            }}
          >
            <span className="relative z-10">{text}</span>
            <span
              className="absolute top-0 left-0 text-red-500 w-full h-full opacity-70 z-0"
              style={{
                clipPath: 'inset(40% 0 61% 0)',
                transform: 'translate(-2px, 2px)',
                color: color2,
                animation: `glitch-offset ${0.8 / intensity}s infinite linear alternate-reverse`
              }}
            >
              {text}
            </span>
            <span
              className="absolute top-0 left-0 text-cyan-500 w-full h-full opacity-70 z-0"
              style={{
                clipPath: 'inset(12% 0 80% 0)',
                transform: 'translate(2px, -2px)',
                color: color1,
                animation: `glitch-offset ${1.2 / intensity}s infinite linear alternate-reverse`
              }}
            >
              {text}
            </span>
            <style>{`
              @keyframes glitch {
                0% { transform: skew(0.5deg); }
                100% { transform: skew(-0.5deg); }
              }
              @keyframes glitch-offset {
                0% { clip-path: inset(10% 0 85% 0); transform: translate(-1px, 1px); }
                50% { clip-path: inset(50% 0 30% 0); transform: translate(2px, -1px); }
                100% { clip-path: inset(5% 0 90% 0); transform: translate(1px, 2px); }
              }
            `}</style>
          </div>
        );
      }

      case 'scroll-velocity': {
        const velocity = controlValues.velocity || 15;

        return (
          <div className="w-full overflow-hidden border-y border-zinc-900 py-3 bg-zinc-950/20 select-none">
            <motion.div
              className="flex whitespace-nowrap gap-8 text-xl sm:text-2xl font-mono uppercase font-bold text-white"
              animate={{ x: velocity > 0 ? [0, -300] : [-300, 0] }}
              transition={{
                repeat: Infinity,
                duration: Math.max(1, 100 / Math.abs(velocity || 1)),
                ease: 'linear'
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="flex items-center gap-4">
                  <span>{text}</span>
                  <span className="text-violet-500">•</span>
                </span>
              ))}
            </motion.div>
          </div>
        );
      }

      default:
        return <div className="text-3xl text-white font-bold">{text}</div>;
    }
  };

  return (
    <div className="flex-1 flex h-full w-full bg-[#120f17] text-zinc-150 min-h-0 min-w-0 overflow-hidden select-none">
      {/* 1. LEFT SIDEBAR */}
      <div className="w-[320px] bg-[#09090b] border-r border-zinc-900/60 p-4 flex flex-col justify-between shrink-0 h-full z-10 relative">
        <div className="flex-1 overflow-y-auto scrollbar-machined pr-1.5 space-y-5">
          <div className="px-1 py-1 text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-900/50 pb-2">
            Text Animations
          </div>

          <div className="flex flex-col gap-1.5 mt-2">
            {ANIMATIONS.map(anim => {
              const isActive = anim.id === activeAnimId;
              const isLiked = liked[anim.id];
              return (
                <button
                  key={anim.id}
                  onClick={() => setActiveAnimId(anim.id)}
                  className={cn(
                    "group w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left font-mono transition-all duration-150 cursor-pointer",
                    isActive
                      ? "bg-zinc-900 border-zinc-800 text-white font-bold"
                      : "bg-transparent border-transparent hover:bg-zinc-900/30 text-zinc-400 hover:text-zinc-200"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {/* Vertical Active Line Indicator */}
                    <div
                      className={cn(
                        "w-1 h-3 rounded transition-all duration-150",
                        isActive ? "bg-violet-500" : "bg-transparent group-hover:bg-zinc-800"
                      )}
                    />
                    <span className="text-[11px] font-semibold tracking-wide">{anim.name}</span>
                  </div>
                  {isLiked && <Heart className="w-3 h-3 text-red-500 fill-red-500" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Brand stamp footer */}
        <div className="pt-3 border-t border-zinc-900/50 mt-4 flex items-center justify-between text-[9px] text-zinc-600 font-mono">
          <span>Onyx engine v1.1.0</span>
          <span>Ready</span>
        </div>
      </div>

      {/* 2. RIGHT WORKSPACE */}
      <div className="flex-1 h-full min-w-0 flex flex-col p-6 overflow-y-auto scrollbar-machined relative z-0">
        
        {/* Header Title Row */}
        <div className="flex items-center justify-between shrink-0 mb-6 border-b border-zinc-900/50 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Type className="w-5 h-5 text-violet-500" />
              <span>{activeConfig.name}</span>
            </h1>
            <p className="text-[11px] font-mono text-zinc-500 mt-1">{activeConfig.description}</p>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-4">
            {/* Preview / Code Tab Switch */}
            <div className="flex rounded-md border border-zinc-900 bg-zinc-950 p-0.5">
              <button
                onClick={() => setActiveTab('preview')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-colors",
                  activeTab === 'preview' ? "bg-zinc-900 text-white border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-mono font-bold cursor-pointer transition-colors",
                  activeTab === 'code' ? "bg-zinc-900 text-white border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Code</span>
              </button>
            </div>

            {/* Utility Toolbar */}
            <div className="flex items-center gap-1.5 border-l border-zinc-900 pl-4">
              <button
                onClick={handleReset}
                title="Reset animation state"
                className="p-2 border border-zinc-900 hover:border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded-md cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleToggleLike}
                title="Add to favorites"
                className="p-2 border border-zinc-900 hover:border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded-md cursor-pointer transition-colors"
              >
                <Heart className={cn("w-3.5 h-3.5 transition-colors", liked[activeAnimId] ? "text-red-500 fill-red-500" : "")} />
              </button>
              <button
                onClick={handleCopyCode}
                title="Copy snippet"
                className="flex items-center gap-1.5 px-3.5 py-2 border border-zinc-900 hover:border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-[10px] font-mono text-zinc-300 hover:text-white rounded-md cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Panel Content Area */}
        <div className="flex-1 flex flex-col gap-6 min-h-0">
          {activeTab === 'preview' ? (
            /* PREVIEW BOX */
            <div className="flex-1 min-h-[320px] rounded-xl border border-zinc-900 bg-zinc-950/60 flex items-center justify-center relative overflow-hidden group">
              {/* Animation Render Slot */}
              <div className="relative z-10 p-8 flex items-center justify-center w-full h-full">
                {renderActivePreview()}
              </div>

              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f12_1px,transparent_1px),linear-gradient(to_bottom,#0f0f12_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-30 pointer-events-none" />

              {/* Floating Replay Action */}
              <button
                onClick={() => setTriggerKey(prev => prev + 1)}
                title="Replay Animation"
                className="absolute top-4 right-4 p-2 bg-black/60 border border-zinc-800/80 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* CODE EXPORTER PANEL */
            <div className="flex-1 min-h-[320px] rounded-xl border border-zinc-900 bg-zinc-950 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-900">
                <div className="flex gap-2">
                  <button
                    onClick={() => setExportTab('react')}
                    className={cn(
                      "px-2.5 py-1 text-[10px] font-mono rounded cursor-pointer transition-colors",
                      exportTab === 'react' ? "bg-zinc-900 text-white font-bold" : "text-zinc-500 hover:text-zinc-350"
                    )}
                  >
                    Component Source (.tsx)
                  </button>
                  <button
                    onClick={() => setExportTab('usage')}
                    className={cn(
                      "px-2.5 py-1 text-[10px] font-mono rounded cursor-pointer transition-colors",
                      exportTab === 'usage' ? "bg-zinc-900 text-white font-bold" : "text-zinc-500 hover:text-zinc-350"
                    )}
                  >
                    Usage Example
                  </button>
                </div>

                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-3 py-1 rounded bg-violet-600 hover:bg-violet-500 text-[10px] font-mono text-white cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Code text block */}
              <pre className="flex-1 p-5 font-mono text-[11px] text-zinc-300 overflow-auto select-all leading-relaxed whitespace-pre bg-zinc-950 scrollbar-machined">
                <code>{generateSourceCode()}</code>
              </pre>
            </div>
          )}

          {/* 3. CUSTOMIZE INSPECTOR */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 p-5 space-y-6">
            <div className="flex items-center gap-2 border-b border-zinc-900/50 pb-3">
              <Sliders className="w-4 h-4 text-violet-500" />
              <h2 className="text-sm font-extrabold text-white tracking-wide font-mono uppercase">Customize</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              {/* Dynamic Text Input Field */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-wider">
                  Test Text Input
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono text-white rounded bg-zinc-900 border border-zinc-800 focus:outline-none focus:border-zinc-700"
                  placeholder="Type preview text..."
                />
              </div>

              {/* Auto Render Config Controls */}
              {activeConfig.controls.map(field => {
                const value = controlValues[field.id] !== undefined ? controlValues[field.id] : field.default;

                return (
                  <div key={field.id} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-wider">
                      <span>{field.label}</span>
                      {field.type === 'slider' && <span className="text-zinc-300 font-semibold">{value}</span>}
                    </div>

                    {field.type === 'slider' && (
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          value={value}
                          onChange={(e) => handleControlChange(field.id, parseFloat(e.target.value))}
                          className="flex-1 h-1.5 rounded-lg appearance-none cursor-pointer bg-zinc-900 accent-violet-500"
                        />
                      </div>
                    )}

                    {field.type === 'select' && (
                      <select
                        value={value}
                        onChange={(e) => handleControlChange(field.id, e.target.value)}
                        className="px-3 py-2 text-xs font-mono text-white rounded bg-zinc-900 border border-zinc-800 focus:outline-none cursor-pointer focus:border-zinc-700"
                      >
                        {field.options?.map(opt => (
                          <option key={opt.value} value={opt.value} className="bg-zinc-950 text-zinc-300">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {field.type === 'toggle' && (
                      <div className="flex items-center">
                        <button
                          onClick={() => handleControlChange(field.id, !value)}
                          className={cn(
                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                            value ? "bg-violet-600" : "bg-zinc-800"
                          )}
                        >
                          <span
                            className={cn(
                              "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                              value ? "translate-x-4" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>
                    )}

                    {field.type === 'color' && (
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => handleControlChange(field.id, e.target.value)}
                          className="w-8 h-8 rounded border border-zinc-800 bg-transparent cursor-pointer p-0.5"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleControlChange(field.id, e.target.value)}
                          className="px-3 py-1.5 text-xs font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 rounded w-28 uppercase focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* GLOBAL TOAST MESSAGE SYSTEM */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-6 right-6 px-4 py-2.5 rounded-lg border border-zinc-850 bg-zinc-950 text-xs font-mono text-zinc-300 flex items-center gap-2 shadow-2xl z-50 pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
