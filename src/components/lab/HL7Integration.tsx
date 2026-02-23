import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Monitor, 
  Activity,
  CheckCircle,
  AlertTriangle,
  Zap,
  Database,
  Settings,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { useLanguage } from '../../services/LanguageService';

interface HL7IntegrationProps {
  language: 'en' | 'ar';
}

const translations = {
  en: {
    title: 'HL7 Lab Integration',
    connectedDevices: 'Connected Devices',
    deviceStatus: 'Device Status',
    messageQueue: 'Message Queue',
    dataFlow: 'Data Flow',
    connected: 'Connected',
    disconnected: 'Disconnected',
    online: 'Online',
    offline: 'Offline',
    idle: 'Idle',
    processing: 'Processing',
    error: 'Error',
    testResults: 'Test Results',
    qualityControl: 'Quality Control',
    deviceMaintenance: 'Device Maintenance',
    lastHeartbeat: 'Last Heartbeat',
    messagesProcessed: 'Messages Processed',
    dataTransmission: 'Data Transmission',
    connect: 'Connect',
    disconnect: 'Disconnect',
    refresh: 'Refresh',
    configure: 'Configure',
    pending: 'Pending',
    transmitted: 'Transmitted',
    failed: 'Failed',
    messageType: 'Message Type',
    timestamp: 'Timestamp',
    status: 'Status',
    deviceName: 'Device Name',
    ipAddress: 'IP Address',
    port: 'Port',
    protocol: 'Protocol',
    vendor: 'Vendor',
    model: 'Model',
    serialNumber: 'Serial Number',
    firmwareVersion: 'Firmware Version',
  },
  ar: {
    title: 'تكامل مختبر HL7',
    connectedDevices: 'الأجهزة المتصلة',
    deviceStatus: 'حالة الجهاز',
    messageQueue: 'قائمة الرسائل',
    dataFlow: 'تدفق البيانات',
    connected: 'متصل',
    disconnected: 'منقطع',
    online: 'متصل',
    offline: 'غير متصل',
    idle: 'خامل',
    processing: 'يعالج',
    error: 'خطأ',
    testResults: 'نتائج الفحص',
    qualityControl: 'مراقبة الجودة',
    deviceMaintenance: 'صيانة الجهاز',
    lastHeartbeat: 'آخر نبضة',
    messagesProcessed: 'الرسائل المعالجة',
    dataTransmission: 'نقل البيانات',
    connect: 'اتصال',
    disconnect: 'قطع الاتصال',
    refresh: 'تحديث',
    configure: 'تكوين',
    pending: 'معلق',
    transmitted: 'مرسل',
    failed: 'فشل',
    messageType: 'نوع الرسالة',
    timestamp: 'الطابع الزمني',
    status: 'الحالة',
    deviceName: 'اسم الجهاز',
    ipAddress: 'عنوان IP',
    port: 'المنفذ',
    protocol: 'البروتوكول',
    vendor: 'المورد',
    model: 'الطراز',
    serialNumber: 'الرقم التسلسلي',
    firmwareVersion: 'إصدار البرنامج الثابت',
  }
};

// Mock HL7 devices and data
const mockDevices = [
  {
    id: 'dev001',
    name: 'Chemistry Analyzer',
    vendor: 'Beckman Coulter',
    model: 'AU5800',
    serialNumber: 'BC5800-001',
    ipAddress: '192.168.1.100',
    port: 5000,
    protocol: 'HL7 v2.5',
    status: 'online',
    lastHeartbeat: new Date().toISOString(),
    firmwareVersion: '3.2.1',
    messagesProcessed: 1245,
    errorCount: 2
  },
  {
    id: 'dev002',
    name: 'Hematology Analyzer',
    vendor: 'Sysmex',
    model: 'XN-3000',
    serialNumber: 'SX3000-002',
    ipAddress: '192.168.1.101',
    port: 5001,
    protocol: 'HL7 v2.5',
    status: 'processing',
    lastHeartbeat: new Date().toISOString(),
    firmwareVersion: '2.8.5',
    messagesProcessed: 890,
    errorCount: 0
  },
  {
    id: 'dev003',
    name: 'Immunoassay Analyzer',
    vendor: 'Abbott',
    model: 'Alinity i',
    serialNumber: 'AB1000-003',
    ipAddress: '192.168.1.102',
    port: 5002,
    protocol: 'HL7 v2.5',
    status: 'offline',
    lastHeartbeat: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    firmwareVersion: '1.9.3',
    messagesProcessed: 567,
    errorCount: 5
  }
];

const mockMessages = [
  {
    id: 'msg001',
    type: 'ORM^O01',
    deviceId: 'dev001',
    timestamp: new Date().toISOString(),
    status: 'transmitted',
    patientId: 'PAT001',
    testCode: 'GLU',
    description: 'Glucose Order'
  },
  {
    id: 'msg002',
    type: 'ORU^R01',
    deviceId: 'dev002',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    status: 'pending',
    patientId: 'PAT002',
    testCode: 'CBC',
    description: 'Complete Blood Count Results'
  },
  {
    id: 'msg003',
    type: 'QCN^J01',
    deviceId: 'dev001',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'failed',
    patientId: null,
    testCode: 'QC001',
    description: 'Quality Control Check'
  }
];

export default function HL7Integration({ language }: HL7IntegrationProps) {
  const [devices, setDevices] = useState(mockDevices);
  const [messages, setMessages] = useState(mockMessages);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);

  const { t } = useLanguage();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update device heartbeats and simulate status changes
      setDevices(prev => prev.map(device => ({
        ...device,
        lastHeartbeat: device.status === 'online' || device.status === 'processing' 
          ? new Date().toISOString() 
          : device.lastHeartbeat,
        messagesProcessed: device.status === 'online' || device.status === 'processing'
          ? device.messagesProcessed + Math.floor(Math.random() * 3)
          : device.messagesProcessed
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Activity className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'offline':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Monitor className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      online: 'bg-green-500',
      processing: 'bg-blue-500',
      offline: 'bg-red-500',
      idle: 'bg-yellow-500'
    };
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'} text-white`}>
        {t[status as keyof typeof t] || status}
      </Badge>
    );
  };

  const getMessageStatusBadge = (status: string) => {
    const statusColors = {
      transmitted: 'bg-green-500',
      pending: 'bg-yellow-500',
      failed: 'bg-red-500'
    };
    return (
      <Badge className={`${statusColors[status as keyof typeof statusColors] || 'bg-gray-500'} text-white`}>
        {t[status as keyof typeof t] || status}
      </Badge>
    );
  };

  const handleConnect = async (deviceId: string) => {
    setIsConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setDevices(prev => prev.map(device => 
        device.id === deviceId 
          ? { ...device, status: 'online', lastHeartbeat: new Date().toISOString() }
          : device
      ));
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnect = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, status: 'offline' }
        : device
    ));
  };

  const connectedDevices = devices.filter(d => d.status === 'online' || d.status === 'processing');
  const totalMessages = messages.length;
  const transmittedMessages = messages.filter(m => m.status === 'transmitted').length;
  const pendingMessages = messages.filter(m => m.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t.connectedDevices}</p>
                <p className="text-3xl font-bold">{connectedDevices.length}/{devices.length}</p>
              </div>
              <div className="p-3 rounded-full bg-green-500">
                <Wifi className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t.messagesProcessed}</p>
                <p className="text-3xl font-bold">{transmittedMessages}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500">
                <Database className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Messages</p>
                <p className="text-3xl font-bold">{pendingMessages}</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-500">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{t.dataTransmission}</p>
                <p className="text-3xl font-bold">{Math.round((transmittedMessages / totalMessages) * 100)}%</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="devices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="devices">{t.connectedDevices}</TabsTrigger>
          <TabsTrigger value="messages">{t.messageQueue}</TabsTrigger>
          <TabsTrigger value="dataflow">{t.dataFlow}</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t.deviceStatus}</CardTitle>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                {t.refresh}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {devices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        {getStatusIcon(device.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{device.name}</h3>
                        <p className="text-sm text-gray-600">{device.vendor} {device.model}</p>
                        <p className="text-sm text-gray-500">
                          {device.ipAddress}:{device.port} | {device.protocol}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">
                            {t.messagesProcessed}: {device.messagesProcessed}
                          </span>
                          <span className="text-xs text-gray-500">
                            {t.lastHeartbeat}: {new Date(device.lastHeartbeat).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(device.status)}
                      <div className="flex gap-2">
                        {device.status === 'offline' ? (
                          <Button 
                            size="sm" 
                            onClick={() => handleConnect(device.id)}
                            disabled={isConnecting}
                          >
                            <Wifi className="w-4 h-4 mr-2" />
                            {t.connect}
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDisconnect(device.id)}
                          >
                            <WifiOff className="w-4 h-4 mr-2" />
                            {t.disconnect}
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4 mr-2" />
                          {t.configure}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.messageQueue}</CardTitle>
              <CardDescription>HL7 message processing status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => {
                  const device = devices.find(d => d.id === message.deviceId);
                  return (
                    <div key={message.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Database className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{message.type}</h3>
                          <p className="text-sm text-gray-600">{message.description}</p>
                          <p className="text-sm text-gray-500">
                            {device?.name} | {message.patientId || 'System'} | {message.testCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {new Date(message.timestamp).toLocaleString()}
                          </p>
                        </div>
                        {getMessageStatusBadge(message.status)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dataflow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.dataFlow}</CardTitle>
              <CardDescription>Real-time data transmission monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{transmittedMessages}</div>
                    <div className="text-sm text-gray-600">{t.transmitted}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{pendingMessages}</div>
                    <div className="text-sm text-gray-600">{t.pending}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {messages.filter(m => m.status === 'failed').length}
                    </div>
                    <div className="text-sm text-gray-600">{t.failed}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-medium">Data Transmission Rate</div>
                  <Progress value={(transmittedMessages / totalMessages) * 100} className="h-3" />
                  <div className="text-sm text-gray-600 text-center">
                    {Math.round((transmittedMessages / totalMessages) * 100)}% success rate
                  </div>
                </div>

                <div className="text-center py-8">
                  <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">{t('dashboard.dataFlowComingSoon')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}