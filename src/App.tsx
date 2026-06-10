/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Undo, 
  Trash2, 
  Download, 
  Image as ImageIcon, 
  Sliders, 
  ArrowLeftRight,
  Brush,
  PaintBucket,
  RefreshCcw,
  Sparkles,
  Droplet,
  Shuffle
} from 'lucide-react';

import mushroomsTemplate from './assets/images/coloring_mushrooms_1780984348367.png';
import spaceTemplate from './assets/images/coloring_space_1780984361991.png';
import sunflowersTemplate from './assets/images/coloring_sunflowers_1780984376782.png';
import fruitsTemplate from './assets/images/coloring_fruits_1780984390787.png';

const GALLERY_TEMPLATES = [
  {
    id: 'mushrooms',
    name: 'Happy Mushroom Forest',
    emoji: '🍄',
    src: mushroomsTemplate,
    description: 'Friendly forest mushrooms and ladybug',
    accent: 'hover:ring-emerald-500/50 hover:shadow-emerald-500/10'
  },
  {
    id: 'space',
    name: 'Astro-Cat Adventure',
    emoji: '🐱🚀',
    src: spaceTemplate,
    description: 'Adventure cat in space with rocket ship',
    accent: 'hover:ring-indigo-500/50 hover:shadow-indigo-500/10'
  },
  {
    id: 'sunflowers',
    name: 'Cheerful Sunflowers',
    emoji: '🌻',
    src: sunflowersTemplate,
    description: 'Cheerful smiling flowers under a rainbow',
    accent: 'hover:ring-amber-500/50 hover:shadow-amber-500/10'
  },
  {
    id: 'fruits',
    name: 'Sweet Fruits Paradise',
    emoji: '🍉🍓',
    src: fruitsTemplate,
    description: 'Watermelon, pear, apple & stars',
    accent: 'hover:ring-pink-500/50 hover:shadow-pink-500/10'
  }
];

class SoundSynth {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playDrop() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  playBubble() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    const startFreq = 220 + Math.random() * 380;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 2.1, now + 0.08);
    
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  playSplash() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    for (let i = 0; i < 4; i++) {
      const t = now + i * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130 + i * 160, t);
      osc.frequency.exponentialRampToValueAtTime(280 + i * 350, t + 0.25);
      
      gain.gain.setValueAtTime(0.15 - i * 0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.28);
    }
  }

  playChime() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 arpeggio
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0.0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.65);
    });
  }

  playSquish() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(75, now + 0.07);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }
}

const synth = new SoundSynth();

const PRESET_MIX_COLORS = [
  { name: 'Red', color: '#ef4444', key: 'r', bg: 'bg-red-500 hover:bg-red-400' },
  { name: 'Yellow', color: '#facc15', key: 'y', bg: 'bg-yellow-400 hover:bg-yellow-300' },
  { name: 'Blue', color: '#2563eb', key: 'b', bg: 'bg-blue-600 hover:bg-blue-500' },
  { name: 'White', color: '#ffffff', key: 'w', bg: 'bg-slate-50 hover:bg-white text-slate-900 border border-slate-300' },
  { name: 'Black', color: '#111827', key: 'k', bg: 'bg-slate-950 hover:bg-slate-900' }
];

// Helper to convert hexadecimal colors to RGB components
const parseHex = (hexStr: string) => {
  let clean = hexStr.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return { r, g, b, a: 255 };
};

// Converts RGB back to subtractive RYB
function rgbToRyb(r: number, g: number, b: number): [number, number, number] {
  // Remove white/lightness
  const w = Math.min(r, g, b);
  let r_p = r - w;
  let g_p = g - w;
  let b_p = b - w;

  const mg = Math.max(r_p, g_p, b_p);

  // Get yellow from green & red
  let y = Math.min(r_p, g_p);
  r_p -= y;
  g_p -= y;

  if (b_p > 0 && g_p > 0) {
    const r_limit = Math.min(b_p, g_p);
    b_p -= r_limit;
    g_p -= r_limit;
    y += r_limit;
  }

  y += g_p;

  // Normalize
  const my = Math.max(r_p, y, b_p);
  if (my > 0 && mg > 0) {
    const n = mg / my;
    r_p *= n;
    y *= n;
    b_p *= n;
  }

  return [r_p / 255, y / 255, b_p / 255];
}

// Converts Subtractive RYB back to RGB with tri-linear interpolation
function rybToRgb(r: number, y: number, b: number): [number, number, number] {
  if (r === 0 && y === 0 && b === 0) {
    return [255, 255, 255];
  }

  const c100 = [239, 68, 68];    // Paint Red
  const c010 = [250, 204, 21];   // Paint Yellow
  const c001 = [37, 99, 235];    // Paint Blue
  const c110 = [249, 115, 22];   // Orange
  const c011 = [22, 163, 74];    // Green
  const c101 = [139, 92, 246];   // Violet/Purple
  const c111 = [65, 55, 50];     // Dark brown/muddy gray

  const r_inv = 1 - r;
  const y_inv = 1 - y;
  const b_inv = 1 - b;

  const w000 = r_inv * y_inv * b_inv; // White weight
  const w100 = r * y_inv * b_inv;
  const w010 = r_inv * y * b_inv;
  const w001 = r_inv * y_inv * b;
  const w110 = r * y * b_inv;
  const w101 = r * y_inv * b;
  const w011 = r_inv * y * b;
  const w111 = r * y * b;

  // Normalize the non-white weights so we don't dilute colors towards the white cubic origin
  // unless we explicitly want a tint. This keeps mixed paint colors extremely vibrant.
  const activeWeight = 1 - w000;
  if (activeWeight <= 0) {
    return [255, 255, 255];
  }

  const rout = (c100[0]*w100 + c010[0]*w010 + c001[0]*w001 + c110[0]*w110 + c101[0]*w101 + c011[0]*w011 + c111[0]*w111) / activeWeight;
  const gout = (c100[1]*w100 + c010[1]*w010 + c001[1]*w001 + c110[1]*w110 + c101[1]*w101 + c011[1]*w011 + c111[1]*w111) / activeWeight;
  const bout = (c100[2]*w100 + c010[2]*w010 + c001[2]*w001 + c110[2]*w110 + c101[2]*w101 + c011[2]*w011 + c111[2]*w111) / activeWeight;

  return [
    Math.max(0, Math.min(255, Math.round(rout))),
    Math.max(0, Math.min(255, Math.round(gout))),
    Math.max(0, Math.min(255, Math.round(bout)))
  ];
}

// Blends two absolute Hex or RGB colors using Subtractive Paint RYB calculation
function blendPhysicalColors(colorA: string, colorB: string, ratio: number = 0.5): string {
  const rgbA = parseHex(colorA);
  const rgbB = parseHex(colorB);

  // If we are painting over white paper/canvas or near-black boundaries/outlines,
  // do not perform subtractive blending. We should paint 100% of our selected color!
  const isWhitePaper = rgbA.r > 235 && rgbA.g > 235 && rgbA.b > 235;
  const isBlackOutline = rgbA.r < 45 && rgbA.g < 45 && rgbA.b < 45;
  if (isWhitePaper || isBlackOutline) {
    return colorB;
  }

  const rybA = rgbToRyb(rgbA.r, rgbA.g, rgbA.b);
  const rybB = rgbToRyb(rgbB.r, rgbB.g, rgbB.b);

  const mixedRyb = [
    rybA[0] * (1 - ratio) + rybB[0] * ratio,
    rybA[1] * (1 - ratio) + rybB[1] * ratio,
    rybA[2] * (1 - ratio) + rybB[2] * ratio
  ];

  const mixedRgb = rybToRgb(mixedRyb[0], mixedRyb[1], mixedRyb[2]);
  
  // Return standard Hex
  const toHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(mixedRgb[0])}${toHex(mixedRgb[1])}${toHex(mixedRgb[2])}`;
}

export default function App() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ef4444');
  const [brushSize, setBrushSize] = useState(12);
  const [history, setHistory] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [activeTool, setActiveTool] = useState<'brush' | 'bucket'>('brush');

  // Kids Museum and Gallery shelf persistence
  const [currentTemplateId, setCurrentTemplateId] = useState<string>('');
  const [completedArtworks, setCompletedArtworks] = useState<{ id: string; src: string; title: string; timestamp: number }[]>([]);
  const [inProgressMap, setInProgressMap] = useState<Record<string, string>>({});

  // Parental numerical lock values
  const [parentGateOpen, setParentGateOpen] = useState(false);
  const [parentGateQuestion, setParentGateQuestion] = useState({ q: '', a: 0, options: [] as number[] });
  const [parentGateCallback, setParentGateCallback] = useState<(() => void) | null>(null);

  // Load completed masterpieces & in-progress draft layers from LocalStorage
  useEffect(() => {
    try {
      const savedCompleted = localStorage.getItem('coloring_museum_completed');
      if (savedCompleted) {
        setCompletedArtworks(JSON.parse(savedCompleted));
      }
      
      const savedInProgress: Record<string, string> = {};
      GALLERY_TEMPLATES.forEach((item) => {
        const val = localStorage.getItem(`coloring_inprogress_${item.id}`);
        if (val) {
          savedInProgress[item.id] = val;
        }
      });
      const customVal = localStorage.getItem('coloring_inprogress_custom');
      if (customVal) {
        savedInProgress['custom'] = customVal;
      }
      setInProgressMap(savedInProgress);
    } catch (e) {
      console.warn('Error reading LocalStorage values:', e);
    }
  }, []);

  // Save the current canvas in-progress sketch state
  const saveInProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentTemplateId) return;
    try {
      const dataUrl = canvas.toDataURL();
      localStorage.setItem(`coloring_inprogress_${currentTemplateId}`, dataUrl);
      setInProgressMap((prev) => ({
        ...prev,
        [currentTemplateId]: dataUrl
      }));
    } catch (e) {
      console.error('Error saving in-progress draft:', e);
    }
  };

  // Triggers the bubbly adult lock mathematical puzzle gate
  const requestParentalAction = (callback: () => void) => {
    const num1 = Math.floor(Math.random() * 8) + 3; // 3 to 10
    const num2 = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const isMultiplication = Math.random() > 0.5;
    
    let qText = '';
    let correctAnswer = 0;
    if (isMultiplication) {
      qText = `${num1} × ${num2} = ?`;
      correctAnswer = num1 * num2;
    } else {
      qText = `${num1} + ${num2} = ?`;
      correctAnswer = num1 + num2;
    }

    const optionsSet = new Set<number>();
    optionsSet.add(correctAnswer);
    while (optionsSet.size < 4) {
      const offset = Math.floor(Math.random() * 8) - 4;
      const fakeAnswer = correctAnswer + offset;
      if (fakeAnswer > 0) {
        optionsSet.add(fakeAnswer);
      }
    }
    const optionsArray = Array.from(optionsSet).sort((a, b) => a - b);

    setParentGateQuestion({
      q: qText,
      a: correctAnswer,
      options: optionsArray
    });
    setParentGateCallback(() => callback);
    setParentGateOpen(true);
    synth.playSquish();
  };

  const handleParentGateAnswer = (selectedAns: number) => {
    if (selectedAns === parentGateQuestion.a) {
      synth.playChime();
      setParentGateOpen(false);
      if (navigator.vibrate) {
        navigator.vibrate([40, 10, 40]);
      }
      if (parentGateCallback) {
        parentGateCallback();
      }
    } else {
      synth.playDrop();
      if (navigator.vibrate) {
        navigator.vibrate(120);
      }
      alert("Oopsie! Grown-ups can try another math puzzle!");
      // Re-trigger with fresh challenge
      if (parentGateCallback) {
        requestParentalAction(parentGateCallback);
      }
    }
  };

  // Gallery storage helpers for kids action results
  const resetInProgress = (templateId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      localStorage.removeItem(`coloring_inprogress_${templateId}`);
      setInProgressMap((prev) => {
        const copy = { ...prev };
        delete copy[templateId];
        return copy;
      });
      synth.playDrop();
    } catch (err) {
      console.error('Error removing inprogress draft:', err);
    }
  };

  const deleteMasterpiece = (artId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const updated = completedArtworks.filter((art) => art.id !== artId);
      setCompletedArtworks(updated);
      localStorage.setItem('coloring_museum_completed', JSON.stringify(updated));
      synth.playDrop();
    } catch (err) {
      console.error('Error deleting completed artwork:', err);
    }
  };

  const saveMasterpiece = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const dataUrl = canvas.toDataURL();
      const template = GALLERY_TEMPLATES.find((t) => t.id === currentTemplateId);
      const title = template ? `${template.name} 🎨` : "My Artwork 🎨";
      
      const newArtwork = {
        id: `muse_${Date.now()}`,
        src: dataUrl,
        title,
        timestamp: Date.now()
      };
      
      const updated = [newArtwork, ...completedArtworks];
      setCompletedArtworks(updated);
      localStorage.setItem('coloring_museum_completed', JSON.stringify(updated));
      
      if (currentTemplateId) {
        localStorage.removeItem(`coloring_inprogress_${currentTemplateId}`);
        setInProgressMap((prev) => {
          const copy = { ...prev };
          delete copy[currentTemplateId];
          return copy;
        });
      }
      
      setHistory([]);
      synth.playChime();
      setImageLoaded(false);
    } catch (err) {
      console.error('Error saving masterpiece:', err);
    }
  };

  // Paint Mixing Station states
  const [mixPot, setMixPot] = useState({ r: 2, y: 0, b: 0, w: 0, k: 0 }); // Default holds some Red
  const [isStirring, setIsStirring] = useState(false);
  const [liquidSwirlAngle, setLiquidSwirlAngle] = useState(0);

  // Drawing refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize canvas size and initial drawing when image loaded changes
  useEffect(() => {
    if (imageLoaded && imageDataUrl && originalImageRef.current) {
      initCanvas(originalImageRef.current);
    }
  }, [imageLoaded, imageDataUrl]);

  const initCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Look up saved in-progress sketch state for this template
    const savedProgress = inProgressMap[currentTemplateId];
    if (savedProgress) {
      const progressImg = new Image();
      progressImg.crossOrigin = 'anonymous';
      progressImg.onload = () => {
        ctx.drawImage(progressImg, 0, 0);
      };
      progressImg.src = savedProgress;
    } else {
      ctx.drawImage(img, 0, 0);
    }
  };

  // Compute RGB color from current mixing pot state
  const getMixPotColor = () => {
    const { r, y, b, w, k } = mixPot;
    const C_total = r + y + b;
    
    if (C_total === 0 && w === 0 && k === 0) {
      return '#dedede'; // Translucent clean pot color
    }

    let baseRgb = [255, 255, 255];
    if (C_total > 0) {
      const ryb = [r / C_total, y / C_total, b / C_total];
      baseRgb = rybToRgb(ryb[0], ryb[1], ryb[2]);
    }

    // Blend tint (white) and shade (black)
    const totalDrops = C_total + w + k;
    const wProp = w / totalDrops;
    const kProp = k / totalDrops;
    const colorProp = C_total / totalDrops;

    const finalR = Math.round(baseRgb[0] * colorProp + 255 * wProp + 15 * kProp);
    const finalG = Math.round(baseRgb[1] * colorProp + 255 * wProp + 15 * kProp);
    const finalB = Math.round(baseRgb[2] * colorProp + 255 * wProp + 15 * kProp);

    const toHex = (c: number) => {
      const val = Math.max(0, Math.min(255, c));
      const hex = val.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(finalR)}${toHex(finalG)}${toHex(finalB)}`;
  };

  // Synchronize mixed pot color as current active paint choice immediately
  const activeMixedColor = getMixPotColor();
  useEffect(() => {
    if (activeMixedColor !== '#dedede') {
      setSelectedColor(activeMixedColor);
    }
  }, [activeMixedColor]);

  // Animate fluid color fill (Water spreading concentric ripple)
  const animatedFloodFill = (startX: number, startY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const roundedX = Math.floor(startX);
    const roundedY = Math.floor(startY);

    if (roundedX < 0 || roundedX >= width || roundedY < 0 || roundedY >= height) return;

    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    const startPos = (roundedY * width + roundedX) * 4;
    const targetR = data[startPos];
    const targetG = data[startPos + 1];
    const targetB = data[startPos + 2];
    const targetA = data[startPos + 3];

    // Read existing region's average/dominant color to mix subtractively!
    const targetHex = `#${targetR.toString(16).padStart(2, '0')}${targetG.toString(16).padStart(2, '0')}${targetB.toString(16).padStart(2, '0')}`;
    
    // Subtractive Paint blending of the target and selected paint colors
    const fillHex = blendPhysicalColors(targetHex, selectedColor, 0.5);
    const fillColor = parseHex(fillHex);

    // If target is already filled, skip
    if (
      Math.abs(targetR - fillColor.r) < 8 &&
      Math.abs(targetG - fillColor.g) < 8 &&
      Math.abs(targetB - fillColor.b) < 8
    ) {
      return;
    }

    // Save previous state to history
    const snapshot = canvas.toDataURL();
    setHistory((prev) => {
      const updated = [...prev, snapshot];
      if (updated.length > 20) {
        updated.shift();
      }
      return updated;
    });

    const tolerance = 48;
    const visited = new Uint8Array(width * height);
    const filledPixels: { x: number; y: number; d: number }[] = [];

    // Faster BFS to gather target match pixels
    let head = 0;
    const queue: [number, number][] = [[roundedX, roundedY]];
    visited[roundedY * width + roundedX] = 1;

    while (head < queue.length) {
      const [cx, cy] = queue[head++];
      
      const dx = cx - roundedX;
      const dy = cy - roundedY;
      const baseDist = Math.sqrt(dx * dx + dy * dy);

      // Compute polar angle relative to tap coordinates
      const angle = Math.atan2(dy, dx);

      // Combine multiple harmonic scales to approximate physical watercolor paper capillary action and random fluid lobes
      const noise = (Math.sin(angle * 7.0) * 18.0) +
                    (Math.cos(angle * 12.0) * 9.0) +
                    (Math.sin(angle * 3.5) * 24.0) +
                    (Math.sin(cx * 0.12) * Math.cos(cy * 0.12) * 6.0);

      // Dampen the noise amplitude near the core origin so the faucet starts smoothly
      const noiseDampen = Math.min(1.0, baseDist / 28.0);
      const dist = Math.max(0, baseDist + noise * noiseDampen);

      filledPixels.push({ x: cx, y: cy, d: dist });

      const neighbors = [
        [cx - 1, cy],
        [cx + 1, cy],
        [cx, cy - 1],
        [cx, cy + 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const idx = ny * width + nx;
          if (!visited[idx]) {
            const p = idx * 4;
            const r = data[p];
            const g = data[p + 1];
            const b = data[p + 2];
            const a = data[p + 3];

            if (
              Math.abs(r - targetR) <= tolerance &&
              Math.abs(g - targetG) <= tolerance &&
              Math.abs(b - targetB) <= tolerance &&
              Math.abs(a - targetA) <= tolerance
            ) {
              visited[idx] = 1;
              queue.push([nx, ny]);
            }
          }
        }
      }
    }

    // Group matching pixel coordinate objects into 35 concentric distance buckets (the water spread effect)
    const NUM_BUCKETS = 35;
    const buckets: [number, number][][] = Array.from({ length: NUM_BUCKETS }, () => []);
    
    let maxD = 1;
    for (const p of filledPixels) {
      if (p.d > maxD) maxD = p.d;
    }

    for (const p of filledPixels) {
      const bIndex = Math.min(NUM_BUCKETS - 1, Math.floor((p.d / maxD) * NUM_BUCKETS));
      buckets[bIndex].push([p.x, p.y]);
    }

    // Animate bucket layers frame by frame on the active canvas
    let currentFrame = 0;
    const fillNextFrame = () => {
      if (currentFrame >= NUM_BUCKETS) {
        saveInProgress();
        return;
      }

      const currentBucket = buckets[currentFrame];
      if (currentBucket && currentBucket.length > 0) {
        const frameImgData = ctx.getImageData(0, 0, width, height);
        const frameData = frameImgData.data;

        for (const [px, py] of currentBucket) {
          const p = (py * width + px) * 4;
          frameData[p] = fillColor.r;
          frameData[p + 1] = fillColor.g;
          frameData[p + 2] = fillColor.b;
          frameData[p + 3] = 255;
        }
        ctx.putImageData(frameImgData, 0, 0);
      }

      currentFrame++;
      requestAnimationFrame(fillNextFrame);
    };

    fillNextFrame();
  };

  const handleFile = (file: File) => {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'].includes(file.type)) {
      alert('Unsupported image format. Please choose standard PNG, JPG, or WEBP.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        const img = new Image();
        img.onload = () => {
          originalImageRef.current = img;
          setCurrentTemplateId('custom');
          setImageDataUrl(dataUrl);
          setImageLoaded(true);
          setHistory([]);
          synth.playChime();
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectTemplate = (id: string, imgUrl: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      originalImageRef.current = img;
      setCurrentTemplateId(id);
      setImageDataUrl(imgUrl);
      setImageLoaded(true);
      setHistory([]);
      synth.playChime();
    };
    img.src = imgUrl;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;

    return { x: canvasX, y: canvasY };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (activeTool === 'bucket') {
      const coords = getCanvasCoords(e);
      synth.playSplash();
      if (navigator.vibrate) {
        try {
          navigator.vibrate([30, 40, 30]);
        } catch (err) {}
      }
      animatedFloodFill(coords.x, coords.y);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    e.currentTarget.setPointerCapture(e.pointerId);

    const snapshot = canvas.toDataURL();
    setHistory((prev) => {
      const updated = [...prev, snapshot];
      if (updated.length > 20) updated.shift();
      return updated;
    });

    isDrawingRef.current = true;
    synth.playDrop();
    const coords = getCanvasCoords(e);

    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    lastPosRef.current = coords;
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);

    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    lastPosRef.current = coords;
  };

  const stopDrawing = () => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false;
      saveInProgress();
    }
  };

  const executeUndo = () => {
    if (history.length === 0) return;

    const updatedHistory = [...history];
    const lastSnapshot = updatedHistory.pop();
    setHistory(updatedHistory);

    if (lastSnapshot) {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = lastSnapshot;
    }
  };

  const clearCanvas = () => {
    if (!originalImageRef.current) return;
    initCanvas(originalImageRef.current);
    setHistory([]);
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const timestamp = Math.floor(Date.now() / 1000);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `my_coloring_${timestamp}.png`;
    link.click();
  };

  const changeImage = () => {
    setImageLoaded(false);
    setImageDataUrl('');
    setHistory([]);
  };

  // Add paint drop into mixing petri pot with swirl animations
  const addPaintDrop = (colorKey: 'r' | 'y' | 'b' | 'w' | 'k') => {
    setMixPot((prev) => ({
      ...prev,
      [colorKey]: prev[colorKey] + 1
    }));
    
    synth.playDrop();
    if (navigator.vibrate) {
      try {
        navigator.vibrate(25);
      } catch (err) {}
    }

    // Trigger swirling micro liquid feedback
    setLiquidSwirlAngle((prev) => prev + 45);
    setIsStirring(true);
    setTimeout(() => setIsStirring(false), 600);
  };

  const washMixPot = () => {
    synth.playSquish();
    setMixPot({ r: 0, y: 0, b: 0, w: 0, k: 0 });
    setSelectedColor('#ef4444'); // reset to classic bold red
  };

  const stirPot = () => {
    setIsStirring(true);
    setLiquidSwirlAngle((prev) => prev + 360);
    
    // Play cute bubble sounds loop & feel resistance with rhythmic vibrations!
    let intervalCount = 0;
    const interval = setInterval(() => {
      synth.playBubble();
      if (navigator.vibrate) {
        try {
          navigator.vibrate(30);
        } catch (err) {}
      }
      intervalCount++;
      if (intervalCount >= 6) {
        clearInterval(interval);
      }
    }, 120);

    setTimeout(() => {
      setIsStirring(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f7f5ee] text-slate-800 flex flex-col font-sans select-none relative overflow-x-hidden antialiased py-3">
      {/* Soft Bubbly Warm Background Decor */}
      <div className="absolute top-[-100px] left-[-50px] w-[350px] h-[350px] bg-amber-200/40 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[-50px] right-[-50px] w-[380px] h-[380px] bg-pink-200/40 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[250px] h-[250px] bg-sky-200/30 rounded-full blur-[60px] pointer-events-none" />

      {/* Children Friendly Header */}
      <header className="py-4 px-6 relative z-10 mx-auto w-full max-w-7xl">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-sm border border-amber-900/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-400 to-indigo-500 flex items-center justify-center shadow-md transform active:scale-90 hover:scale-105 active:rotate-3 transition-all duration-200 cursor-pointer">
              <span className="text-3xl">🎨</span>
            </div>
            <div>
              <h1 className="font-black text-2xl tracking-tight text-amber-950 flex items-center gap-1">
                Coloring Canvas
              </h1>
              <p className="text-xs text-amber-900/60 font-bold tracking-wide">Magical Subtractive Mixing Playroom ✨</p>
            </div>
          </div>

          {imageLoaded && (
            <button
              onClick={() => {
                synth.playSquish();
                setImageLoaded(false);
              }}
              className="px-5 py-3 rounded-full bg-amber-100 hover:bg-amber-200 border-2 border-amber-800 text-amber-950 text-sm font-black active:scale-90 hover:scale-105 hover:-rotate-1 active:duration-100 duration-200 transition-all transform flex items-center gap-2 shadow"
            >
              <span>🏡</span> Home
            </button>
          )}
        </div>
      </header>

      {/* Interactive Easel Stage */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10 w-full mx-auto max-w-[1400px]">
        {!imageLoaded ? (
          /* STARTUP KIDS PLAYROOM SHELF & MUSEUM */
          <div className="w-full duration-500 ease-out animate-fade-in space-y-12">
            
            {/* Header Greeting */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-block px-4 py-1.5 bg-pink-100 border-2 border-pink-400 text-pink-700 text-xs font-black uppercase tracking-wider rounded-full shadow-sm animate-bounce">
                🎉 Kids Painting Lab!
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-amber-950">
                Let's Make Art!
              </h2>
            </div>

            {/* THE WOOD BOOKSHELF WRAPPER */}
            <div className="bg-[#e5d4bc] rounded-3xl p-6 md:p-8 shadow-xl border-t-4 border-l-4 border-white/40 border-b-8 border-amber-900/30 relative">
              <div className="absolute top-2 left-4 px-3 py-1 bg-[#d0bc9f] rounded-full text-base font-black shadow-inner">
                📚
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                {GALLERY_TEMPLATES.map((item) => {
                  const hasProgress = inProgressMap[item.id];
                  return (
                    <div
                      key={item.id}
                      className="group relative bg-white/95 rounded-3xl p-4 border-2 border-amber-900/10 shadow-md hover:shadow-xl hover:border-amber-50/40 transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Image Thumbnail inside Sketchbook frame */}
                      <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-900/5 flex items-center justify-center p-4 relative shadow-inner group-hover:bg-amber-50/20 transition-colors">
                        <img
                          src={item.src}
                          alt={item.name}
                          className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        {/* Friendly Emoji Badge */}
                        <span className="absolute top-2 right-2 text-2xl drop-shadow">{item.emoji}</span>
                        
                        {hasProgress && (
                          <div className="absolute inset-0 bg-amber-950/20 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2.5 p-3">
                            <span className="bg-amber-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                              🎨 Draft Saved!
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info and squishy action bubbles */}
                      <div className="mt-4 space-y-3">
                        {hasProgress ? (
                          <div className="grid grid-cols-5 gap-2">
                            <button
                              onClick={() => handleSelectTemplate(item.id, item.src)}
                              className="col-span-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 border-b-4 border-emerald-700 text-white font-black text-xs cursor-pointer active:scale-95 duration-150 transform hover:scale-[1.03]"
                            >
                              Continue 🎨
                            </button>
                            <button
                              onClick={(e) => resetInProgress(item.id, e)}
                              className="col-span-1 rounded-2xl bg-rose-500 hover:bg-rose-400 border-b-4 border-rose-700 text-white flex items-center justify-center cursor-pointer active:scale-95 duration-150 transform hover:scale-[1.03]"
                              title="Start Fresh"
                            >
                              🧹
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSelectTemplate(item.id, item.src)}
                            className="w-full py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 border-b-4 border-amber-600 text-amber-950 font-black text-xs cursor-pointer active:scale-95 duration-150 transform hover:scale-[1.03]"
                          >
                            Start Page ✨
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ART EXHIBITION MUSEUM WALL */}
            <div className="bg-[#8a5a3c] rounded-3xl p-6 md:p-8 shadow-2xl border-t-4 border-l-4 border-white/20 border-b-12 border-amber-950/40 relative">
              <div className="absolute top-2 left-4 px-3 py-1 bg-amber-900 rounded-full text-base font-black shadow-inner">
                🏛️✨
              </div>

              {completedArtworks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6">
                  {completedArtworks.map((art) => (
                    <div
                      key={art.id}
                      className="relative border-[14px] md:border-[18px] border-[#d4af37] bg-white rounded-3xl p-2.5 shadow-2xl transition-all duration-300 hover:scale-105 hover:rotate-1"
                    >
                      {/* Corner shiny brass hangers */}
                      <div className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-amber-200 border border-amber-600 shadow" />
                      <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-200 border border-amber-600 shadow" />
                      <div className="absolute bottom-1 left-1 w-2.5 h-2.5 rounded-full bg-amber-200 border border-amber-600 shadow" />
                      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-amber-200 border border-amber-600 shadow" />

                      {/* The canvas screenshot */}
                      <div className="aspect-square bg-white rounded-xl overflow-hidden border shadow-inner">
                        <img
                          src={art.src}
                          alt={art.title}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Frame description plaque */}
                      <div className="mt-3.5 text-center px-1">
                        <span className="inline-block px-3 py-1 bg-amber-50 border-2 border-amber-800 rounded-xl text-[10px] font-black uppercase text-amber-905 tracking-wider shadow">
                          "{art.title}" 🏆
                        </span>
                      </div>

                      {/* Trash Button for Grown-Ups */}
                      <button
                        onClick={(e) => deleteMasterpiece(art.id, e)}
                        className="absolute -top-3.5 -right-3.5 w-9 h-9 rounded-full bg-rose-500 hover:bg-rose-400 text-white flex items-center justify-center border-4 border-white shadow-xl cursor-pointer text-xs active:scale-75 transition-all"
                        title="Remove Masterpiece"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-4 border-dashed border-amber-900/20 rounded-2xl py-12 px-6 mt-4 text-center">
                  <span className="text-4xl block mb-2">🖼️</span>
                  <p className="text-amber-100 font-bold text-sm">
                    No masterpieces hung yet! Color any drawing page and tap the star to hang your canvas here!
                  </p>
                </div>
              )}
            </div>

            {/* FILE DROP ZONE (Parental Gate Guarded) */}
            <div className="max-w-xl mx-auto">
              <div
                id="upload-screen"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => requestParentalAction(triggerFileInput)}
                className={`animated-dash-border group relative flex flex-col items-center justify-center p-8 rounded-3xl cursor-pointer text-center bg-white hover:bg-amber-50/20 transition-all duration-300 border-dashed border-4 ${
                  dragActive ? 'drag-active ring-8 ring-amber-500/10 scale-[1.03]' : 'border-amber-900/10'
                } shadow-md`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*.png,image/*.jpg,image/*.jpeg,image/*.webp,image/*.gif"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFile(e.target.files[0]);
                  }}
                  className="hidden"
                />

                <span className="text-4xl mb-3 drop-shadow">📂</span>
                <h3 className="font-extrabold text-lg text-amber-950 mb-1">
                  Upload Outline Sketch
                </h3>
                <p className="text-xs text-slate-500 mb-4 max-w-[280px] leading-relaxed font-bold">
                  Grown-ups can load a personal outline file! (PNG, JPG, WEBP)
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    requestParentalAction(triggerFileInput);
                  }}
                  className="px-5 py-2.5 rounded-full font-black text-xs text-white bg-indigo-500 hover:bg-indigo-400 border-b-4 border-indigo-700 hover:scale-[1.03] active:scale-95 duration-150 transform shadow-md"
                >
                  Family File Pick ✨
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* PLAYGROUND DESIGN: THE WOODEN EASEL STAGE & BOTTOM TABLET (NO TEXT DESCRIPTIONS) */
          <div id="canvas-screen" className="w-full flex flex-col gap-6 items-stretch animate-fade-in py-1">
            
            {/* 80% SCREEN AREA: THE MAJESTIC WOODEN BEZEL CANVASES ON COZY WALNUT SUPPORT */}
            <div className="flex-1 flex flex-col items-center justify-center bg-[#2c3e50] border-4 border-amber-950 rounded-3xl p-6 min-h-[50vh] max-h-[62vh] relative shadow-2xl">
              
              {/* Back to Home and Save Star (Zero-text styled game HUD header) */}
              <div className="absolute top-3 left-4 flex gap-2">
                <button
                  onClick={() => {
                    synth.playSquish();
                    setImageLoaded(false);
                  }}
                  className="w-12 h-12 rounded-full bg-white hover:bg-amber-50 border-2 border-amber-900 active:scale-95 flex items-center justify-center cursor-pointer shadow transform active:translate-y-0.5 active:duration-100 transition-all text-xl"
                  title="Return Home"
                >
                  🏡
                </button>
                <button
                  onClick={saveMasterpiece}
                  className="px-5 h-12 rounded-full bg-amber-400 hover:bg-yellow-300 border-2 border-amber-900 active:scale-95 flex items-center justify-center cursor-pointer shadow-lg transform active:translate-y-0.5 active:duration-100 transition-all text-xs font-black text-amber-950 uppercase tracking-wider gap-1.5 animate-pulse"
                  title="Hang on Museum Shelf!"
                >
                  <span>🌟 Done!</span> 🖼️
                </button>
              </div>

              {originalImageRef.current && (
                <div className="absolute top-4 right-4 text-[10px] bg-black/30 backdrop-blur text-white px-3 py-1.5 rounded-full font-bold">
                  SHEET: {originalImageRef.current.naturalWidth} x {originalImageRef.current.naturalHeight}
                </div>
              )}

              {/* WOODEN EASEL BEZEL (Beige backing board inside thick, tactile cherrywood border) */}
              <div className="relative border-[18px] md:border-[26px] border-[#8e4a23] rounded-[36px] shadow-2xl bg-[#f5ebd7] p-2.5 max-w-full">
                {/* Physical golden metal bolts on the easel bezel edges */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 rounded-full bg-amber-200 border border-amber-600 shadow-inner" />
                <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-amber-200 border border-amber-600 shadow-inner" />
                <div className="absolute bottom-2 left-2 w-3.5 h-3.5 rounded-full bg-amber-200 border border-amber-600 shadow-inner" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full bg-amber-200 border border-amber-600 shadow-inner" />
                
                <canvas
                  ref={canvasRef}
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={stopDrawing}
                  onPointerLeave={stopDrawing}
                  onContextMenu={(e) => e.preventDefault()}
                  className="canvas-paint-area max-w-[85vw] max-h-[44vh] w-auto h-auto object-contain cursor-crosshair rounded-2xl bg-transparent block mx-auto hover:brightness-[1.01] transition-all"
                />
              </div>

              {/* Dynamic Brush Size bubble slider */}
              <div className="flex items-center gap-3 bg-white border-2 border-amber-900/10 p-2.5 rounded-full shadow-lg mt-4 shrink-0">
                <span className="text-lg">🖌️</span>
                <input
                  type="range"
                  min="4"
                  max="44"
                  value={brushSize}
                  onChange={(e) => {
                    setBrushSize(parseInt(e.target.value));
                    synth.playSquish();
                  }}
                  className="w-36 h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:accent-pink-400 focus:outline-none"
                  title="Brush Size"
                />
                <div 
                  className="rounded-full border shadow transition-all ml-1 shrink-0"
                  style={{
                    backgroundColor: selectedColor,
                    width: `${Math.max(8, Math.min(brushSize, 22))}px`,
                    height: `${Math.max(8, Math.min(brushSize, 22))}px`
                  }}
                />
                <span className="text-xs font-black text-amber-950 px-1.5">{brushSize}px</span>
              </div>
            </div>

            {/* 20% BOTTOM TOOLBELT: THE TRACTILE LANDSCAPE PLAYSET TABLE */}
            <div className="w-full bg-[#dfd6c6] border-4 border-[#ab9579] rounded-3xl p-5 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* SECTION A: TOOL SELECT SWITCH (Brush vs Bucket) - ZERO TEXT */}
              <div className="flex items-center gap-2.5 bg-black/10 p-2 rounded-2xl shrink-0 border border-amber-900/5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTool('brush');
                    synth.playSquish();
                  }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center active:scale-75 transition-all text-2xl relative cursor-pointer ${
                    activeTool === 'brush'
                      ? 'bg-amber-400 border-2 border-amber-900 text-amber-950 shadow-md ring-4 ring-amber-400/30'
                      : 'bg-white/80 hover:bg-white text-slate-500 shadow-sm border border-black/5 hover:-translate-y-0.5'
                  }`}
                  title="Brush tool"
                >
                  🖌️
                  {activeTool === 'brush' && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white animate-ping" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTool('bucket');
                    synth.playSquish();
                  }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center active:scale-75 transition-all text-2xl relative cursor-pointer ${
                    activeTool === 'bucket'
                      ? 'bg-amber-400 border-2 border-amber-900 text-amber-950 shadow-md ring-4 ring-amber-400/30'
                      : 'bg-white/80 hover:bg-white text-slate-500 shadow-sm border border-black/5 hover:-translate-y-0.5'
                  }`}
                  title="Bucket tool"
                >
                  🪣
                  {activeTool === 'bucket' && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white animate-ping" />
                  )}
                </button>
              </div>

              {/* SECTION B: RYB INTERACTIVE PALETTE & LIQUID POT BLENDING EXPERIMENTS */}
              <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6">
                
                {/* Paint color options buttons */}
                <div className="flex items-center flex-wrap gap-2 justify-center">
                  {PRESET_MIX_COLORS.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => addPaintDrop(item.key as any)}
                      className={`w-11 h-11 rounded-full cursor-pointer transition-all hover:scale-110 active:scale-75 transform hover:rotate-6 flex items-center justify-center font-black relative border-2 border-amber-900/10 shadow-lg ${item.bg}`}
                      title={`Splatter ${item.name}`}
                    >
                      {/* Interactive drop emblem */}
                      <span className="text-xs select-none">🍯</span>
                    </button>
                  ))}
                </div>

                {/* Swirling Liquid Experiment Cauldron Pot */}
                <div className="flex items-center gap-3 bg-black/10 p-2.5 rounded-2xl border border-amber-900/5">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-[#a1887f] border-4 border-amber-900 shadow-xl flex items-center justify-center p-1 relative">
                      {/* Concentric metal rivets */}
                      <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
                      
                      {/* Liquid blend well */}
                      <div
                        className={`w-full h-full rounded-full shadow-inner relative overflow-hidden flex items-center justify-center transition-all duration-500 ${
                          isStirring ? 'animate-spin-slow' : ''
                        }`}
                        style={{
                          backgroundColor: activeMixedColor,
                          transform: `rotate(${liquidSwirlAngle}deg)`,
                          transition: 'background-color 0.4s ease, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                      >
                        <div className="absolute inset-0.5 bg-gradient-to-tr from-white/20 to-transparent rounded-full opacity-60" />
                        <div className="absolute -top-1 -left-1 w-6 h-4 bg-white/25 rounded-full blur-[1px]" />
                        
                        {/* Interactive particles or paint drop bubbles before stirring */}
                        {mixPot.r > 0 && <span className="absolute top-1 left-3 w-3 h-3 rounded-full bg-red-600 border border-white/20" />}
                        {mixPot.y > 0 && <span className="absolute bottom-2 right-2 w-3.5 h-3.5 rounded-full bg-yellow-400 border border-white/20" />}
                        {mixPot.b > 0 && <span className="absolute bottom-1 left-3 w-3 h-3 rounded-full bg-blue-600 border border-white/20" />}
                        {mixPot.w > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-white border border-white/25" />}
                        {mixPot.k > 0 && <span className="absolute top-6 left-6 w-2.5 h-2.5 rounded-full bg-slate-900 border border-white/25" />}
                      </div>
                    </div>

                    {/* Active mixture count banner */}
                    <span className="absolute -bottom-1 -right-1 bg-amber-900 text-amber-100 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                      {mixPot.r + mixPot.y + mixPot.b + mixPot.w + mixPot.k}
                    </span>
                  </div>

                  {/* Cauldron controls (Zero text) */}
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      onClick={stirPot}
                      className="p-2 rounded-xl bg-white hover:bg-amber-50 text-amber-950 border border-amber-900/10 active:scale-75 cursor-pointer shadow-sm"
                      title="Stir Cauldron"
                    >
                      🥄
                    </button>
                    <button
                      type="button"
                      onClick={washMixPot}
                      className="p-2 rounded-xl bg-white hover:bg-rose-50 text-rose-600 border border-amber-900/10 active:scale-75 cursor-pointer shadow-sm"
                      title="Clean Cauldron"
                    >
                      🧼
                    </button>
                  </div>
                </div>

              </div>

              {/* SECTION C: CIRCULAR ACTION BUBBLES (Undo, Clear, Save) - SQUISH PHYSICS */}
              <div className="flex items-center gap-3 bg-black/10 p-2.5 rounded-2xl justify-around border border-amber-900/5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    synth.playSquish();
                    executeUndo();
                  }}
                  disabled={history.length === 0}
                  className={`w-14 h-14 rounded-full cursor-pointer flex items-center justify-center transform active:scale-[0.82] transition-all duration-150 border-2 shadow-md relative ${
                    history.length === 0
                      ? 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed opacity-55'
                      : 'bg-white hover:bg-yellow-50 border-amber-900 text-amber-950 hover:scale-105 active:-rotate-1'
                  }`}
                  title="Undo stroke"
                >
                  ↩️
                  {history.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[9px] font-black w-5.5 h-5.5 rounded-full flex items-center justify-center border border-white shadow animate-pulse">
                      {history.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    requestParentalAction(() => {
                      clearCanvas();
                    });
                  }}
                  className="w-14 h-14 rounded-full bg-white hover:bg-rose-50 border-2 border-amber-900 active:scale-[0.82] hover:scale-105 active:-rotate-2 transition-all flex items-center justify-center cursor-pointer shadow-md"
                  title="Clear canvas"
                >
                  🧹
                </button>

                <button
                  type="button"
                  onClick={() => {
                    requestParentalAction(downloadCanvas);
                  }}
                  className="w-14 h-14 rounded-full bg-amber-400 hover:bg-yellow-300 border-2 border-amber-900 active:scale-[0.82] hover:scale-105 active:rotate-3 transition-all flex items-center justify-center cursor-pointer shadow-lg"
                  title="Grown-Up Save/Print"
                >
                  📥
                </button>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* PARENTAL ARITHMETIC GATE CHALLENGE MODAL */}
      {parentGateOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] p-6 md:p-8 max-w-sm w-full border-[6px] border-amber-900 shadow-2xl relative text-center">
            
            {/* Playful alert icons */}
            <span className="text-5xl block mb-2 font-black select-none">🧐</span>
            
            <h3 className="text-xl font-black text-amber-950 mb-1">
              Grown-Up Area!
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-bold mb-5">
              Ask a parent or teacher to solve this puzzle to open this option! Double-tap your answer bubble.
            </p>

            {/* Arithmetic layout puzzle */}
            <div className="bg-amber-50 rounded-2xl py-4 px-6 border border-amber-950/10 mb-6 flex items-center justify-center gap-1.5">
              <span className="text-2xl font-black text-amber-900 tracking-wider">
                {parentGateQuestion.q}
              </span>
            </div>

            {/* Multiple Choice bubble picks */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {parentGateQuestion.options.map((val) => (
                <button
                  key={val}
                  onClick={() => handleParentGateAnswer(val)}
                  className="py-3 rounded-2xl bg-[#f7f5ee] hover:bg-amber-200 text-amber-950 font-black text-sm border-2 border-amber-950/10 shadow-sm transition-all duration-150 cursor-pointer active:scale-90 active:rotate-1"
                >
                  {val}
                </button>
              ))}
            </div>

            {/* Cancel trigger */}
            <button
              onClick={() => {
                synth.playSquish();
                setParentGateOpen(false);
              }}
              className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 text-xs font-black rounded-full active:scale-95 transition-all"
            >
              Cancel ↩️
            </button>
          </div>
        </div>
      )}

      {/* Cozy Playroom Footer */}
      <footer className="py-4 text-center border-t border-amber-900/5 mt-10 relative z-10 w-full mx-auto max-w-7xl">
        <p className="text-amber-900/40 text-[10px] uppercase tracking-widest font-bold">
          Coloring Canvas &bull; Premium Playroom &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
