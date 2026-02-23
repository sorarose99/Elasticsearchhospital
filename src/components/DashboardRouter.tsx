import React from 'react';
import { NavigationProvider } from './navigation/NavigationContext';
import { MainLayout } from './navigation/MainLayout';
import { useNavigation } from './navigation/NavigationContext';

// Import all dashboard components
import AdminDashboard from './dashboards/AdminDashboard';
import DoctorDashboard from './dashboards/DoctorDashboard';
import ReceptionDashboard from './dashboards/ReceptionDashboard';
import LabDashboard from './dashboards/LabDashboard';
import PharmacyDashboard from './dashboards/PharmacyDashboard';
import BillingDashboard from './dashboards/BillingDashboard';
import RadiologyDashboard from './dashboards/RadiologyDashboard';
import ComprehensiveDashboard from './dashboards/ComprehensiveDashboard';

// Import medical components
import AppointmentScheduler from './medical/AppointmentScheduler';
import PatientEMR from './medical/PatientEMR';

// Import new comprehensive components
import PatientManagement from './patients/PatientManagement';
import AppointmentsDashboard from './appointments/AppointmentsDashboard';
import ComprehensiveAppointmentScheduler from './appointments/ComprehensiveAppointmentScheduler';
import PharmacyManagement from './pharmacy/PharmacyManagement';
import LaboratoryManagement from './laboratory/LaboratoryManagement';

// Import new advanced components
import MedicalSpecializationsManagement from './specializations/MedicalSpecializationsManagement';
import MobileAppInterface from './mobile/MobileAppInterface';
import IoTDeviceManagement from './iot/IoTDeviceManagement';
import AIAssistantDiagnostics from './ai/AIAssistantDiagnostics';

// Import additional management components
import NursingManagement from './nursing/NursingManagement';
import InventoryManagement from './inventory/InventoryManagement';
import StaffManagement from './staff/StaffManagement';
import InsuranceManagement from './insurance/InsuranceManagement';
import CommunicationCenter from './communication/CommunicationCenter';
import EmergencyManagement from './emergency/EmergencyManagement';
import TelemedicineConsultation from './telemedicine/TelemedicineConsultation';
import PatientPortal from './patient/PatientPortal';
import DischargePlanning from './discharge/DischargePlanning';
import HospitalOnboarding from './onboarding/HospitalOnboarding';
import QualityManagement from './quality/QualityManagement';
import TestRouter from './test/TestRouter';

// Import analytics components
import AdvancedReports from './analytics/AdvancedReports';
import AnalyticsDashboard from './analytics/AnalyticsDashboard';

// Import reports components
import ReportsDashboard from './reports/ReportsDashboard';
import OverviewReports from './reports/OverviewReports';
import FinancialReports from './reports/FinancialReports';
import ClinicalReports from './reports/ClinicalReports';
import OperationalReports from './reports/OperationalReports';

// Import new comprehensive financial reports system
import ReportsMain from './reports/ReportsMain';

import PatientOverview from './admin/PatientOverview';
import UserManagement from './admin/UserManagement';
import SystemReports from './admin/SystemReports';
import HL7Integration from './lab/HL7Integration';
import DICOMViewer from './radiology/DICOMViewer';
import BillingManagement from './billing/BillingManagement';
import RadiologyManagement from './radiology/RadiologyManagement';
import ClinicalResearch from './research/ClinicalResearch';
import { SettingsPage } from './settings/SettingsPage';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  specialization?: string;
  department?: string;
}

interface DashboardRouterProps {
  user: User;
  onLogout: () => void;
  language: 'en' | 'ar';
  onLanguageChange: (lang: 'en' | 'ar') => void;
  isDemoMode?: boolean;
}

// Main content component that uses navigation context
const DashboardContent: React.FC<Omit<DashboardRouterProps, 'user'> & { user: User }> = ({ 
  user, 
  onLogout, 
  language, 
  onLanguageChange, 
  isDemoMode = false 
}) => {
  const { navigation } = useNavigation();

  const renderContent = () => {
    const { currentModule, currentView } = navigation;

    // Route based on current module and view
    switch (currentModule) {
      case 'dashboard':
        return getDashboardByRole(user.role);

      case 'patients':
        switch (currentView) {
          case 'list':
            return <PatientManagement />;
          case 'registration':
            return <PatientManagement />;
          case 'emr':
            // EMR needs patient data - redirect to patient list if no patient selected
            return <PatientManagement />;
          default:
            return <PatientManagement />;
        }

      case 'appointments':
        switch (currentView) {
          case 'scheduler':
            return <ComprehensiveAppointmentScheduler />;
          case 'dashboard':
            return <AppointmentsDashboard isDemoMode={isDemoMode} />;
          default:
            return <ComprehensiveAppointmentScheduler />;
        }

      case 'laboratory':
        switch (currentView) {
          case 'hl7':
            return <HL7Integration user={user} language={language} />;
          default:
            return <LaboratoryManagement />;
        }

      case 'pharmacy':
        return <PharmacyManagement />;

      case 'radiology':
        switch (currentView) {
          case 'dicom':
            return <DICOMViewer user={user} language={language} />;
          case 'management':
            return <RadiologyManagement userRole={user.role} />;
          default:
            return <RadiologyManagement userRole={user.role} />;
        }

      case 'billing':
        switch (currentView) {
          case 'management':
            return <BillingManagement userRole={user.role} />;
          default:
            return <BillingManagement userRole={user.role} />;
        }

      case 'reports':
        switch (currentView) {
          case 'dashboard':
            return <ReportsDashboard userRole={user.role} />;
          case 'overview':
            return <OverviewReports userRole={user.role} />;
          case 'financial':
            return <ReportsMain initialReport="dashboard" />;
          case 'clinical':
            return <ClinicalReports userRole={user.role} />;
          case 'operational':
            return <OperationalReports userRole={user.role} />;
          case 'financial_advanced':
            return <ReportsMain initialReport="dashboard" />;
          default:
            return <ReportsDashboard userRole={user.role} />;
        }

      case 'analytics':
        return <AnalyticsDashboard userRole={user.role} />;

      case 'administration':
        switch (currentView) {
          case 'users':
            return <UserManagement user={user} language={language} />;
          case 'system':
            return <SystemReports isDemoMode={isDemoMode} />;
          default:
            return <AdminDashboard 
              user={user} 
              onLogout={onLogout}
              language={language}
              onLanguageChange={onLanguageChange}
            />;
        }

      case 'nursing':
        return <NursingManagement />;

      case 'inventory':
        return <InventoryManagement />;

      case 'staff':
        return <StaffManagement />;

      case 'insurance':
        return <InsuranceManagement />;

      case 'communication':
        return <CommunicationCenter />;

      case 'emergency':
        return <EmergencyManagement />;

      case 'telemedicine':
        return <TelemedicineConsultation />;

      case 'patient_portal':
        return <PatientPortal />;

      case 'discharge':
        return <DischargePlanning />;

      case 'onboarding':
        return <HospitalOnboarding />;

      case 'quality':
        return <QualityManagement />;

      case 'research':
        return <ClinicalResearch />;

      case 'specializations':
        return <MedicalSpecializationsManagement isDemoMode={isDemoMode} />;

      case 'mobile_apps':
        return <MobileAppInterface isDemoMode={isDemoMode} />;

      case 'iot_devices':
        return <IoTDeviceManagement isDemoMode={isDemoMode} />;

      case 'ai_diagnostics':
        return <AIAssistantDiagnostics isDemoMode={isDemoMode} />;

      case 'testing':
        return <TestRouter />;

      case 'settings':
        return <SettingsPage 
          user={user} 
          language={language} 
          onLanguageChange={onLanguageChange}
        />;

      default:
        return getDashboardByRole(user.role);
    }
  };

  const getDashboardByRole = (role: string) => {
    const commonProps = {
      user,
      onLogout,
      language,
      onLanguageChange,
      isDemoMode
    };

    switch (role) {
      case 'admin':
        return <ComprehensiveDashboard userRole={role} />;
      case 'doctor':
        return <DoctorDashboard {...commonProps} />;
      case 'receptionist':
        return <ReceptionDashboard {...commonProps} />;
      case 'lab_tech':
        return <LabDashboard {...commonProps} />;
      case 'pharmacist':
        return <PharmacyDashboard {...commonProps} />;
      case 'radiologist':
        return <RadiologyDashboard {...commonProps} />;
      case 'billing':
        return <BillingDashboard {...commonProps} />;
      default:
        return <ComprehensiveDashboard userRole={role} />;
    }
  };

  return (
    <MainLayout
      user={user}
      language={language}
      onLanguageChange={onLanguageChange}
      onLogout={onLogout}
      isDemoMode={isDemoMode}
    >
      {renderContent()}
    </MainLayout>
  );
};

export default function DashboardRouter({ 
  user, 
  onLogout, 
  language, 
  onLanguageChange, 
  isDemoMode = false 
}: DashboardRouterProps) {
  return (
    <NavigationProvider userRole={user.role}>
      <DashboardContent
        user={user}
        onLogout={onLogout}
        language={language}
        onLanguageChange={onLanguageChange}
        isDemoMode={isDemoMode}
      />
    </NavigationProvider>
  );
}