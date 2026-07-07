import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Code, RotateCcw, Copy, Check, Sliders, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import UI presets
import { AnimatedList } from '@/components/ui/AnimatedList';
import ScrollStack, { ScrollStackItem } from '@/components/ui/ScrollStack';
import BubbleMenu from '@/components/ui/BubbleMenu';
import MagicBento from '@/components/ui/MagicBento';
import TerminalCard from '@/components/ui/TerminalCard';
import SparkleButton from '@/components/ui/SparkleButton';
import JapaneseMatrix from '@/components/ui/JapaneseMatrix';
import BackToTop from '@/components/ui/BackToTop';
import GlassAppButtons from '@/components/ui/GlassAppButtons';

// TYPES
type ComponentTab = 'preview' | 'code';
type ExportTab = 'react' | 'css' | 'usage';

interface ControlField {
  id: string;
  label: string;
  type: 'slider' | 'toggle' | 'color';
  default: any;
  min?: number;
  max?: number;
  step?: number;
}

interface ComponentConfig {
  id: string;
  name: string;
  description: string;
  controls: ControlField[];
}

const COMPONENTS: ComponentConfig[] = [
  {
    id: 'animated-list',
    name: 'Animated List',
    description: 'Entrance animation transitions for list container layouts.',
    controls: [
      { id: 'showGradients', label: 'Show Gradients', type: 'toggle', default: true },
      { id: 'enableArrowNavigation', label: 'Enable Arrow Navigation', type: 'toggle', default: true },
      { id: 'displayScrollbar', label: 'Display Scrollbar', type: 'toggle', default: true },
      { id: 'initialSelectedIndex', label: 'Initial Selected Index', type: 'slider', default: -1, min: -1, max: 14, step: 1 }
    ]
  },
  {
    id: 'scroll-stack',
    name: 'Scroll Stack',
    description: 'Overlapping layout where cards shift and stack as you scroll.',
    controls: [
      { id: 'itemDistance', label: 'Item Distance (px)', type: 'slider', default: 100, min: 20, max: 200, step: 10 },
      { id: 'itemScale', label: 'Item Scale increment', type: 'slider', default: 0.03, min: 0.01, max: 0.1, step: 0.01 },
      { id: 'itemStackDistance', label: 'Item Stack Distance', type: 'slider', default: 30, min: 10, max: 80, step: 5 },
      { id: 'baseScale', label: 'Base Scale factor', type: 'slider', default: 0.85, min: 0.5, max: 1.0, step: 0.05 },
      { id: 'rotationAmount', label: 'Rotation amount (deg)', type: 'slider', default: 0, min: -15, max: 15, step: 1 },
      { id: 'blurAmount', label: 'Blur amount (px)', type: 'slider', default: 0, min: 0, max: 8, step: 1 }
    ]
  },
  {
    id: 'bubble-menu',
    name: 'Bubble Menu',
    description: 'Horizontal navigation menu with a sliding bubble backplate.',
    controls: [
      { id: 'menuBg', label: 'Menu Bg Color', type: 'color', default: '#ffffff' },
      { id: 'menuContentColor', label: 'Menu Content Color', type: 'color', default: '#111111' },
      { id: 'animationDuration', label: 'Animation Duration (s)', type: 'slider', default: 0.5, min: 0.1, max: 2.0, step: 0.1 },
      { id: 'staggerDelay', label: 'Stagger Delay (s)', type: 'slider', default: 0.12, min: 0.02, max: 0.5, step: 0.02 }
    ]
  },
  {
    id: 'magic-bento',
    name: 'Magic Bento',
    description: 'Interactive Bento dashboard grid with 3D parallax and glowing borders.',
    controls: [
      { id: 'textAutoHide', label: 'Text Auto Hide', type: 'toggle', default: true },
      { id: 'enableStars', label: 'Enable Stars', type: 'toggle', default: true },
      { id: 'enableSpotlight', label: 'Enable Spotlight', type: 'toggle', default: true },
      { id: 'enableBorderGlow', label: 'Enable Border Glow', type: 'toggle', default: true },
      { id: 'enableTilt', label: 'Enable Tilt', type: 'toggle', default: false },
      { id: 'enableMagnetism', label: 'Enable Magnetism', type: 'toggle', default: true },
      { id: 'clickEffect', label: 'Click Effect', type: 'toggle', default: true },
      { id: 'spotlightRadius', label: 'Spotlight Radius (px)', type: 'slider', default: 300, min: 100, max: 600, step: 20 },
      { id: 'particleCount', label: 'Particle Count', type: 'slider', default: 12, min: 4, max: 32, step: 2 },
      { id: 'glowColor', label: 'Glow Color Accent', type: 'color', default: '#8400ff' }
    ]
  },
  {
    id: 'terminal-card',
    name: 'Terminal Card',
    description: 'A mock Linux bash terminal window layout widget.',
    controls: []
  },
  {
    id: 'sparkle-button',
    name: 'Sparkle Button',
    description: 'A button with sparkling particles and micro-animations.',
    controls: []
  },
  {
    id: 'japanese-matrix',
    name: 'Matrix Rain',
    description: 'Falling digital rain made of random Japanese characters.',
    controls: []
  },
  {
    id: 'back-to-top',
    name: 'Back to Top',
    description: 'An expandable pill-to-circle layout button.',
    controls: []
  },
  {
    id: 'glass-app-buttons',
    name: 'Glass App Buttons',
    description: 'Neo-glassmorphic app button selectors with hovering gradient highlights.',
    controls: []
  }
];

// Color converter helper
const hexToRgbStr = (hex: string): string => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '132, 0, 255';
};

export default function ComponentsPage() {
  const [activeAnimId, setActiveAnimId] = useState<string>('animated-list');
  const [activeTab, setActiveTab] = useState<ComponentTab>('preview');
  const [exportTab, setExportTab] = useState<ExportTab>('react');
  const [copied, setCopied] = useState<boolean>(false);
  const [triggerKey, setTriggerKey] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [controlValues, setControlValues] = useState<Record<string, any>>({});

  const activeConfig = COMPONENTS.find(c => c.id === activeAnimId) || COMPONENTS[0];

  // Initialize controls
  useEffect(() => {
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
    setTriggerKey(prev => prev + 1);
    showToastNotification('Component state reset');
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
    showToastNotification('Source code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  // SOURCE CODE GENERATOR
  const generateSourceCode = (): string => {
    if (exportTab === 'usage') {
      switch (activeAnimId) {
        case 'animated-list':
          return `import AnimatedList from './AnimatedList';

export default function Demo() {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10'];

  return (
    <div className="flex items-center justify-center min-h-[300px] bg-black text-white p-6">
      <AnimatedList
        items={items}
        onItemSelect={(item, index) => console.log(item, index)}
        showGradients={${controlValues.showGradients !== false}}
        enableArrowNavigation={${controlValues.enableArrowNavigation !== false}}
        displayScrollbar={${controlValues.displayScrollbar !== false}}
        initialSelectedIndex={${controlValues.initialSelectedIndex !== undefined ? controlValues.initialSelectedIndex : -1}}
      />
    </div>
  );
}`;

        case 'scroll-stack':
          return `import ScrollStack, { ScrollStackItem } from './ScrollStack';

export default function Demo() {
  return (
    <ScrollStack
      itemDistance={${controlValues.itemDistance ?? 100}}
      itemScale={${controlValues.itemScale ?? 0.03}}
      itemStackDistance={${controlValues.itemStackDistance ?? 30}}
      baseScale={${controlValues.baseScale ?? 0.85}}
      rotationAmount={${controlValues.rotationAmount ?? 0}}
      blurAmount={${controlValues.blurAmount ?? 0}}
    >
      <ScrollStackItem>
        <h2>Card 1</h2>
        <p>This is the first card in the stack</p>
      </ScrollStackItem>
      <ScrollStackItem>
        <h2>Card 2</h2>
        <p>This is the second card in the stack</p>
      </ScrollStackItem>
      <ScrollStackItem>
        <h2>Card 3</h2>
        <p>This is the third card in the stack</p>
      </ScrollStackItem>
    </ScrollStack>
  );
}`;

        case 'bubble-menu':
          return `import BubbleMenu from './BubbleMenu';

export default function Demo() {
  const items = [
    { label: 'home', href: '#', ariaLabel: 'Home', rotation: -8, hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' } },
    { label: 'about', href: '#', ariaLabel: 'About', rotation: 8, hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' } },
    { label: 'projects', href: '#', ariaLabel: 'Projects', rotation: 8, hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' } },
    { label: 'contact', href: '#', ariaLabel: 'Contact', rotation: -8, hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' } }
  ];

  return (
    <BubbleMenu
      logo={<span style={{ fontWeight: 700 }}>RB</span>}
      items={items}
      menuBg="${controlValues.menuBg || '#ffffff'}"
      menuContentColor="${controlValues.menuContentColor || '#111111'}"
      useFixedPosition={false}
      animationEase="back.out(1.5)"
      animationDuration={${controlValues.animationDuration ?? 0.5}}
      staggerDelay={${controlValues.staggerDelay ?? 0.12}}
    />
  );
}`;

        case 'magic-bento':
          return `import MagicBento from './MagicBento';

export default function Demo() {
  return (
    <MagicBento 
      textAutoHide={${controlValues.textAutoHide !== false}}
      enableStars={${controlValues.enableStars !== false}}
      enableSpotlight={${controlValues.enableSpotlight !== false}}
      enableBorderGlow={${controlValues.enableBorderGlow !== false}}
      enableTilt={${controlValues.enableTilt === true}}
      enableMagnetism={${controlValues.enableMagnetism !== false}}
      clickEffect={${controlValues.clickEffect !== false}}
      spotlightRadius={${controlValues.spotlightRadius ?? 300}}
      particleCount={${controlValues.particleCount ?? 12}}
      glowColor="${hexToRgbStr(controlValues.glowColor || '#8400ff')}"
    />
  );
}`;

        case 'terminal-card':
          return `import TerminalCard from './TerminalCard';

export default function Demo() {
  return (
    <div className="flex items-center justify-center min-h-[300px] bg-black">
      <TerminalCard />
    </div>
  );
}`;

        case 'sparkle-button':
          return `import SparkleButton from './SparkleButton';

export default function Demo() {
  return (
    <div className="flex items-center justify-center min-h-[150px]">
      <SparkleButton />
    </div>
  );
}`;

        case 'japanese-matrix':
          return `import JapaneseMatrix from './JapaneseMatrix';

export default function Demo() {
  return (
    <div className="w-full max-w-md mx-auto">
      <JapaneseMatrix />
    </div>
  );
}`;

        case 'back-to-top':
          return `import BackToTop from './BackToTop';

export default function Demo() {
  return (
    <div className="flex items-center justify-center min-h-[150px]">
      <BackToTop />
    </div>
  );
}`;

        case 'glass-app-buttons':
          return `import GlassAppButtons from './GlassAppButtons';

export default function Demo() {
  return (
    <div className="flex items-center justify-center min-h-[150px] bg-black">
      <GlassAppButtons />
    </div>
  );
}`;
      }
    }

    if (exportTab === 'css') {
      switch (activeAnimId) {
        case 'animated-list':
          return `.scroll-list-container {
  position: relative;
  width: 500px;
}

.scroll-list {
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
}

.scroll-list::-webkit-scrollbar {
  width: 8px;
}

.scroll-list::-webkit-scrollbar-track {
  background: #120F17;
}

.scroll-list::-webkit-scrollbar-thumb {
  background: #2F293A;
  border-radius: 4px;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.item {
  padding: 16px;
  background-color: #2F293A;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.item.selected {
  background-color: #2F293A;
}

.item-text {
  color: white;
  margin: 0;
}

.top-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background: linear-gradient(to bottom, #120F17, transparent);
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.bottom-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, #120F17, transparent);
  pointer-events: none;
  transition: opacity 0.3s ease;
}`;

        case 'scroll-stack':
          return `.scroll-stack-scroller {
  position: relative;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: visible;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  will-change: scroll-position;
}

.scroll-stack-inner {
  padding: 20vh 5rem 50rem;
  min-height: 100vh;
}

.scroll-stack-card-wrapper {
  position: relative;
}

.scroll-stack-card {
  transform-origin: top center;
  will-change: transform, filter;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
  height: 20rem;
  width: 100%;
  margin: 30px 0;
  padding: 3rem;
  border-radius: 40px;
  box-sizing: border-box;
  /* Improve mobile performance */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  position: relative;
}

.scroll-stack-end {
  width: 100%;
  height: 1px;
}`;

        case 'bubble-menu':
          return `.bubble-menu {
  left: 0;
  right: 0;
  top: 2em;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 2em;
  pointer-events: none;
  z-index: 99;
}

.bubble-menu.fixed {
  position: fixed;
}

.bubble-menu.absolute {
  position: absolute;
}

.bubble-menu .bubble {
  --bubble-size: 48px;
  width: var(--bubble-size);
  height: var(--bubble-size);
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
}

.bubble-menu .logo-bubble,
.bubble-menu .toggle-bubble {
  will-change: transform;
}

.bubble-menu .logo-bubble {
  width: auto;
  min-height: var(--bubble-size);
  height: var(--bubble-size);
  padding: 0 16px;
  border-radius: calc(var(--bubble-size) / 2);
  gap: 8px;
}

.bubble-menu .toggle-bubble {
  width: var(--bubble-size);
  height: var(--bubble-size);
}

.bubble-menu .bubble-logo {
  max-height: 60%;
  max-width: 100%;
  object-fit: contain;
  display: block;
}

.bubble-menu .logo-content {
  --logo-max-height: 60%;
  --logo-max-width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 100%;
}

.bubble-menu .logo-content > .bubble-logo,
.bubble-menu .logo-content > img,
.bubble-menu .logo-content > svg {
  max-height: var(--logo-max-height);
  max-width: var(--logo-max-width);
}

.bubble-menu .menu-btn {
  border: none;
  background: #fff;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.bubble-menu .menu-line {
  width: 26px;
  height: 2px;
  background: #111;
  border-radius: 2px;
  display: block;
  margin: 0 auto;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  transform-origin: center;
}

.bubble-menu .menu-line + .menu-line {
  margin-top: 6px;
}

.bubble-menu .menu-btn.open .menu-line:first-child {
  transform: translateY(4px) rotate(45deg);
}

.bubble-menu .menu-btn.open .menu-line:last-child {
  transform: translateY(-4px) rotate(-45deg);
}

@media (min-width: 768px) {
  .bubble-menu .bubble {
    --bubble-size: 56px;
  }

  .bubble-menu .logo-bubble {
    padding: 0 16px;
  }
}

.bubble-menu-items {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 98;
}

.bubble-menu-items.fixed {
  position: fixed;
}

.bubble-menu-items.absolute {
  position: absolute;
}

.bubble-menu-items .pill-list {
  list-style: none;
  margin: 0;
  padding: 0 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  row-gap: 4px;
  width: 100%;
  max-width: 1600px;
  margin-left: auto;
  margin-right: auto;
  pointer-events: auto;
  justify-content: stretch;
}

.bubble-menu-items .pill-list .pill-spacer {
  width: 100%;
  height: 0;
  pointer-events: none;
}

.bubble-menu-items .pill-list .pill-col {
  display: flex;
  justify-content: center;
  align-items: stretch;
  flex: 0 0 calc(100% / 3);
  box-sizing: border-box;
}

.bubble-menu-items .pill-list .pill-col:nth-child(4):nth-last-child(2) {
  margin-left: calc(100% / 6);
}

.bubble-menu-items .pill-list .pill-col:nth-child(4):last-child {
  margin-left: calc(100% / 3);
}

.bubble-menu-items .pill-link {
  --pill-bg: #ffffff;
  --pill-color: #111;
  --pill-border: rgba(0, 0, 0, 0.12);
  --item-rot: 0deg;
  --pill-min-h: 160px;
  --hover-bg: #f3f4f6;
  --hover-color: #111;
  width: 100%;
  min-height: var(--pill-min-h);
  padding: clamp(1.5rem, 3vw, 8rem) 0;
  font-size: clamp(1.5rem, 4vw, 4rem);
  font-weight: 400;
  line-height: 0;
  border-radius: 999px;
  background: var(--pill-bg);
  color: var(--pill-color);
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition:
    background 0.3s ease,
    color 0.3s ease;
  will-change: transform;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  height: 10px;
}

@media (min-width: 900px) {
  .bubble-menu-items .pill-link {
    transform: rotate(var(--item-rot));
  }

  .bubble-menu-items .pill-link:hover {
    transform: rotate(var(--item-rot)) scale(1.06);
    background: var(--hover-bg);
    color: var(--hover-color);
  }

  .bubble-menu-items .pill-link:active {
    transform: rotate(var(--item-rot)) scale(0.94);
  }
}

.bubble-menu-items .pill-link .pill-label {
  display: inline-block;
  will-change: transform, opacity;
  height: 1.2em;
  line-height: 1.2;
}

@media (max-width: 899px) {
  .bubble-menu-items {
    padding-top: 0px;
    align-items: flex-start;
    padding-top: 120px;
  }

  .bubble-menu-items .pill-list {
    row-gap: 16px;
  }

  .bubble-menu-items .pill-list .pill-col {
    flex: 0 0 100%;
    margin-left: 0 !important;
    overflow: visible;
  }

  .bubble-menu-items .pill-link {
    font-size: clamp(1.2rem, 3vw, 4rem);
    padding: clamp(1rem, 2vw, 2rem) 0;
    min-height: 80px;
  }

  .bubble-menu-items .pill-link:hover {
    transform: scale(1.06);
    background: var(--hover-bg);
    color: var(--hover-color);
  }

  .bubble-menu-items .pill-link:active {
    transform: scale(0.94);
  }
}
`;

        case 'magic-bento':
          return `:root {
  --hue: 27;
  --sat: 69%;
  --white: hsl(0, 0%, 100%);
  --purple-primary: rgba(132, 0, 255, 1);
  --purple-glow: rgba(132, 0, 255, 0.2);
  --purple-border: rgba(132, 0, 255, 0.8);
  --border-color: #2F293A;
  --background-dark: #120F17;
  color-scheme: light dark;
}

.card-grid {
  display: grid;
  gap: 0.5em;
  padding: 0.75em;
  max-width: 54em;
  font-size: clamp(1rem, 0.9rem + 0.5vw, 1.5rem);
}

.magic-bento-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  aspect-ratio: 4/3;
  min-height: 200px;
  width: 100%;
  max-width: 100%;
  padding: 1.25em;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  background: var(--background-dark);
  font-weight: 300;
  overflow: hidden;
  transition: all 0.3s ease;

  --glow-x: 50%;
  --glow-y: 50%;
  --glow-intensity: 0;
  --glow-radius: 200px;
}

.magic-bento-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.magic-bento-card__header,
.magic-bento-card__content {
  display: flex;
  position: relative;
  color: var(--white);
}

.magic-bento-card__header {
  gap: 0.75em;
  justify-content: space-between;
}

.magic-bento-card__content {
  flex-direction: column;
}

.magic-bento-card__label {
  font-size: 16px;
}

.magic-bento-card__title,
.magic-bento-card__description {
  --clamp-title: 1;
  --clamp-desc: 2;
}

.magic-bento-card__title {
  font-weight: 400;
  font-size: 16px;
  margin: 0 0 0.25em;
}

.magic-bento-card__description {
  font-size: 12px;
  line-height: 1.2;
  opacity: 0.9;
}

.magic-bento-card--text-autohide .magic-bento-card__title,
.magic-bento-card--text-autohide .magic-bento-card__description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.magic-bento-card--text-autohide .magic-bento-card__title {
  -webkit-line-clamp: var(--clamp-title);
  line-clamp: var(--clamp-title);
}

.magic-bento-card--text-autohide .magic-bento-card__description {
  -webkit-line-clamp: var(--clamp-desc);
  line-clamp: var(--clamp-desc);
}

@media (max-width: 599px) {
  .card-grid {
    grid-template-columns: 1fr;
    width: 90%;
    margin: 0 auto;
    padding: 0.5em;
  }

  .magic-bento-card {
    width: 100%;
    min-height: 180px;
  }
}

@media (min-width: 600px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .magic-bento-card:nth-child(3) {
    grid-column: span 2;
    grid-row: span 2;
  }

  .magic-bento-card:nth-child(4) {
    grid-column: 1 / span 2;
    grid-row: 2 / span 2;
  }

  .magic-bento-card:nth-child(6) {
    grid-column: 4;
    grid-row: 3;
  }
}

/* Border glow effect */
.magic-bento-card--border-glow::after {
  content: '';
  position: absolute;
  inset: 0;
  padding: 6px;
  background: radial-gradient(
    var(--glow-radius) circle at var(--glow-x) var(--glow-y),
    rgba(132, 0, 255, calc(var(--glow-intensity) * 0.8)) 0%,
    rgba(132, 0, 255, calc(var(--glow-intensity) * 0.4)) 30%,
    transparent 60%
  );
  border-radius: inherit;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  opacity: 1;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.magic-bento-card--border-glow:hover::after {
  opacity: 1;
}

.magic-bento-card--border-glow:hover {
  box-shadow:
    0 4px 20px rgba(46, 24, 78, 0.4),
    0 0 30px var(--purple-glow);
}

.particle-container {
  position: relative;
  overflow: hidden;
}

.particle::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: rgba(132, 0, 255, 0.2);
  border-radius: 50%;
  z-index: -1;
}

.particle-container:hover {
  box-shadow:
    0 4px 20px rgba(46, 24, 78, 0.2),
    0 0 30px var(--purple-glow);
}

/* Global spotlight styles */
.global-spotlight {
  mix-blend-mode: screen;
  will-change: transform, opacity;
  z-index: 200 !important;
  pointer-events: none;
}

.bento-section {
  position: relative;
  user-select: none;
}`;

        case 'terminal-card':
          return `.terminal-container {
  width: 250px;
  height: 250px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.terminal_toolbar {
  display: flex;
  height: 30px;
  align-items: center;
  padding: 0 8px;
  box-sizing: border-box;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  background: #212121;
  justify-content: space-between;
}

.butt {
  display: flex;
  align-items: center;
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin-right: 5px;
  font-size: 8px;
  height: 12px;
  width: 12px;
  box-sizing: border-box;
  border: none;
  border-radius: 100%;
  background: linear-gradient(#7d7871 0%, #595953 100%);
  text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.2);
  box-shadow: 0px 0px 1px 0px #41403A, 0px 1px 1px 0px #474642;
}

.btn-color {
  background: #ee411a;
}

.btn:hover {
  cursor: pointer;
}

.btn:focus {
  outline: none;
}

.add_tab {
  border: 1px solid #fff;
  color: #fff;
  padding: 0 6px;
  border-radius: 4px 4px 0 0;
  border-bottom: none;
  cursor: pointer;
}

.user {
  color: #d5d0ce;
  margin-left: 6px;
  font-size: 11px;
  font-family: monospace;
}

.terminal_body {
  background: rgba(0, 0, 0, 0.85);
  height: calc(100% - 30px);
  padding: 10px;
  margin-top: -1px;
  font-size: 12px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  font-family: monospace;
}

.terminal_promt {
  display: flex;
  align-items: center;
}

.terminal_promt span {
  margin-left: 4px;
}

.terminal_user {
  color: #1eff8e;
}

.terminal_location {
  color: #4878c0;
}

.terminal_bling {
  color: #dddddd;
}

.terminal_cursor {
  display: block;
  height: 14px;
  width: 5px;
  margin-left: 10px;
  animation: curbl 1200ms linear infinite;
}

@keyframes curbl {
  0% { background: #ffffff; }
  49% { background: #ffffff; }
  50% { background: transparent; }
  99% { background: transparent; }
  100% { background: #ffffff; }
}`;

        case 'sparkle-button':
          return `.sparkle-button {
  --active: 0;
  --bg: radial-gradient(
      40% 50% at center 100%,
      hsl(270 calc(var(--active) * 97%) 72% / var(--active)),
      transparent
    ),
    radial-gradient(
      80% 100% at center 120%,
      hsl(260 calc(var(--active) * 97%) 70% / var(--active)),
      transparent
    ),
    hsl(260 calc(var(--active) * 97%) calc((var(--active) * 44%) + 12%));
  background: var(--bg);
  font-size: 1.2rem;
  font-weight: 500;
  border: 0;
  cursor: pointer;
  padding: 1em 2em;
  display: flex;
  align-items: center;
  gap: 0.25em;
  white-space: nowrap;
  border-radius: 100px;
  position: relative;
  box-shadow: 0 0 calc(var(--active) * 3em) calc(var(--active) * 1em) hsl(260 97% 61% / 0.75),
    0 0em 0 0 hsl(260 calc(var(--active) * 97%) calc((var(--active) * 50%) + 30%)) inset,
    0 -0.05em 0 0 hsl(260 calc(var(--active) * 97%) calc(var(--active) * 60%)) inset;
  transition: box-shadow 0.3s, scale 0.3s, background 0.3s;
  scale: calc(1 + (var(--active) * 0.1));
}

.sparkle-button:active {
  scale: 1;
  transition: .3s;
}

.sparkle path {
  color: hsl(0 0% calc((var(--active, 0) * 70%) + var(--base)));
  transform-box: fill-box;
  transform-origin: center;
  fill: currentColor;
  stroke: currentColor;
  animation-delay: calc((0.3s * 1.5) + (var(--delay) * 1s));
  animation-duration: 0.6s;
  transition: color 0.3s;
}

.sparkle-button:is(:hover, :focus-visible) path {
  animation-name: bounce;
}

@keyframes bounce {
  35%, 65% {
    scale: var(--scale);
  }
}

.sparkle path:nth-of-type(1) {
  --scale: 0.5;
  --delay: 0.1;
  --base: 40%;
}

.sparkle path:nth-of-type(2) {
  --scale: 1.5;
  --delay: 0.2;
  --base: 20%;
}

.sparkle path:nth-of-type(3) {
  --scale: 2.5;
  --delay: 0.35;
  --base: 30%;
}

.sparkle-button:before {
  content: "";
  position: absolute;
  inset: -0.2em;
  z-index: -1;
  border: 0.25em solid hsl(260 97% 50% / 0.5);
  border-radius: 100px;
  opacity: var(--active, 0);
  transition: opacity 0.3s;
}

.spark {
  position: absolute;
  inset: 0;
  border-radius: 100px;
  rotate: 0deg;
  overflow: hidden;
  mask: linear-gradient(white, transparent 50%);
  animation: flip calc(var(--spark, 1s) * 2) infinite steps(2, end);
}

@keyframes flip {
  to {
    rotate: 360deg;
  }
}

.spark:before {
  content: "";
  position: absolute;
  width: 200%;
  aspect-ratio: 1;
  top: 0%;
  left: 50%;
  z-index: -1;
  translate: -50% -15%;
  rotate: 0;
  transform: rotate(-90deg);
  opacity: calc((var(--active)) + 0.4);
  background: conic-gradient(
    from 0deg,
    transparent 0 340deg,
    white 360deg
  );
  transition: opacity 0.3s;
  animation: rotate var(--spark, 1s) linear infinite both;
}

.spark:after {
  content: "";
  position: absolute;
  inset: var(--cut, 1px);
  border-radius: 100px;
}

.backdrop {
  position: absolute;
  inset: var(--cut, 1px);
  background: var(--bg);
  border-radius: 100px;
  transition: background 0.3s;
}

@keyframes rotate {
  to {
    transform: rotate(90deg);
  }
}

.sparkle-button:is(:hover, :focus-visible) ~ :is(.bodydrop, .particle-pen) {
  --active: 1;
  --play-state: running;
}

.sparkle-button:is(:hover, :focus-visible) {
  --active: 1;
  --play-state: running;
}

.sp {
  position: relative;
}

.particle-pen {
  position: absolute;
  width: 200%;
  aspect-ratio: 1;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  -webkit-mask: radial-gradient(white, transparent 65%);
  z-index: -1;
  opacity: var(--active, 0);
  transition: opacity 0.3s;
}

.particle {
  fill: white;
  width: calc(var(--size, 0.25) * 1rem);
  aspect-ratio: 1;
  position: absolute;
  top: calc(var(--y) * 1%);
  left: calc(var(--x) * 1%);
  opacity: var(--alpha, 1);
  animation: float-out calc(var(--duration, 1) * 1s) calc(var(--delay) * -1s) infinite linear;
  transform-origin: var(--origin-x, 1000%) var(--origin-y, 1000%);
  z-index: -1;
  animation-play-state: var(--play-state, paused);
}

.particle path {
  fill: hsl(0 0% 90%);
  stroke: none;
}

.particle:nth-of-type(even) {
  animation-direction: reverse;
}

@keyframes float-out {
  to {
    rotate: 360deg;
  }
}

.text {
  translate: 2% -6%;
  letter-spacing: 0.01ch;
  background: linear-gradient(90deg, hsl(0 0% calc((var(--active) * 100%) + 65%)), hsl(0 0% calc((var(--active) * 100%) + 26%)));
  -webkit-background-clip: text;
  color: transparent;
  transition: background 0.3s;
}

.sparkle-button svg {
  inline-size: 1.25em;
  translate: -25% -5%;
}`;

        case 'japanese-matrix':
          return `.jp-matrix-wrapper {
  width: 100%;
  height: 300px;
  background-color: #05050a;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  border: 1px solid #111;
}

.jp-matrix {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20px, 1fr));
  grid-auto-rows: 24px;
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: rgba(0, 150, 255, 0.4);
  font-family: "Courier New", Courier, monospace;
  justify-content: center;
  align-content: center;
  user-select: none;
  padding: 8px;
  box-sizing: border-box;
}

.jp-matrix > span {
  text-align: center;
  text-shadow: 0 0 5px rgba(0, 150, 255, 0.5);
  transition: color 0.5s, text-shadow 0.5s;
  line-height: 1;
}

.jp-matrix > span:nth-child(19n + 2) {
  animation: smooth-pulse 3.5s ease-in-out infinite 0.2s;
}
.jp-matrix > span:nth-child(29n + 1) {
  animation: smooth-pulse 4.1s ease-in-out infinite 0.7s;
}
.jp-matrix > span:nth-child(11n) {
  color: rgba(100, 200, 255, 0.7);
  animation: smooth-pulse 2.9s ease-in-out infinite 1.1s;
}
.jp-matrix > span:nth-child(37n + 10) {
  animation: smooth-pulse 5.3s ease-in-out infinite 1.5s;
}
.jp-matrix > span:nth-child(41n + 1) {
  animation: smooth-pulse 3.9s ease-in-out infinite 0.4s;
}
.jp-matrix > span:nth-child(17n + 9) {
  animation: smooth-pulse 2.8s ease-in-out infinite 0.9s;
}
.jp-matrix > span:nth-child(23n + 18) {
  animation: smooth-pulse 4.3s ease-in-out infinite 1.3s;
}
.jp-matrix > span:nth-child(31n + 4) {
  animation: smooth-pulse 5.6s ease-in-out infinite 0.1s;
}
.jp-matrix > span:nth-child(43n + 20) {
  animation: smooth-pulse 3.6s ease-in-out infinite 1.8s;
}
.jp-matrix > span:nth-child(13n + 6) {
  animation: smooth-pulse 3.2s ease-in-out infinite 1.2s;
}
.jp-matrix > span:nth-child(53n + 5) {
  animation: smooth-pulse 4.9s ease-in-out infinite 0.5s;
}
.jp-matrix > span:nth-child(47n + 15) {
  animation: smooth-pulse 5.9s ease-in-out infinite 1s;
}

@keyframes smooth-pulse {
  0%,
  100% {
    color: rgba(0, 150, 255, 0.4);
    text-shadow: 0 0 5px rgba(0, 150, 255, 0.5);
  }
  30% {
    color: rgba(100, 200, 255, 1);
    text-shadow:
      0 0 10px rgba(100, 200, 255, 1),
      0 0 15px rgba(100, 200, 255, 1);
  }
  50% {
    color: rgba(255, 105, 180, 1);
    text-shadow:
      0 0 10px rgba(255, 105, 180, 1),
      0 0 15px rgba(255, 105, 180, 1);
  }
  70% {
    color: #ffffff;
    text-shadow:
      0 0 10px #fff,
      0 0 15px #fff,
      0 0 20px #fff;
  }
}`;

        case 'back-to-top':
          return `.back-to-top-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgb(20, 20, 20);
  border: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 0px 0px 4px rgba(180, 160, 255, 0.253);
  cursor: pointer;
  transition-duration: 0.3s;
  overflow: hidden;
  position: relative;
}

.svgIcon {
  width: 12px;
  transition-duration: 0.3s;
}

.svgIcon path {
  fill: white;
}

.back-to-top-button:hover {
  width: 140px;
  border-radius: 50px;
  transition-duration: 0.3s;
  background-color: rgb(181, 160, 255);
  align-items: center;
}

.back-to-top-button:hover .svgIcon {
  transition-duration: 0.3s;
  transform: translateY(-200%);
}

.back-to-top-button::before {
  position: absolute;
  bottom: -20px;
  content: "Back to Top";
  color: white;
  font-size: 0px;
  font-family: monospace;
}

.back-to-top-button:hover::before {
  font-size: 13px;
  opacity: 1;
  bottom: unset;
  transition-duration: 0.3s;
}`;

        case 'glass-app-buttons':
          return `/* This component is fully styled using utility classes from Tailwind CSS. No additional CSS stylesheets are required. */`;
      }
    }

    switch (activeAnimId) {
      case 'animated-list':
        return `import React, { useRef, useState, useEffect, useCallback, ReactNode, MouseEventHandler, UIEvent } from 'react';
import { motion, useInView } from 'framer-motion';
import './AnimatedList.css';

interface AnimatedItemProps {
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({ children, delay = 0, index, onMouseEnter, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      style={{ marginBottom: '1rem', cursor: 'pointer' }}
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  items?: string[];
  onItemSelect?: (item: string, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  items = [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5',
    'Item 6',
    'Item 7',
    'Item 8',
    'Item 9',
    'Item 10',
    'Item 11',
    'Item 12',
    'Item 13',
    'Item 14',
    'Item 15'
  ],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = '',
  itemClassName = '',
  displayScrollbar = true,
  initialSelectedIndex = -1
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);

  const handleItemMouseEnter = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const handleItemClick = useCallback(
    (item: string, index: number) => {
      setSelectedIndex(index);
      if (onItemSelect) {
        onItemSelect(item, index);
      }
    },
    [onItemSelect]
  );

  const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  }, []);

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.min(prev + 1, items.length - 1));
      } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(\`[data-index="\${selectedIndex}"]\`) as HTMLElement | null;
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: 'smooth'
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <div className={\`scroll-list-container \${className}\`}>
      <div ref={listRef} className={\`scroll-list \${!displayScrollbar ? 'no-scrollbar' : ''}\`} onScroll={handleScroll}>
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            delay={0.1}
            index={index}
            onMouseEnter={() => handleItemMouseEnter(index)}
            onClick={() => handleItemClick(item, index)}
          >
            <div className={\`item \${selectedIndex === index ? 'selected' : ''} \${itemClassName}\`}>
              <p className="item-text">{item}</p>
            </div>
          </AnimatedItem>
        ))}
      </div>
      {showGradients && (
        <>
          <div className="top-gradient" style={{ opacity: topGradientOpacity }}></div>
          <div className="bottom-gradient" style={{ opacity: bottomGradientOpacity }}></div>
        </>
      )}
    </div>
  );
};

export default AnimatedList;`;

      case 'scroll-stack':
        return `import React, { useLayoutEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({ children, itemClassName = '' }) => (
  <div className={\`scroll-stack-card \${itemClassName}\`.trim()}>{children}</div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(new Map<number, any>());
  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value as string);
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller!.scrollTop,
        containerHeight: scroller!.clientHeight,
        scrollContainer: scroller!
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element: HTMLElement) => {
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      } else {
        return element.offsetTop;
      }
    },
    [useWindowScroll]
  );

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    const endElement = useWindowScroll
      ? (document.querySelector('.scroll-stack-end') as HTMLElement)
      : (scrollerRef.current?.querySelector('.scroll-stack-end') as HTMLElement);

    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = getElementOffset(cardsRef.current[j]);
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1;

      if (hasChanged) {
        const transform = \`translate3d(0, \${newTransform.translateY}px, 0) scale(\${newTransform.scale}) rotate(\${newTransform.rotation}deg)\`;
        const filter = newTransform.blur > 0 ? \`blur(\${newTransform.blur}px)\` : '';

        card.style.transform = transform;
        card.style.filter = filter;

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner') as HTMLElement,
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        gestureOrientation: 'vertical',
        wheelMultiplier: 1,
        lerp: 0.1,
        syncTouch: true,
        syncTouchLerp: 0.075
      });

      lenis.on('scroll', handleScroll);

      const raf = (time: number) => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    }
  }, [handleScroll, useWindowScroll]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : scroller.querySelectorAll('.scroll-stack-card')
    ) as HTMLElement[];

    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = \`\${itemDistance}px\`;
      }
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.webkitTransform = 'translateZ(0)';
      card.style.perspective = '1000px';
      card.style.webkitPerspective = '1000px';
    });

    setupLenis();

    updateCardTransforms();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms
  ]);

  return (
    <div className={\`scroll-stack-scroller \${className}\`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;`;

      case 'bubble-menu':
        return `import type { CSSProperties, ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './BubbleMenu.css';

type MenuItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: {
    bgColor?: string;
    textColor?: string;
  };
};

export type BubbleMenuProps = {
  logo: ReactNode | string;
  onMenuClick?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  items?: MenuItem[];
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
};

const DEFAULT_ITEMS: MenuItem[] = [
  {
    label: 'home',
    href: '#',
    ariaLabel: 'Home',
    rotation: -8,
    hoverStyles: { bgColor: '#3b82f6', textColor: '#ffffff' }
  },
  {
    label: 'about',
    href: '#',
    ariaLabel: 'About',
    rotation: 8,
    hoverStyles: { bgColor: '#10b981', textColor: '#ffffff' }
  },
  {
    label: 'projects',
    href: '#',
    ariaLabel: 'Documentation',
    rotation: 8,
    hoverStyles: { bgColor: '#f59e0b', textColor: '#ffffff' }
  },
  {
    label: 'blog',
    href: '#',
    ariaLabel: 'Blog',
    rotation: 8,
    hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' }
  },
  {
    label: 'contact',
    href: '#',
    ariaLabel: 'Contact',
    rotation: -8,
    hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' }
  }
];

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = 'Toggle menu',
  menuBg = '#fff',
  menuContentColor = '#111',
  useFixedPosition = false,
  items,
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.12
}: BubbleMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLAnchorElement[]>([]);
  const labelRefs = useRef<HTMLSpanElement[]>([]);

  const menuItems = items?.length ? items : DEFAULT_ITEMS;
  const containerClassName = ['bubble-menu', useFixedPosition ? 'fixed' : 'absolute', className]
    .filter(Boolean)
    .join(' ');

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);

    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });

        tl.to(bubble, {
          scale: 1,
          duration: animationDuration,
          ease: animationEase
        });
        if (labels[i]) {
          tl.to(
            labels[i],
            {
              y: 0,
              autoAlpha: 1,
              duration: animationDuration,
              ease: 'power3.out'
            },
            \`-=\${animationDuration * 0.9}\`
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, {
        y: 24,
        autoAlpha: 0,
        duration: 0.2,
        ease: 'power3.in'
      });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          setShowOverlay(false);
        }
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  useEffect(() => {
    const handleResize = () => {
      if (isMenuOpen) {
        const bubbles = bubblesRef.current.filter(Boolean);
        const isDesktop = window.innerWidth >= 900;

        bubbles.forEach((bubble, i) => {
          const item = menuItems[i];
          if (bubble && item) {
            const rotation = isDesktop ? (item.rotation ?? 0) : 0;
            gsap.set(bubble, { rotation });
          }
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen, menuItems]);

  return (
    <>
      <nav className={containerClassName} style={style} aria-label="Main navigation">
        <div className="bubble logo-bubble" aria-label="Logo" style={{ background: menuBg }}>
          <span className="logo-content">
            {typeof logo === 'string' ? <img src={logo} alt="Logo" className="bubble-logo" /> : logo}
          </span>
        </div>

        <button
          type="button"
          className={\`bubble toggle-bubble menu-btn \${isMenuOpen ? 'open' : ''}\`}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          style={{ background: menuBg }}
        >
          <span className="menu-line" style={{ background: menuContentColor }} />
          <span className="menu-line short" style={{ background: menuContentColor }} />
        </button>
      </nav>
      {showOverlay && (
        <div
          ref={overlayRef}
          className={\`bubble-menu-items \${useFixedPosition ? 'fixed' : 'absolute'}\`}
          aria-hidden={!isMenuOpen}
        >
          <ul className="pill-list" role="menu" aria-label="Menu links">
            {menuItems.map((item, idx) => (
              <li key={idx} role="none" className="pill-col">
                <a
                  role="menuitem"
                  href={item.href}
                  aria-label={item.ariaLabel || item.label}
                  className="pill-link"
                  style={
                    {
                      '--item-rot': \`\${item.rotation ?? 0}deg\`,
                      '--pill-bg': menuBg,
                      '--pill-color': menuContentColor,
                      '--hover-bg': item.hoverStyles?.bgColor || '#f3f4f6',
                      '--hover-color': item.hoverStyles?.textColor || menuContentColor
                    } as CSSProperties
                  }
                  ref={el => {
                    if (el) bubblesRef.current[idx] = el;
                  }}
                >
                  <span
                    className="pill-label"
                    ref={el => {
                      if (el) labelRefs.current[idx] = el;
                    }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}`;

      case 'magic-bento':
        return `import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

export interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  textAutoHide?: boolean;
  disableAnimations?: boolean;
}

export interface BentoProps {
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

const cardData: BentoCardProps[] = [
  { color: '#120F17', title: 'Analytics', description: 'Track user behavior', label: 'Insights' },
  { color: '#120F17', title: 'Dashboard', description: 'Centralized data view', label: 'Overview' },
  { color: '#120F17', title: 'Collaboration', description: 'Work together seamlessly', label: 'Teamwork' },
  { color: '#120F17', title: 'Automation', description: 'Streamline workflows', label: 'Efficiency' },
  { color: '#120F17', title: 'Integration', description: 'Connect favorite tools', label: 'Connectivity' },
  { color: '#120F17', title: 'Security', description: 'Enterprise-grade protection', label: 'Protection' }
];

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = \`
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(\${color}, 1);
    box-shadow: 0 0 6px rgba(\${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: \${x}px;
    top: \${y}px;
  \`;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', \`\${relativeX}%\blank\`);
  card.style.setProperty('--glow-y', \`\${relativeY}%\`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', \`\${radius}px\`);
};

const ParticleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimations?: boolean;
  style?: React.CSSProperties;
  particleCount?: number;
  glowColor?: string;
  enableTilt?: boolean;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}> = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef<HTMLDivElement[]>([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef<gsap.core.Tween | null>(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true) as HTMLDivElement;
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });

        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 100);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }

      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;

        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement('div');
      ripple.style.cssText = \`
        position: absolute;
        width: \${maxDistance * 2}px;
        height: \${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(\${glowColor}, 0.4) 0%, rgba(\${glowColor}, 0.2) 30%, transparent 70%);
        left: \${x - maxDistance}px;
        top: \${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      \`;

      element.appendChild(ripple);

      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={\`\${className} particle-container\`}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight: React.FC<{
  gridRef: React.RefObject<HTMLDivElement | null>;
  disableAnimations?: boolean;
  enabled?: boolean;
  spotlightRadius?: number;
  glowColor?: string;
}> = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const isInsideSection = useRef(false);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = \`
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(\${glowColor}, 0.15) 0%,
        rgba(\${glowColor}, 0.08) 15%,
        rgba(\${glowColor}, 0.04) 25%,
        rgba(\${glowColor}, 0.02) 40%,
        rgba(\${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    \`;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      isInsideSection.current = mouseInside || false;
      const cards = gridRef.current.querySelectorAll('.magic-bento-card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
        cards.forEach(card => {
          (card as HTMLElement).style.setProperty('--glow-intensity', '0');
        });
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach(card => {
        const cardElement = card as HTMLElement;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      isInsideSection.current = false;
      gridRef.current?.querySelectorAll('.magic-bento-card').forEach(card => {
        (card as HTMLElement).style.setProperty('--glow-intensity', '0');
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid: React.FC<{
  children: React.ReactNode;
  gridRef?: React.RefObject<HTMLDivElement | null>;
}> = ({ children, gridRef }) => (
  <div className="card-grid bento-section" ref={gridRef}>
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

export const MagicBento: React.FC<BentoProps> = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        {cardData.map((card, index) => {
          const baseClassName = \`magic-bento-card \${textAutoHide ? 'magic-bento-card--text-autohide' : ''} \${enableBorderGlow ? 'magic-bento-card--border-glow' : ''}\`;
          const cardProps = {
            className: baseClassName,
            style: {
              backgroundColor: card.color,
              '--glow-color': glowColor
            } as React.CSSProperties
          };

          if (enableStars) {
            return (
              <ParticleCard
                key={index}
                {...cardProps}
                disableAnimations={shouldDisableAnimations}
                particleCount={particleCount}
                glowColor={glowColor}
                enableTilt={enableTilt}
                clickEffect={clickEffect}
                enableMagnetism={enableMagnetism}
              >
                <div className="magic-bento-card__header">
                  <div className="magic-bento-card__label">{card.label}</div>
                </div>
                <div className="magic-bento-card__content">
                  <h2 className="magic-bento-card__title">{card.title}</h2>
                  <p className="magic-bento-card__description">{card.description}</p>
                </div>
              </ParticleCard>
            );
          }

          return (
            <div
              key={index}
              {...cardProps}
              ref={el => {
                if (!el) return;

                const handleMouseMove = (e: MouseEvent) => {
                  if (shouldDisableAnimations) return;

                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;

                  if (enableTilt) {
                    const rotateX = ((y - centerY) / centerY) * -10;
                    const rotateY = ((x - centerX) / centerX) * 10;
                    gsap.to(el, {
                      rotateX,
                      rotateY,
                      duration: 0.1,
                      ease: 'power2.out',
                      transformPerspective: 1000
                    });
                  }

                  if (enableMagnetism) {
                    const magnetX = (x - centerX) * 0.05;
                    const magnetY = (y - centerY) * 0.05;
                    gsap.to(el, {
                      x: magnetX,
                      y: magnetY,
                      duration: 0.3,
                      ease: 'power2.out'
                    });
                  }
                };

                const handleMouseLeave = () => {
                  if (shouldDisableAnimations) return;

                  if (enableTilt) {
                    gsap.to(el, {
                      rotateX: 0,
                      rotateY: 0,
                      duration: 0.3,
                      ease: 'power2.out'
                    });
                  }

                  if (enableMagnetism) {
                    gsap.to(el, {
                      x: 0,
                      y: 0,
                      duration: 0.3,
                      ease: 'power2.out'
                    });
                  }
                };

                const handleClick = (e: MouseEvent) => {
                  if (!clickEffect || shouldDisableAnimations) return;

                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  // Calculate the maximum distance from click point to any corner
                  const maxDistance = Math.max(
                    Math.hypot(x, y),
                    Math.hypot(x - rect.width, y),
                    Math.hypot(x, y - rect.height),
                    Math.hypot(x - rect.width, y - rect.height)
                  );

                  const ripple = document.createElement('div');
                  ripple.style.cssText = \`
                    position: absolute;
                    width: \${maxDistance * 2}px;
                    height: \${maxDistance * 2}px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(\${glowColor}, 0.4) 0%, rgba(\${glowColor}, 0.2) 30%, transparent 70%);
                    left: \${x - maxDistance}px;
                    top: \${y - maxDistance}px;
                    pointer-events: none;
                    z-index: 1000;
                  \`;

                  el.appendChild(ripple);

                  gsap.fromTo(
                    ripple,
                    {
                      scale: 0,
                      opacity: 1
                    },
                    {
                      scale: 1,
                      opacity: 0,
                      duration: 0.8,
                      ease: 'power2.out',
                      onComplete: () => ripple.remove()
                    }
                  );
                };

                el.addEventListener('mousemove', handleMouseMove);
                el.addEventListener('mouseleave', handleMouseLeave);
                el.addEventListener('click', handleClick);
              }}
            >
              <div className="magic-bento-card__header">
                <div className="magic-bento-card__label">{card.label}</div>
              </div>
              <div className="magic-bento-card__content">
                <h2 className="magic-bento-card__title">{card.title}</h2>
                <p className="magic-bento-card__description">{card.description}</p>
              </div>
            </div>
          );
        })}
      </BentoCardGrid>
    </>
  );
};

export default MagicBento;`;

      case 'terminal-card':
        return `import React from 'react';
import './TerminalCard.css';

export const TerminalCard: React.FC = () => {
  return (
    <div className="terminal-container">
      <div className="terminal_toolbar">
        <div className="butt">
          <button className="btn btn-color" />
          <button className="btn" />
          <button className="btn" />
        </div>
        <p className="user">johndoe@admin: ~</p>
        <div className="add_tab">+</div>
      </div>
      <div className="terminal_body">
        <div className="terminal_promt">
          <span className="terminal_user">johndoe@admin:</span>
          <span className="terminal_location">~</span>
          <span className="terminal_bling">$</span>
          <span className="terminal_cursor" />
        </div>
      </div>
    </div>
  );
};

export default TerminalCard;`;

      case 'sparkle-button':
        return `import React from 'react';
import './SparkleButton.css';

export const SparkleButton: React.FC = () => {
  return (
    <div className="sp">
      <button className="sparkle-button">
        <span className="spark" />
        <span className="backdrop" />
        <svg className="sparkle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.187 8.096L15 5.25L15.813 8.096C16.0231 8.83114 16.4171 9.50062 16.9577 10.0413C17.4984 10.5819 18.1679 10.9759 18.903 11.186L21.75 12L18.904 12.813C18.1689 13.0231 17.4994 13.4171 16.9587 13.9577C16.4181 14.4984 16.0241 15.1679 15.814 15.903L15 18.75L14.187 15.904C13.9769 15.1689 13.5829 14.4994 13.0423 13.9587C12.5016 13.4181 11.8321 13.0241 11.097 12.814L8.25 12L11.096 11.187C11.8311 10.9769 12.5006 10.5829 13.0413 10.0423C13.5819 9.50162 13.9759 8.83214 14.186 8.097L14.187 8.096Z" fill="black" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 14.25L5.741 15.285C5.59267 15.8785 5.28579 16.4206 4.85319 16.8532C4.42059 17.2858 3.87853 17.5927 3.285 17.741L2.25 18L3.285 18.259C3.87853 18.4073 4.42059 18.7142 4.85319 19.1468C5.28579 19.5794 5.59267 20.1215 5.741 20.715L6 21.75L6.259 20.715C6.40725 20.1216 6.71398 19.5796 7.14639 19.147C7.5788 18.7144 8.12065 18.4075 8.714 18.259L9.75 18L8.714 17.741C8.12065 17.5925 7.5788 17.2856 7.14639 16.853C6.71398 16.4204 6.40725 15.8784 6.259 15.285L6 14.25Z" fill="black" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6.5 4L6.303 4.5915C6.24777 4.75718 6.15472 4.90774 6.03123 5.03123C5.90774 5.15472 5.75718 5.24777 5.5915 5.303L5 5.5L5.5915 5.697C5.75718 5.75223 5.90774 5.84528 6.03123 5.96877C6.15472 6.09226 6.24777 6.24282 6.303 6.4085L6.5 7L6.697 6.4085C6.75223 6.24282 6.84528 6.09226 6.96877 5.96877C7.09226 5.84528 7.24282 5.75223 7.4085 5.697L8 5.5L7.4085 5.303C7.24282 5.24777 7.09226 5.15472 6.96877 5.03123C6.84528 4.90774 6.75223 4.75718 6.697 4.5915L6.5 4Z" fill="black" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text">Generate Site</span>
      </button>
      <div className="bodydrop" />
      <span aria-hidden="true" className="particle-pen">
        {Array.from({ length: 20 }).map((_, i) => (
          <svg
            key={i}
            className="particle"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              '--x': Math.random() * 100,
              '--y': Math.random() * 100,
              '--delay': Math.random() * -10,
              '--duration': 2 + Math.random() * 4,
              '--size': 0.1 + Math.random() * 0.35,
              '--alpha': 0.3 + Math.random() * 0.7
            } as React.CSSProperties}
          >
            <path d="M6.937 3.846L7.75 1L8.563 3.846C8.77313 4.58114 9.1671 5.25062 9.70774 5.79126C10.2484 6.3319 10.9179 6.72587 11.653 6.936L14.5 7.75L11.654 8.563C10.9189 8.77313 10.2494 9.1671 9.70874 9.70774C9.1681 10.2484 8.77413 10.9179 8.564 11.653L7.75 14.5L6.937 11.654C6.72687 10.9189 6.3329 10.2494 5.79226 9.70874C5.25162 9.1681 4.58214 8.77413 3.847 8.564L1 7.75L3.846 6.937C4.58114 6.72687 5.25062 6.3329 5.79126 5.79226C6.3319 5.25162 6.72587 4.58214 6.936 3.847L6.937 3.846Z" fill="black" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ))}
      </span>
    </div>
  );
};

export default SparkleButton;`;

      case 'japanese-matrix':
        return `import React from 'react';
import './JapaneseMatrix.css';

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ';

export const JapaneseMatrix: React.FC = () => {
  const spans = Array.from({ length: 150 }).map((_, i) => {
    const char = CHARS[Math.floor(Math.random() * CHARS.length)];
    return <span key={i}>{char}</span>;
  });

  return (
    <div className="jp-matrix-wrapper">
      <div className="jp-matrix">
        {spans}
      </div>
    </div>
  );
};

export default JapaneseMatrix;`;

      case 'back-to-top':
        return `import React from 'react';
import './BackToTop.css';

export const BackToTop: React.FC = () => {
  return (
    <button className="back-to-top-button">
      <svg className="svgIcon" viewBox="0 0 384 512">
        <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
      </svg>
    </button>
  );
};

export default BackToTop;`;

      case 'glass-app-buttons':
        return `import React from 'react';

export const GlassAppButtons: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto p-4 select-none">
      {/* Apple App Store */}
      <button className="p-5 rounded-full backdrop-blur-lg border border-white/10 bg-gradient-to-tr from-black/60 to-black/40 shadow-lg hover:shadow-2xl hover:shadow-white/20 hover:scale-110 hover:rotate-3 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-white/30 hover:bg-gradient-to-tr hover:from-white/10 hover:to-black/40 group relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
        <div className="relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-7 h-7 fill-current text-white group-hover:text-white/90 transition-colors duration-300">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z"/>
          </svg>
        </div>
      </button>

      {/* Spotify */}
      <button className="p-5 rounded-full backdrop-blur-lg border border-green-500/20 bg-gradient-to-tr from-black/60 to-black/40 shadow-lg hover:shadow-2xl hover:shadow-green-500/30 hover:scale-110 hover:rotate-2 active:scale-95 active:rotate-0 transition-all duration-300 ease-out cursor-pointer hover:border-green-500/50 hover:bg-gradient-to-tr hover:from-green-500/10 hover:to-black/40 group relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
        <div className="relative z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" className="w-7 h-7 text-green-500 fill-current group-hover:text-green-400 transition-colors duration-300">
            <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 30.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-11.4 2.6-12.9 0-21.9-9-21.9-21.9 0-10.9 6.5-19 16.1-21.6 90.7-25.5 229.4-12.6 312 37.1 7.1 4.2 10 10.9 10 18.7 0 11.7-9.4 18.7-19 18.7z" />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default GlassAppButtons;`;

      default:
        return '';
    }
  };

  // INDIVIDUAL COMPONENT RENDERER
  const renderActivePreview = () => {
    switch (activeAnimId) {
      case 'animated-list':
        return (
          <div className="w-full max-w-sm flex items-center justify-center p-4">
            <AnimatedList
              key={triggerKey}
              showGradients={controlValues.showGradients !== false}
              enableArrowNavigation={controlValues.enableArrowNavigation !== false}
              displayScrollbar={controlValues.displayScrollbar !== false}
              initialSelectedIndex={controlValues.initialSelectedIndex !== undefined ? controlValues.initialSelectedIndex : -1}
            />
          </div>
        );
      case 'scroll-stack':
        return (
          <div className="w-full max-w-lg h-96 border border-zinc-900 bg-zinc-950/60 rounded-2xl overflow-hidden relative">
            <ScrollStack
              key={triggerKey}
              itemDistance={controlValues.itemDistance !== undefined ? controlValues.itemDistance : 100}
              itemScale={controlValues.itemScale !== undefined ? controlValues.itemScale : 0.03}
              itemStackDistance={controlValues.itemStackDistance !== undefined ? controlValues.itemStackDistance : 30}
              baseScale={controlValues.baseScale !== undefined ? controlValues.baseScale : 0.85}
              rotationAmount={controlValues.rotationAmount !== undefined ? controlValues.rotationAmount : 0}
              blurAmount={controlValues.blurAmount !== undefined ? controlValues.blurAmount : 0}
              useWindowScroll={false}
            >
              <ScrollStackItem>
                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wide">Card 1</h2>
                  <p className="text-xs text-zinc-400 font-mono">This is the first card in the stack. Scroll down inside this frame to stack cards.</p>
                </div>
              </ScrollStackItem>
              <ScrollStackItem>
                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wide">Card 2</h2>
                  <p className="text-xs text-zinc-400 font-mono">This is the second card in the stack. Cards dynamically shrink and blur as stack builds up.</p>
                </div>
              </ScrollStackItem>
              <ScrollStackItem>
                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wide">Card 3</h2>
                  <p className="text-xs text-zinc-400 font-mono">This is the third card in the stack. Custom options allow adjusting spacing, scaling, and tilt angles.</p>
                </div>
              </ScrollStackItem>
            </ScrollStack>
          </div>
        );
      case 'bubble-menu':
        return (
          <div className="w-full h-80 flex items-center justify-center relative bg-zinc-950/20 border border-zinc-900 rounded-2xl overflow-hidden">
            <BubbleMenu
              key={triggerKey}
              logo={<span className="font-extrabold text-white font-mono tracking-wider">RB</span>}
              menuBg={controlValues.menuBg || '#ffffff'}
              menuContentColor={controlValues.menuContentColor || '#111111'}
              useFixedPosition={false}
              animationDuration={controlValues.animationDuration !== undefined ? controlValues.animationDuration : 0.5}
              staggerDelay={controlValues.staggerDelay !== undefined ? controlValues.staggerDelay : 0.12}
            />
          </div>
        );
      case 'magic-bento':
        return (
          <div className="w-full max-h-[380px] overflow-y-auto flex items-center justify-center p-4 border border-zinc-900 bg-zinc-950/40 rounded-2xl scrollbar-machined">
            <MagicBento
              key={triggerKey}
              textAutoHide={controlValues.textAutoHide !== false}
              enableStars={controlValues.enableStars !== false}
              enableSpotlight={controlValues.enableSpotlight !== false}
              enableBorderGlow={controlValues.enableBorderGlow !== false}
              enableTilt={controlValues.enableTilt === true}
              enableMagnetism={controlValues.enableMagnetism !== false}
              clickEffect={controlValues.clickEffect !== false}
              spotlightRadius={controlValues.spotlightRadius !== undefined ? controlValues.spotlightRadius : 300}
              particleCount={controlValues.particleCount !== undefined ? controlValues.particleCount : 12}
              glowColor={hexToRgbStr(controlValues.glowColor || '#8400ff')}
            />
          </div>
        );
      case 'terminal-card':
        return (
          <div className="w-full flex items-center justify-center p-4">
            <TerminalCard />
          </div>
        );
      case 'sparkle-button':
        return (
          <div className="w-full h-40 flex items-center justify-center p-4">
            <SparkleButton />
          </div>
        );
      case 'japanese-matrix':
        return (
          <div className="w-full max-w-sm p-4">
            <JapaneseMatrix />
          </div>
        );
      case 'back-to-top':
        return (
          <div className="w-full h-40 flex items-center justify-center p-4">
            <BackToTop />
          </div>
        );
      case 'glass-app-buttons':
        return (
          <div className="w-full p-4 flex items-center justify-center">
            <GlassAppButtons />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex min-h-0 bg-black text-zinc-100">
      {/* 1. COMPONENT SELECTION SIDEBAR */}
      <aside className="w-60 border-r border-zinc-900 bg-zinc-950/20 p-4 flex flex-col min-h-0 shrink-0">
        <div className="px-1 py-1 text-[10px] font-bold font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-900/50 pb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-zinc-500" />
          <span>Components</span>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1 mt-2.5 scrollbar-machined">
          {COMPONENTS.map(comp => {
            const isActive = comp.id === activeAnimId;
            return (
              <button
                key={comp.id}
                onClick={() => setActiveAnimId(comp.id)}
                className={cn(
                  "group w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left font-mono transition-all duration-150 cursor-pointer",
                  isActive
                    ? "bg-zinc-900 border-zinc-800 text-white font-bold"
                    : "bg-transparent border-transparent hover:bg-zinc-900/30 text-zinc-400 hover:text-zinc-200"
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={cn(
                      "w-1 h-3 rounded shrink-0 transition-all duration-150",
                      isActive ? "bg-violet-500" : "bg-transparent group-hover:bg-zinc-800"
                    )}
                  />
                  <span className="text-[11px] font-semibold tracking-wide truncate">{comp.name}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t border-zinc-900/50 mt-4 flex items-center justify-between text-[9px] text-zinc-600 font-mono shrink-0">
          <span>Onyx engine v1.1.0</span>
          <span>Ready</span>
        </div>
      </aside>

      {/* 2. MAIN PREVIEW & CONTROLS WORKSPACE */}
      <main className="flex-1 flex flex-col min-h-0 bg-black overflow-y-auto p-6 md:p-8 scrollbar-machined">
        {/* Module Header Title */}
        <div className="flex flex-col gap-1 mb-6">
          <h1 className="text-3xl font-black font-sans tracking-tight text-white select-none">
            {activeConfig.name}
          </h1>
          <p className="text-[11px] font-mono text-zinc-400 select-none">
            {activeConfig.description}
          </p>
        </div>

        {/* Tab Selection Header Bar */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-6">
          <div className="flex items-center gap-2">
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

          <div className="flex items-center gap-1.5 border-l border-zinc-900 pl-4">
            <button
              onClick={handleReset}
              title="Reset component state"
              className="p-2 border border-zinc-900 hover:border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 rounded-md cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main Panel Content Area */}
        <div className="flex-1 flex flex-col gap-6 min-h-0">
          {activeTab === 'preview' ? (
            /* PREVIEW BOX */
            <div className="flex-1 min-h-[320px] rounded-xl border border-zinc-900 bg-zinc-950/40 flex items-center justify-center relative overflow-hidden group">
              <div className="relative z-10 p-8 flex items-center justify-center w-full h-full">
                {renderActivePreview()}
              </div>
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#09090b_1px,transparent_1px),linear-gradient(to_bottom,#09090b_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 z-0 pointer-events-none" />
            </div>
          ) : (
            /* CODE EXPORTER */
            <div className="flex-1 rounded-xl border border-zinc-900 bg-zinc-950/40 flex flex-col overflow-hidden min-h-[320px]">
              {/* Code Panel Header */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-900 bg-zinc-950/60">
                <div className="flex items-center gap-1">
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
                    onClick={() => setExportTab('css')}
                    className={cn(
                      "px-2.5 py-1 text-[10px] font-mono rounded cursor-pointer transition-colors",
                      exportTab === 'css' ? "bg-zinc-900 text-white font-bold" : "text-zinc-500 hover:text-zinc-350"
                    )}
                  >
                    Styles (.css)
                  </button>
                  <button
                    onClick={() => setExportTab('usage')}
                    className={cn(
                      "px-2.5 py-1 text-[10px] font-mono rounded cursor-pointer transition-colors",
                      exportTab === 'usage' ? "bg-zinc-900 text-white font-bold" : "text-zinc-500 hover:text-zinc-355"
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {/* Auto Render Config Controls */}
              {activeConfig.controls.length > 0 ? (
                activeConfig.controls.map(field => {
                  const value = controlValues[field.id] !== undefined ? controlValues[field.id] : field.default;

                  return (
                    <div key={field.id} className="flex flex-col gap-2 bg-zinc-950/20 p-3 rounded-lg border border-zinc-900/40">
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

                      {field.type === 'toggle' && (
                        <button
                          type="button"
                          onClick={() => handleControlChange(field.id, !value)}
                          className={cn(
                            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
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
                      )}

                      {field.type === 'color' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={value}
                            onChange={(e) => handleControlChange(field.id, e.target.value)}
                            className="w-6 h-6 rounded border border-zinc-800 bg-transparent cursor-pointer overflow-hidden"
                          />
                          <span className="text-[10px] font-mono text-zinc-400 uppercase">{value}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-4 text-center text-xs font-mono text-zinc-500">
                  No customization parameters available for this layout component template.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Global Toast Notification System */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-300 flex items-center gap-2 shadow-2xl"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
