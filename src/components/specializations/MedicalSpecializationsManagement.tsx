import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Stethoscope,
  Heart,
  Brain,
  Eye,
  Bone,
  Baby,
  Scissors,
  UserPlus,
  Users,
  Calendar,
  Award,
  BookOpen,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  TrendingUp,
  Activity,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Settings,
  ChevronRight,
  Hospital,
  Microscope,
  Zap,
  Shield
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import { useTheme } from '../../services/ThemeService';

interface Specialization {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: any;
  category: string;
  categoryAr: string;
  doctorsCount: number;
  appointmentsToday: number;
  avgWaitTime: number;
  satisfaction: number;
  isActive: boolean;
  emergencyServices: boolean;
  telemedicineAvailable: boolean;
  subspecializations: string[];
}

interface Doctor {
  id: string;
  name: string;
  nameAr: string;
  specialization: string;
  subspecialization?: string;
  experience: number;
  rating: number;
  patientsToday: number;
  nextAvailable: string;
  consultationFee: number;
  languages: string[];
  education: string[];
  certifications: string[];
  workingHours: {
    start: string;
    end: string;
    days: string[];
  };
  contactInfo: {
    phone: string;
    email: string;
    location: string;
  };
  avatar?: string;
  isAvailable: boolean;
  emergencyOn: boolean;
  telemedicineEnabled: boolean;
}

interface MedicalSpecializationsManagementProps {
  isDemoMode?: boolean;
}

const MedicalSpecializationsManagement: React.FC<MedicalSpecializationsManagementProps> = ({ 
  isDemoMode = false 
}) => {
  const { t, language, isRTL } = useLanguage();
  const { effectiveTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  
  // Demo data for specializations
  const [specializations, setSpecializations] = useState<Specialization[]>([
    {
      id: '1',
      name: 'Cardiology',
      nameAr: 'أمراض القلب',
      description: 'Diagnosis and treatment of heart and cardiovascular diseases',
      descriptionAr: 'تشخيص وعلاج أمراض القلب والأوعية الدموية',
      icon: Heart,
      category: 'Internal Medicine',
      categoryAr: 'الطب الباطني',
      doctorsCount: 8,
      appointmentsToday: 24,
      avgWaitTime: 25,
      satisfaction: 4.8,
      isActive: true,
      emergencyServices: true,
      telemedicineAvailable: true,
      subspecializations: ['Interventional Cardiology', 'Heart Failure', 'Electrophysiology']
    },
    {
      id: '2',
      name: 'Neurology',
      nameAr: 'أمراض الجهاز العصبي',
      description: 'Treatment of disorders of the nervous system',
      descriptionAr: 'علاج اضطرابات الجهاز العصبي',
      icon: Brain,
      category: 'Neuroscience',
      categoryAr: 'علوم الأعصاب',
      doctorsCount: 5,
      appointmentsToday: 18,
      avgWaitTime: 30,
      satisfaction: 4.6,
      isActive: true,
      emergencyServices: true,
      telemedicineAvailable: false,
      subspecializations: ['Stroke', 'Epilepsy', 'Movement Disorders', 'Dementia']
    },
    {
      id: '3',
      name: 'Pediatrics',
      nameAr: 'طب الأطفال',
      description: 'Medical care for infants, children, and adolescents',
      descriptionAr: 'الرعاية الطبية للرضع والأطفال والمراهقين',
      icon: Baby,
      category: 'Primary Care',
      categoryAr: 'الرعاية الأولية',
      doctorsCount: 12,
      appointmentsToday: 45,
      avgWaitTime: 20,
      satisfaction: 4.9,
      isActive: true,
      emergencyServices: true,
      telemedicineAvailable: true,
      subspecializations: ['Neonatology', 'Pediatric Cardiology', 'Developmental Pediatrics']
    },
    {
      id: '4',
      name: 'Orthopedics',
      nameAr: 'جراحة العظام',
      description: 'Treatment of musculoskeletal system disorders',
      descriptionAr: 'علاج اضطرابات الجهاز العضلي الهيكلي',
      icon: Bone,
      category: 'Surgery',
      categoryAr: 'الجراحة',
      doctorsCount: 6,
      appointmentsToday: 16,
      avgWaitTime: 35,
      satisfaction: 4.7,
      isActive: true,
      emergencyServices: true,
      telemedicineAvailable: false,
      subspecializations: ['Sports Medicine', 'Spine Surgery', 'Joint Replacement']
    },
    {
      id: '5',
      name: 'Ophthalmology',
      nameAr: 'طب العيون',
      description: 'Diagnosis and treatment of eye and vision disorders',
      descriptionAr: 'تشخيص وعلاج اضطرابات العين والرؤية',
      icon: Eye,
      category: 'Surgical Specialties',
      categoryAr: 'التخصصات الجراحية',
      doctorsCount: 4,
      appointmentsToday: 22,
      avgWaitTime: 15,
      satisfaction: 4.8,
      isActive: true,
      emergencyServices: false,
      telemedicineAvailable: true,
      subspecializations: ['Retina', 'Cornea', 'Glaucoma', 'Pediatric Ophthalmology']
    },
    {
      id: '6',
      name: 'Dermatology',
      nameAr: 'الأمراض الجلدية',
      description: 'Treatment of skin, hair, and nail disorders',
      descriptionAr: 'علاج اضطرابات الجلد والشعر والأظافر',
      icon: Shield,
      category: 'Medical Specialties',
      categoryAr: 'التخصصات الطبية',
      doctorsCount: 3,
      appointmentsToday: 28,
      avgWaitTime: 18,
      satisfaction: 4.6,
      isActive: true,
      emergencyServices: false,
      telemedicineAvailable: true,
      subspecializations: ['Dermatopathology', 'Cosmetic Dermatology', 'Pediatric Dermatology']
    },
    {
      id: '7',
      name: 'Psychiatry',
      nameAr: 'الطب النفسي',
      description: 'Mental health and psychiatric disorders treatment',
      descriptionAr: 'علاج الصحة النفسية والاضطرابات النفسية',
      icon: Brain,
      category: 'Mental Health',
      categoryAr: 'الصحة النفسية',
      doctorsCount: 4,
      appointmentsToday: 15,
      avgWaitTime: 40,
      satisfaction: 4.5,
      isActive: true,
      emergencyServices: true,
      telemedicineAvailable: true,
      subspecializations: ['Child Psychiatry', 'Addiction Medicine', 'Geriatric Psychiatry']
    },
    {
      id: '8',
      name: 'Emergency Medicine',
      nameAr: 'طب الطوارئ',
      description: 'Acute care for medical emergencies',
      descriptionAr: 'الرعاية الحادة للطوارئ الطبية',
      icon: Zap,
      category: 'Emergency Services',
      categoryAr: 'خدمات الطوارئ',
      doctorsCount: 10,
      appointmentsToday: 35,
      avgWaitTime: 5,
      satisfaction: 4.7,
      isActive: true,
      emergencyServices: true,
      telemedicineAvailable: false,
      subspecializations: ['Trauma', 'Critical Care', 'Toxicology']
    }
  ]);

  // Demo data for doctors
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: '1',
      name: 'Dr. Ahmed Hassan',
      nameAr: 'د. أحمد حسن',
      specialization: 'Cardiology',
      subspecialization: 'Interventional Cardiology',
      experience: 15,
      rating: 4.9,
      patientsToday: 8,
      nextAvailable: '14:30',
      consultationFee: 300,
      languages: ['Arabic', 'English'],
      education: ['MD - Cairo University', 'Fellowship - Harvard Medical School'],
      certifications: ['Board Certified Cardiologist', 'Interventional Cardiology Certificate'],
      workingHours: {
        start: '08:00',
        end: '16:00',
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
      },
      contactInfo: {
        phone: '+966501234567',
        email: 'ahmed.hassan@hospital.com',
        location: 'Building A, Floor 2, Room 201'
      },
      isAvailable: true,
      emergencyOn: true,
      telemedicineEnabled: true
    },
    {
      id: '2',
      name: 'Dr. Sarah Johnson',
      nameAr: 'د. سارة جونسون',
      specialization: 'Pediatrics',
      subspecialization: 'Neonatology',
      experience: 12,
      rating: 4.8,
      patientsToday: 12,
      nextAvailable: '15:45',
      consultationFee: 250,
      languages: ['English', 'Arabic'],
      education: ['MD - Johns Hopkins', 'Residency - Children\'s Hospital Boston'],
      certifications: ['Board Certified Pediatrician', 'Neonatal-Perinatal Medicine Certificate'],
      workingHours: {
        start: '07:00',
        end: '15:00',
        days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
      },
      contactInfo: {
        phone: '+966507654321',
        email: 'sarah.johnson@hospital.com',
        location: 'Building B, Floor 1, Room 105'
      },
      isAvailable: true,
      emergencyOn: false,
      telemedicineEnabled: true
    }
  ]);

  const categories = [
    'Internal Medicine',
    'Surgery',
    'Primary Care',
    'Neuroscience',
    'Surgical Specialties',
    'Medical Specialties',
    'Mental Health',
    'Emergency Services'
  ];

  const filteredSpecializations = specializations.filter(spec => {
    const matchesSearch = spec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         spec.nameAr.includes(searchQuery);
    const matchesCategory = filterCategory === 'all' || spec.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getSpecializationStats = () => {
    const total = specializations.length;
    const active = specializations.filter(s => s.isActive).length;
    const emergency = specializations.filter(s => s.emergencyServices).length;
    const telemedicine = specializations.filter(s => s.telemedicineAvailable).length;
    
    return { total, active, emergency, telemedicine };
  };

  const stats = getSpecializationStats();

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {language === 'ar' ? 'إدارة التخصصات الطبية' : 'Medical Specializations Management'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' 
              ? 'إدارة شاملة للتخصصات الطبية والأطباء المتخصصين'
              : 'Comprehensive management of medical specializations and specialist doctors'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {language === 'ar' ? 'تخصص جديد' : 'New Specialization'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {language === 'ar' ? 'إضافة تخصص طبي جديد' : 'Add New Medical Specialization'}
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{language === 'ar' ? 'الاسم بالإنجليزية' : 'Name (English)'}</Label>
                    <Input placeholder="Enter specialization name" />
                  </div>
                  <div>
                    <Label>{language === 'ar' ? 'الاسم بالعربية' : 'Name (Arabic)'}</Label>
                    <Input placeholder="أدخل اسم التخصص" />
                  </div>
                </div>
                <div>
                  <Label>{language === 'ar' ? 'الفئة' : 'Category'}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{language === 'ar' ? 'الوصف' : 'Description'}</Label>
                  <Textarea placeholder="Enter description" />
                </div>
                <div className="flex items-center gap-4">
                  <Button className="flex-1">
                    {language === 'ar' ? 'حفظ التخصص' : 'Save Specialization'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'إجمالي التخصصات' : 'Total Specializations'}
                </p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <Hospital className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'التخصصات النشطة' : 'Active Specializations'}
                </p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'خدمات الطوارئ' : 'Emergency Services'}
                </p>
                <p className="text-2xl font-bold text-red-600">{stats.emergency}</p>
              </div>
              <Zap className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'الطب عن بُعد' : 'Telemedicine'}
                </p>
                <p className="text-2xl font-bold text-purple-600">{stats.telemedicine}</p>
              </div>
              <Microscope className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={language === 'ar' ? 'البحث في التخصصات...' : 'Search specializations...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {language === 'ar' ? 'جميع الفئات' : 'All Categories'}
            </SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </motion.div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Hospital className="h-4 w-4" />
              {language === 'ar' ? 'نظرة عامة' : 'Overview'}
            </TabsTrigger>
            <TabsTrigger value="specializations" className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4" />
              {language === 'ar' ? 'التخصصات' : 'Specializations'}
            </TabsTrigger>
            <TabsTrigger value="doctors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {language === 'ar' ? 'الأطباء' : 'Doctors'}
            </TabsTrigger>
          </TabsList>
        </motion.div>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Top Performing Specializations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {language === 'ar' ? 'أفضل التخصصات أداءً' : 'Top Performing Specializations'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {specializations
                    .sort((a, b) => b.satisfaction - a.satisfaction)
                    .slice(0, 5)
                    .map((spec, index) => (
                      <div key={spec.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            index === 0 ? 'bg-yellow-100 text-yellow-600' :
                            index === 1 ? 'bg-gray-100 text-gray-600' :
                            index === 2 ? 'bg-orange-100 text-orange-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            <spec.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {language === 'ar' ? spec.nameAr : spec.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {spec.doctorsCount} {language === 'ar' ? 'طبيب' : 'doctors'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-bold">{spec.satisfaction}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {spec.appointmentsToday} {language === 'ar' ? 'موعد اليوم' : 'appointments today'}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Wait Time Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {language === 'ar' ? 'تحليل أوقات الانتظار' : 'Wait Time Analysis'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {specializations
                    .sort((a, b) => a.avgWaitTime - b.avgWaitTime)
                    .slice(0, 5)
                    .map((spec) => (
                      <div key={spec.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-3">
                          <spec.icon className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">
                              {language === 'ar' ? spec.nameAr : spec.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {spec.appointmentsToday} {language === 'ar' ? 'موعد اليوم' : 'appointments today'}
                            </p>
                          </div>
                        </div>
                        <Badge variant={spec.avgWaitTime <= 20 ? 'default' : spec.avgWaitTime <= 30 ? 'secondary' : 'destructive'}>
                          {spec.avgWaitTime} {language === 'ar' ? 'دقيقة' : 'min'}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Specializations Tab */}
        <TabsContent value="specializations">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredSpecializations.map((spec, index) => (
              <motion.div
                key={spec.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
                onClick={() => setSelectedSpecialization(spec.id)}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10 text-primary">
                          <spec.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {language === 'ar' ? spec.nameAr : spec.name}
                          </CardTitle>
                          <CardDescription>
                            {language === 'ar' ? spec.categoryAr : spec.category}
                          </CardDescription>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === 'ar' ? spec.descriptionAr : spec.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? 'الأطباء' : 'Doctors'}
                        </p>
                        <p className="text-xl font-bold text-blue-600">{spec.doctorsCount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {language === 'ar' ? 'مواعيد اليوم' : 'Today\'s Appointments'}
                        </p>
                        <p className="text-xl font-bold text-green-600">{spec.appointmentsToday}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'متوسط الانتظار' : 'Avg. Wait Time'}
                      </span>
                      <Badge variant={spec.avgWaitTime <= 20 ? 'default' : 'secondary'}>
                        {spec.avgWaitTime} {language === 'ar' ? 'دقيقة' : 'min'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">
                        {language === 'ar' ? 'تقييم المرضى' : 'Patient Rating'}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{spec.satisfaction}/5</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {spec.emergencyServices && (
                        <Badge variant="destructive" className="text-xs">
                          {language === 'ar' ? 'طوارئ' : 'Emergency'}
                        </Badge>
                      )}
                      {spec.telemedicineAvailable && (
                        <Badge variant="secondary" className="text-xs">
                          {language === 'ar' ? 'عن بُعد' : 'Telemedicine'}
                        </Badge>
                      )}
                      {spec.isActive && (
                        <Badge variant="default" className="text-xs">
                          {language === 'ar' ? 'نشط' : 'Active'}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        {/* Doctors Tab */}
        <TabsContent value="doctors">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {language === 'ar' ? 'الأطباء المتخصصين' : 'Specialist Doctors'}
              </h3>
              <Button 
                onClick={() => setIsAddDoctorModalOpen(true)}
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                {language === 'ar' ? 'إضافة طبيب' : 'Add Doctor'}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {doctors.map((doctor, index) => (
                <motion.div
                  key={doctor.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <Stethoscope className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-lg">
                              {language === 'ar' ? doctor.nameAr : doctor.name}
                            </h4>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium">{doctor.rating}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-1">
                            {doctor.specialization}
                            {doctor.subspecialization && ` - ${doctor.subspecialization}`}
                          </p>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {doctor.experience} {language === 'ar' ? 'سنة خبرة' : 'years experience'}
                          </p>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {language === 'ar' ? 'مرضى اليوم' : 'Patients Today'}
                              </p>
                              <p className="font-semibold text-blue-600">{doctor.patientsToday}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                {language === 'ar' ? 'المتاح التالي' : 'Next Available'}
                              </p>
                              <p className="font-semibold text-green-600">{doctor.nextAvailable}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {doctor.contactInfo.location}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {doctor.isAvailable && (
                              <Badge variant="default" className="text-xs">
                                {language === 'ar' ? 'متاح' : 'Available'}
                              </Badge>
                            )}
                            {doctor.emergencyOn && (
                              <Badge variant="destructive" className="text-xs">
                                {language === 'ar' ? 'مناوب طوارئ' : 'Emergency On-call'}
                              </Badge>
                            )}
                            {doctor.telemedicineEnabled && (
                              <Badge variant="secondary" className="text-xs">
                                {language === 'ar' ? 'طب عن بُعد' : 'Telemedicine'}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Calendar className="h-3 w-3 mr-1" />
                              {language === 'ar' ? 'حجز موعد' : 'Schedule'}
                            </Button>
                            <Button variant="outline" size="sm">
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Mail className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Add Doctor Modal */}
      <Dialog open={isAddDoctorModalOpen} onOpenChange={setIsAddDoctorModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {language === 'ar' ? 'إضافة طبيب جديد' : 'Add New Doctor'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === 'ar' ? 'الاسم بالإنجليزية' : 'Name (English)'}</Label>
                <Input placeholder="Dr. John Smith" />
              </div>
              <div>
                <Label>{language === 'ar' ? 'الاسم بالعربية' : 'Name (Arabic)'}</Label>
                <Input placeholder="د. أحمد محمد" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === 'ar' ? 'التخصص الرئيسي' : 'Primary Specialization'}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map(spec => (
                      <SelectItem key={spec.id} value={spec.name}>
                        {language === 'ar' ? spec.nameAr : spec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>{language === 'ar' ? 'التخصص الفرعي' : 'Subspecialization'}</Label>
                <Input placeholder="Enter subspecialization" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === 'ar' ? 'سنوات الخبرة' : 'Years of Experience'}</Label>
                <Input type="number" placeholder="15" />
              </div>
              <div>
                <Label>{language === 'ar' ? 'رسوم الاستشارة' : 'Consultation Fee (SAR)'}</Label>
                <Input type="number" placeholder="300" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</Label>
                <Input placeholder="+966501234567" />
              </div>
              <div>
                <Label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
                <Input type="email" placeholder="doctor@hospital.com" />
              </div>
            </div>

            <div>
              <Label>{language === 'ar' ? 'الموقع' : 'Location'}</Label>
              <Input placeholder="Building A, Floor 2, Room 201" />
            </div>

            <div className="flex items-center gap-4">
              <Button className="flex-1">
                {language === 'ar' ? 'حفظ الطبيب' : 'Save Doctor'}
              </Button>
              <Button variant="outline" onClick={() => setIsAddDoctorModalOpen(false)}>
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalSpecializationsManagement;