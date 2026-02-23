/**
 * Hospital Onboarding Flow - First-time setup for new hospitals
 */

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Progress } from '../ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle, Building, Users, Settings, Upload, Download } from 'lucide-react';

interface OnboardingData {
  hospitalInfo: {
    name: string;
    type: string;
    address: string;
    phone: string;
    email: string;
    license: string;
    capacity: number;
    accreditation: string[];
  };
  departments: string[];
  adminUser: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  };
  preferences: {
    language: string;
    timezone: string;
    currency: string;
    dateFormat: string;
    features: string[];
  };
}

export default function HospitalOnboarding() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    hospitalInfo: {
      name: '',
      type: '',
      address: '',
      phone: '',
      email: '',
      license: '',
      capacity: 0,
      accreditation: []
    },
    departments: [],
    adminUser: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: ''
    },
    preferences: {
      language: 'en',
      timezone: '',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY',
      features: []
    }
  });

  const steps = [
    { id: 1, title: 'Hospital Information', icon: Building },
    { id: 2, title: 'Departments Setup', icon: Settings },
    { id: 3, title: 'Admin User', icon: Users },
    { id: 4, title: 'Preferences', icon: Settings },
    { id: 5, title: 'Completion', icon: CheckCircle }
  ];

  const hospitalTypes = [
    'General Hospital',
    'Specialty Hospital',
    'Teaching Hospital',
    'Research Hospital',
    'Private Clinic',
    'Public Hospital',
    'Emergency Care Center',
    'Rehabilitation Center'
  ];

  const availableDepartments = [
    'Emergency Department',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Obstetrics & Gynecology',
    'Internal Medicine',
    'Surgery',
    'Radiology',
    'Laboratory',
    'Pharmacy',
    'Intensive Care Unit',
    'Oncology',
    'Psychiatry',
    'Dermatology',
    'Ophthalmology',
    'ENT',
    'Anesthesiology'
  ];

  const availableFeatures = [
    'Electronic Medical Records (EMR)',
    'Laboratory Management',
    'Pharmacy Management',
    'Radiology & DICOM',
    'Billing & Insurance',
    'Appointment Scheduling',
    'Inventory Management',
    'Staff Management',
    'Telemedicine',
    'Analytics & Reporting',
    'Patient Portal',
    'Mobile App Access'
  ];

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    // Submit onboarding data
    try {
      console.log('Submitting onboarding data:', data);
      // API call to setup hospital
      // Redirect to main application
    } catch (error) {
      console.error('Onboarding error:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl mb-2">Hospital Information</h2>
              <p className="text-muted-foreground">Tell us about your healthcare facility</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="hospitalName">Hospital Name *</Label>
                <Input
                  id="hospitalName"
                  value={data.hospitalInfo.name}
                  onChange={(e) => setData({
                    ...data,
                    hospitalInfo: { ...data.hospitalInfo, name: e.target.value }
                  })}
                  placeholder="Enter hospital name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospitalType">Hospital Type *</Label>
                <Select
                  value={data.hospitalInfo.type}
                  onValueChange={(value) => setData({
                    ...data,
                    hospitalInfo: { ...data.hospitalInfo, type: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select hospital type" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitalTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={data.hospitalInfo.address}
                  onChange={(e) => setData({
                    ...data,
                    hospitalInfo: { ...data.hospitalInfo, address: e.target.value }
                  })}
                  placeholder="Enter complete address"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={data.hospitalInfo.phone}
                  onChange={(e) => setData({
                    ...data,
                    hospitalInfo: { ...data.hospitalInfo, phone: e.target.value }
                  })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={data.hospitalInfo.email}
                  onChange={(e) => setData({
                    ...data,
                    hospitalInfo: { ...data.hospitalInfo, email: e.target.value }
                  })}
                  placeholder="contact@hospital.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="license">License Number</Label>
                <Input
                  id="license"
                  value={data.hospitalInfo.license}
                  onChange={(e) => setData({
                    ...data,
                    hospitalInfo: { ...data.hospitalInfo, license: e.target.value }
                  })}
                  placeholder="Enter license number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Bed Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={data.hospitalInfo.capacity}
                  onChange={(e) => setData({
                    ...data,
                    hospitalInfo: { ...data.hospitalInfo, capacity: parseInt(e.target.value) || 0 }
                  })}
                  placeholder="Number of beds"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Settings className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl mb-2">Department Setup</h2>
              <p className="text-muted-foreground">Select the departments in your hospital</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {availableDepartments.map(dept => (
                <div key={dept} className="flex items-center space-x-2">
                  <Checkbox
                    id={dept}
                    checked={data.departments.includes(dept)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setData({
                          ...data,
                          departments: [...data.departments, dept]
                        });
                      } else {
                        setData({
                          ...data,
                          departments: data.departments.filter(d => d !== dept)
                        });
                      }
                    }}
                  />
                  <Label htmlFor={dept} className="text-sm">{dept}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl mb-2">Create Admin User</h2>
              <p className="text-muted-foreground">Set up the primary administrator account</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={data.adminUser.firstName}
                  onChange={(e) => setData({
                    ...data,
                    adminUser: { ...data.adminUser, firstName: e.target.value }
                  })}
                  placeholder="Enter first name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={data.adminUser.lastName}
                  onChange={(e) => setData({
                    ...data,
                    adminUser: { ...data.adminUser, lastName: e.target.value }
                  })}
                  placeholder="Enter last name"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="adminEmail">Email Address *</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={data.adminUser.email}
                  onChange={(e) => setData({
                    ...data,
                    adminUser: { ...data.adminUser, email: e.target.value }
                  })}
                  placeholder="admin@hospital.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminPhone">Phone Number</Label>
                <Input
                  id="adminPhone"
                  type="tel"
                  value={data.adminUser.phone}
                  onChange={(e) => setData({
                    ...data,
                    adminUser: { ...data.adminUser, phone: e.target.value }
                  })}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={data.adminUser.password}
                  onChange={(e) => setData({
                    ...data,
                    adminUser: { ...data.adminUser, password: e.target.value }
                  })}
                  placeholder="Create strong password"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Settings className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl mb-2">System Preferences</h2>
              <p className="text-muted-foreground">Configure your system settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="space-y-2">
                <Label htmlFor="language">Default Language</Label>
                <Select
                  value={data.preferences.language}
                  onValueChange={(value) => setData({
                    ...data,
                    preferences: { ...data.preferences, language: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">العربية (Arabic)</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={data.preferences.timezone}
                  onValueChange={(value) => setData({
                    ...data,
                    preferences: { ...data.preferences, timezone: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Asia/Riyadh">Riyadh</SelectItem>
                    <SelectItem value="Asia/Dubai">Dubai</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={data.preferences.currency}
                  onValueChange={(value) => setData({
                    ...data,
                    preferences: { ...data.preferences, currency: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="SAR">SAR (ر.س)</SelectItem>
                    <SelectItem value="AED">AED (د.إ)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <Select
                  value={data.preferences.dateFormat}
                  onValueChange={(value) => setData({
                    ...data,
                    preferences: { ...data.preferences, dateFormat: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Select Features to Enable</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableFeatures.map(feature => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox
                      id={feature}
                      checked={data.preferences.features.includes(feature)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setData({
                            ...data,
                            preferences: {
                              ...data.preferences,
                              features: [...data.preferences.features, feature]
                            }
                          });
                        } else {
                          setData({
                            ...data,
                            preferences: {
                              ...data.preferences,
                              features: data.preferences.features.filter(f => f !== feature)
                            }
                          });
                        }
                      }}
                    />
                    <Label htmlFor={feature} className="text-sm">{feature}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h2 className="text-2xl mb-2">Setup Complete!</h2>
              <p className="text-muted-foreground">Your hospital management system is ready to use</p>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-medium">Setup Summary</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Hospital:</strong> {data.hospitalInfo.name}</div>
                <div><strong>Type:</strong> {data.hospitalInfo.type}</div>
                <div><strong>Departments:</strong> {data.departments.length} selected</div>
                <div><strong>Admin User:</strong> {data.adminUser.firstName} {data.adminUser.lastName}</div>
                <div><strong>Features:</strong> {data.preferences.features.length} enabled</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Setup Report
              </Button>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Import Sample Data
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">Hospital Setup Wizard</h1>
          <p className="text-muted-foreground">Let's get your hospital management system configured</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <Progress value={(step / 5) * 100} className="mb-4" />
          <div className="flex justify-between">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`flex flex-col items-center ${
                  step >= s.id ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    step >= s.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  <s.icon className="w-4 h-4" />
                </div>
                <span className="text-xs text-center hidden md:block">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <div className="p-6">
            {renderStep()}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {step < 5 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="bg-success hover:bg-success/90">
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}