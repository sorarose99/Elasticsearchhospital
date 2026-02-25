import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Video, 
  Phone, 
  Calendar, 
  Clock, 
  User, 
  FileText,
  MessageSquare,
  Monitor,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface TelemedicineSession {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  type: 'video' | 'audio' | 'chat';
  notes?: string;
}

interface TelemedicineManagementProps {
  userId?: string;
  userRole?: string;
}

export default function TelemedicineManagement({ userId, userRole }: TelemedicineManagementProps) {
  const [sessions, setSessions] = useState<TelemedicineSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<TelemedicineSession | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    loadSessions();
    checkConnection();
  }, []);

  const loadSessions = async () => {
    try {
      setLoading(true);
      
      // Mock data for demo
      const mockSessions: TelemedicineSession[] = [
        {
          id: '1',
          patientName: 'John Doe',
          patientId: 'P001',
          doctorName: 'Dr. Sarah Smith',
          doctorId: 'D001',
          scheduledTime: new Date(Date.now() + 3600000).toISOString(),
          duration: 30,
          status: 'scheduled',
          type: 'video',
          notes: 'Follow-up consultation'
        },
        {
          id: '2',
          patientName: 'Jane Smith',
          patientId: 'P002',
          doctorName: 'Dr. Michael Johnson',
          doctorId: 'D002',
          scheduledTime: new Date(Date.now() - 1800000).toISOString(),
          duration: 45,
          status: 'in-progress',
          type: 'video',
          notes: 'Initial consultation'
        },
        {
          id: '3',
          patientName: 'Ahmed Ali',
          patientId: 'P003',
          doctorName: 'Dr. Sarah Smith',
          doctorId: 'D001',
          scheduledTime: new Date(Date.now() - 7200000).toISOString(),
          duration: 30,
          status: 'completed',
          type: 'audio',
          notes: 'Prescription renewal'
        }
      ];

      setSessions(mockSessions);
    } catch (error) {
      console.error('Error loading telemedicine sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkConnection = () => {
    setIsOnline(navigator.onLine);
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'in-progress': return <Video className="w-4 h-4 text-green-500 animate-pulse" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-gray-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'audio': return <Phone className="w-4 h-4" />;
      case 'chat': return <MessageSquare className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const startSession = (session: TelemedicineSession) => {
    console.log('Starting telemedicine session:', session.id);
    // In production, this would open video call interface
    alert(`Starting ${session.type} session with ${session.patientName}`);
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading telemedicine sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Telemedicine</h1>
          <p className="text-muted-foreground">Virtual consultations and remote care</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            {isOnline ? (
              <>
                <Wifi className="w-5 h-5 text-green-500" />
                <span className="text-sm text-green-600">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-red-500" />
                <span className="text-sm text-red-600">Offline</span>
              </>
            )}
          </div>

          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Session
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Scheduled Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.filter(s => s.status === 'scheduled').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {sessions.filter(s => s.status === 'in-progress').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.filter(s => s.status === 'completed').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.reduce((acc, s) => acc + (s.duration || 0), 0)} min
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>Telemedicine Sessions</CardTitle>
          <CardDescription>Manage virtual consultations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No telemedicine sessions scheduled</p>
                <Button className="mt-4">Schedule First Session</Button>
              </div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Type Icon */}
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      {getTypeIcon(session.type)}
                    </div>

                    {/* Session Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{session.patientName}</h3>
                        <Badge variant="outline" className="text-xs">
                          {session.patientId}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {session.doctorName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(session.scheduledTime)} at {formatTime(session.scheduledTime)}
                        </span>
                        <span>{session.duration} min</span>
                      </div>
                      {session.notes && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {session.notes}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {getStatusIcon(session.status)}
                      <span className="text-sm capitalize">{session.status.replace('-', ' ')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    {session.status === 'scheduled' && (
                      <Button
                        size="sm"
                        onClick={() => startSession(session)}
                        disabled={!isOnline}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                    )}
                    {session.status === 'in-progress' && (
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => startSession(session)}
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Join
                      </Button>
                    )}
                    {session.status === 'completed' && (
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4 mr-2" />
                        View Notes
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-600" />
              Video Consultation
            </CardTitle>
            <CardDescription>
              Start or schedule a video call with patients
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-600" />
              Audio Consultation
            </CardTitle>
            <CardDescription>
              Voice-only consultation for quick follow-ups
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Chat Consultation
            </CardTitle>
            <CardDescription>
              Text-based consultation and messaging
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
