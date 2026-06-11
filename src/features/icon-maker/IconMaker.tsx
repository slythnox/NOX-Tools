import { useState, useRef, useMemo } from 'react';
import { Download, Copy, Check, AlertCircle, Search, Filter } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

// Lucide-only icon list — filtered to callable React components
const ALL_ICON_NAMES: string[] = Object.keys(LucideIcons).filter(
  (name) =>
    name !== 'default' &&
    name !== 'createLucideIcon' &&
    !name.endsWith('Icon') &&
    /^[A-Z]/.test(name) &&
    ((LucideIcons as Record<string, unknown>)[name] !== null &&
      (typeof (LucideIcons as Record<string, unknown>)[name] === 'object' ||
       typeof (LucideIcons as Record<string, unknown>)[name] === 'function'))
);

const ICON_CATEGORIES: Record<string, string[]> = {
  All: ALL_ICON_NAMES,
  Popular: [
    'Heart', 'Star', 'Home', 'User', 'Mail', 'Phone', 'Camera', 'Search',
    'Settings', 'Download', 'Upload', 'Share', 'ThumbsUp', 'Shield', 'Lock',
    'Bell', 'Calendar', 'Clock', 'Globe', 'Zap',
  ],
  Navigation: [
    'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ChevronUp',
    'ChevronDown', 'ChevronLeft', 'ChevronRight', 'Menu', 'X', 'Plus',
    'Minus', 'MoreHorizontal', 'MoreVertical', 'Navigation', 'Compass',
    'MapPin', 'Map', 'Route',
  ],
  Media: [
    'Play', 'Pause', 'Stop', 'SkipForward', 'SkipBack', 'Volume2', 'VolumeX',
    'Music', 'Headphones', 'Mic', 'MicOff', 'Video', 'VideoOff', 'Image',
    'Film', 'Tv', 'Radio',
  ],
  Files: [
    'File', 'FileText', 'Folder', 'FolderOpen', 'Archive', 'Copy', 'Trash2',
    'Save', 'Download', 'Upload', 'Link', 'Paperclip', 'Database', 'HardDrive',
    'Server', 'Cloud',
  ],
  Tech: [
    'Smartphone', 'Tablet', 'Laptop', 'Monitor', 'Wifi', 'WifiOff', 'Bluetooth',
    'Battery', 'Plug', 'Power', 'Cpu', 'HardDrive', 'Code', 'Terminal',
    'Github', 'Braces',
  ],
  Business: [
    'DollarSign', 'CreditCard', 'Wallet', 'Calculator', 'TrendingUp',
    'TrendingDown', 'BarChart', 'PieChart', 'Activity', 'Target', 'Award',
    'Briefcase', 'Building', 'ShoppingCart', 'Tag', 'Receipt',
  ],
  Nature: [
    'Sun', 'Moon', 'CloudRain', 'Cloud', 'Zap', 'Umbrella', 'Droplets',
    'Wind', 'Thermometer', 'Sunrise', 'Sunset', 'TreePine', 'Flower',
    'Leaf', 'Mountain', 'Waves', 'Flame',
  ],
};

export default function IconMaker() {
  const [selectedIconName, setSelectedIconName] = useState<string>('Star');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Popular');
  const [settings, setSettings] = useState({
    size: 48,
    strokeWidth: 2,
    color: '#8b5cf6',
    backgroundColor: '#ffffff',
    backgroundType: 'solid',
    gradientFrom: '#8b5cf6',
    gradientTo: '#ec4899',
    padding: 16,
    borderRadius: 12,
  });
  const [exportState, setExportState] = useState({
    isExporting: false,
    success: false,
    error: null as string | null,
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const resetExportState = () => {
    setTimeout(() => {
      setExportState({ isExporting: false, success: false, error: null });
    }, 2000);
  };

  const handleExport = async () => {
    if (!previewRef.current) return;
    setExportState({ isExporting: true, success: false, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(previewRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `icon-${selectedIconName.toLowerCase()}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      setExportState({ isExporting: false, success: true, error: null });
      resetExportState();
    } catch {
      setExportState({ isExporting: false, success: false, error: 'Failed to export image' });
      resetExportState();
    }
  };

  const handleCopyToClipboard = async () => {
    if (!previewRef.current) return;
    setExportState({ isExporting: true, success: false, error: null });
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(previewRef.current, { cacheBust: true, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setExportState({ isExporting: false, success: true, error: null });
      resetExportState();
    } catch {
      setExportState({ isExporting: false, success: false, error: 'Failed to copy to clipboard' });
      resetExportState();
    }
  };

  const updateSettings = (key: string, value: string | number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const filteredIcons = useMemo(() => {
    const pool =
      searchTerm.trim()
        ? ALL_ICON_NAMES.filter((n) => n.toLowerCase().includes(searchTerm.toLowerCase()))
        : ICON_CATEGORIES[selectedCategory] ?? ALL_ICON_NAMES;
    // Only keep icons that actually exist in lucide exports
    return pool
      .filter((n) => {
        const val = (LucideIcons as Record<string, unknown>)[n];
        return val !== null && (typeof val === 'object' || typeof val === 'function');
      })
      .slice(0, 200);
  }, [searchTerm, selectedCategory]);

  const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; color?: string; className?: string }>>)[selectedIconName];

  const getBackgroundStyle = () => {
    switch (settings.backgroundType) {
      case 'solid':
        return { backgroundColor: settings.backgroundColor };
      case 'gradient':
        return { background: `linear-gradient(135deg, ${settings.gradientFrom}, ${settings.gradientTo})` };
      default:
        return { backgroundColor: 'transparent' };
    }
  };

  const renderGridIcon = (name: string) => {
    const Comp = (LucideIcons as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>>)[name];
    if (!Comp) return null;
    const isSelected = name === selectedIconName;
    return (
      <button
        key={name}
        onClick={() => setSelectedIconName(name)}
        className={`p-3 rounded-xl transition-all duration-200 group ${
          isSelected
            ? 'bg-primary shadow-lg scale-105'
            : 'bg-white/5 hover:bg-white/15 hover:scale-105'
        }`}
        title={name}
      >
        <Comp
          size={20}
          className={`mx-auto transition-colors duration-200 ${
            isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'
          }`}
        />
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col h-full">
        {/* Icon Browser */}
        <div className="flex-shrink-0 glass-amoled rounded-2xl m-4 p-4 max-h-[38vh] flex flex-col">
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search icons…"
              className="w-full pl-10 glass-input rounded-lg px-4 py-2 text-white/90 placeholder-white/50 text-sm"
            />
          </div>

          {!searchTerm && (
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mb-2 flex-shrink-0">
              {Object.keys(ICON_CATEGORIES).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                    selectedCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto scrollbar-custom">
            <div className="grid grid-cols-8 gap-1.5">
              {filteredIcons.map(renderGridIcon)}
            </div>
          </div>
        </div>

        {/* Preview + Settings */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto scrollbar-custom p-4 pt-0">
          {/* Preview */}
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-base font-bold text-white/90 mb-1">{selectedIconName}</h2>
            <div
              ref={previewRef}
              className="inline-flex items-center justify-center shadow-2xl"
              style={{
                ...getBackgroundStyle(),
                padding: `${settings.padding}px`,
                borderRadius: `${settings.borderRadius}px`,
                minWidth: `${settings.size + settings.padding * 2}px`,
                minHeight: `${settings.size + settings.padding * 2}px`,
                ...(settings.backgroundType !== 'none'
                  ? { boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)' }
                  : {}),
              }}
            >
              {IconComponent ? (
                <IconComponent size={settings.size} strokeWidth={settings.strokeWidth} color={settings.color} />
              ) : (
                <div className="flex items-center justify-center text-white/50" style={{ width: settings.size, height: settings.size }}>
                  <AlertCircle size={settings.size * 0.6} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 w-full">
              <button
                onClick={handleExport}
                disabled={exportState.isExporting || !IconComponent}
                className="btn-glass-primary flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium disabled:opacity-50"
              >
                {exportState.isExporting ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : exportState.success ? <Check className="w-3 h-3" />
                  : exportState.error ? <AlertCircle className="w-3 h-3" />
                  : <Download className="w-3 h-3" />}
                {exportState.isExporting ? 'Export…' : exportState.success ? 'Done!' : exportState.error ? 'Failed' : 'Export'}
              </button>
              <button
                onClick={handleCopyToClipboard}
                disabled={exportState.isExporting || !IconComponent}
                className="btn-glass-secondary flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium disabled:opacity-50"
              >
                {exportState.isExporting ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : exportState.success ? <Check className="w-3 h-3" />
                  : exportState.error ? <AlertCircle className="w-3 h-3" />
                  : <Copy className="w-3 h-3" />}
                Copy
              </button>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-white/90">Size</label>
                  <span className="text-xs text-white/60 font-mono bg-white/10 px-1.5 py-0.5 rounded">{settings.size}px</span>
                </div>
                <input type="range" min="16" max="96" value={settings.size} onChange={(e) => updateSettings('size', parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-white/90">Stroke</label>
                  <span className="text-xs text-white/60 font-mono bg-white/10 px-1.5 py-0.5 rounded">{settings.strokeWidth}</span>
                </div>
                <input type="range" min="0.5" max="4" step="0.5" value={settings.strokeWidth} onChange={(e) => updateSettings('strokeWidth', parseFloat(e.target.value))} className="w-full" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/90 mb-2">Icon Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={settings.color} onChange={(e) => updateSettings('color', e.target.value)} className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer bg-transparent" />
                <input type="text" value={settings.color} onChange={(e) => updateSettings('color', e.target.value)} className="flex-1 glass-input rounded-lg px-3 py-2 text-white/90 font-mono text-xs" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/90 mb-2">Background</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {['none', 'solid', 'gradient'].map((type) => (
                  <button
                    key={type}
                    onClick={() => updateSettings('backgroundType', type)}
                    className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 capitalize ${
                      settings.backgroundType === type
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {settings.backgroundType === 'solid' && (
                <div className="flex items-center gap-2">
                  <input type="color" value={settings.backgroundColor} onChange={(e) => updateSettings('backgroundColor', e.target.value)} className="w-10 h-10 rounded-lg border border-white/20 cursor-pointer bg-transparent" />
                  <input type="text" value={settings.backgroundColor} onChange={(e) => updateSettings('backgroundColor', e.target.value)} className="flex-1 glass-input rounded-lg px-3 py-2 text-white/90 font-mono text-xs" />
                </div>
              )}

              {settings.backgroundType === 'gradient' && (
                <div className="space-y-2">
                  {[['From', 'gradientFrom'] as const, ['To', 'gradientTo'] as const].map(([label, key]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-xs text-white/70 w-8 font-medium">{label}</span>
                      <input type="color" value={settings[key]} onChange={(e) => updateSettings(key, e.target.value)} className="w-8 h-8 rounded border border-white/20 cursor-pointer bg-transparent" />
                      <input type="text" value={settings[key]} onChange={(e) => updateSettings(key, e.target.value)} className="flex-1 glass-input rounded px-2 py-1.5 text-white/90 font-mono text-xs" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {settings.backgroundType !== 'none' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-white/90">Padding</label>
                    <span className="text-xs text-white/60 font-mono bg-white/10 px-1.5 py-0.5 rounded">{settings.padding}px</span>
                  </div>
                  <input type="range" min="0" max="48" value={settings.padding} onChange={(e) => updateSettings('padding', parseInt(e.target.value))} className="w-full" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-medium text-white/90">Radius</label>
                    <span className="text-xs text-white/60 font-mono bg-white/10 px-1.5 py-0.5 rounded">{settings.borderRadius}px</span>
                  </div>
                  <input type="range" min="0" max="64" value={settings.borderRadius} onChange={(e) => updateSettings('borderRadius', parseInt(e.target.value))} className="w-full" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full gap-6 p-6">
        {/* Icon Browser */}
        <div className="w-80 glass-amoled rounded-2xl p-5 flex-shrink-0 flex flex-col max-h-[calc(100vh-120px)]">
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search icons…"
              className="w-full pl-12 glass-input rounded-xl px-4 py-2.5 text-white/90 placeholder-white/50"
            />
          </div>

          {!searchTerm && (
            <div className="flex items-center gap-1.5 mb-3 flex-shrink-0">
              <Filter className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                {Object.keys(ICON_CATEGORIES).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                      selectedCategory === cat
                        ? 'bg-primary text-white'
                        : 'bg-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-white/30 text-xs mb-2 flex-shrink-0">
            {filteredIcons.length} icon{filteredIcons.length !== 1 ? 's' : ''}
            {filteredIcons.length === 200 ? ' (showing first 200)' : ''}
          </p>

          <div className="flex-1 overflow-y-auto scrollbar-custom">
            <div className="grid grid-cols-6 gap-2">
              {filteredIcons.map(renderGridIcon)}
            </div>
          </div>
        </div>

        {/* Center Preview */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center w-full max-w-xs">
            <h2 className="text-2xl font-bold text-white/90 mb-1">{selectedIconName}</h2>
            <p className="text-white/50 text-sm mb-8">Lucide Icons</p>

            <div className="mb-8 flex items-center justify-center">
              <div
                ref={previewRef}
                className="inline-flex items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-105"
                style={{
                  ...getBackgroundStyle(),
                  padding: `${settings.padding}px`,
                  borderRadius: `${settings.borderRadius}px`,
                  minWidth: `${settings.size + settings.padding * 2}px`,
                  minHeight: `${settings.size + settings.padding * 2}px`,
                  ...(settings.backgroundType !== 'none'
                    ? { boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)' }
                    : {}),
                }}
              >
                {IconComponent ? (
                  <IconComponent size={settings.size} strokeWidth={settings.strokeWidth} color={settings.color} />
                ) : (
                  <div className="text-white/50" style={{ width: settings.size, height: settings.size }}>
                    <AlertCircle size={settings.size * 0.6} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleExport}
                disabled={exportState.isExporting || !IconComponent}
                className="px-6 btn-glass-primary flex items-center gap-3 py-3 rounded-xl font-medium disabled:opacity-50"
              >
                {exportState.isExporting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : exportState.success ? <Check className="w-4 h-4" />
                  : exportState.error ? <AlertCircle className="w-4 h-4" />
                  : <Download className="w-4 h-4" />}
                {exportState.isExporting ? 'Exporting…' : exportState.success ? 'Exported!' : exportState.error ? 'Failed' : 'Export PNG'}
              </button>

              <button
                onClick={handleCopyToClipboard}
                disabled={exportState.isExporting || !IconComponent}
                className="px-6 btn-glass-secondary flex items-center gap-3 py-3 rounded-xl font-medium disabled:opacity-50"
              >
                {exportState.isExporting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : exportState.success ? <Check className="w-4 h-4" />
                  : exportState.error ? <AlertCircle className="w-4 h-4" />
                  : <Copy className="w-4 h-4" />}
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="w-80 glass-amoled rounded-2xl p-6 overflow-y-auto scrollbar-custom flex-shrink-0 max-h-[calc(100vh-120px)]">
          <div className="space-y-7">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-white/90">Size</label>
                <span className="text-sm text-white/60 font-mono bg-white/10 px-2 py-1 rounded">{settings.size}px</span>
              </div>
              <input type="range" min="16" max="96" value={settings.size} onChange={(e) => updateSettings('size', parseInt(e.target.value))} className="w-full" />
              <div className="flex justify-between text-xs text-white/40 mt-1"><span>16px</span><span>96px</span></div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-white/90">Stroke Width</label>
                <span className="text-sm text-white/60 font-mono bg-white/10 px-2 py-1 rounded">{settings.strokeWidth}</span>
              </div>
              <input type="range" min="0.5" max="4" step="0.5" value={settings.strokeWidth} onChange={(e) => updateSettings('strokeWidth', parseFloat(e.target.value))} className="w-full" />
              <div className="flex justify-between text-xs text-white/40 mt-1"><span>0.5</span><span>4</span></div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">Icon Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={settings.color} onChange={(e) => updateSettings('color', e.target.value)} className="w-12 h-12 rounded-xl border border-white/20 cursor-pointer bg-transparent" />
                <input type="text" value={settings.color} onChange={(e) => updateSettings('color', e.target.value)} className="flex-1 glass-input rounded-xl px-4 py-3 text-white/90 font-mono text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-3">Background</label>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {['none', 'solid', 'gradient'].map((type) => (
                  <button
                    key={type}
                    onClick={() => updateSettings('backgroundType', type)}
                    className={`p-3 rounded-xl text-xs font-medium transition-all duration-200 capitalize ${
                      settings.backgroundType === type
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-white/10 text-white/70 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {settings.backgroundType === 'solid' && (
                <div className="flex items-center gap-3">
                  <input type="color" value={settings.backgroundColor} onChange={(e) => updateSettings('backgroundColor', e.target.value)} className="w-12 h-12 rounded-xl border border-white/20 cursor-pointer bg-transparent" />
                  <input type="text" value={settings.backgroundColor} onChange={(e) => updateSettings('backgroundColor', e.target.value)} className="flex-1 glass-input rounded-xl px-4 py-3 text-white/90 font-mono text-sm" />
                </div>
              )}

              {settings.backgroundType === 'gradient' && (
                <div className="space-y-3">
                  {[['From', 'gradientFrom'] as const, ['To', 'gradientTo'] as const].map(([label, key]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-sm text-white/70 w-10 font-medium">{label}</span>
                      <input type="color" value={settings[key]} onChange={(e) => updateSettings(key, e.target.value)} className="w-12 h-12 rounded-xl border border-white/20 cursor-pointer bg-transparent" />
                      <input type="text" value={settings[key]} onChange={(e) => updateSettings(key, e.target.value)} className="flex-1 glass-input rounded-xl px-4 py-3 text-white/90 font-mono text-sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {settings.backgroundType !== 'none' && (
              <>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-white/90">Padding</label>
                    <span className="text-sm text-white/60 font-mono bg-white/10 px-2 py-1 rounded">{settings.padding}px</span>
                  </div>
                  <input type="range" min="0" max="48" value={settings.padding} onChange={(e) => updateSettings('padding', parseInt(e.target.value))} className="w-full" />
                  <div className="flex justify-between text-xs text-white/40 mt-1"><span>0px</span><span>48px</span></div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-white/90">Border Radius</label>
                    <span className="text-sm text-white/60 font-mono bg-white/10 px-2 py-1 rounded">{settings.borderRadius}px</span>
                  </div>
                  <input type="range" min="0" max="64" value={settings.borderRadius} onChange={(e) => updateSettings('borderRadius', parseInt(e.target.value))} className="w-full" />
                  <div className="flex justify-between text-xs text-white/40 mt-1"><span>0px</span><span>64px</span></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
