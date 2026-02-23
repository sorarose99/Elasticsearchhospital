import React, { useState } from 'react';
import { Calendar, Clock, User, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { useLanguage } from '../../services/LanguageService';

interface AppointmentSchedulerProps {
  doctor: any;
  language: 'en' | 'ar';
}

const translations = {
  en: {
    title: 'Appointment Scheduler',
    scheduleNew: 'Schedule New Appointment',
    patient: 'Patient',
    date: 'Date',
    time: 'Time',
    type: 'Appointment Type',
    consultation: 'Consultation',
    followUp: 'Follow-up',
    checkUp: 'Check-up',
    schedule: 'Schedule',
    cancel: 'Cancel',
    upcomingAppointments: 'Upcoming Appointments',
    todaySchedule: "Today's Schedule",
  },
  ar: {
    title: 'جدولة المواعيد',
    scheduleNew: 'جدولة موعد جديد',
    patient: 'المريض',
    date: 'التاريخ',
    time: 'الوقت',
    type: 'نوع الموعد',
    consultation: 'استشارة',
    followUp: 'متابعة',
    checkUp: 'فحص',
    schedule: 'جدولة',
    cancel: 'إلغاء',
    upcomingAppointments: 'المواعيد القادمة',
    todaySchedule: 'جدول اليوم',
  }
};

export default function AppointmentScheduler({ doctor, language }: AppointmentSchedulerProps) {
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patient: '',
    date: '',
    time: '',
    type: ''
  });

  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t.title}</CardTitle>
          <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t.scheduleNew}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.scheduleNew}</DialogTitle>
                <DialogDescription>
                  Schedule a new appointment for your patient
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t.patient}</Label>
                  <Input
                    value={newAppointment.patient}
                    onChange={(e) => setNewAppointment({...newAppointment, patient: e.target.value})}
                    placeholder="Enter patient name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t.date}</Label>
                    <Input
                      type="date"
                      value={newAppointment.date}
                      onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.time}</Label>
                    <Input
                      type="time"
                      value={newAppointment.time}
                      onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{t.type}</Label>
                  <Select value={newAppointment.type} onValueChange={(value) => setNewAppointment({...newAppointment, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">{t.consultation}</SelectItem>
                      <SelectItem value="follow-up">{t.followUp}</SelectItem>
                      <SelectItem value="check-up">{t.checkUp}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                  {t.cancel}
                </Button>
                <Button onClick={() => setShowScheduleDialog(false)}>
                  {t.schedule}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t('dashboard.appointmentSchedulerComingSoon')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}