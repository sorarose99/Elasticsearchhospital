import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Heart,
  Shield,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Save
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

interface NewPatientRegistrationProps {
  onComplete: () => void;
}

export default function NewPatientRegistration({ onComplete }: NewPatientRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    maritalStatus: '',
    
    // Contact Information
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Emergency Contact
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    
    // Insurance
    hasInsurance: false,
    insuranceProvider: '',
    policyNumber: '',
    groupNumber: '',
    
    // Medical Information
    allergies: '',
    medications: '',
    medicalHistory: '',
    notes: ''
  });

  const totalSteps = 5;

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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

  const handleSubmit = () => {
    console.log('Submitting patient data:', formData);
    // Here you would save to Firebase
    alert('Patient registered successfully!');
    onComplete();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">New Patient Registration</h1>
        <p className="text-muted-foreground">
          Complete all steps to register a new patient
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4, 5].map((step) => (
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
              {step < 5 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Personal</span>
          <span>Contact</span>
          <span>Emergency</span>
          <span>Insurance</span>
          <span>Medical</span>
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && 'Personal Information'}
            {currentStep === 2 && 'Contact Information'}
            {currentStep === 3 && 'Emergency Contact'}
            {currentStep === 4 && 'Insurance Information'}
            {currentStep === 5 && 'Medical Information'}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && 'Enter patient\'s basic personal details'}
            {currentStep === 2 && 'Provide contact and address information'}
            {currentStep === 3 && 'Emergency contact person details'}
            {currentStep === 4 && 'Insurance coverage information'}
            {currentStep === 5 && 'Medical history and current conditions'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender} onValueChange={(value) => updateField('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select value={formData.bloodType} onValueChange={(value) => updateField('bloodType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select value={formData.maritalStatus} onValueChange={(value) => updateField('maritalStatus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="john.doe@email.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State/Province *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    placeholder="NY"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => updateField('zipCode', e.target.value)}
                    placeholder="10001"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    placeholder="United States"
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 3: Emergency Contact */}
          {currentStep === 3 && (
            <>
              <div>
                <Label htmlFor="emergencyName">Emergency Contact Name *</Label>
                <Input
                  id="emergencyName"
                  value={formData.emergencyName}
                  onChange={(e) => updateField('emergencyName', e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => updateField('emergencyPhone', e.target.value)}
                  placeholder="+1 234 567 8901"
                />
              </div>

              <div>
                <Label htmlFor="emergencyRelationship">Relationship *</Label>
                <Select value={formData.emergencyRelationship} onValueChange={(value) => updateField('emergencyRelationship', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Step 4: Insurance */}
          {currentStep === 4 && (
            <>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasInsurance"
                  checked={formData.hasInsurance}
                  onChange={(e) => updateField('hasInsurance', e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="hasInsurance">Patient has insurance coverage</Label>
              </div>

              {formData.hasInsurance && (
                <>
                  <div>
                    <Label htmlFor="insuranceProvider">Insurance Provider *</Label>
                    <Input
                      id="insuranceProvider"
                      value={formData.insuranceProvider}
                      onChange={(e) => updateField('insuranceProvider', e.target.value)}
                      placeholder="Blue Cross Blue Shield"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="policyNumber">Policy Number *</Label>
                      <Input
                        id="policyNumber"
                        value={formData.policyNumber}
                        onChange={(e) => updateField('policyNumber', e.target.value)}
                        placeholder="POL123456"
                      />
                    </div>
                    <div>
                      <Label htmlFor="groupNumber">Group Number</Label>
                      <Input
                        id="groupNumber"
                        value={formData.groupNumber}
                        onChange={(e) => updateField('groupNumber', e.target.value)}
                        placeholder="GRP789"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Step 5: Medical Information */}
          {currentStep === 5 && (
            <>
              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  value={formData.allergies}
                  onChange={(e) => updateField('allergies', e.target.value)}
                  placeholder="List any known allergies (e.g., Penicillin, Peanuts)"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  value={formData.medications}
                  onChange={(e) => updateField('medications', e.target.value)}
                  placeholder="List current medications and dosages"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => updateField('medicalHistory', e.target.value)}
                  placeholder="Previous diagnoses, surgeries, chronic conditions"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Any other relevant information"
                  rows={3}
                />
              </div>
            </>
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
          <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Register Patient
          </Button>
        )}
      </div>
    </div>
  );
}
