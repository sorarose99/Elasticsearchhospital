import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Bed,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Settings,
  Database,
  Shield
} from 'lucide-react';

interface HospitalInfo {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  licenseNumber: string;
  totalBeds: number;
  departments: string[];
}

export default function HospitalSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [hospitalInfo, setHospitalInfo] = useState<HospitalInfo>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    licenseNumber: '',
    totalBeds: 0,
    departments: []
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    console.log('Hospital setup completed:', hospitalInfo);
    alert('Hospital setup completed successfully!');
  };

  const updateField = (field: keyof HospitalInfo, value: any) => {
    setHospitalInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Hospital Setup Wizard</h1>
          <p className="text-muted-foreground">
            Let's set up your hospital management system
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Basic Info</span>
            <span>Location</span>
            <span>Configuration</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && 'Basic Information'}
              {currentStep === 2 && 'Location Details'}
              {currentStep === 3 && 'System Configuration'}
              {currentStep === 4 && 'Review & Complete'}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && 'Enter your hospital\'s basic information'}
              {currentStep === 2 && 'Provide location and contact details'}
              {currentStep === 3 && 'Configure system settings'}
              {currentStep === 4 && 'Review your information and complete setup'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Hospital Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter hospital name"
                    value={hospitalInfo.name}
                    onChange={(e) => updateField('name', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hospital@example.com"
                    value={hospitalInfo.email}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={hospitalInfo.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://www.hospital.com"
                    value={hospitalInfo.website}
                    onChange={(e) => updateField('website', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="license">License Number *</Label>
                  <Input
                    id="license"
                    placeholder="Enter license number"
                    value={hospitalInfo.licenseNumber}
                    onChange={(e) => updateField('licenseNumber', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={hospitalInfo.address}
                    onChange={(e) => updateField('address', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={hospitalInfo.city}
                      onChange={(e) => updateField('city', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State/Province *</Label>
                    <Input
                      id="state"
                      placeholder="State"
                      value={hospitalInfo.state}
                      onChange={(e) => updateField('state', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                    <Input
                      id="zipCode"
                      placeholder="12345"
                      value={hospitalInfo.zipCode}
                      onChange={(e) => updateField('zipCode', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      placeholder="Country"
                      value={hospitalInfo.country}
                      onChange={(e) => updateField('country', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Configuration */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="beds">Total Number of Beds *</Label>
                  <Input
                    id="beds"
                    type="number"
                    placeholder="100"
                    value={hospitalInfo.totalBeds || ''}
                    onChange={(e) => updateField('totalBeds', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label>Select Departments</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {[
                      'Emergency',
                      'Cardiology',
                      'Neurology',
                      'Pediatrics',
                      'Orthopedics',
                      'Radiology',
                      'Laboratory',
                      'Pharmacy',
                      'Surgery',
                      'ICU',
                      'Maternity',
                      'Oncology'
                    ].map((dept) => (
                      <label key={dept} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-accent">
                        <input
                          type="checkbox"
                          checked={hospitalInfo.departments.includes(dept)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateField('departments', [...hospitalInfo.departments, dept]);
                            } else {
                              updateField('departments', hospitalInfo.departments.filter(d => d !== dept));
                            }
                          }}
                        />
                        <span className="text-sm">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <h3 className="font-semibold">Setup Almost Complete!</h3>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-300">
                    Please review your information before completing the setup.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Hospital Name:</strong> {hospitalInfo.name || 'Not provided'}</p>
                      <p><strong>Email:</strong> {hospitalInfo.email || 'Not provided'}</p>
                      <p><strong>Phone:</strong> {hospitalInfo.phone || 'Not provided'}</p>
                      <p><strong>License:</strong> {hospitalInfo.licenseNumber || 'Not provided'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Location</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Address:</strong> {hospitalInfo.address || 'Not provided'}</p>
                      <p><strong>City:</strong> {hospitalInfo.city || 'Not provided'}</p>
                      <p><strong>State:</strong> {hospitalInfo.state || 'Not provided'}</p>
                      <p><strong>Country:</strong> {hospitalInfo.country || 'Not provided'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Configuration</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Total Beds:</strong> {hospitalInfo.totalBeds || 0}</p>
                      <p><strong>Departments:</strong></p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {hospitalInfo.departments.length > 0 ? (
                          hospitalInfo.departments.map((dept) => (
                            <Badge key={dept} variant="secondary">{dept}</Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">None selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Setup
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
