import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Clock, User, MapPin } from 'lucide-react';

export default function AppointmentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  const mockAppointments = [
    {
      id: '1',
      time: '09:00',
      duration: 30,
      patient: 'John Doe',
      doctor: 'Dr. Sarah Smith',
      type: 'Consultation',
      location: 'Room 101',
      status: 'confirmed'
    },
    {
      id: '2',
      time: '10:30',
      duration: 60,
      patient: 'Jane Smith',
      doctor: 'Dr. Michael Johnson',
      type: 'Procedure',
      location: 'Room 202',
      status: 'scheduled'
    },
    {
      id: '3',
      time: '14:00',
      duration: 30,
      patient: 'Robert Brown',
      doctor: 'Dr. Emily Davis',
      type: 'Follow-up',
      location: 'Room 103',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 border-green-500 text-green-800';
      case 'scheduled': return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'completed': return 'bg-gray-100 border-gray-500 text-gray-800';
      case 'cancelled': return 'bg-red-100 border-red-500 text-red-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Appointment Calendar</h2>
          <p className="text-muted-foreground">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={view === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('day')}
            >
              Day
            </Button>
            <Button
              variant={view === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('week')}
            >
              Week
            </Button>
            <Button
              variant={view === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('month')}
            >
              Month
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-6">
          {view === 'week' && (
            <div className="space-y-4">
              {/* Week Header */}
              <div className="grid grid-cols-8 gap-2">
                <div className="text-sm font-medium text-muted-foreground">Time</div>
                {daysOfWeek.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm font-medium">{day}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + index).getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                {hours.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 gap-2">
                    <div className="text-sm text-muted-foreground py-2">
                      {hour}:00
                    </div>
                    {daysOfWeek.map((_, dayIndex) => (
                      <div
                        key={dayIndex}
                        className="border rounded-lg p-2 min-h-[80px] hover:bg-muted/50 transition-colors relative"
                      >
                        {/* Show appointments for current day and hour */}
                        {dayIndex === currentDate.getDay() && 
                         mockAppointments
                           .filter(apt => parseInt(apt.time.split(':')[0]) === hour)
                           .map(apt => (
                             <div
                               key={apt.id}
                               className={`text-xs p-2 rounded border-l-2 ${getStatusColor(apt.status)}`}
                             >
                               <div className="font-medium">{apt.time}</div>
                               <div className="truncate">{apt.patient}</div>
                               <div className="text-xs opacity-75">{apt.doctor}</div>
                             </div>
                           ))
                        }
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'day' && (
            <div className="space-y-2">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">
                  {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
              </div>
              {hours.map((hour) => (
                <div key={hour} className="flex gap-4 border-b pb-4">
                  <div className="w-20 text-sm text-muted-foreground py-2">
                    {hour}:00
                  </div>
                  <div className="flex-1 space-y-2">
                    {mockAppointments
                      .filter(apt => parseInt(apt.time.split(':')[0]) === hour)
                      .map(apt => (
                        <div
                          key={apt.id}
                          className={`p-4 rounded-lg border-l-4 ${getStatusColor(apt.status)}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-semibold">{apt.patient}</div>
                              <div className="text-sm flex items-center gap-4 mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {apt.time} ({apt.duration} min)
                                </span>
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {apt.doctor}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {apt.location}
                                </span>
                              </div>
                            </div>
                            <Badge variant="outline">{apt.type}</Badge>
                          </div>
                        </div>
                      ))
                    }
                    {mockAppointments.filter(apt => parseInt(apt.time.split(':')[0]) === hour).length === 0 && (
                      <div className="text-sm text-muted-foreground italic py-2">
                        No appointments scheduled
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {view === 'month' && (
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-center text-sm font-medium py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
                  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
                  const dayNumber = i - firstDay + 1;
                  const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
                  const isToday = isCurrentMonth && dayNumber === new Date().getDate() && 
                                 currentDate.getMonth() === new Date().getMonth();

                  return (
                    <div
                      key={i}
                      className={`border rounded-lg p-2 min-h-[100px] ${
                        isCurrentMonth ? 'bg-background' : 'bg-muted/30'
                      } ${isToday ? 'ring-2 ring-primary' : ''}`}
                    >
                      {isCurrentMonth && (
                        <>
                          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary' : ''}`}>
                            {dayNumber}
                          </div>
                          <div className="space-y-1">
                            {mockAppointments.slice(0, 2).map((apt, idx) => (
                              <div
                                key={idx}
                                className="text-xs p-1 bg-primary/10 rounded truncate"
                              >
                                {apt.time} - {apt.patient}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Status Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
              <span className="text-sm">Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
              <span className="text-sm">Scheduled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border-2 border-gray-500 rounded"></div>
              <span className="text-sm">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded"></div>
              <span className="text-sm">Cancelled</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
