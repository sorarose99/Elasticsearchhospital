import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building2,
  Shield,
  Users,
  Database,
  Cloud,
  Network,
  Lock,
  Key,
  Monitor,
  Server,
  Wifi,
  Globe,
  FileText,
  Bell,
  Mail,
  Phone,
  Calendar,
  Clock,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  Save,
  Plus,
  Minus,
  Edit,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  X,
  Check,
  Info,
  HelpCircle,
  ExternalLink,
  Smartphone,
  Tablet,
  Laptop,
  Cpu,
  HardDrive,
  MemoryStick,
  Router,
  MapPin,
  Flag,
  UserCheck,
  UserPlus,
  Crown,
  Briefcase,
  GraduationCap,
  Award,
  Star,
  Bookmark
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useLanguage } from '../../services/LanguageService';
import { motion, AnimatePresence } from 'motion/react';

interface OrganizationProfile {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'healthcare-system' | 'medical-center';
  size: 'small' | 'medium' | 'large' | 'enterprise';
  locations: number;
  employees: number;
  beds: number;
  departments: string[];
  certifications: string[];
  region: string;
  timezone: string;
  languages: string[];
}

interface SecurityConfiguration {
  authentication: {
    twoFactorRequired: boolean;
    biometricEnabled: boolean;
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireSpecialChars: boolean;
      requireNumbers: boolean;
      requireUppercase: boolean;
      expirationDays: number;
    };
  };
  dataProtection: {
    encryptionLevel: 'basic' | 'advanced' | 'enterprise';
    auditLogging: boolean;
    dataRetention: number;
    backupFrequency: 'daily' | 'hourly' | 'real-time';
  };
  accessControl: {
    roleBasedAccess: boolean;
    departmentIsolation: boolean;
    ipRestrictions: string[];
    deviceManagement: boolean;
  };
}

interface SystemConfiguration {
  performance: {
    maxConcurrentUsers: number;
    dataProcessingTier: 'basic' | 'standard' | 'premium' | 'enterprise';
    cacheEnabled: boolean;
    loadBalancing: boolean;
  };
  integration: {
    hl7Enabled: boolean;
    fhirEnabled: boolean;
    apiRateLimit: number;
    webhookEnabled: boolean;
    ssoProviders: string[];
  };
  monitoring: {
    uptimeMonitoring: boolean;
    performanceAlerts: boolean;
    errorTracking: boolean;
    usageAnalytics: boolean;
  };
}

interface EnterpriseSettingsProps {
  organizationId?: string;
  onSave?: (settings: any) => void;
  onClose?: () => void;
}

const enterpriseFeatures = [
  {
    category: 'Multi-Location Management',
    categoryKey: 'enterprise.features.multiLocation.title',
    icon: Building2,
    color: 'from-blue-500 to-cyan-500',
    features: [
      {
        name: 'Centralized Administration',
        nameKey: 'enterprise.features.multiLocation.centralized',
        description: 'Manage all locations from a single dashboard',
        descKey: 'enterprise.features.multiLocation.centralizedDesc'
      },
      {
        name: 'Cross-Location Analytics',
        nameKey: 'enterprise.features.multiLocation.analytics',
        description: 'Compare performance across multiple facilities',
        descKey: 'enterprise.features.multiLocation.analyticsDesc'
      },
      {
        name: 'Resource Sharing',
        nameKey: 'enterprise.features.multiLocation.sharing',
        description: 'Share staff, equipment, and resources efficiently',
        descKey: 'enterprise.features.multiLocation.sharingDesc'
      }
    ]
  },
  {
    category: 'Advanced Security',
    categoryKey: 'enterprise.features.security.title',
    icon: Shield,
    color: 'from-red-500 to-pink-500',
    features: [
      {
        name: 'Zero-Trust Architecture',
        nameKey: 'enterprise.features.security.zeroTrust',
        description: 'Advanced security model with continuous verification',
        descKey: 'enterprise.features.security.zeroTrustDesc'
      },
      {
        name: 'Advanced Threat Protection',
        nameKey: 'enterprise.features.security.threatProtection',
        description: 'AI-powered threat detection and prevention',
        descKey: 'enterprise.features.security.threatProtectionDesc'
      },
      {
        name: 'Compliance Automation',
        nameKey: 'enterprise.features.security.compliance',
        description: 'Automated HIPAA, GDPR, and SOC2 compliance monitoring',
        descKey: 'enterprise.features.security.complianceDesc'
      }
    ]
  },
  {
    category: 'Scalable Infrastructure',
    categoryKey: 'enterprise.features.infrastructure.title',
    icon: Server,
    color: 'from-green-500 to-emerald-500',
    features: [
      {
        name: 'Auto-Scaling',
        nameKey: 'enterprise.features.infrastructure.autoScaling',
        description: 'Automatically scale resources based on demand',
        descKey: 'enterprise.features.infrastructure.autoScalingDesc'
      },
      {
        name: 'High Availability',
        nameKey: 'enterprise.features.infrastructure.highAvailability',
        description: '99.9% uptime with redundant systems',
        descKey: 'enterprise.features.infrastructure.highAvailabilityDesc'
      },
      {
        name: 'Global CDN',
        nameKey: 'enterprise.features.infrastructure.cdn',
        description: 'Fast content delivery worldwide',
        descKey: 'enterprise.features.infrastructure.cdnDesc'
      }
    ]
  },
  {
    category: 'Advanced Analytics',
    categoryKey: 'enterprise.features.analytics.title',
    icon: BarChart3,
    color: 'from-purple-500 to-violet-500',
    features: [
      {
        name: 'Predictive Analytics',
        nameKey: 'enterprise.features.analytics.predictive',
        description: 'AI-powered insights for better decision making',
        descKey: 'enterprise.features.analytics.predictiveDesc'
      },
      {
        name: 'Custom Dashboards',
        nameKey: 'enterprise.features.analytics.dashboards',
        description: 'Build custom analytics dashboards',
        descKey: 'enterprise.features.analytics.dashboardsDesc'
      },
      {
        name: 'Real-time Reporting',
        nameKey: 'enterprise.features.analytics.realTime',
        description: 'Live data updates and instant notifications',
        descKey: 'enterprise.features.analytics.realTimeDesc'
      }
    ]
  }
];

const sampleOrganization: OrganizationProfile = {
  id: 'org-001',
  name: 'Metropolitan Healthcare System',
  type: 'healthcare-system',
  size: 'enterprise',
  locations: 15,
  employees: 8500,
  beds: 2400,
  departments: ['Emergency Medicine', 'Cardiology', 'Oncology', 'Pediatrics', 'Surgery', 'Radiology'],
  certifications: ['Joint Commission', 'Magnet Recognition', 'HIMSS Stage 7'],
  region: 'North America',
  timezone: 'America/New_York',
  languages: ['English', 'Spanish', 'French']
};

export default function EnterpriseSettings({ organizationId, onSave, onClose }: EnterpriseSettingsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [organization, setOrganization] = useState<OrganizationProfile>(sampleOrganization);
  const [securityConfig, setSecurityConfig] = useState<SecurityConfiguration>({
    authentication: {
      twoFactorRequired: true,
      biometricEnabled: true,
      sessionTimeout: 30,
      passwordPolicy: {
        minLength: 12,
        requireSpecialChars: true,
        requireNumbers: true,
        requireUppercase: true,
        expirationDays: 90
      }
    },
    dataProtection: {
      encryptionLevel: 'enterprise',
      auditLogging: true,
      dataRetention: 2555, // 7 years in days
      backupFrequency: 'real-time'
    },
    accessControl: {
      roleBasedAccess: true,
      departmentIsolation: true,
      ipRestrictions: ['192.168.1.0/24', '10.0.0.0/16'],
      deviceManagement: true
    }
  });
  const [systemConfig, setSystemConfig] = useState<SystemConfiguration>({
    performance: {
      maxConcurrentUsers: 5000,
      dataProcessingTier: 'enterprise',
      cacheEnabled: true,
      loadBalancing: true
    },
    integration: {
      hl7Enabled: true,
      fhirEnabled: true,
      apiRateLimit: 10000,
      webhookEnabled: true,
      ssoProviders: ['Azure AD', 'Okta', 'SAML 2.0']
    },
    monitoring: {
      uptimeMonitoring: true,
      performanceAlerts: true,
      errorTracking: true,
      usageAnalytics: true
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
  const { t, isRTL } = useLanguage();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSave?.({ organization, securityConfig, systemConfig });
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Enterprise Settings
              </h1>
              <p className="text-muted-foreground">
                Advanced configuration for large healthcare organizations
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
            {onClose && (
              <Button variant="ghost" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="infrastructure" className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              Infrastructure
            </TabsTrigger>
            <TabsTrigger value="integration" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              Integration
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Compliance
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Organization Profile */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5" />
                      Organization Profile
                    </CardTitle>
                    <CardDescription>
                      Basic information about your healthcare organization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="orgName">Organization Name</Label>
                        <Input
                          id="orgName"
                          value={organization.name}
                          onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="orgType">Organization Type</Label>
                        <Select 
                          value={organization.type}
                          onValueChange={(value: any) => setOrganization({ ...organization, type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hospital">Hospital</SelectItem>
                            <SelectItem value="clinic">Clinic</SelectItem>
                            <SelectItem value="healthcare-system">Healthcare System</SelectItem>
                            <SelectItem value="medical-center">Medical Center</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="locations">Number of Locations</Label>
                        <Input
                          id="locations"
                          type="number"
                          value={organization.locations}
                          onChange={(e) => setOrganization({ ...organization, locations: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="employees">Number of Employees</Label>
                        <Input
                          id="employees"
                          type="number"
                          value={organization.employees}
                          onChange={(e) => setOrganization({ ...organization, employees: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="beds">Total Beds</Label>
                        <Input
                          id="beds"
                          type="number"
                          value={organization.beds}
                          onChange={(e) => setOrganization({ ...organization, beds: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="region">Region</Label>
                        <Select 
                          value={organization.region}
                          onValueChange={(value) => setOrganization({ ...organization, region: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="North America">North America</SelectItem>
                            <SelectItem value="Europe">Europe</SelectItem>
                            <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                            <SelectItem value="Latin America">Latin America</SelectItem>
                            <SelectItem value="Middle East">Middle East</SelectItem>
                            <SelectItem value="Africa">Africa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Departments</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {organization.departments.map((dept, index) => (
                          <Badge key={index} variant="secondary">
                            {dept}
                            <button
                              onClick={() => {
                                const newDepts = organization.departments.filter((_, i) => i !== index);
                                setOrganization({ ...organization, departments: newDepts });
                              }}
                              className="ml-1 hover:text-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Add Department
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Certifications & Accreditations</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {organization.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <Award className="w-3 h-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-1" />
                          Add Certification
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Organization Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                        <p className="text-3xl font-bold text-blue-600">{organization.locations}</p>
                        <p className="text-sm text-muted-foreground">Locations</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-950/50 rounded-lg">
                        <p className="text-3xl font-bold text-green-600">{organization.employees.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Employees</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                        <p className="text-3xl font-bold text-purple-600">{organization.beds.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Total Beds</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/50 rounded-lg">
                        <p className="text-3xl font-bold text-orange-600">{organization.departments.length}</p>
                        <p className="text-sm text-muted-foreground">Departments</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Enterprise Features */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Enterprise Features</h2>
              {enterpriseFeatures.map((category, categoryIndex) => {
                const CategoryIcon = category.icon;
                
                return (
                  <Card key={categoryIndex} className="animate-fade-in" style={{ animationDelay: `${categoryIndex * 0.1}s` }}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                          <CategoryIcon className="w-5 h-5 text-white" />
                        </div>
                        {t(category.categoryKey)}
                        <Badge variant="secondary">Enterprise</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {category.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="p-4 rounded-lg border bg-card">
                            <h4 className="font-semibold mb-2">{t(feature.nameKey)}</h4>
                            <p className="text-sm text-muted-foreground">{t(feature.descKey)}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Authentication Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Authentication
                  </CardTitle>
                  <CardDescription>
                    Configure authentication and access policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                    </div>
                    <Switch
                      checked={securityConfig.authentication.twoFactorRequired}
                      onCheckedChange={(checked) => 
                        setSecurityConfig({
                          ...securityConfig,
                          authentication: { ...securityConfig.authentication, twoFactorRequired: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Biometric Authentication</p>
                      <p className="text-sm text-muted-foreground">Enable fingerprint/face recognition</p>
                    </div>
                    <Switch
                      checked={securityConfig.authentication.biometricEnabled}
                      onCheckedChange={(checked) => 
                        setSecurityConfig({
                          ...securityConfig,
                          authentication: { ...securityConfig.authentication, biometricEnabled: checked }
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Session Timeout (minutes)</Label>
                    <div className="mt-2">
                      <Slider
                        value={[securityConfig.authentication.sessionTimeout]}
                        onValueChange={([value]) => 
                          setSecurityConfig({
                            ...securityConfig,
                            authentication: { ...securityConfig.authentication, sessionTimeout: value }
                          })
                        }
                        max={120}
                        min={5}
                        step={5}
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>5 min</span>
                        <span>{securityConfig.authentication.sessionTimeout} min</span>
                        <span>120 min</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Password Policy</Label>
                    <div className="mt-2 space-y-3 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Minimum Length: {securityConfig.authentication.passwordPolicy.minLength}</span>
                        <Slider
                          value={[securityConfig.authentication.passwordPolicy.minLength]}
                          onValueChange={([value]) => 
                            setSecurityConfig({
                              ...securityConfig,
                              authentication: { 
                                ...securityConfig.authentication, 
                                passwordPolicy: { ...securityConfig.authentication.passwordPolicy, minLength: value }
                              }
                            })
                          }
                          max={20}
                          min={8}
                          step={1}
                          className="w-32"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Require Special Characters</span>
                        <Switch
                          checked={securityConfig.authentication.passwordPolicy.requireSpecialChars}
                          onCheckedChange={(checked) => 
                            setSecurityConfig({
                              ...securityConfig,
                              authentication: { 
                                ...securityConfig.authentication, 
                                passwordPolicy: { ...securityConfig.authentication.passwordPolicy, requireSpecialChars: checked }
                              }
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Protection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Data Protection
                  </CardTitle>
                  <CardDescription>
                    Configure data encryption and retention policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Encryption Level</Label>
                    <Select 
                      value={securityConfig.dataProtection.encryptionLevel}
                      onValueChange={(value: any) => 
                        setSecurityConfig({
                          ...securityConfig,
                          dataProtection: { ...securityConfig.dataProtection, encryptionLevel: value }
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic (AES-128)</SelectItem>
                        <SelectItem value="advanced">Advanced (AES-256)</SelectItem>
                        <SelectItem value="enterprise">Enterprise (AES-256 + HSM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Audit Logging</p>
                      <p className="text-sm text-muted-foreground">Log all system access and changes</p>
                    </div>
                    <Switch
                      checked={securityConfig.dataProtection.auditLogging}
                      onCheckedChange={(checked) => 
                        setSecurityConfig({
                          ...securityConfig,
                          dataProtection: { ...securityConfig.dataProtection, auditLogging: checked }
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Data Retention (days)</Label>
                    <Input
                      type="number"
                      value={securityConfig.dataProtection.dataRetention}
                      onChange={(e) => 
                        setSecurityConfig({
                          ...securityConfig,
                          dataProtection: { ...securityConfig.dataProtection, dataRetention: parseInt(e.target.value) || 0 }
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Backup Frequency</Label>
                    <Select 
                      value={securityConfig.dataProtection.backupFrequency}
                      onValueChange={(value: any) => 
                        setSecurityConfig({
                          ...securityConfig,
                          dataProtection: { ...securityConfig.dataProtection, backupFrequency: value }
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="real-time">Real-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Access Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Access Control
                </CardTitle>
                <CardDescription>
                  Manage user permissions and access restrictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Role-Based Access Control</p>
                        <p className="text-sm text-muted-foreground">Enable RBAC for fine-grained permissions</p>
                      </div>
                      <Switch
                        checked={securityConfig.accessControl.roleBasedAccess}
                        onCheckedChange={(checked) => 
                          setSecurityConfig({
                            ...securityConfig,
                            accessControl: { ...securityConfig.accessControl, roleBasedAccess: checked }
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Department Isolation</p>
                        <p className="text-sm text-muted-foreground">Isolate data between departments</p>
                      </div>
                      <Switch
                        checked={securityConfig.accessControl.departmentIsolation}
                        onCheckedChange={(checked) => 
                          setSecurityConfig({
                            ...securityConfig,
                            accessControl: { ...securityConfig.accessControl, departmentIsolation: checked }
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Device Management</p>
                        <p className="text-sm text-muted-foreground">Control which devices can access the system</p>
                      </div>
                      <Switch
                        checked={securityConfig.accessControl.deviceManagement}
                        onCheckedChange={(checked) => 
                          setSecurityConfig({
                            ...securityConfig,
                            accessControl: { ...securityConfig.accessControl, deviceManagement: checked }
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label>IP Restrictions</Label>
                    <div className="mt-2 space-y-2">
                      {securityConfig.accessControl.ipRestrictions.map((ip, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={ip} readOnly />
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add IP Range
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Infrastructure Tab */}
          <TabsContent value="infrastructure" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Performance Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Max Concurrent Users</Label>
                    <Input
                      type="number"
                      value={systemConfig.performance.maxConcurrentUsers}
                      onChange={(e) => 
                        setSystemConfig({
                          ...systemConfig,
                          performance: { ...systemConfig.performance, maxConcurrentUsers: parseInt(e.target.value) || 0 }
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Processing Tier</Label>
                    <Select 
                      value={systemConfig.performance.dataProcessingTier}
                      onValueChange={(value: any) => 
                        setSystemConfig({
                          ...systemConfig,
                          performance: { ...systemConfig.performance, dataProcessingTier: value }
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Caching</p>
                      <p className="text-sm text-muted-foreground">Enable intelligent caching</p>
                    </div>
                    <Switch
                      checked={systemConfig.performance.cacheEnabled}
                      onCheckedChange={(checked) => 
                        setSystemConfig({
                          ...systemConfig,
                          performance: { ...systemConfig.performance, cacheEnabled: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Load Balancing</p>
                      <p className="text-sm text-muted-foreground">Distribute traffic across servers</p>
                    </div>
                    <Switch
                      checked={systemConfig.performance.loadBalancing}
                      onCheckedChange={(checked) => 
                        setSystemConfig({
                          ...systemConfig,
                          performance: { ...systemConfig.performance, loadBalancing: checked }
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* System Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="w-5 h-5" />
                    Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                    <Cpu className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">16 vCPU</p>
                    <p className="text-sm text-muted-foreground">Processing Power</p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/50 rounded-lg">
                    <MemoryStick className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">64 GB</p>
                    <p className="text-sm text-muted-foreground">Memory</p>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                    <HardDrive className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">2 TB</p>
                    <p className="text-sm text-muted-foreground">Storage</p>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">System Health</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Healthy</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span>23%</span>
                    </div>
                    <Progress value={23} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory Usage</span>
                      <span>41%</span>
                    </div>
                    <Progress value={41} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Storage Usage</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} />
                  </div>
                  
                  <Separator />
                  
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">99.9%</p>
                    <p className="text-sm text-muted-foreground">Uptime (30 days)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Integration Tab */}
          <TabsContent value="integration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5" />
                    Healthcare Standards
                  </CardTitle>
                  <CardDescription>
                    Configure integration with healthcare standards and protocols
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">HL7 FHIR</p>
                      <p className="text-sm text-muted-foreground">Fast Healthcare Interoperability Resources</p>
                    </div>
                    <Switch
                      checked={systemConfig.integration.fhirEnabled}
                      onCheckedChange={(checked) => 
                        setSystemConfig({
                          ...systemConfig,
                          integration: { ...systemConfig.integration, fhirEnabled: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">HL7 v2</p>
                      <p className="text-sm text-muted-foreground">Legacy HL7 messaging standard</p>
                    </div>
                    <Switch
                      checked={systemConfig.integration.hl7Enabled}
                      onCheckedChange={(checked) => 
                        setSystemConfig({
                          ...systemConfig,
                          integration: { ...systemConfig.integration, hl7Enabled: checked }
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>API Rate Limit (requests/hour)</Label>
                    <Input
                      type="number"
                      value={systemConfig.integration.apiRateLimit}
                      onChange={(e) => 
                        setSystemConfig({
                          ...systemConfig,
                          integration: { ...systemConfig.integration, apiRateLimit: parseInt(e.target.value) || 0 }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Webhooks</p>
                      <p className="text-sm text-muted-foreground">Real-time event notifications</p>
                    </div>
                    <Switch
                      checked={systemConfig.integration.webhookEnabled}
                      onCheckedChange={(checked) => 
                        setSystemConfig({
                          ...systemConfig,
                          integration: { ...systemConfig.integration, webhookEnabled: checked }
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Single Sign-On
                  </CardTitle>
                  <CardDescription>
                    Configure SSO providers for seamless authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>SSO Providers</Label>
                    <div className="mt-2 space-y-2">
                      {systemConfig.integration.ssoProviders.map((provider, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                              <Key className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium">{provider}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Active</Badge>
                            <Button variant="ghost" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Add SSO Provider
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Usage Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg">
                      <p className="text-3xl font-bold text-blue-600">2,847</p>
                      <p className="text-sm text-muted-foreground">Active Users (30d)</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950/50 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">15.2M</p>
                      <p className="text-sm text-muted-foreground">API Calls (30d)</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                      <p className="text-3xl font-bold text-purple-600">94.7%</p>
                      <p className="text-sm text-muted-foreground">Satisfaction Score</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Response Time</span>
                        <span>127ms avg</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Throughput</span>
                        <span>1.2K req/s</span>
                      </div>
                      <Progress value={72} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Error Rate</span>
                        <span>0.01%</span>
                      </div>
                      <Progress value={99} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Uptime Monitoring</p>
                      <p className="text-sm text-muted-foreground">24/7 system monitoring</p>
                    </div>
                    <Switch
                      checked={systemConfig.monitoring.uptimeMonitoring}
                      onCheckedChange={(checked) => 
                        setSystemConfig({
                          ...systemConfig,
                          monitoring: { ...systemConfig.monitoring, uptimeMonitoring: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Performance Alerts</p>
                      <p className="text-sm text-muted-foreground">Get notified of issues</p>
                    </div>
                    <Switch
                      checked={systemConfig.monitoring.performanceAlerts}
                      onCheckedChange={(checked) => 
                        setSystemConfig({
                          ...systemConfig,
                          monitoring: { ...systemConfig.monitoring, performanceAlerts: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Error Tracking</p>
                      <p className="text-sm text-muted-foreground">Track and analyze errors</p>
                    </div>
                    <Switch
                      checked={systemConfig.monitoring.errorTracking}
                      onCheckedChange={(checked) => 
                        setSystemConfig({
                          ...systemConfig,
                          monitoring: { ...systemConfig.monitoring, errorTracking: checked }
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Usage Analytics</p>
                      <p className="text-sm text-muted-foreground">Detailed usage insights</p>
                    </div>
                    <Switch
                      checked={systemConfig.monitoring.usageAnalytics}
                      onCheckedChange={(checked) => 
                        setSystemConfig({
                          ...systemConfig,
                          monitoring: { ...systemConfig.monitoring, usageAnalytics: checked }
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Compliance Status
                  </CardTitle>
                  <CardDescription>
                    Current compliance status for various healthcare standards
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: 'HIPAA', status: 'Compliant', color: 'green' },
                    { name: 'HITECH', status: 'Compliant', color: 'green' },
                    { name: 'SOC 2 Type II', status: 'Certified', color: 'green' },
                    { name: 'GDPR', status: 'Compliant', color: 'green' },
                    { name: 'FDA 21 CFR Part 11', status: 'In Progress', color: 'yellow' },
                    { name: 'ISO 27001', status: 'Certified', color: 'green' }
                  ].map((compliance, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          compliance.color === 'green' ? 'bg-green-500' : 
                          compliance.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-medium">{compliance.name}</span>
                      </div>
                      <Badge variant={compliance.color === 'green' ? 'default' : 'secondary'}>
                        {compliance.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Assessments
                  </CardTitle>
                  <CardDescription>
                    Recent security assessments and audits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { 
                      name: 'Annual Security Audit', 
                      date: '2024-01-15', 
                      status: 'Passed', 
                      score: 98 
                    },
                    { 
                      name: 'Penetration Testing', 
                      date: '2024-02-10', 
                      status: 'Passed', 
                      score: 96 
                    },
                    { 
                      name: 'Vulnerability Assessment', 
                      date: '2024-02-28', 
                      status: 'Passed', 
                      score: 94 
                    }
                  ].map((assessment, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{assessment.name}</span>
                        <Badge variant="default">{assessment.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{assessment.date}</span>
                        <span className="font-medium">Score: {assessment.score}%</span>
                      </div>
                      <Progress value={assessment.score} className="mt-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Compliance Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Compliance Actions
                </CardTitle>
                <CardDescription>
                  Required actions to maintain compliance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: 'Update data retention policy',
                      deadline: '2024-03-15',
                      priority: 'high',
                      status: 'pending'
                    },
                    {
                      action: 'Complete staff security training',
                      deadline: '2024-03-30',
                      priority: 'medium',
                      status: 'in-progress'
                    },
                    {
                      action: 'Review access control policies',
                      deadline: '2024-04-15',
                      priority: 'low',
                      status: 'scheduled'
                    }
                  ].map((action, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{action.action}</p>
                        <p className="text-sm text-muted-foreground">Due: {action.deadline}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            action.priority === 'high' ? 'destructive' :
                            action.priority === 'medium' ? 'default' : 'secondary'
                          }
                        >
                          {action.priority}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}