import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Printer,
  Filter
} from 'lucide-react';

export default function AppointmentReports() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const stats = {
    totalAppointments: 1248,
    completedAppointments: 1056,
    cancelledAppointments: 124,
    noShowAppointments: 68,
    averageWaitTime: 18,
    completionRate: 84.6,
    cancellationRate: 9.9,
    noShowRate: 5.5
  };

  const appointmentsByType = [
    { type: 'Consultation', count: 524, percentage: 42 },
    { type: 'Follow-up', count: 412, percentage: 33 },
    { type: 'Procedure', count: 218, percentage: 17.5 },
    { type: 'Emergency', count: 94, percentage: 7.5 }
  ];

  const appointmentsByDoctor = [
    { doctor: 'Dr. Sarah Smith', appointments: 342, rating: 4.8 },
    { doctor: 'Dr. Michael Johnson', appointments: 298, rating: 4.7 },
    { doctor: 'Dr. Emily Davis', appointments: 276, rating: 4.9 },
    { doctor: 'Dr. Ahmad Al-Ali', appointments: 332, rating: 4.6 }
  ];

  const appointmentsByDay = [
    { day: 'Monday', count: 198 },
    { day: 'Tuesday', count: 186 },
    { day: 'Wednesday', count: 204 },
    { day: 'Thursday', count: 192 },
    { day: 'Friday', count: 168 },
    { day: 'Saturday', count: 142 },
    { day: 'Sunday', count: 158 }
  ];

  const peakHours = [
    { hour: '09:00 - 10:00', count: 124 },
    { hour: '10:00 - 11:00', count: 156 },
    { hour: '11:00 - 12:00', count: 142 },
    { hour: '14:00 - 15:00', count: 138 },
    { hour: '15:00 - 16:00', count: 118 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Appointment Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive statistics and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={timeRange === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('week')}
            >
              Week
            </Button>
            <Button
              variant={timeRange === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('month')}
            >
              Month
            </Button>
            <Button
              variant={timeRange === 'year' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('year')}
            >
              Year
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              <Badge variant="outline">Total</Badge>
            </div>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-sm text-muted-foreground">Total Appointments</p>
            <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12% from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <Badge variant="outline">Completed</Badge>
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.completedAppointments}</div>
            <p className="text-sm text-muted-foreground">Completed</p>
            <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
              <span>{stats.completionRate}% completion rate</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <XCircle className="w-8 h-8 text-red-600" />
              <Badge variant="outline">Cancelled</Badge>
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.cancelledAppointments}</div>
            <p className="text-sm text-muted-foreground">Cancelled</p>
            <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>{stats.cancellationRate}% cancellation rate</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-orange-600" />
              <Badge variant="outline">Avg Wait</Badge>
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.averageWaitTime}m</div>
            <p className="text-sm text-muted-foreground">Average Wait Time</p>
            <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>-3 min from last {timeRange}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Appointments by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointmentsByType.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{item.type}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appointments by Doctor */}
        <Card>
          <CardHeader>
            <CardTitle>Appointments by Doctor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointmentsByDoctor.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">{item.doctor}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.appointments} appointments
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">⭐ {item.rating}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appointments by Day */}
        <Card>
          <CardHeader>
            <CardTitle>Appointments by Day of Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointmentsByDay.map((item, index) => {
                const maxCount = Math.max(...appointmentsByDay.map(d => d.count));
                const percentage = (item.count / maxCount) * 100;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.day}</span>
                      <span className="text-sm text-muted-foreground">{item.count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {peakHours.map((item, index) => {
                const maxCount = Math.max(...peakHours.map(h => h.count));
                const percentage = (item.count / maxCount) * 100;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.hour}</span>
                      <span className="text-sm text-muted-foreground">{item.count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Summary Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-600">Positive Trends</span>
              </div>
              <ul className="text-sm space-y-1 text-green-700 dark:text-green-300">
                <li>• Completion rate increased by 5%</li>
                <li>• Average wait time decreased</li>
                <li>• Patient satisfaction up 8%</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-600">Key Metrics</span>
              </div>
              <ul className="text-sm space-y-1 text-blue-700 dark:text-blue-300">
                <li>• Wednesday is busiest day</li>
                <li>• 10-11 AM peak hour</li>
                <li>• Dr. Smith has most bookings</li>
              </ul>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-600">Recommendations</span>
              </div>
              <ul className="text-sm space-y-1 text-orange-700 dark:text-orange-300">
                <li>• Add staff on Wednesdays</li>
                <li>• Reduce no-show rate</li>
                <li>• Optimize morning slots</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
