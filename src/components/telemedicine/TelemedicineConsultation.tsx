/**
 * Telemedicine Consultation Platform - Video consultations and remote care
 */

import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  Settings, 
  Camera, 
  Users, 
  Clock, 
  Calendar,
  FileText,
  Send,
  Paperclip,
  Download,
  Upload,
  MessageSquare,
  Heart,
  Activity,
  User,
  Shield,
  CheckCircle,
  AlertCircle,
  Volume2,
  VolumeX,
  RotateCcw,
  Maximize,
  Minimize,
  Share,
  Circle,
  StopCircle
} from 'lucide-react';

interface TelehealthSession {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  type: 'video' | 'audio' | 'phone';
  reason: string;
  priority: 'routine' | 'urgent' | 'emergency';
}

interface ChatMessage {
  id: string;
  sender: string;
  senderType: 'doctor' | 'patient' | 'system';
  message: string;
  timestamp: string;
  type: 'text' | 'file' | 'prescription' | 'system';
}

export default function TelemedicineConsultation() {
  const [currentSession, setCurrentSession] = useState<TelehealthSession | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isSpeakerEnabled, setIsSpeakerEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('good');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');

  // Mock session data
  useEffect(() => {
    const mockSession: TelehealthSession = {
      id: 'TS001',
      patientName: 'Sarah Johnson',
      patientId: 'P001',
      doctorName: 'Dr. Emily Chen',
      scheduledTime: new Date().toISOString(),
      duration: 30,
      status: 'active',
      type: 'video',
      reason: 'Follow-up consultation for hypertension',
      priority: 'routine'
    };

    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        sender: 'System',
        senderType: 'system',
        message: 'Session started. All participants connected.',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        type: 'system'
      },
      {
        id: '2',
        sender: 'Dr. Emily Chen',
        senderType: 'doctor',
        message: 'Good morning, Sarah. How are you feeling today?',
        timestamp: new Date(Date.now() - 240000).toISOString(),
        type: 'text'
      },
      {
        id: '3',
        sender: 'Sarah Johnson',
        senderType: 'patient',
        message: 'Good morning, Doctor. I\'ve been feeling much better since starting the new medication.',
        timestamp: new Date(Date.now() - 180000).toISOString(),
        type: 'text'
      }
    ];

    setCurrentSession(mockSession);
    setChatMessages(mockMessages);
  }, []);

  const handleEndSession = () => {
    if (currentSession) {
      setCurrentSession({ ...currentSession, status: 'completed' });
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        sender: 'Dr. Emily Chen',
        senderType: 'doctor',
        message: newMessage,
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const getConnectionQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'routine': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!currentSession) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl mb-2">No Active Session</h2>
          <p className="text-muted-foreground">No telemedicine session is currently active.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 text-white overflow-hidden">
      <div className="flex h-full">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gray-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-lg font-medium">{currentSession.patientName}</h1>
                <p className="text-sm text-gray-300">{currentSession.reason}</p>
              </div>
              <Badge className={getPriorityColor(currentSession.priority)}>
                {currentSession.priority.toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  connectionQuality === 'excellent' ? 'bg-green-500' :
                  connectionQuality === 'good' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className={`text-sm ${getConnectionQualityColor()}`}>
                  {connectionQuality.charAt(0).toUpperCase() + connectionQuality.slice(1)}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>25:30</span>
              </div>

              {isRecording && (
                <div className="flex items-center gap-2 text-red-400">
                  <Circle className="w-4 h-4 animate-pulse fill-current" />
                  <span className="text-sm">Recording</span>
                </div>
              )}
            </div>
          </div>

          {/* Video Container */}
          <div className="flex-1 bg-black relative">
            {/* Patient Video (Main) */}
            <div className="w-full h-full relative">
              <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                <div className="text-center">
                  <User className="w-32 h-32 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">Patient Video</p>
                  <p className="text-white/40 text-sm">{currentSession.patientName}</p>
                </div>
              </div>

              {/* Doctor Video (Picture-in-Picture) */}
              <div className="absolute top-4 right-4 w-64 h-48 bg-gradient-to-br from-green-900 to-blue-900 rounded-lg border-2 border-white/20">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <User className="w-16 h-16 text-white/40 mx-auto mb-2" />
                    <p className="text-white/60 text-sm">You</p>
                  </div>
                </div>
              </div>

              {/* Screen Sharing Indicator */}
              {isScreenSharing && (
                <div className="absolute top-4 left-4 bg-blue-600 px-3 py-1 rounded-full flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  <span className="text-sm">Sharing Screen</span>
                </div>
              )}

              {/* Video Quality Warning */}
              {connectionQuality === 'poor' && (
                <Alert className="absolute bottom-20 left-4 right-4 bg-red-900/90 border-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-white">
                    Poor connection quality. Consider switching to audio-only mode.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Control Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gray-800/95 p-4">
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant={isVideoEnabled ? "default" : "destructive"}
                  onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  className="rounded-full w-12 h-12"
                >
                  {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>

                <Button
                  size="lg"
                  variant={isAudioEnabled ? "default" : "destructive"}
                  onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  className="rounded-full w-12 h-12"
                >
                  {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>

                <Button
                  size="lg"
                  variant={isSpeakerEnabled ? "default" : "secondary"}
                  onClick={() => setIsSpeakerEnabled(!isSpeakerEnabled)}
                  className="rounded-full w-12 h-12"
                >
                  {isSpeakerEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </Button>

                <Button
                  size="lg"
                  variant={isScreenSharing ? "default" : "secondary"}
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className="rounded-full w-12 h-12"
                >
                  <Share className="w-5 h-5" />
                </Button>

                <Button
                  size="lg"
                  variant={isRecording ? "destructive" : "secondary"}
                  onClick={() => setIsRecording(!isRecording)}
                  className="rounded-full w-12 h-12"
                >
                  {isRecording ? <StopCircle className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => setShowChat(!showChat)}
                  className="rounded-full w-12 h-12"
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full w-12 h-12"
                >
                  <Settings className="w-5 h-5" />
                </Button>

                <Button
                  size="lg"
                  variant="destructive"
                  onClick={handleEndSession}
                  className="rounded-full w-12 h-12"
                >
                  <PhoneOff className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className={`bg-gray-800 transition-all duration-300 ${showChat ? 'w-96' : 'w-0 overflow-hidden'}`}>
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3 bg-gray-700 rounded-none">
              <TabsTrigger value="chat" className="text-white">Chat</TabsTrigger>
              <TabsTrigger value="notes" className="text-white">Notes</TabsTrigger>
              <TabsTrigger value="files" className="text-white">Files</TabsTrigger>
            </TabsList>

            {/* Chat */}
            <TabsContent value="chat" className="flex-1 flex flex-col p-0">
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderType === 'doctor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs rounded-lg p-3 ${
                        message.senderType === 'doctor'
                          ? 'bg-blue-600 text-white'
                          : message.senderType === 'system'
                          ? 'bg-gray-600 text-gray-300 text-sm'
                          : 'bg-gray-700 text-white'
                      }`}
                    >
                      {message.senderType !== 'system' && (
                        <div className="text-xs opacity-70 mb-1">{message.sender}</div>
                      )}
                      <div>{message.message}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-700">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="bg-gray-700 border-gray-600 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button size="sm" onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Notes */}
            <TabsContent value="notes" className="flex-1 flex flex-col p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Session Notes</h3>
                <Textarea
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Enter consultation notes..."
                  className="bg-gray-700 border-gray-600 text-white min-h-[200px]"
                />
              </div>

              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Quick Templates
                </Button>
                <Button className="w-full" variant="outline">
                  <Heart className="w-4 h-4 mr-2" />
                  Add Prescription
                </Button>
                <Button className="w-full" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Follow-up
                </Button>
              </div>
            </TabsContent>

            {/* Files */}
            <TabsContent value="files" className="flex-1 flex flex-col p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Patient Files</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-700 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">Lab Results - 01/10/2024</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="p-3 bg-gray-700 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-400" />
                        <span className="text-sm">Previous Consultation</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-2">Share Files</h3>
                  <Button className="w-full" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Waiting Room Dialog */}
      <Dialog open={currentSession.status === 'scheduled'}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Waiting for Patient</DialogTitle>
            <DialogDescription>
              Please wait while the patient connects to the session. You can call or message them if needed.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-6">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Waiting for {currentSession.patientName} to join the session...
            </p>
            <div className="space-y-2">
              <Button className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Call Patient
              </Button>
              <Button variant="outline" className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Session Complete Dialog */}
      <Dialog open={currentSession.status === 'completed'}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Session Completed</DialogTitle>
            <DialogDescription>
              The consultation session has ended successfully. You can now complete your notes and schedule follow-up appointments.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Consultation with {currentSession.patientName} has ended.
            </p>
            <div className="space-y-2">
              <Button className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                Complete Notes
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Recording
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Follow-up
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}