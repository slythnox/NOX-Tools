import React from 'react';
import GradientBlinds from '@/components/ui/GradientBlinds';

export default function LandingPage() {
  return (
    <div className="bg-black text-zinc-100 flex flex-col items-center">

      {/* Hero Section */}
      <section className="relative w-full h-[calc(100vh-80px)] min-h-[600px] flex flex-col items-center justify-center overflow-hidden border-b border-zinc-900 bg-black">
        <div className="absolute inset-0 z-0 opacity-90 select-none pointer-events-none">
          <GradientBlinds
            gradientColors={['#FF0000', '#000000']}
            angle={35}
            noise={0.45}
            blindCount={12}
            blindMinWidth={60}
            spotlightRadius={0.45}
            spotlightSoftness={1.1}
            spotlightOpacity={1.0}
            mouseDampening={0.15}
            distortAmount={0}
            shineDirection="left"
            mixBlendMode="lighten"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-4xl px-6 text-center flex flex-col items-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-3xl mb-6 text-white select-none">
            Your shortcut to everything.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-lg leading-relaxed select-none">
            A collection of powerful developer tools all within an extendable workspace. Fast, local and reliable.
          </p>
        </div>
      </section>

      {/* What's inside — Asymmetric Bento Grid */}
      <section className="w-full max-w-4xl px-6 my-20">
        <h2 className="font-mono text-xs text-zinc-500 font-bold uppercase tracking-widest mb-6 text-left border-b border-zinc-900 pb-2">
          What's inside
        </h2>

        {/* ROW 1: [col-span-2 big] + [col-span-1 tall] */}
        <div className="grid grid-cols-3 gap-3 mb-3">

          {/* Card A — 12 UI Components (wide, col-span-2) */}
          <div className="col-span-2 p-6 rounded border border-zinc-900 bg-zinc-950/60 flex flex-col justify-between min-h-[240px] overflow-hidden group hover:border-zinc-800 transition-all">
            <div className="flex flex-wrap gap-1.5 mb-6">
              {[
                'Animated List','Scroll Stack','Bubble Menu','Magic Bento',
                'Strands','Magnet','Fluid Glass','Dock',
                'Sparkle Button','Matrix Rain','Glass Buttons','Back to Top'
              ].map(name => (
                <span
                  key={name}
                  className="font-mono text-[10px] px-2 py-0.5 rounded border border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors cursor-default select-none"
                >
                  {name}
                </span>
              ))}
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-white mb-1">12 UI Components</h3>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-md">
                Physics, 3D, WebGL and motion-powered. Preview live, tweak controls, copy source.
              </p>
            </div>
          </div>

          {/* Card B — 6 Visual Tools (tall, col-span-1) */}
          <div className="col-span-1 p-5 rounded border border-zinc-900 bg-zinc-950/60 flex flex-col justify-between min-h-[240px] hover:border-zinc-800 transition-all group">
            <div className="flex-1 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-3 opacity-50 group-hover:opacity-80 transition-opacity">
                {[
                  { icon: '⬡', label: 'Icons' },
                  { icon: '◈', label: 'Colors' },
                  { icon: '▣', label: 'Backgrounds' },
                  { icon: '</>', label: 'Snippets' },
                  { icon: 'T↗', label: 'Text FX' },
                  { icon: '⬚', label: 'Components' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center font-mono text-sm text-zinc-400">
                      {icon}
                    </div>
                    <span className="font-mono text-[8px] text-zinc-600 text-center leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-mono text-sm font-bold text-white mb-1">6 Visual Tools</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Studio editors. Generate and export production code.</p>
            </div>
          </div>

        </div>

        {/* ROW 2: three equal-ish cards but different content density */}
        <div className="grid grid-cols-3 gap-3">

          {/* Card C — Modern Stack (col-span-1) */}
          <div className="col-span-1 p-5 rounded border border-zinc-900 bg-zinc-950/60 flex flex-col justify-between min-h-[210px] hover:border-zinc-800 transition-all group">
            <div className="flex-1 space-y-2.5 pt-1">
              {[
                { stack: 'React + TypeScript', dot: 'bg-violet-500' },
                { stack: 'CSS Modules', dot: 'bg-blue-500' },
                { stack: 'Framer Motion', dot: 'bg-pink-500' },
                { stack: 'GSAP + OGL', dot: 'bg-emerald-500' },
                { stack: 'Three.js + Fiber', dot: 'bg-orange-500' },
              ].map(({ stack, dot }) => (
                <div key={stack} className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                  <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
                  {stack}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h3 className="font-mono text-sm font-bold text-white mb-1">Modern Stack</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Tools you already use. No lock-in.</p>
            </div>
          </div>

          {/* Card D — Copy-Paste Ready (col-span-1) */}
          <div className="col-span-1 p-5 rounded border border-zinc-900 bg-zinc-950/60 flex flex-col justify-between min-h-[210px] hover:border-zinc-800 transition-all group">
            <div className="flex-1 flex items-start pt-1">
              <div className="w-full font-mono text-[10px] rounded border border-zinc-800 bg-black/70 p-3 space-y-1.5 opacity-50 group-hover:opacity-90 transition-opacity leading-snug">
                <div className="text-zinc-600 text-[9px] pb-1 border-b border-zinc-800/60">● ● ●&nbsp;&nbsp;component.tsx</div>
                <div><span className="text-purple-400">import</span> <span className="text-zinc-300">Dock</span> <span className="text-purple-400">from</span> <span className="text-green-400">'./Dock'</span></div>
                <div><span className="text-purple-400">import</span> <span className="text-zinc-300">Strands</span> <span className="text-purple-400">from</span> <span className="text-green-400">'./Strands'</span></div>
                <div className="text-zinc-600">{'// preview → customize → copy'}</div>
                <div><span className="text-blue-400">{'<Dock'}</span> <span className="text-amber-300">magnification</span><span className="text-zinc-300">={'{70}'}</span> <span className="text-blue-400">{'/>'}</span></div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-mono text-sm font-bold text-white mb-1">Copy-Paste Ready</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Clean TSX + CSS. Drop into any React project.</p>
            </div>
          </div>

          {/* Card E — 100% Local (col-span-1, stat card) */}
          <div className="col-span-1 p-5 rounded border border-zinc-900 bg-zinc-950/60 flex flex-col justify-between min-h-[210px] hover:border-zinc-800 transition-all group relative overflow-hidden">
            <div className="flex-1 flex flex-col justify-center">
              <div className="font-mono font-black text-[52px] leading-none text-white group-hover:text-violet-300 transition-colors tracking-tight">
                100%
              </div>
              <div className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest mt-1">Local &amp; Private</div>
              <svg viewBox="0 0 140 40" className="mt-5 w-full opacity-20 group-hover:opacity-50 transition-opacity" fill="none">
                <polyline
                  points="0,36 25,30 50,22 70,25 95,12 115,8 140,3"
                  stroke="#8b5cf6"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-mono text-sm font-bold text-white mb-1">Runs Offline</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">No telemetry, no accounts. Fully browser-native.</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
