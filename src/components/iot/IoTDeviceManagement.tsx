import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Progress } from '../ui/progress';
import { 
  Activity,
  Heart,
  Thermometer,
  Zap,
  Wifi,
  WifiOff,
  Battery,
  Bluetooth,
  Signal,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Monitor,
  Smartphone,
  Watch,
  Stethoscope,
  Scale,
  Eye,
  Droplets,
  Wind,
  Brain,
  Plus,
  Search,
  Filter,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Share2,
  Bell,
  Shield,
  Lock,
  Unlock,
  Power,
  PowerOff,
  MapPin,
  Calendar,
  Users,
  BarChart3,
  LineChart,
  PieChart,
  Gauge,
  Radio,
  Cpu,
  HardDrive,
  MemoryStick,
  Disc
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';

interface IoTDevice {
  id: string;
  name: string;
  nameAr: string;
  type: string;
  category: 'vital-signs' | 'diagnostics' | 'monitoring' | 'therapeutic' | 'environmental';
  model: string;
  manufacturer: string;
  serialNumber: string;
  location: {
    room: string;
    floor: string;
    building: string;
    coordinates: { lat: number; lng: number };
  };
  status: 'online' | 'offline' | 'maintenance' | 'error' | 'calibrating';
  connectivity: {
    type: 'wifi' | 'bluetooth' | 'ethernet' | 'cellular' | '5g';
    signal: number;
    latency: number;
    lastSeen: string;
  };
  battery: {
    level: number;
    isCharging: boolean;
    estimatedLife: string;
  };
  metrics: {
    uptime: string;
    dataTransmitted: number;
    errorsToday: number;
    lastMaintenance: string;
  };
  currentReading: {
    value: number;
    unit: string;
    timestamp: string;
    trend: 'up' | 'down' | 'stable';
    isNormal: boolean;
  };
  alerts: {
    count: number;
    highPriority: number;
    lastAlert: string;
  };
  patientId?: string;
  isActive: boolean;
  icon: any;
  specifications: Record<string, any>;
  calibrationDue: string;
  warrantyExpiry: string;
  firmwareVersion: string;
}

interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'critical' | 'warning' | 'info' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  timestamp: string;
  isResolved: boolean;
  assignedTo?: string;
  patientId?: string;
  actionRequired: boolean;
  autoResolvable: boolean;
}

interface IoTDeviceManagementProps {
  isDemoMode?: boolean;
}

const IoTDeviceManagement: React.FC<IoTDeviceManagementProps> = ({ 
  isDemoMode = false 
}) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [realTimeData, setRealTimeData] = useState<Record<string, any>>({});
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Demo IoT devices
  const [devices, setDevices] = useState<IoTDevice[]>([
    {
      id: '1',
      name: 'Cardiac Monitor Pro 3000',
      nameAr: 'جهاز مراقبة القلب المحترف 3000',
      type: 'ECG Monitor',
      category: 'vital-signs',
      model: 'CM-3000-PRO',
      manufacturer: 'MedTech Solutions',
      serialNumber: 'MT-2024-001-ECG',
      location: {
        room: 'ICU-101',
        floor: '1st Floor',
        building: 'Main Building A',
        coordinates: { lat: 24.7136, lng: 46.6753 }
      },
      status: 'online',
      connectivity: {
        type: 'wifi',
        signal: 95,
        latency: 12,
        lastSeen: '2024-01-28T10:30:00Z'
      },
      battery: {
        level: 87,
        isCharging: false,
        estimatedLife: '6 hours'
      },
      metrics: {
        uptime: '15 days 8 hours',
        dataTransmitted: 2.4,
        errorsToday: 0,
        lastMaintenance: '2024-01-15'
      },
      currentReading: {
        value: 72,
        unit: 'BPM',
        timestamp: '2024-01-28T10:29:45Z',
        trend: 'stable',
        isNormal: true
      },
      alerts: {
        count: 0,
        highPriority: 0,
        lastAlert: '2024-01-25T14:22:00Z'
      },
      patientId: 'P001',
      isActive: true,
      icon: Heart,
      specifications: {
        accuracy: '±2 BPM',
        range: '30-300 BPM',
        resolution: '1 BPM',
        leads: 12,
        sampling: '1000 Hz'
      },
      calibrationDue: '2024-03-15',
      warrantyExpiry: '2025-12-31',
      firmwareVersion: 'v2.1.3'
    },
    {
      id: '2',
      name: 'Smart Temperature Sensor Array',
      nameAr: 'مصفوفة أجهزة استشعار الحرارة الذكية',
      type: 'Temperature Monitor',
      category: 'environmental',
      model: 'STS-Array-2024',
      manufacturer: 'EnviroMed Inc.',
      serialNumber: 'EM-2024-002-TEMP',
      location: {
        room: 'Operating Room 1',
        floor: '2nd Floor',
        building: 'Surgical Wing',
        coordinates: { lat: 24.7140, lng: 46.6760 }
      },
      status: 'online',
      connectivity: {
        type: 'ethernet',
        signal: 100,
        latency: 3,
        lastSeen: '2024-01-28T10:31:00Z'
      },
      battery: {
        level: 100,
        isCharging: true,
        estimatedLife: 'AC Powered'
      },
      metrics: {
        uptime: '45 days 12 hours',
        dataTransmitted: 8.7,
        errorsToday: 1,
        lastMaintenance: '2024-01-10'
      },
      currentReading: {
        value: 21.5,
        unit: '°C',
        timestamp: '2024-01-28T10:30:30Z',
        trend: 'stable',
        isNormal: true
      },
      alerts: {
        count: 2,
        highPriority: 0,
        lastAlert: '2024-01-28T09:15:00Z'
      },
      isActive: true,
      icon: Thermometer,
      specifications: {
        accuracy: '±0.1°C',
        range: '-10 to +50°C',
        resolution: '0.01°C',
        sensors: 8,
        response: '2 seconds'
      },
      calibrationDue: '2024-02-28',
      warrantyExpiry: '2026-06-30',
      firmwareVersion: 'v1.4.7'
    },
    {
      id: '3',
      name: 'Pulse Oximeter Network Hub',
      nameAr: 'مركز شبكة أجهزة قياس الأكسجين',
      type: 'SpO2 Monitor',
      category: 'vital-signs',
      model: 'POX-HUB-500',
      manufacturer: 'OxyGenMed Corp.',
      serialNumber: 'OG-2024-003-SPO2',
      location: {
        room: 'Emergency Department',
        floor: 'Ground Floor',
        building: 'Main Building A',
        coordinates: { lat: 24.7130, lng: 46.6745 }
      },
      status: 'online',
      connectivity: {
        type: '5g',
        signal: 78,
        latency: 18,
        lastSeen: '2024-01-28T10:30:50Z'
      },
      battery: {
        level: 42,
        isCharging: false,
        estimatedLife: '3 hours'
      },
      metrics: {
        uptime: '8 days 2 hours',
        dataTransmitted: 1.2,
        errorsToday: 0,
        lastMaintenance: '2024-01-20'
      },
      currentReading: {
        value: 98,
        unit: '%SpO2',
        timestamp: '2024-01-28T10:30:15Z',
        trend: 'stable',
        isNormal: true
      },
      alerts: {
        count: 1,
        highPriority: 1,
        lastAlert: '2024-01-28T08:45:00Z'
      },
      patientId: 'P003',
      isActive: true,
      icon: Wind,
      specifications: {
        accuracy: '±2% SpO2',
        range: '70-100% SpO2',
        resolution: '1% SpO2',
        wireless: true,
        battery: '12 hours'
      },
      calibrationDue: '2024-04-10',
      warrantyExpiry: '2025-08-15',
      firmwareVersion: 'v3.2.1'
    },
    {
      id: '4',
      name: 'Blood Pressure Monitoring Station',
      nameAr: 'محطة مراقبة ضغط الدم',
      type: 'Blood Pressure Monitor',
      category: 'vital-signs',
      model: 'BP-MS-2024',
      manufacturer: 'CardioTech Systems',
      serialNumber: 'CT-2024-004-BP',
      location: {
        room: 'Cardiology Unit',
        floor: '3rd Floor',
        building: 'Specialized Care Wing',
        coordinates: { lat: 24.7142, lng: 46.6770 }
      },
      status: 'maintenance',
      connectivity: {
        type: 'wifi',
        signal: 88,
        latency: 25,
        lastSeen: '2024-01-28T09:45:00Z'
      },
      battery: {
        level: 65,
        isCharging: true,
        estimatedLife: '8 hours'
      },
      metrics: {
        uptime: '22 days 18 hours',
        dataTransmitted: 5.8,
        errorsToday: 3,
        lastMaintenance: '2024-01-28'
      },
      currentReading: {
        value: 120,
        unit: 'mmHg',
        timestamp: '2024-01-28T09:40:00Z',
        trend: 'stable',
        isNormal: true
      },
      alerts: {
        count: 5,
        highPriority: 2,
        lastAlert: '2024-01-28T09:45:00Z'
      },
      patientId: 'P002',
      isActive: false,
      icon: Gauge,
      specifications: {
        accuracy: '±3 mmHg',
        range: '30-300 mmHg',
        cuff: 'Adult/Pediatric',
        method: 'Oscillometric',
        storage: '1000 readings'
      },
      calibrationDue: '2024-02-15',
      warrantyExpiry: '2026-01-30',
      firmwareVersion: 'v2.0.8'
    },
    {
      id: '5',
      name: 'Glucose Meter Smart Network',
      nameAr: 'شبكة أجهزة قياس السكر الذكية',
      type: 'Blood Glucose Monitor',
      category: 'diagnostics',
      model: 'BGM-NET-400',
      manufacturer: 'DiabetesCare Solutions',
      serialNumber: 'DC-2024-005-BGM',
      location: {
        room: 'Endocrinology Clinic',
        floor: '2nd Floor',
        building: 'Outpatient Building B',
        coordinates: { lat: 24.7135, lng: 46.6755 }
      },
      status: 'online',
      connectivity: {
        type: 'bluetooth',
        signal: 92,
        latency: 8,
        lastSeen: '2024-01-28T10:31:30Z'
      },
      battery: {
        level: 78,
        isCharging: false,
        estimatedLife: '2 days'
      },
      metrics: {
        uptime: '12 days 4 hours',
        dataTransmitted: 0.8,
        errorsToday: 0,
        lastMaintenance: '2024-01-16'
      },
      currentReading: {
        value: 95,
        unit: 'mg/dL',
        timestamp: '2024-01-28T10:25:00Z',
        trend: 'down',
        isNormal: true
      },
      alerts: {
        count: 0,
        highPriority: 0,
        lastAlert: '2024-01-26T16:30:00Z'
      },
      patientId: 'P005',
      isActive: true,
      icon: Droplets,
      specifications: {
        accuracy: '±10% or ±10 mg/dL',
        range: '20-600 mg/dL',
        sample: '0.6 μL',
        time: '5 seconds',
        memory: '500 tests'
      },
      calibrationDue: '2024-05-20',
      warrantyExpiry: '2025-11-15',
      firmwareVersion: 'v1.3.4'
    },
    {
      id: '6',
      name: 'Environmental Control System',
      nameAr: 'نظام التحكم البيئي',
      type: 'HVAC & Air Quality Monitor',
      category: 'environmental',
      model: 'ECS-2024-PRO',
      manufacturer: 'CleanAir Technologies',
      serialNumber: 'CA-2024-006-ECS',
      location: {
        room: 'Building Central Control',
        floor: 'Basement Level',
        building: 'Main Building A',
        coordinates: { lat: 24.7138, lng: 46.6750 }
      },
      status: 'online',
      connectivity: {
        type: 'ethernet',
        signal: 100,
        latency: 1,
        lastSeen: '2024-01-28T10:31:45Z'
      },
      battery: {
        level: 100,
        isCharging: true,
        estimatedLife: 'UPS Backup'
      },
      metrics: {
        uptime: '90 days 15 hours',
        dataTransmitted: 25.6,
        errorsToday: 0,
        lastMaintenance: '2024-01-05'
      },
      currentReading: {
        value: 22.8,
        unit: '°C',
        timestamp: '2024-01-28T10:31:00Z',
        trend: 'stable',
        isNormal: true
      },
      alerts: {
        count: 1,
        highPriority: 0,
        lastAlert: '2024-01-27T22:15:00Z'
      },
      isActive: true,
      icon: Wind,
      specifications: {
        temperature: '±0.5°C',
        humidity: '±3% RH',
        pressure: '±0.1 kPa',
        particles: 'PM2.5, PM10',
        coverage: 'Full Building'
      },
      calibrationDue: '2024-06-30',
      warrantyExpiry: '2027-03-15',
      firmwareVersion: 'v4.1.2'
    }
  ]);

  // Demo alerts
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      deviceId: '3',
      deviceName: 'Pulse Oximeter Network Hub',
      type: 'warning',
      priority: 'high',
      title: 'Low Battery Warning',
      titleAr: 'تحذير بطارية منخفضة',
      message: 'Device battery level is below 50%. Please replace or recharge soon.',
      messageAr: 'مستوى البطارية أقل من 50%. يرجى الاستبدال أو إعادة الشحن قريباً.',
      timestamp: '2024-01-28T08:45:00Z',
      isResolved: false,
      patientId: 'P003',
      actionRequired: true,
      autoResolvable: false
    },
    {
      id: '2',
      deviceId: '4',
      deviceName: 'Blood Pressure Monitoring Station',
      type: 'critical',
      priority: 'critical',
      title: 'Device Offline - Maintenance Mode',
      titleAr: 'الجهاز غير متصل - وضع الصيانة',
      message: 'Device entered maintenance mode due to calibration errors. Technical support required.',
      messageAr: 'دخل الجهاز في وضع الصيانة بسبب أخطاء المعايرة. مطلوب دعم فني.',
      timestamp: '2024-01-28T09:45:00Z',
      isResolved: false,
      assignedTo: 'Tech Support Team',
      patientId: 'P002',
      actionRequired: true,
      autoResolvable: false
    },
    {
      id: '3',
      deviceId: '2',
      deviceName: 'Smart Temperature Sensor Array',
      type: 'info',
      priority: 'low',
      title: 'Routine Calibration Reminder',
      titleAr: 'تذكير المعايرة الروتينية',
      message: 'Device calibration is due in 30 days. Schedule maintenance appointment.',
      messageAr: 'معايرة الجهاز مستحقة خلال 30 يوماً. حدد موعد الصيانة.',
      timestamp: '2024-01-28T09:15:00Z',
      isResolved: false,
      actionRequired: false,
      autoResolvable: true
    }
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setDevices(prevDevices => 
        prevDevices.map(device => ({
          ...device,
          currentReading: {
            ...device.currentReading,
            value: device.currentReading.value + (Math.random() - 0.5) * 2,
            timestamp: new Date().toISOString(),
            trend: Math.random() > 0.7 ? (Math.random() > 0.5 ? 'up' : 'down') : 'stable'
          },
          connectivity: {
            ...device.connectivity,
            latency: Math.max(1, device.connectivity.latency + (Math.random() - 0.5) * 5),
            lastSeen: new Date().toISOString()
          }
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.nameAr.includes(searchQuery) ||
                         device.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || device.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || device.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'offline': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'calibrating': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getConnectivityIcon = (type: string) => {
    switch (type) {
      case 'wifi': return Wifi;
      case 'bluetooth': return Bluetooth;
      case 'ethernet': return Zap;
      case 'cellular': return Signal;
      case '5g': return Radio;
      default: return Wifi;
    }
  };

  const deviceStats = {
    total: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length,
    maintenance: devices.filter(d => d.status === 'maintenance').length,
    criticalAlerts: alerts.filter(a => a.priority === 'critical' && !a.isResolved).length
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {language === 'ar' ? 'إدارة الأجهزة الطبية الذكية' : 'IoT Medical Device Management'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'مراقبة وإدارة الأجهزة الطبية المتصلة في الوقت الفعلي'
              : 'Real-time monitoring and management of connected medical devices'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Switch 
              checked={isMonitoring}
              onCheckedChange={setIsMonitoring}
            />
            <span className="text-sm">
              {language === 'ar' ? 'المراقبة المباشرة' : 'Live Monitoring'}
            </span>
          </div>
          <Button 
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {language === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
          <Dialog open={isAddDeviceModalOpen} onOpenChange={setIsAddDeviceModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {language === 'ar' ? 'إضافة جهاز' : 'Add Device'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {language === 'ar' ? 'إضافة جهاز IoT جديد' : 'Add New IoT Device'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{language === 'ar' ? 'اسم الجهاز' : 'Device Name'}</Label>
                    <Input placeholder="Enter device name" />
                  </div>
                  <div>
                    <Label>{language === 'ar' ? 'النوع' : 'Type'}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select device type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ecg">ECG Monitor</SelectItem>
                        <SelectItem value="bp">Blood Pressure Monitor</SelectItem>
                        <SelectItem value="temp">Temperature Sensor</SelectItem>
                        <SelectItem value="spo2">Pulse Oximeter</SelectItem>
                        <SelectItem value="glucose">Glucose Meter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{language === 'ar' ? 'الرقم التسلسلي' : 'Serial Number'}</Label>
                    <Input placeholder="Enter serial number" />
                  </div>
                  <div>
                    <Label>{language === 'ar' ? 'الموقع' : 'Location'}</Label>
                    <Input placeholder="Room/Ward/Building" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button className="flex-1">
                    {language === 'ar' ? 'إضافة الجهاز' : 'Add Device'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'إجمالي الأجهزة' : 'Total Devices'}
                </p>
                <p className="text-2xl font-bold text-blue-600">{deviceStats.total}</p>
              </div>
              <Monitor className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'متصلة' : 'Online'}
                </p>
                <p className="text-2xl font-bold text-green-600">{deviceStats.online}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'غير متصلة' : 'Offline'}
                </p>
                <p className="text-2xl font-bold text-red-600">{deviceStats.offline}</p>
              </div>
              <WifiOff className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'قيد الصيانة' : 'Maintenance'}
                </p>
                <p className="text-2xl font-bold text-yellow-600">{deviceStats.maintenance}</p>
              </div>
              <Settings className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'تنبيهات حرجة' : 'Critical Alerts'}
                </p>
                <p className="text-2xl font-bold text-red-600">{deviceStats.criticalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'ar' ? 'البحث في الأجهزة...' : 'Search devices...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {language === 'ar' ? 'جميع الحالات' : 'All Status'}
            </SelectItem>
            <SelectItem value="online">
              {language === 'ar' ? 'متصل' : 'Online'}
            </SelectItem>
            <SelectItem value="offline">
              {language === 'ar' ? 'غير متصل' : 'Offline'}
            </SelectItem>
            <SelectItem value="maintenance">
              {language === 'ar' ? 'صيانة' : 'Maintenance'}
            </SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {language === 'ar' ? 'جميع الفئات' : 'All Categories'}
            </SelectItem>
            <SelectItem value="vital-signs">
              {language === 'ar' ? 'العلامات الحيوية' : 'Vital Signs'}
            </SelectItem>
            <SelectItem value="diagnostics">
              {language === 'ar' ? 'التشخيص' : 'Diagnostics'}
            </SelectItem>
            <SelectItem value="monitoring">
              {language === 'ar' ? 'المراقبة' : 'Monitoring'}
            </SelectItem>
            <SelectItem value="environmental">
              {language === 'ar' ? 'البيئية' : 'Environmental'}
            </SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {language === 'ar' ? 'نظرة عامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="devices" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              {language === 'ar' ? 'الأجهزة' : 'Devices'}
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              {language === 'ar' ? 'التنبيهات' : 'Alerts'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              {language === 'ar' ? 'التحليلات' : 'Analytics'}
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Real-time Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {language === 'ar' ? 'المراقبة في الوقت الفعلي' : 'Real-time Monitoring'}
                </CardTitle>
                <CardDescription>
                  {language === 'ar' 
                    ? 'القراءات الحية من الأجهزة المتصلة'
                    : 'Live readings from connected devices'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {devices.filter(d => d.status === 'online' && d.patientId).slice(0, 4).map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <device.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {language === 'ar' ? device.nameAr : device.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {device.location.room}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-lg">
                            {device.currentReading.value.toFixed(1)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {device.currentReading.unit}
                          </span>
                          {device.currentReading.trend === 'up' && (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          )}
                          {device.currentReading.trend === 'down' && (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                        <Badge 
                          variant={device.currentReading.isNormal ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {device.currentReading.isNormal 
                            ? (language === 'ar' ? 'طبيعي' : 'Normal')
                            : (language === 'ar' ? 'غير طبيعي' : 'Abnormal')
                          }
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  {language === 'ar' ? 'توزيع حالة الأجهزة' : 'Device Status Distribution'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">
                        {language === 'ar' ? 'متصل' : 'Online'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{deviceStats.online}</span>
                      <Progress value={(deviceStats.online / deviceStats.total) * 100} className="w-20" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">
                        {language === 'ar' ? 'غير متصل' : 'Offline'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{deviceStats.offline}</span>
                      <Progress value={(deviceStats.offline / deviceStats.total) * 100} className="w-20" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">
                        {language === 'ar' ? 'صيانة' : 'Maintenance'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{deviceStats.maintenance}</span>
                      <Progress value={(deviceStats.maintenance / deviceStats.total) * 100} className="w-20" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Network Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  {language === 'ar' ? 'أداء الشبكة' : 'Network Performance'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">
                        {language === 'ar' ? 'متوسط قوة الإشارة' : 'Avg Signal Strength'}
                      </span>
                      <span className="font-medium">
                        {Math.round(devices.reduce((sum, d) => sum + d.connectivity.signal, 0) / devices.length)}%
                      </span>
                    </div>
                    <Progress value={devices.reduce((sum, d) => sum + d.connectivity.signal, 0) / devices.length} />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">
                        {language === 'ar' ? 'متوسط الكمون' : 'Avg Latency'}
                      </span>
                      <span className="font-medium">
                        {Math.round(devices.reduce((sum, d) => sum + d.connectivity.latency, 0) / devices.length)}ms
                      </span>
                    </div>
                    <Progress value={100 - (devices.reduce((sum, d) => sum + d.connectivity.latency, 0) / devices.length)} />
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">WiFi</p>
                      <p className="font-bold text-blue-600">
                        {devices.filter(d => d.connectivity.type === 'wifi').length}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Bluetooth</p>
                      <p className="font-bold text-purple-600">
                        {devices.filter(d => d.connectivity.type === 'bluetooth').length}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Ethernet</p>
                      <p className="font-bold text-green-600">
                        {devices.filter(d => d.connectivity.type === 'ethernet').length}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Battery Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Battery className="h-5 w-5" />
                  {language === 'ar' ? 'حالة البطاريات' : 'Battery Status'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {devices.filter(d => d.battery.level < 100).map((device) => (
                    <div key={device.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <device.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {device.location.room}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={device.battery.level} 
                          className="w-20"
                        />
                        <span className="text-sm font-medium w-12">
                          {device.battery.level}%
                        </span>
                        {device.battery.isCharging && (
                          <Zap className="h-3 w-3 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4"
          >
            {filteredDevices.map((device, index) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <device.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">
                            {language === 'ar' ? device.nameAr : device.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{device.type}</p>
                          <p className="text-xs text-muted-foreground">{device.serialNumber}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(device.status)}>
                          {device.status}
                        </Badge>
                        {device.alerts.count > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {device.alerts.count} {language === 'ar' ? 'تنبيه' : 'alerts'}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      {/* Current Reading */}
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          {language === 'ar' ? 'القراءة الحالية' : 'Current Reading'}
                        </p>
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold">
                            {device.currentReading.value.toFixed(1)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {device.currentReading.unit}
                          </span>
                          {device.currentReading.trend === 'up' && (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          )}
                          {device.currentReading.trend === 'down' && (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                        </div>
                      </div>

                      {/* Battery */}
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          {language === 'ar' ? 'البطارية' : 'Battery'}
                        </p>
                        <div className="flex items-center gap-2">
                          <Progress value={device.battery.level} className="flex-1" />
                          <span className="text-sm font-medium">
                            {device.battery.level}%
                          </span>
                          {device.battery.isCharging && (
                            <Zap className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      </div>

                      {/* Connectivity */}
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          {language === 'ar' ? 'الاتصال' : 'Connectivity'}
                        </p>
                        <div className="flex items-center gap-2">
                          {React.createElement(getConnectivityIcon(device.connectivity.type), {
                            className: 'h-4 w-4'
                          })}
                          <span className="text-sm font-medium">
                            {device.connectivity.signal}%
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {device.connectivity.latency}ms
                          </span>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">
                          {language === 'ar' ? 'الموقع' : 'Location'}
                        </p>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {device.location.room}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {device.location.floor}
                        </p>
                      </div>
                    </div>

                    {/* Device Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">
                          {language === 'ar' ? 'الشركة المصنعة' : 'Manufacturer'}
                        </p>
                        <p className="font-medium">{device.manufacturer}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          {language === 'ar' ? 'النموذج' : 'Model'}
                        </p>
                        <p className="font-medium">{device.model}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          {language === 'ar' ? 'وقت التشغيل' : 'Uptime'}
                        </p>
                        <p className="font-medium">{device.metrics.uptime}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          {language === 'ar' ? 'المعايرة التالية' : 'Next Calibration'}
                        </p>
                        <p className="font-medium">{device.calibrationDue}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Settings className="h-3 w-3 mr-1" />
                        {language === 'ar' ? 'إعدادات' : 'Settings'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-3 w-3 mr-1" />
                        {language === 'ar' ? 'البيانات' : 'Data'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        {language === 'ar' ? 'تصدير' : 'Export'}
                      </Button>
                      {device.status === 'online' ? (
                        <Button variant="outline" size="sm">
                          <PowerOff className="h-3 w-3 mr-1" />
                          {language === 'ar' ? 'إيقاف' : 'Stop'}
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Power className="h-3 w-3 mr-1" />
                          {language === 'ar' ? 'تشغيل' : 'Start'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {language === 'ar' ? 'تنبيهات الأجهزة' : 'Device Alerts'}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="destructive">
                  {alerts.filter(a => !a.isResolved).length} {language === 'ar' ? 'غير محلول' : 'unresolved'}
                </Badge>
              </div>
            </div>

            <div className="grid gap-4">
              {alerts.map((alert, index) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border-l-4 ${getPriorityColor(alert.priority)}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getPriorityColor(alert.priority)}>
                              {alert.priority}
                            </Badge>
                            <Badge variant="outline">
                              {alert.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(alert.timestamp).toLocaleString()}
                            </span>
                          </div>
                          
                          <h4 className="font-semibold mb-1">
                            {language === 'ar' ? alert.titleAr : alert.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {language === 'ar' ? alert.messageAr : alert.message}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Device: {alert.deviceName}</span>
                            {alert.patientId && <span>Patient: {alert.patientId}</span>}
                            {alert.assignedTo && <span>Assigned: {alert.assignedTo}</span>}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {alert.actionRequired && (
                            <Button size="sm" variant="outline">
                              {language === 'ar' ? 'اتخاذ إجراء' : 'Take Action'}
                            </Button>
                          )}
                          {!alert.isResolved && (
                            <Button size="sm">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {language === 'ar' ? 'حل' : 'Resolve'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'ar' ? 'اتجاهات الأداء' : 'Performance Trends'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <LineChart className="h-16 w-16" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'ar' ? 'استخدام الأجهزة' : 'Device Utilization'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <PieChart className="h-16 w-16" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'ar' ? 'تاريخ الأخطاء' : 'Error History'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <BarChart3 className="h-16 w-16" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'ar' ? 'كفاءة الشبكة' : 'Network Efficiency'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <Gauge className="h-16 w-16" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IoTDeviceManagement;