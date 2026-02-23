import React, { useState, useEffect } from 'react';
import {
  Brain,
  Stethoscope,
  Search,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Image,
  Activity,
  Target,
  Zap,
  Bot,
  MessageSquare,
  Camera,
  Mic,
  Upload,
  Download,
  Star,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Heart,
  Lungs,
  Bone,
  Pill,
  FlaskConical,
  ScanLine,
  BarChart3,
  PieChart,
  LineChart,
  TrendingDown,
  Users,
  Calendar,
  Shield,
  Lock,
  Database,
  Cloud,
  Wifi,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  Settings,
  HelpCircle,
  BookOpen,
  Lightbulb,
  Sparkles,
  ChevronRight,
  ChevronDown,
  X,
  Plus,
  Minus,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { useLanguage } from '../../services/LanguageService';
import { motion, AnimatePresence } from 'motion/react';

interface DiagnosticResult {
  condition: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendations: string[];
  additionalTests: string[];
  riskFactors: string[];
}

interface SymptomData {
  symptom: string;
  severity: number;
  duration: string;
  frequency: string;
}

const aiCapabilities = [
  {
    id: 'diagnostic',
    name: 'Diagnostic Analysis',
    nameKey: 'ai.capabilities.diagnostic.name',
    description: 'AI-powered symptom analysis and differential diagnosis',
    descKey: 'ai.capabilities.diagnostic.desc',
    icon: Search,
    color: 'from-blue-500 to-cyan-500',
    accuracy: 94,
    features: [
      'Multi-modal symptom analysis',
      'Differential diagnosis ranking',
      'Evidence-based recommendations',
      'Risk stratification'
    ]
  },
  {
    id: 'imaging',
    name: 'Medical Imaging AI',
    nameKey: 'ai.capabilities.imaging.name',
    description: 'Advanced image analysis for radiology and pathology',
    descKey: 'ai.capabilities.imaging.desc',
    icon: Image,
    color: 'from-green-500 to-emerald-500',
    accuracy: 96,
    features: [
      'X-ray abnormality detection',
      'CT/MRI analysis',
      'Pathology slide review',
      'Real-time annotations'
    ]
  },
  {
    id: 'predictive',
    name: 'Predictive Analytics',
    nameKey: 'ai.capabilities.predictive.name',
    description: 'Early warning systems and outcome prediction',
    descKey: 'ai.capabilities.predictive.desc',
    icon: TrendingUp,
    color: 'from-purple-500 to-violet-500',
    accuracy: 91,
    features: [
      'Sepsis prediction',
      'Readmission risk',
      'Deterioration alerts',
      'Length of stay estimation'
    ]
  },
  {
    id: 'drug',
    name: 'Drug Interaction Analysis',
    nameKey: 'ai.capabilities.drug.name',
    description: 'Medication safety and interaction detection',
    descKey: 'ai.capabilities.drug.desc',
    icon: Pill,
    color: 'from-red-500 to-pink-500',
    accuracy: 98,
    features: [
      'Drug-drug interactions',
      'Allergy checking',
      'Dosage optimization',
      'Side effect prediction'
    ]
  }
];

const sampleDiagnosticResults: DiagnosticResult[] = [
  {
    condition: 'Acute Myocardial Infarction (STEMI)',
    confidence: 89,
    severity: 'critical',
    description: 'High probability of ST-elevation myocardial infarction based on symptom profile and risk factors.',
    recommendations: [
      'Immediate ECG and troponin levels',
      'Urgent cardiology consultation',
      'Consider thrombolytic therapy',
      'Continuous cardiac monitoring'
    ],
    additionalTests: ['Echocardiogram', 'Chest X-ray', 'Complete metabolic panel'],
    riskFactors: ['Age > 65', 'Male gender', 'Hypertension', 'Smoking history']
  },
  {
    condition: 'Pneumonia (Community-acquired)',
    confidence: 76,
    severity: 'medium',
    description: 'Moderate probability of community-acquired pneumonia based on respiratory symptoms.',
    recommendations: [
      'Chest X-ray for confirmation',
      'Blood cultures if severe',
      'Consider antibiotic therapy',
      'Monitor oxygen saturation'
    ],
    additionalTests: ['Complete blood count', 'Procalcitonin', 'Sputum culture'],
    riskFactors: ['Age', 'Chronic conditions', 'Recent viral illness']
  },
  {
    condition: 'Viral Upper Respiratory Infection',
    confidence: 62,
    severity: 'low',
    description: 'Possible viral upper respiratory tract infection with supportive care indicated.',
    recommendations: [
      'Symptomatic treatment',
      'Adequate rest and hydration',
      'Return if symptoms worsen',
      'No antibiotics needed'
    ],
    additionalTests: ['Consider rapid strep test if indicated'],
    riskFactors: ['Seasonal factors', 'Close contacts with illness']
  }
];

interface AIAssistantDiagnosticsProps {
  patientId?: string;
  onClose?: () => void;
}

export default function AIAssistantDiagnostics({ patientId, onClose }: AIAssistantDiagnosticsProps) {
  const [activeTab, setActiveTab] = useState('diagnostic');
  const [symptoms, setSymptoms] = useState<SymptomData[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [diagnosticResults, setDiagnosticResults] = useState<DiagnosticResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedResult, setSelectedResult] = useState<DiagnosticResult | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [voiceInput, setVoiceInput] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai', content: string, timestamp: Date}>>([]);
  const [chatInput, setChatInput] = useState('');
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    // Initialize with sample data for demonstration
    setDiagnosticResults(sampleDiagnosticResults);
  }, []);

  const addSymptom = () => {
    if (currentSymptom.trim()) {
      setSymptoms([...symptoms, {
        symptom: currentSymptom,
        severity: 5,
        duration: '1-2 days',
        frequency: 'constant'
      }]);
      setCurrentSymptom('');
    }
  };

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const runDiagnosticAnalysis = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      // In real implementation, this would call the AI API
    }, 3000);
  };

  const sendChatMessage = () => {
    if (chatInput.trim()) {
      const userMessage = {
        type: 'user' as const,
        content: chatInput,
        timestamp: new Date()
      };
      setChatMessages([...chatMessages, userMessage]);
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = {
          type: 'ai' as const,
          content: `Based on the symptoms you've described, I would recommend further evaluation. The combination of chest pain and shortness of breath warrants immediate attention. Would you like me to analyze any specific test results or vital signs?`,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiResponse]);
      }, 1000);
      
      setChatInput('');
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Diagnostic Assistant
              </h1>
              <p className="text-muted-foreground">
                Advanced AI-powered medical diagnosis and analysis
              </p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* AI Capabilities Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {aiCapabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <Card key={capability.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${capability.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg">{t(capability.nameKey)}</CardTitle>
                  <CardDescription className="text-sm">{t(capability.descKey)}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Accuracy</span>
                    <span className="text-sm font-bold text-green-600">{capability.accuracy}%</span>
                  </div>
                  <Progress value={capability.accuracy} className="h-2 mb-3" />
                  <div className="space-y-1">
                    {capability.features.slice(0, 2).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="w-3 h-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="diagnostic" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Diagnostic Analysis
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              AI Chat
            </TabsTrigger>
            <TabsTrigger value="imaging" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Image Analysis
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              AI Reports
            </TabsTrigger>
          </TabsList>

          {/* Diagnostic Analysis Tab */}
          <TabsContent value="diagnostic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Symptom Input */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Stethoscope className="w-5 h-5" />
                      Symptom Input
                    </CardTitle>
                    <CardDescription>
                      Enter patient symptoms for AI analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter symptom..."
                        value={currentSymptom}
                        onChange={(e) => setCurrentSymptom(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
                      />
                      <Button onClick={addSymptom} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant={voiceInput ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setVoiceInput(!voiceInput)}
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        Voice Input
                      </Button>
                      <Button variant="outline" size="sm">
                        <Camera className="w-4 h-4 mr-2" />
                        Image
                      </Button>
                    </div>

                    {/* Current Symptoms */}
                    <div className="space-y-2">
                      {symptoms.map((symptom, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{symptom.symptom}</p>
                            <p className="text-xs text-muted-foreground">
                              Severity: {symptom.severity}/10 | Duration: {symptom.duration}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSymptom(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Analysis Settings */}
                    <div className="space-y-3 pt-4 border-t">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Confidence Threshold: {confidenceThreshold}%
                        </label>
                        <Slider
                          value={[confidenceThreshold]}
                          onValueChange={([value]) => setConfidenceThreshold(value)}
                          max={100}
                          min={50}
                          step={5}
                        />
                      </div>
                      <Button 
                        onClick={runDiagnosticAnalysis}
                        disabled={symptoms.length === 0 || isAnalyzing}
                        className="w-full"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Brain className="w-4 h-4 mr-2" />
                            Run AI Analysis
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Diagnostic Results */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Diagnostic Results
                    </CardTitle>
                    <CardDescription>
                      AI-powered differential diagnosis with confidence scores
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {diagnosticResults.length > 0 ? (
                      <div className="space-y-4">
                        {diagnosticResults
                          .filter(result => result.confidence >= confidenceThreshold)
                          .map((result, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedResult === result 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50' 
                                : `border-gray-200 hover:border-gray-300 ${getSeverityColor(result.severity)}`
                            }`}
                            onClick={() => setSelectedResult(selectedResult === result ? null : result)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{result.condition}</h4>
                              <div className="flex items-center gap-2">
                                <Badge variant={result.severity === 'critical' ? 'destructive' : 'secondary'}>
                                  {result.severity.toUpperCase()}
                                </Badge>
                                <div className="flex items-center gap-1">
                                  <span className="text-sm font-medium">{result.confidence}%</span>
                                  <div className={`w-3 h-3 rounded-full ${
                                    result.confidence >= 80 ? 'bg-green-500' :
                                    result.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`} />
                                </div>
                              </div>
                            </div>
                            
                            <Progress value={result.confidence} className="mb-3" />
                            
                            <p className="text-sm text-muted-foreground mb-3">
                              {result.description}
                            </p>

                            <AnimatePresence>
                              {selectedResult === result && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="space-y-4 pt-4 border-t"
                                >
                                  <div>
                                    <h5 className="font-medium mb-2 flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      Recommendations
                                    </h5>
                                    <ul className="space-y-1">
                                      {result.recommendations.map((rec, idx) => (
                                        <li key={idx} className="text-sm flex items-start gap-2">
                                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                          {rec}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  <div>
                                    <h5 className="font-medium mb-2 flex items-center gap-2">
                                      <FlaskConical className="w-4 h-4 text-blue-600" />
                                      Additional Tests
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                      {result.additionalTests.map((test, idx) => (
                                        <Badge key={idx} variant="outline">
                                          {test}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="font-medium mb-2 flex items-center gap-2">
                                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                      Risk Factors
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                      {result.riskFactors.map((risk, idx) => (
                                        <Badge key={idx} variant="secondary">
                                          {risk}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium mb-2">No Analysis Results</h3>
                        <p className="text-muted-foreground text-sm">
                          Enter symptoms and run AI analysis to see diagnostic recommendations
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5" />
                      AI Medical Assistant
                    </CardTitle>
                    <CardDescription>
                      Chat with our AI assistant for medical insights and recommendations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {chatMessages.length === 0 ? (
                        <div className="text-center py-12">
                          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="font-medium mb-2">Start a Conversation</h3>
                          <p className="text-muted-foreground text-sm">
                            Ask me about symptoms, treatments, or medical conditions
                          </p>
                        </div>
                      ) : (
                        chatMessages.map((message, index) => (
                          <div
                            key={index}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[70%] p-3 rounded-lg ${
                              message.type === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800'
                            }`}>
                              <p className="text-sm">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask the AI assistant..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      />
                      <Button onClick={sendChatMessage} disabled={!chatInput.trim()}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Suggest Diagnosis
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FlaskConical className="w-4 h-4 mr-2" />
                      Recommend Tests
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Pill className="w-4 h-4 mr-2" />
                      Drug Interactions
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Clinical Guidelines
                    </Button>
                  </CardContent>
                </Card>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">AI Confidence</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Response Quality</span>
                        <span className="font-medium">96%</span>
                      </div>
                      <Progress value={96} />
                      <div className="flex justify-between text-sm">
                        <span>Medical Accuracy</span>
                        <span className="font-medium">94%</span>
                      </div>
                      <Progress value={94} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Image Analysis Tab */}
          <TabsContent value="imaging" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5" />
                  Medical Image Analysis
                </CardTitle>
                <CardDescription>
                  Upload medical images for AI-powered analysis and interpretation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
                  <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">Upload Medical Images</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Supports X-rays, CT scans, MRI, ultrasound, and pathology slides
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button>
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                    <Button variant="outline">
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Diagnostic Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Cardiology', 'Pulmonology', 'Neurology', 'Infectious Disease'].map((specialty, index) => (
                      <div key={specialty}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{specialty}</span>
                          <span className="font-medium">{95 - index}%</span>
                        </div>
                        <Progress value={95 - index} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Usage Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-blue-600">1,247</p>
                      <p className="text-sm text-muted-foreground">Analyses This Month</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600">94.2%</p>
                      <p className="text-sm text-muted-foreground">Average Accuracy</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-purple-600">3.2s</p>
                      <p className="text-sm text-muted-foreground">Avg Response Time</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-orange-600">98.7%</p>
                      <p className="text-sm text-muted-foreground">User Satisfaction</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}