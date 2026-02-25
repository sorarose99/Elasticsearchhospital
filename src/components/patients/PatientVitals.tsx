import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Activity, Heart, Thermometer, Wind, Droplets, TrendingUp, TrendingDown, Plus } from 'lucide-react';

interface PatientVitalsProps {
  patientId: string | null;
}

export default function PatientVitals({ patientId }: PatientVitalsProps) {
  const [vitals, setVitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadVitals();
  }, [patientId]);

  const loadVitals = async () => {
    setLoading(true);
    try {
      // Simulated data - replace with Firebase call
      const mockVitals = [
        {
          id: '1',
          patientId: 'P001',
          patientName: 'John Doe',
          timestamp: '2024-03-15 10:30 AM',
          bloodPressure: '120/80',
          heartRate: 72,
          temperature: 98.6,
          respiratoryRate: 16,
          oxygenSaturation: 98,
          weight: 75,
          height: 175,
          bmi: 24.5,
          recordedBy: 'Nurse Sarah'
        },
        {
          id: '2',
          patientId: 'P001',
          patientName: 'John Doe',
          timestamp: '2024-03-14 2:15 PM',
          bloodPressure: '118/78',
          heartRate: 70,
          temperature: 98.4,
          respiratoryRate: 15,
          oxygenSaturation: 99,
          weight: 75,
          height: 175,
          bmi: 24.5,
          recordedBy: 'Nurse Mike'
        }
      ];

      const filtered = patientId 
        ? mockVitals.filter(v => v.patientId === patientId)
        : mockVitals;

      setVitals(filtered);
    } catch (error) {
      console.error('Error loading vitals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVitalStatus = (type: string, value: number) => {
    const ranges: Record<string, any> = {
      heartRate: { low: 60, high: 100, unit: 'bpm' },
      temperature: { low: 97, high: 99, unit: '°F' },
      respiratoryRate: { low: 12, high: 20, unit: '/min' },
      oxygenSaturation: { low: 95, high: 100, unit: '%' }
    };

    const range = ranges[type];
    if (!range) return 'normal';

    if (value < range.low) return 'low';
    if (value > range.high) return 'high';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-blue-600';
      case 'high': return 'text-red-600';
      default: return 'text-green-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'low': return <TrendingDown className="w-4 h-4" />;
      case 'high': return <TrendingUp className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading vitals...</p>
        </div>
      </div>
    );
  }

  const latestVitals = vitals[0];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Patient Vitals & Monitoring</h2>
          <p className="text-muted-foreground">
            {patientId ? `Vital signs for patient ${patientId}` : 'All patient vitals'}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Record Vitals
        </Button>
      </div>

      {/* Current Vitals Dashboard */}
      {latestVitals && (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-4">Current Vitals</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Blood Pressure */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Heart className="w-8 h-8 text-red-500" />
                    <Badge variant="outline">BP</Badge>
                  </div>
                  <div className="text-2xl font-bold">{latestVitals.bloodPressure}</div>
                  <p className="text-sm text-muted-foreground">Blood Pressure (mmHg)</p>
                </CardContent>
              </Card>

              {/* Heart Rate */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className={`w-8 h-8 ${getStatusColor(getVitalStatus('heartRate', latestVitals.heartRate))}`} />
                    {getStatusIcon(getVitalStatus('heartRate', latestVitals.heartRate))}
                  </div>
                  <div className="text-2xl font-bold">{latestVitals.heartRate}</div>
                  <p className="text-sm text-muted-foreground">Heart Rate (bpm)</p>
                </CardContent>
              </Card>

              {/* Temperature */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Thermometer className={`w-8 h-8 ${getStatusColor(getVitalStatus('temperature', latestVitals.temperature))}`} />
                    {getStatusIcon(getVitalStatus('temperature', latestVitals.temperature))}
                  </div>
                  <div className="text-2xl font-bold">{latestVitals.temperature}°F</div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                </CardContent>
              </Card>

              {/* Oxygen Saturation */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Wind className={`w-8 h-8 ${getStatusColor(getVitalStatus('oxygenSaturation', latestVitals.oxygenSaturation))}`} />
                    {getStatusIcon(getVitalStatus('oxygenSaturation', latestVitals.oxygenSaturation))}
                  </div>
                  <div className="text-2xl font-bold">{latestVitals.oxygenSaturation}%</div>
                  <p className="text-sm text-muted-foreground">Oxygen Saturation</p>
                </CardContent>
              </Card>

              {/* Respiratory Rate */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Droplets className={`w-8 h-8 ${getStatusColor(getVitalStatus('respiratoryRate', latestVitals.respiratoryRate))}`} />
                    {getStatusIcon(getVitalStatus('respiratoryRate', latestVitals.respiratoryRate))}
                  </div>
                  <div className="text-2xl font-bold">{latestVitals.respiratoryRate}</div>
                  <p className="text-sm text-muted-foreground">Respiratory Rate (/min)</p>
                </CardContent>
              </Card>

              {/* Weight */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 text-blue-500" />
                    <Badge variant="outline">Weight</Badge>
                  </div>
                  <div className="text-2xl font-bold">{latestVitals.weight} kg</div>
                  <p className="text-sm text-muted-foreground">Body Weight</p>
                </CardContent>
              </Card>

              {/* Height */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 text-purple-500" />
                    <Badge variant="outline">Height</Badge>
                  </div>
                  <div className="text-2xl font-bold">{latestVitals.height} cm</div>
                  <p className="text-sm text-muted-foreground">Body Height</p>
                </CardContent>
              </Card>

              {/* BMI */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 text-green-500" />
                    <Badge variant="outline">BMI</Badge>
                  </div>
                  <div className="text-2xl font-bold">{latestVitals.bmi}</div>
                  <p className="text-sm text-muted-foreground">Body Mass Index</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Latest Reading Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last recorded</p>
                  <p className="font-semibold">{latestVitals.timestamp}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Recorded by</p>
                  <p className="font-semibold">{latestVitals.recordedBy}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Vitals History */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Vitals History</h3>
        <div className="space-y-4">
          {vitals.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No vitals recorded yet</p>
              </CardContent>
            </Card>
          ) : (
            vitals.map((vital) => (
              <Card key={vital.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">{vital.patientName}</h4>
                      <p className="text-sm text-muted-foreground">{vital.timestamp}</p>
                    </div>
                    <Badge variant="outline">{vital.recordedBy}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">BP</p>
                      <p className="font-semibold">{vital.bloodPressure}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Heart Rate</p>
                      <p className="font-semibold">{vital.heartRate} bpm</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Temperature</p>
                      <p className="font-semibold">{vital.temperature}°F</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">SpO2</p>
                      <p className="font-semibold">{vital.oxygenSaturation}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
