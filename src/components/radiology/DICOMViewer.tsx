import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Move, 
  Contrast, 
  Ruler,
  Download,
  Maximize,
  Info,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Grid3X3,
  Square,
  Circle as CircleIcon,
  ArrowRight,
  Type,
  Crosshair,
  MousePointer,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Layers,
  Sun,
  Moon,
  Settings,
  Save,
  Share2,
  Printer,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Undo2,
  Redo2,
  Palette,
  ImageIcon,
  Sliders
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface DICOMViewerProps {
  imageData: any;
  patientInfo: any;
  studyInfo: any;
  onClose: () => void;
  language: 'en' | 'ar';
}

const translations = {
  en: {
    viewer: 'DICOM Image Viewer',
    tools: 'Tools',
    info: 'Image Info',
    measurements: 'Measurements',
    annotations: 'Annotations',
    presets: 'Window Presets',
    layout: 'Layout',
    zoom: 'Zoom',
    contrast: 'Contrast',
    brightness: 'Brightness',
    windowWidth: 'Window Width',
    windowLevel: 'Window Level',
    reset: 'Reset',
    fullscreen: 'Fullscreen',
    download: 'Download',
    measure: 'Measure',
    annotate: 'Annotate',
    pan: 'Pan',
    pointer: 'Pointer',
    distance: 'Distance',
    angle: 'Angle',
    area: 'Area',
    rectangle: 'Rectangle',
    circle: 'Circle',
    arrow: 'Arrow',
    text: 'Text',
    crosshair: 'Crosshair',
    magnify: 'Magnify',
    rotate: 'Rotate',
    flip: 'Flip',
    invert: 'Invert',
    patientInfo: 'Patient Information',
    studyInfo: 'Study Information',
    imageInfo: 'Image Information',
    seriesInfo: 'Series Information',
    sliceNumber: 'Slice Number',
    totalSlices: 'Total Slices',
    playAnimation: 'Play Animation',
    pauseAnimation: 'Pause Animation',
    nextSlice: 'Next Slice',
    previousSlice: 'Previous Slice',
    animationSpeed: 'Animation Speed',
    windowPresets: 'Window Presets',
    lungWindow: 'Lung Window',
    boneWindow: 'Bone Window',
    brainWindow: 'Brain Window',
    softTissueWindow: 'Soft Tissue Window',
    liverWindow: 'Liver Window',
    customWindow: 'Custom Window',
    singleView: 'Single View',
    quadView: 'Quad View',
    compareView: 'Compare View',
    stackView: 'Stack View',
    overlays: 'Overlays',
    showInfo: 'Show Info',
    showMeasurements: 'Show Measurements',
    showAnnotations: 'Show Annotations',
    showGrid: 'Show Grid',
    showCrosshairs: 'Show Crosshairs',
    colormap: 'Color Map',
    grayscale: 'Grayscale',
    hotmetal: 'Hot Metal',
    rainbow: 'Rainbow',
    jet: 'Jet',
    cool: 'Cool',
    warm: 'Warm'
  },
  ar: {
    viewer: 'عارض صور DICOM',
    tools: 'الأدوات',
    info: 'معلومات الصورة',
    measurements: 'القياسات',
    annotations: 'التعليقات',
    presets: 'إعدادات النوافذ',
    layout: 'التخطيط',
    zoom: 'التكبير',
    contrast: 'التباين',
    brightness: 'السطوع',
    windowWidth: 'عرض النافذة',
    windowLevel: 'مستوى النافذة',
    reset: 'إعادة تعيين',
    fullscreen: 'ملء الشاشة',
    download: 'تحميل',
    measure: 'قياس',
    annotate: 'تعليق',
    pan: 'تحريك',
    pointer: 'مؤشر',
    distance: 'مسافة',
    angle: 'زاوية',
    area: 'مساحة',
    rectangle: 'مستطيل',
    circle: 'دائرة',
    arrow: 'سهم',
    text: 'نص',
    crosshair: 'خطوط التقاطع',
    magnify: 'تكبير',
    rotate: 'دوران',
    flip: 'قلب',
    invert: 'عكس',
    patientInfo: 'معلومات المريض',
    studyInfo: 'معلومات الدراسة',
    imageInfo: 'معلومات الصورة',
    seriesInfo: 'معلومات السلسلة',
    sliceNumber: 'رقم الشريحة',
    totalSlices: 'إجمالي الشرائح',
    playAnimation: 'تشغيل الرسوم المتحركة',
    pauseAnimation: 'إيقاف الرسوم المتحركة',
    nextSlice: 'الشريحة التالية',
    previousSlice: 'الشريحة السابقة',
    animationSpeed: 'سرعة الرسوم المتحركة',
    windowPresets: 'إعدادات النافذة المسبقة',
    lungWindow: 'نافذة الرئة',
    boneWindow: 'نافذة العظام',
    brainWindow: 'نافذة الدماغ',
    softTissueWindow: 'نافذة الأنسجة الرخوة',
    liverWindow: 'نافذة الكبد',
    customWindow: 'نافذة مخصصة',
    singleView: 'عرض واحد',
    quadView: 'عرض رباعي',
    compareView: 'عرض المقارنة',
    stackView: 'عرض المكدس',
    overlays: 'الطبقات العلوية',
    showInfo: 'إظهار المعلومات',
    showMeasurements: 'إظهار القياسات',
    showAnnotations: 'إظهار التعليقات',
    showGrid: 'إظهار الشبكة',
    showCrosshairs: 'إظهار خطوط التقاطع',
    colormap: 'خريطة الألوان',
    grayscale: 'رمادي',
    hotmetal: 'معدن ساخن',
    rainbow: 'قوس قزح',
    jet: 'نفاث',
    cool: 'بارد',
    warm: 'دافئ'
  }
};

// Mock DICOM data for demonstration
const mockDICOMSeries = [
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBmaWxsPSIjMTExIi8+CjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMTAwIiBmaWxsPSIjMzMzIiBzdHJva2U9IiM2NjYiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIyMDAiIHI9IjMwIiBmaWxsPSIjNTU1Ii8+CjxjaXJjbGUgY3g9IjMxMiIgY3k9IjMxMiIgcj0iMjAiIGZpbGw9IiM3NzciLz4KPHN2Zz4K',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBmaWxsPSIjMTExIi8+CjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMTA1IiBmaWxsPSIjMzMzIiBzdHJva2U9IiM2NjYiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIyMDUiIGN5PSIyMDUiIHI9IjMyIiBmaWxsPSIjNTU1Ii8+CjxjaXJjbGUgY3g9IjMxNSIgY3k9IjMxNSIgcj0iMjIiIGZpbGw9IiM3NzciLz4KPHN2Zz4K',
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBmaWxsPSIjMTExIi8+CjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMTEwIiBmaWxsPSIjMzMzIiBzdHJva2U9IiM2NjYiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIyMTAiIGN5PSIyMTAiIHI9IjM0IiBmaWxsPSIjNTU1Ii8+CjxjaXJjbGUgY3g9IjMxOCIgY3k9IjMxOCIgcj0iMjQiIGZpbGw9IiM3NzciLz4KPHN2Zz4K'
];

export default function DICOMViewer({ imageData, patientInfo, studyInfo, onClose, language }: DICOMViewerProps) {
  const [currentSlice, setCurrentSlice] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [contrast, setContrast] = useState(50);
  const [brightness, setBrightness] = useState(50);
  const [windowWidth, setWindowWidth] = useState(400);
  const [windowLevel, setWindowLevel] = useState(40);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(200);
  const [tool, setTool] = useState('pan');
  const [measurements, setMeasurements] = useState([]);
  const [annotations, setAnnotations] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [invert, setInvert] = useState(false);
  const [layout, setLayout] = useState('single'); // single, quad, compare, stack
  const [colormap, setColormap] = useState('grayscale');
  const [showOverlays, setShowOverlays] = useState({
    info: true,
    measurements: true,
    annotations: true,
    grid: false,
    crosshairs: false
  });
  const [windowPreset, setWindowPreset] = useState('custom');
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  const t = translations[language];

  useEffect(() => {
    if (isPlaying) {
      animationRef.current = setInterval(() => {
        setCurrentSlice(prev => (prev + 1) % mockDICOMSeries.length);
      }, animationSpeed);
    } else {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [isPlaying, animationSpeed]);

  // Window preset configurations
  const windowPresets = {
    lung: { width: 1500, level: -600 },
    bone: { width: 2000, level: 300 },
    brain: { width: 80, level: 40 },
    softTissue: { width: 400, level: 50 },
    liver: { width: 150, level: 90 },
    custom: { width: windowWidth, level: windowLevel }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 800));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  
  const handleReset = () => {
    setZoom(100);
    setContrast(50);
    setBrightness(50);
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setInvert(false);
    setPanOffset({ x: 0, y: 0 });
    setWindowWidth(400);
    setWindowLevel(40);
    setWindowPreset('custom');
  };

  const applyWindowPreset = (preset: string) => {
    if (windowPresets[preset]) {
      setWindowWidth(windowPresets[preset].width);
      setWindowLevel(windowPresets[preset].level);
      setWindowPreset(preset);
    }
  };

  const handleRotateLeft = () => setRotation(prev => (prev - 90) % 360);
  const handleRotateRight = () => setRotation(prev => (prev + 90) % 360);
  const handleFlipH = () => setFlipHorizontal(prev => !prev);
  const handleFlipV = () => setFlipVertical(prev => !prev);
  const handleInvert = () => setInvert(prev => !prev);

  const handleNextSlice = () => {
    setCurrentSlice(prev => (prev + 1) % mockDICOMSeries.length);
  };

  const handlePreviousSlice = () => {
    setCurrentSlice(prev => (prev - 1 + mockDICOMSeries.length) % mockDICOMSeries.length);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (viewerRef.current?.requestFullscreen) {
        viewerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const getImageTransform = () => {
    let transform = `scale(${zoom / 100}) translate(${panOffset.x}px, ${panOffset.y}px) rotate(${rotation}deg)`;
    if (flipHorizontal) transform += ' scaleX(-1)';
    if (flipVertical) transform += ' scaleY(-1)';
    return transform;
  };

  const getImageFilter = () => {
    let filter = `contrast(${contrast}%) brightness(${brightness}%)`;
    if (invert) filter += ' invert(1)';
    
    // Apply color maps
    switch (colormap) {
      case 'hotmetal':
        filter += ' sepia(1) saturate(2) hue-rotate(320deg)';
        break;
      case 'rainbow':
        filter += ' saturate(2) hue-rotate(180deg)';
        break;
      case 'jet':
        filter += ' saturate(1.5) hue-rotate(240deg)';
        break;
      case 'cool':
        filter += ' sepia(0.5) saturate(1.2) hue-rotate(180deg)';
        break;
      case 'warm':
        filter += ' sepia(0.8) saturate(1.5) hue-rotate(15deg)';
        break;
      default:
        break;
    }
    
    return filter;
  };

  return (
    <div 
      ref={viewerRef}
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50"
    >
      <div className="w-full h-full max-w-full mx-auto p-2 flex gap-2">
        {/* Main Viewer */}
        <div className="flex-1 bg-black rounded-lg overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gray-900 p-3 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white text-lg font-semibold">{t.viewer}</h2>
                <p className="text-gray-400 text-sm">
                  {patientInfo?.name} - {studyInfo?.studyDescription}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Layout Controls */}
                <div className="flex items-center border border-gray-600 rounded">
                  <Button
                    size="sm"
                    variant={layout === 'single' ? 'default' : 'ghost'}
                    onClick={() => setLayout('single')}
                    className="rounded-none border-0 text-white"
                  >
                    <Square className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={layout === 'quad' ? 'default' : 'ghost'}
                    onClick={() => setLayout('quad')}
                    className="rounded-none border-0 text-white"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={layout === 'compare' ? 'default' : 'ghost'}
                    onClick={() => setLayout('compare')}
                    className="rounded-none border-0 text-white"
                  >
                    <Layers className="w-4 h-4" />
                  </Button>
                </div>
                
                <Badge variant="outline" className="text-white border-gray-600">
                  {t.sliceNumber}: {currentSlice + 1} / {mockDICOMSeries.length}
                </Badge>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleFullscreen}
                  className="text-white border-gray-600"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
                
                <Button variant="outline" size="sm" onClick={onClose} className="text-white border-gray-600">
                  ✕
                </Button>
              </div>
            </div>
          </div>

          {/* Image Display Area */}
          <div className="flex-1 relative bg-black overflow-hidden">
            {layout === 'single' && (
              <div className="w-full h-full flex items-center justify-center relative">
                <img
                  src={mockDICOMSeries[currentSlice]}
                  alt={`DICOM Slice ${currentSlice + 1}`}
                  className="max-w-full max-h-full object-contain transition-all duration-200 cursor-crosshair"
                  style={{
                    transform: getImageTransform(),
                    filter: getImageFilter()
                  }}
                />
                
                {/* Crosshairs */}
                {showOverlays.crosshairs && (
                  <>
                    <div className="absolute top-0 left-1/2 w-px h-full bg-red-500 opacity-50 pointer-events-none" />
                    <div className="absolute top-1/2 left-0 w-full h-px bg-red-500 opacity-50 pointer-events-none" />
                  </>
                )}
                
                {/* Grid */}
                {showOverlays.grid && (
                  <div className="absolute inset-0 pointer-events-none">
                    <svg width="100%" height="100%" className="opacity-30">
                      <defs>
                        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#666" strokeWidth="1"/>
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>
                )}
              </div>
            )}
            
            {layout === 'quad' && (
              <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="bg-black flex items-center justify-center relative border border-gray-700">
                    <img
                      src={mockDICOMSeries[Math.min(index, mockDICOMSeries.length - 1)]}
                      alt={`DICOM Slice ${index + 1}`}
                      className="max-w-full max-h-full object-contain"
                      style={{
                        transform: `scale(${zoom / 200})`, // Smaller zoom for quad view
                        filter: getImageFilter()
                      }}
                    />
                    <div className="absolute top-2 left-2 text-white text-xs">
                      Slice {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {layout === 'compare' && (
              <div className="w-full h-full flex gap-1">
                <div className="flex-1 bg-black flex items-center justify-center relative">
                  <img
                    src={mockDICOMSeries[currentSlice]}
                    alt={`Current Slice`}
                    className="max-w-full max-h-full object-contain"
                    style={{
                      transform: getImageTransform(),
                      filter: getImageFilter()
                    }}
                  />
                  <div className="absolute top-2 left-2 text-white text-sm">
                    Current: {currentSlice + 1}
                  </div>
                </div>
                <div className="flex-1 bg-black flex items-center justify-center relative border-l border-gray-700">
                  <img
                    src={mockDICOMSeries[Math.max(0, currentSlice - 1)]}
                    alt={`Previous Slice`}
                    className="max-w-full max-h-full object-contain"
                    style={{
                      transform: getImageTransform(),
                      filter: getImageFilter()
                    }}
                  />
                  <div className="absolute top-2 left-2 text-white text-sm">
                    Previous: {Math.max(1, currentSlice)}
                  </div>
                </div>
              </div>
            )}
            
            {/* Overlay Information */}
            {showOverlays.info && (
              <>
                <div className="absolute top-4 left-4 text-white text-sm space-y-1 bg-black bg-opacity-50 p-2 rounded">
                  <div>Patient: {patientInfo?.name || 'Test Patient'}</div>
                  <div>Study Date: {studyInfo?.studyDate || '2024-01-20'}</div>
                  <div>Modality: {studyInfo?.modality || 'CT'}</div>
                  <div>Series: {studyInfo?.seriesNumber || '1'}</div>
                </div>

                <div className="absolute top-4 right-4 text-white text-sm space-y-1 text-right bg-black bg-opacity-50 p-2 rounded">
                  <div>WW: {windowWidth}</div>
                  <div>WL: {windowLevel}</div>
                  <div>Zoom: {zoom}%</div>
                  <div>Slice: {currentSlice + 1}/{mockDICOMSeries.length}</div>
                  {rotation !== 0 && <div>Rotation: {rotation}°</div>}
                </div>
              </>
            )}
            
            {/* Measurements Overlay */}
            {showOverlays.measurements && measurements.length > 0 && (
              <div className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 p-2 rounded">
                <div className="font-semibold mb-1">Measurements:</div>
                {measurements.map((measurement, index) => (
                  <div key={index}>Measurement {index + 1}: {measurement}</div>
                ))}
              </div>
            )}
            
            {/* Annotations Overlay */}
            {showOverlays.annotations && annotations.length > 0 && (
              <div className="absolute bottom-4 right-4 text-white text-sm bg-black bg-opacity-50 p-2 rounded">
                <div className="font-semibold mb-1">Annotations:</div>
                {annotations.map((annotation, index) => (
                  <div key={index}>{annotation}</div>
                ))}
              </div>
            )}
          </div>

          {/* Animation Controls */}
          <div className="bg-gray-900 p-3 border-t border-gray-700 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousSlice}
                  className="text-white border-gray-600"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlayback}
                  className="text-white border-gray-600"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextSlice}
                  className="text-white border-gray-600"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white text-sm">{t.animationSpeed}:</span>
                <Slider
                  value={[animationSpeed]}
                  onValueChange={(value) => setAnimationSpeed(value[0])}
                  min={50}
                  max={1000}
                  step={50}
                  className="w-24"
                />
                <span className="text-white text-sm w-12">{animationSpeed}ms</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-gray-600"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-white border-gray-600"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Slice Navigation Bar */}
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="text-white text-xs">Slice:</span>
                <Slider
                  value={[currentSlice]}
                  onValueChange={(value) => setCurrentSlice(value[0])}
                  min={0}
                  max={mockDICOMSeries.length - 1}
                  step={1}
                  className="flex-1"
                />
                <span className="text-white text-xs w-16">
                  {currentSlice + 1}/{mockDICOMSeries.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-96 bg-white rounded-lg overflow-hidden flex flex-col">
          <Tabs defaultValue="tools" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-5 shrink-0">
              <TabsTrigger value="tools">{t.tools}</TabsTrigger>
              <TabsTrigger value="presets">{t.presets}</TabsTrigger>
              <TabsTrigger value="layout">{t.layout}</TabsTrigger>
              <TabsTrigger value="info">{t.info}</TabsTrigger>
              <TabsTrigger value="measurements">{t.measurements}</TabsTrigger>
            </TabsList>

            <TabsContent value="tools" className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Tool Selection */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Navigation Tools</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={tool === 'pan' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('pan')}
                  >
                    <Move className="w-4 h-4 mr-2" />
                    {t.pan}
                  </Button>
                  <Button
                    variant={tool === 'pointer' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('pointer')}
                  >
                    <MousePointer className="w-4 h-4 mr-2" />
                    {t.pointer}
                  </Button>
                  <Button
                    variant={tool === 'zoom' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('zoom')}
                  >
                    <ZoomIn className="w-4 h-4 mr-2" />
                    {t.zoom}
                  </Button>
                  <Button
                    variant={tool === 'crosshair' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('crosshair')}
                  >
                    <Crosshair className="w-4 h-4 mr-2" />
                    {t.crosshair}
                  </Button>
                </div>
              </div>

              {/* Measurement Tools */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Measurement Tools</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={tool === 'distance' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('distance')}
                  >
                    <Ruler className="w-4 h-4 mr-2" />
                    {t.distance}
                  </Button>
                  <Button
                    variant={tool === 'angle' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('angle')}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {t.angle}
                  </Button>
                  <Button
                    variant={tool === 'rectangle' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('rectangle')}
                  >
                    <Square className="w-4 h-4 mr-2" />
                    {t.rectangle}
                  </Button>
                  <Button
                    variant={tool === 'circle' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('circle')}
                  >
                    <CircleIcon className="w-4 h-4 mr-2" />
                    {t.circle}
                  </Button>
                </div>
              </div>

              {/* Annotation Tools */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Annotation Tools</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={tool === 'arrow' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('arrow')}
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {t.arrow}
                  </Button>
                  <Button
                    variant={tool === 'text' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTool('text')}
                  >
                    <Type className="w-4 h-4 mr-2" />
                    {t.text}
                  </Button>
                </div>
              </div>

              {/* Transform Controls */}
              <div className="space-y-4">
                <h3 className="font-semibold text-sm">Image Transforms</h3>
                
                {/* Zoom Controls */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.zoom}</label>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={handleZoomOut}>
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                    <Slider
                      value={[zoom]}
                      onValueChange={(value) => setZoom(value[0])}
                      min={25}
                      max={800}
                      step={25}
                      className="flex-1"
                    />
                    <Button size="sm" variant="outline" onClick={handleZoomIn}>
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-center text-sm text-gray-600">{zoom}%</div>
                </div>

                {/* Rotation and Flip Controls */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rotation & Flip</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" onClick={handleRotateLeft}>
                      <RotateCcw className="w-4 h-4 mr-1" />
                      90° L
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleRotateRight}>
                      <RotateCw className="w-4 h-4 mr-1" />
                      90° R
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleFlipH}>
                      <FlipHorizontal className="w-4 h-4 mr-1" />
                      Flip H
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleFlipV}>
                      <FlipVertical className="w-4 h-4 mr-1" />
                      Flip V
                    </Button>
                  </div>
                </div>

                {/* Color Controls */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color & Inversion</label>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant={invert ? 'default' : 'outline'}
                      onClick={handleInvert}
                      className="flex-1"
                    >
                      <Palette className="w-4 h-4 mr-1" />
                      {t.invert}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Window/Level Controls */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.windowWidth}</label>
                  <Slider
                    value={[windowWidth]}
                    onValueChange={(value) => setWindowWidth(value[0])}
                    min={1}
                    max={1000}
                    step={1}
                  />
                  <div className="text-center text-sm text-gray-600">{windowWidth}</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.windowLevel}</label>
                  <Slider
                    value={[windowLevel]}
                    onValueChange={(value) => setWindowLevel(value[0])}
                    min={-500}
                    max={500}
                    step={1}
                  />
                  <div className="text-center text-sm text-gray-600">{windowLevel}</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.contrast}</label>
                  <Slider
                    value={[contrast]}
                    onValueChange={(value) => setContrast(value[0])}
                    min={0}
                    max={200}
                    step={5}
                  />
                  <div className="text-center text-sm text-gray-600">{contrast}%</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.brightness}</label>
                  <Slider
                    value={[brightness]}
                    onValueChange={(value) => setBrightness(value[0])}
                    min={0}
                    max={200}
                    step={5}
                  />
                  <div className="text-center text-sm text-gray-600">{brightness}%</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <Undo2 className="w-4 h-4 mr-1" />
                    {t.reset}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Printer className="w-4 h-4 mr-1" />
                    Print
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Window Presets Tab */}
            <TabsContent value="presets" className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">{t.windowPresets}</h3>
                <div className="grid gap-2">
                  {Object.keys(windowPresets).map((preset) => (
                    <Button
                      key={preset}
                      variant={windowPreset === preset ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => applyWindowPreset(preset)}
                      className="justify-start"
                    >
                      {t[preset + 'Window'] || preset}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Manual Window/Level Controls */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.windowWidth}</label>
                  <Slider
                    value={[windowWidth]}
                    onValueChange={(value) => {
                      setWindowWidth(value[0]);
                      setWindowPreset('custom');
                    }}
                    min={1}
                    max={2000}
                    step={10}
                  />
                  <div className="text-center text-sm text-gray-600">{windowWidth}</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.windowLevel}</label>
                  <Slider
                    value={[windowLevel]}
                    onValueChange={(value) => {
                      setWindowLevel(value[0]);
                      setWindowPreset('custom');
                    }}
                    min={-1000}
                    max={1000}
                    step={10}
                  />
                  <div className="text-center text-sm text-gray-600">{windowLevel}</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.contrast}</label>
                  <Slider
                    value={[contrast]}
                    onValueChange={(value) => setContrast(value[0])}
                    min={0}
                    max={200}
                    step={5}
                  />
                  <div className="text-center text-sm text-gray-600">{contrast}%</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.brightness}</label>
                  <Slider
                    value={[brightness]}
                    onValueChange={(value) => setBrightness(value[0])}
                    min={0}
                    max={200}
                    step={5}
                  />
                  <div className="text-center text-sm text-gray-600">{brightness}%</div>
                </div>
              </div>

              {/* Color Maps */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.colormap}</label>
                <select 
                  value={colormap} 
                  onChange={(e) => setColormap(e.target.value)}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value="grayscale">{t.grayscale}</option>
                  <option value="hotmetal">{t.hotmetal}</option>
                  <option value="rainbow">{t.rainbow}</option>
                  <option value="jet">{t.jet}</option>
                  <option value="cool">{t.cool}</option>
                  <option value="warm">{t.warm}</option>
                </select>
              </div>
            </TabsContent>

            {/* Layout Tab */}
            <TabsContent value="layout" className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">View Layout</h3>
                <div className="grid gap-2">
                  <Button
                    variant={layout === 'single' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLayout('single')}
                    className="justify-start"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    {t.singleView}
                  </Button>
                  <Button
                    variant={layout === 'quad' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLayout('quad')}
                    className="justify-start"
                  >
                    <Grid3X3 className="w-4 h-4 mr-2" />
                    {t.quadView}
                  </Button>
                  <Button
                    variant={layout === 'compare' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLayout('compare')}
                    className="justify-start"
                  >
                    <Layers className="w-4 h-4 mr-2" />
                    {t.compareView}
                  </Button>
                </div>
              </div>

              {/* Overlay Controls */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">{t.overlays}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm">{t.showInfo}</label>
                    <input
                      type="checkbox"
                      checked={showOverlays.info}
                      onChange={(e) => setShowOverlays(prev => ({...prev, info: e.target.checked}))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">{t.showMeasurements}</label>
                    <input
                      type="checkbox"
                      checked={showOverlays.measurements}
                      onChange={(e) => setShowOverlays(prev => ({...prev, measurements: e.target.checked}))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">{t.showAnnotations}</label>
                    <input
                      type="checkbox"
                      checked={showOverlays.annotations}
                      onChange={(e) => setShowOverlays(prev => ({...prev, annotations: e.target.checked}))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">{t.showGrid}</label>
                    <input
                      type="checkbox"
                      checked={showOverlays.grid}
                      onChange={(e) => setShowOverlays(prev => ({...prev, grid: e.target.checked}))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm">{t.showCrosshairs}</label>
                    <input
                      type="checkbox"
                      checked={showOverlays.crosshairs}
                      onChange={(e) => setShowOverlays(prev => ({...prev, crosshairs: e.target.checked}))}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="info" className="p-4 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{t.patientInfo}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <div>Name: {patientInfo?.name}</div>
                  <div>ID: {patientInfo?.id}</div>
                  <div>DOB: {patientInfo?.dateOfBirth}</div>
                  <div>Gender: {patientInfo?.gender}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{t.studyInfo}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <div>Study Date: {studyInfo?.studyDate}</div>
                  <div>Modality: {studyInfo?.modality}</div>
                  <div>Study Description: {studyInfo?.studyDescription}</div>
                  <div>Series Number: {studyInfo?.seriesNumber}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{t.imageInfo}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <div>Matrix: 512 x 512</div>
                  <div>Slice Thickness: 1.0 mm</div>
                  <div>Pixel Spacing: 0.5 x 0.5 mm</div>
                  <div>Image Position: [-125.0, -125.0, {currentSlice * 1.0}]</div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="measurements" className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="text-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{t.measurements}</h3>
                  <Button size="sm" variant="outline">
                    <Ruler className="w-4 h-4 mr-1" />
                    New
                  </Button>
                </div>
                {measurements.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">
                    No measurements yet
                    <br />
                    <span className="text-xs">Select a measurement tool to begin</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {measurements.map((measurement, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">Measurement {index + 1}</span>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-sm text-gray-600">{measurement}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{t.annotations}</h3>
                  <Button size="sm" variant="outline">
                    <Type className="w-4 h-4 mr-1" />
                    New
                  </Button>
                </div>
                {annotations.length === 0 ? (
                  <div className="text-gray-500 text-center py-4">
                    No annotations yet
                    <br />
                    <span className="text-xs">Select annotation tool to add notes</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {annotations.map((annotation, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-blue-50">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">Note {index + 1}</span>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="text-sm text-gray-600">{annotation}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <Button size="sm" variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Measurements & Annotations
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}