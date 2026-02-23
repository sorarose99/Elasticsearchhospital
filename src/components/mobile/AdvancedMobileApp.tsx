import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Heart,
  Calendar,
  Users,
  Activity,
  Bell,
  Camera,
  Mic,
  Search,
  Settings,
  MessageCircle,
  Video,
  FileText,
  Shield,
  Download,
  Star,
  QrCode,
  MapPin,
  Clock,
  Zap,
  Fingerprint,
  FaceIcon as Face,
  Wifi,
  Battery,
  Signal,
  Menu,
  Home,
  Plus,
  User,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  AlertCircle,
  Stethoscope,
  Pill,
  FlaskConical,
  Scan,
  CloudSync,
  Headphones
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { useLanguage } from '../../services/LanguageService';
import { motion, AnimatePresence } from 'motion/react';

const mobileFeatures = [
  {
    category: 'Patient Care',
    categoryKey: 'mobile.features.patientCare.title',
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    features: [
      {
        name: 'Quick Patient Search',
        nameKey: 'mobile.features.patientCare.quickSearch',
        description: 'Instant patient lookup with AI-powered search',
        descKey: 'mobile.features.patientCare.quickSearchDesc',
        icon: Search
      },
      {
        name: 'Vital Signs Recording',
        nameKey: 'mobile.features.patientCare.vitals',
        description: 'Quick vital signs entry with voice commands',
        descKey: 'mobile.features.patientCare.vitalsDesc',
        icon: Activity
      },
      {
        name: 'Voice Notes',
        nameKey: 'mobile.features.patientCare.voiceNotes',
        description: 'Record patient notes hands-free with AI transcription',
        descKey: 'mobile.features.patientCare.voiceNotesDesc',
        icon: Mic
      },
      {
        name: 'Photo Documentation',
        nameKey: 'mobile.features.patientCare.photos',
        description: 'Secure medical photography with automatic encryption',
        descKey: 'mobile.features.patientCare.photosDesc',
        icon: Camera
      }
    ]
  },
  {
    category: 'Communication',
    categoryKey: 'mobile.features.communication.title',
    icon: MessageCircle,
    color: 'from-blue-500 to-cyan-500',
    features: [
      {
        name: 'Secure Messaging',
        nameKey: 'mobile.features.communication.messaging',
        description: 'HIPAA-compliant team communication',
        descKey: 'mobile.features.communication.messagingDesc',
        icon: MessageCircle
      },
      {
        name: 'Video Consultations',
        nameKey: 'mobile.features.communication.video',
        description: 'HD video calls with recording capability',
        descKey: 'mobile.features.communication.videoDesc',
        icon: Video
      },
      {
        name: 'Emergency Alerts',
        nameKey: 'mobile.features.communication.alerts',
        description: 'Instant emergency notifications and escalation',
        descKey: 'mobile.features.communication.alertsDesc',
        icon: Bell
      },
      {
        name: 'Real-time Chat',
        nameKey: 'mobile.features.communication.chat',
        description: 'Department-based group messaging',
        descKey: 'mobile.features.communication.chatDesc',
        icon: MessageCircle
      }
    ]
  },
  {
    category: 'Clinical Tools',
    categoryKey: 'mobile.features.clinical.title',
    icon: Stethoscope,
    color: 'from-green-500 to-emerald-500',
    features: [
      {
        name: 'Drug Reference',
        nameKey: 'mobile.features.clinical.drugReference',
        description: 'Comprehensive medication database with interactions',
        descKey: 'mobile.features.clinical.drugReferenceDesc',
        icon: Pill
      },
      {
        name: 'Lab Results',
        nameKey: 'mobile.features.clinical.labResults',
        description: 'Real-time lab results with trend analysis',
        descKey: 'mobile.features.clinical.labResultsDesc',
        icon: FlaskConical
      },
      {
        name: 'Diagnostic Tools',
        nameKey: 'mobile.features.clinical.diagnostics',
        description: 'Clinical calculators and decision support',
        descKey: 'mobile.features.clinical.diagnosticsDesc',
        icon: Scan
      },
      {
        name: 'Procedure Checklists',
        nameKey: 'mobile.features.clinical.procedures',
        description: 'Step-by-step medical procedure guides',
        descKey: 'mobile.features.clinical.proceduresDesc',
        icon: FileText
      }
    ]
  },
  {
    category: 'Security & Compliance',
    categoryKey: 'mobile.features.security.title',
    icon: Shield,
    color: 'from-purple-500 to-violet-500',
    features: [
      {
        name: 'Biometric Login',
        nameKey: 'mobile.features.security.biometric',
        description: 'Fingerprint and face recognition authentication',
        descKey: 'mobile.features.security.biometricDesc',
        icon: Fingerprint
      },
      {
        name: 'Data Encryption',
        nameKey: 'mobile.features.security.encryption',
        description: 'End-to-end encryption for all data',
        descKey: 'mobile.features.security.encryptionDesc',
        icon: Shield
      },
      {
        name: 'Audit Logging',
        nameKey: 'mobile.features.security.audit',
        description: 'Comprehensive access and action logging',
        descKey: 'mobile.features.security.auditDesc',
        icon: FileText
      },
      {
        name: 'Remote Wipe',
        nameKey: 'mobile.features.security.remoteWipe',
        description: 'Secure device management and data protection',
        descKey: 'mobile.features.security.remoteWipeDesc',
        icon: X
      }
    ]
  }
];

const mobileScreens = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    nameKey: 'mobile.screens.dashboard',
    icon: Home,
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Today's Patients</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium">Appointments</p>
                <p className="text-2xl font-bold">18</p>
              </div>
            </div>
          </Card>
        </div>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Recent Activities</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <Avatar className="w-8 h-8">
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-sm">
                <p className="font-medium">John Smith admitted</p>
                <p className="text-muted-foreground">2 mins ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <Activity className="w-8 h-8 text-red-600" />
              <div className="flex-1 text-sm">
                <p className="font-medium">Emergency alert resolved</p>
                <p className="text-muted-foreground">5 mins ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  },
  {
    id: 'patients',
    name: 'Patients',
    nameKey: 'mobile.screens.patients',
    icon: Users,
    content: (
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <Button size="sm">
            <QrCode className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {[
            { name: 'Sarah Johnson', id: '12345', status: 'Active', severity: 'green' },
            { name: 'Mike Wilson', id: '12346', status: 'Critical', severity: 'red' },
            { name: 'Emma Davis', id: '12347', status: 'Stable', severity: 'yellow' }
          ].map((patient, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">ID: {patient.id}</p>
                </div>
                <Badge variant={patient.severity === 'red' ? 'destructive' : patient.severity === 'yellow' ? 'default' : 'secondary'}>
                  {patient.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'vitals',
    name: 'Vitals',
    nameKey: 'mobile.screens.vitals',
    icon: Activity,
    content: (
      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Quick Entry</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Blood Pressure</label>
              <div className="flex gap-1 mt-1">
                <input type="number" placeholder="120" className="w-full px-2 py-1 border rounded" />
                <span className="self-center">/</span>
                <input type="number" placeholder="80" className="w-full px-2 py-1 border rounded" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Heart Rate</label>
              <input type="number" placeholder="72" className="w-full px-2 py-1 border rounded mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Temperature</label>
              <input type="number" placeholder="98.6" className="w-full px-2 py-1 border rounded mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">O2 Sat</label>
              <input type="number" placeholder="98" className="w-full px-2 py-1 border rounded mt-1" />
            </div>
          </div>
          <Button className="w-full mt-4">
            <Check className="w-4 h-4 mr-2" />
            Save Vitals
          </Button>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Recent Readings</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-sm">BP: 125/82 mmHg</span>
              <span className="text-xs text-muted-foreground">2h ago</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
              <span className="text-sm">HR: 78 bpm</span>
              <span className="text-xs text-muted-foreground">2h ago</span>
            </div>
          </div>
        </Card>
      </div>
    )
  },
  {
    id: 'messages',
    name: 'Messages',
    nameKey: 'mobile.screens.messages',
    icon: MessageCircle,
    content: (
      <div className="space-y-4">
        <div className="space-y-2">
          {[
            { name: 'Dr. Sarah Chen', message: 'Patient in room 204 needs immediate attention', time: '2m', urgent: true },
            { name: 'Nursing Team', message: 'Shift change report ready for review', time: '15m', urgent: false },
            { name: 'Lab Department', message: 'Blood work results for Johnson, S.', time: '1h', urgent: false }
          ].map((msg, index) => (
            <Card key={index} className={`p-3 ${msg.urgent ? 'border-red-200 bg-red-50 dark:bg-red-950/20' : ''}`}>
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{msg.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm truncate">{msg.name}</p>
                    <span className="text-xs text-muted-foreground">{msg.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{msg.message}</p>
                  {msg.urgent && (
                    <Badge variant="destructive" className="mt-2 text-xs">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Urgent
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <Button className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>
    )
  }
];

interface AdvancedMobileAppProps {
  onClose?: () => void;
}

export default function AdvancedMobileApp({ onClose }: AdvancedMobileAppProps) {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const { t, isRTL } = useLanguage();

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('mobile.title')} Mobile Pro
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                {t('mobile.subtitle')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Mobile Device Mockup */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-80 h-[640px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                  {/* Status Bar */}
                  <div className="flex justify-between items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm">
                    <div className="flex items-center gap-1">
                      <Signal className="w-4 h-4" />
                      <Wifi className="w-4 h-4" />
                    </div>
                    <div className="font-medium">{currentTime}</div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs">85%</span>
                      <Battery className="w-4 h-4" />
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="bg-white dark:bg-gray-800 px-4 py-3 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-blue-600 text-white">DR</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">Dr. Rodriguez</p>
                          <p className="text-xs text-muted-foreground">Emergency Medicine</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Bell className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Screen Content */}
                  <div className="flex-1 bg-white dark:bg-gray-800 p-4 overflow-y-auto">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeScreen}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        {mobileScreens.find(screen => screen.id === activeScreen)?.content}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="bg-white dark:bg-gray-800 border-t px-4 py-2">
                    <div className="flex justify-around">
                      {mobileScreens.map((screen) => {
                        const Icon = screen.icon;
                        const isActive = activeScreen === screen.id;
                        return (
                          <button
                            key={screen.id}
                            onClick={() => setActiveScreen(screen.id)}
                            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                              isActive 
                                ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/50' 
                                : 'text-muted-foreground hover:text-blue-600'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="text-xs">{t(screen.nameKey)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Action Buttons */}
              <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 space-y-4">
                <Button size="sm" className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg">
                  <Bell className="w-5 h-5" />
                </Button>
                <Button size="sm" className="w-12 h-12 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg">
                  <Plus className="w-5 h-5" />
                </Button>
                <Button size="sm" className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                  <Mic className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-8">
            {mobileFeatures.map((category, categoryIndex) => {
              const CategoryIcon = category.icon;
              
              return (
                <div key={categoryIndex} className="animate-fade-in" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                      <CategoryIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold">{t(category.categoryKey)}</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {category.features.map((feature, featureIndex) => {
                      const FeatureIcon = feature.icon;
                      const isExpanded = selectedFeature === categoryIndex * 10 + featureIndex;
                      
                      return (
                        <Card 
                          key={featureIndex}
                          className="hover:shadow-md transition-all duration-200 cursor-pointer"
                          onClick={() => setSelectedFeature(isExpanded ? null : categoryIndex * 10 + featureIndex)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                                  <FeatureIcon className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{t(feature.nameKey)}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {t(feature.descKey)}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                            </div>
                            
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="mt-4 pt-4 border-t"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary">Available in Pro</Badge>
                                    <Badge variant="outline">iOS & Android</Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    This feature provides advanced functionality for healthcare professionals,
                                    ensuring HIPAA compliance and seamless integration with your hospital management system.
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Download Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Go Mobile?</h2>
              <p className="text-xl mb-6 opacity-90">
                Download our mobile app and access your hospital management system anywhere, anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="px-8">
                  <Download className="w-5 h-5 mr-2" />
                  Download for iOS
                </Button>
                <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-blue-600">
                  <Download className="w-5 h-5 mr-2" />
                  Download for Android
                </Button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-6 text-sm opacity-75">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span>4.9 Rating</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span>10K+ Downloads</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>HIPAA Compliant</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {onClose && (
          <div className="fixed top-4 right-4">
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}