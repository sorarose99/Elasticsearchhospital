import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { toast } from 'sonner@2.0.3';
import { 
  Users, Clock, Calendar, Award, User, UserPlus, Download, Filter, Phone, Mail,
  MapPin, Briefcase, GraduationCap, Star, CheckCircle, XCircle, AlertCircle,
  Search, Eye, Edit, Trash2, MoreVertical, TrendingUp, TrendingDown,
  UserCheck, UserX, CalendarDays, DollarSign, Settings, FileText,
  Plus, Save, RefreshCw, Upload, BookOpen, Shield, Globe,
  Activity, BarChart3, PieChart, LineChart, ChevronRight,
  Building, Department, Clock3, Home, CreditCard, Phone as PhoneIcon
} from 'lucide-react';
import { useLanguage } from '../../services/LanguageService';
import firebaseService from '../../services/FirebaseService';

interface Staff {
  id: string;
  name: string;
  nameEn: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  specialization?: string;
  employeeId: string;
  hireDate: string;
  salary: number;
  status: 'active' | 'inactive' | 'on_leave';
  avatar?: string;
  address: string;
  emergencyContact: string;
  qualifications: string[];
  shift: 'morning' | 'evening' | 'night' | 'rotating';
}

interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  hoursWorked?: number;
  status: 'present' | 'absent' | 'late' | 'half_day';
  notes?: string;
}

interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'annual' | 'sick' | 'emergency' | 'maternity';
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  approvedBy?: string;
}

export default function StaffManagementComplete() {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Partial<Staff>>({
    name: '',
    nameEn: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    specialization: '',
    salary: 0,
    address: '',
    emergencyContact: '',
    shift: 'morning',
    status: 'active'
  });

  useEffect(() => {
    loadStaffData();
    
    // Subscribe to real-time updates
    const unsubscribe = firebaseService.subscribeToCollection('staff', (updatedStaff) => {
      setStaff(updatedStaff);
    });
    
    return () => unsubscribe();
  }, []);

  const loadStaffData = async () => {
    setIsLoading(true);
    try {
      const staffData = await firebaseService.getStaff();
      setStaff(staffData);
      
      // Initialize demo data for attendance and leaves
      // TODO: Replace with Firebase data when collections are created
      setLeaves([
        {
          id: '1',
          employeeId: '1',
          employeeName: 'د. أحمد محمد حسن',
          type: 'annual',
          startDate: '2024-02-01',
          endDate: '2024-02-05',
          days: 5,
          status: 'pending',
          reason: 'إجازة سنوية'
        },
        {
          id: '2',
          employeeId: '5',
          employeeName: 'د. خالد حسن العتيبي',
          type: 'sick',
          startDate: '2024-01-18',
          endDate: '2024-01-25',
          days: 7,
          status: 'approved',
          reason: 'إجازة مرضية',
          approvedBy: 'المدير العام'
        }
      ]);
    } catch (error) {
      console.error('Error loading staff data:', error);
      toast.error('Error loading staff data');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter functions
  const filteredStaff = staff.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || employee.department === selectedDepartment;
    const matchesRole = selectedRole === 'all' || employee.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || employee.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  // Statistics calculations
  const totalEmployees = staff.length;
  const activeEmployees = staff.filter(emp => emp.status === 'active').length;
  const onLeaveEmployees = staff.filter(emp => emp.status === 'on_leave').length;
  const inactiveEmployees = staff.filter(emp => emp.status === 'inactive').length;
  const presentToday = attendance.filter(att => att.status === 'present').length;
  const lateToday = attendance.filter(att => att.status === 'late').length;
  const absentToday = attendance.filter(att => att.status === 'absent').length;
  const pendingLeaves = leaves.filter(leave => leave.status === 'pending').length;

  // Helper functions
  const departments = [...new Set(staff.map(emp => emp.department))];
  const roles = [...new Set(staff.map(emp => emp.role))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'present': return 'bg-green-100 text-green-800 border-green-200';
      case 'absent': return 'bg-red-100 text-red-800 border-red-200';
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'half_day': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string, type: string = 'general') => {
    if (type === 'attendance') {
      switch (status) {
        case 'present': return 'حاضر';
        case 'absent': return 'غائب';
        case 'late': return 'متأخر';
        case 'half_day': return 'نصف يوم';
        default: return status;
      }
    } else if (type === 'leave') {
      switch (status) {
        case 'approved': return 'موافق عليها';
        case 'pending': return 'قيد المراجعة';
        case 'rejected': return 'مرفوضة';
        default: return status;
      }
    } else {
      switch (status) {
        case 'active': return 'نشط';
        case 'inactive': return 'غير نشط';
        case 'on_leave': return 'في إجازة';
        default: return status;
      }
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'doctor': return 'طبيب';
      case 'nurse': return 'ممرض/ة';
      case 'receptionist': return 'استقبال';
      case 'lab_tech': return 'فني مختبر';
      case 'pharmacist': return 'صيدلي';
      case 'radiologist': return 'أخصائي أشعة';
      case 'admin': return 'إداري';
      default: return role;
    }
  };

  // Action handlers
  const handleAddEmployee = async () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.phone || !newEmployee.role) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsLoading(true);
    try {
      const employeeData: Staff = {
        id: Date.now().toString(),
        employeeId: `EMP${String(staff.length + 1).padStart(3, '0')}`,
        hireDate: new Date().toISOString().split('T')[0],
        qualifications: [],
        ...newEmployee as Staff
      };

      setStaff(prev => [...prev, employeeData]);
      setShowAddDialog(false);
      setNewEmployee({
        name: '',
        nameEn: '',
        email: '',
        phone: '',
        role: '',
        department: '',
        specialization: '',
        salary: 0,
        address: '',
        emergencyContact: '',
        shift: 'morning',
        status: 'active'
      });
      toast.success('تم إضافة الموظف بنجاح');
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error('حدث خطأ أثناء إضافة الموظف');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditEmployee = async () => {
    if (!selectedEmployee) return;

    setIsLoading(true);
    try {
      setStaff(prev => prev.map(emp => 
        emp.id === selectedEmployee.id ? selectedEmployee : emp
      ));
      setShowEditDialog(false);
      setSelectedEmployee(null);
      toast.success('تم تحديث بيانات الموظف بنجاح');
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('حدث خطأ أثناء تحديث بيانات الموظف');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموظف؟')) return;

    setIsLoading(true);
    try {
      setStaff(prev => prev.filter(emp => emp.id !== employeeId));
      toast.success('تم حذف الموظف بنجاح');
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error('حدث خطأ أثناء حذف الموظف');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveLeave = async (leaveId: string) => {
    setIsLoading(true);
    try {
      setLeaves(prev => prev.map(leave => 
        leave.id === leaveId ? { ...leave, status: 'approved' as const, approvedBy: 'المدير العام' } : leave
      ));
      toast.success('تم الموافقة على طلب الإجازة');
    } catch (error) {
      console.error('Error approving leave:', error);
      toast.error('حدث خطأ أثناء الموافقة على الإجازة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectLeave = async (leaveId: string) => {
    setIsLoading(true);
    try {
      setLeaves(prev => prev.map(leave => 
        leave.id === leaveId ? { ...leave, status: 'rejected' as const } : leave
      ));
      toast.success('تم رفض طلب الإجازة');
    } catch (error) {
      console.error('Error rejecting leave:', error);
      toast.error('حدث خطأ أثناء رفض الإجازة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    toast.success('جاري تصدير البيانات...');
    // Implementation for data export
  };

  // Main render function
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="p-6 space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-br from-primary to-primary/80 p-3 rounded-xl shadow-lg"
            >
              <Users className="h-8 w-8 text-white" />
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              >
                {t('staff.management')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground"
              >
                {t('staff.comprehensive')}
              </motion.p>
            </div>
          </div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 bg-card/50 backdrop-blur-sm border rounded-lg p-4"
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{totalEmployees}</p>
              <p className="text-xs text-muted-foreground">إجمالي الموظفين</p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{activeEmployees}</p>
              <p className="text-xs text-muted-foreground">نشط</p>
            </div>
            <Separator orientation="vertical" className="h-8" />
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{onLeaveEmployees}</p>
              <p className="text-xs text-muted-foreground">في إجازة</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في الموظفين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card/50 backdrop-blur-sm border-primary/20 focus:border-primary/40"
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchTerm('')}
            className="btn-press"
            disabled={!searchTerm}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            مسح البحث
          </Button>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                {t('staff.dashboard')}
              </TabsTrigger>
              <TabsTrigger 
                value="staff"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Users className="h-4 w-4 mr-2" />
                {t('staff.employees')} ({filteredStaff.length})
              </TabsTrigger>
              <TabsTrigger 
                value="attendance"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Clock className="h-4 w-4 mr-2" />
                {t('staff.attendance')} ({presentToday})
              </TabsTrigger>
              <TabsTrigger 
                value="leaves"
                className="data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Calendar className="h-4 w-4 mr-2" />
                {t('staff.leaves')} ({pendingLeaves})
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6 m-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    {
                      title: t('staff.totalEmployees'),
                      value: totalEmployees,
                      icon: Users,
                      color: 'primary',
                      trend: t('staff.fromLastMonth', { value: '+12%' })
                    },
                    {
                      title: t('staff.todayAttendance'),
                      value: presentToday,
                      icon: UserCheck,
                      color: 'success',
                      trend: `${((presentToday / totalEmployees) * 100).toFixed(1)}% ${t('staff.attendanceRate')}`
                    },
                    {
                      title: t('staff.onLeaveToday'),
                      value: onLeaveEmployees,
                      icon: CalendarDays,
                      color: 'warning',
                      trend: `${pendingLeaves} ${t('staff.pendingRequest')}`
                    },
                    {
                      title: t('staff.averagePerformance'),
                      value: '4.2/5',
                      icon: Star,
                      color: 'info',
                      trend: `+0.3 ${t('staff.fromLastReview')}`
                    }
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                      className="hover-lift"
                    >
                      <Card className="relative overflow-hidden">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">{stat.title}</p>
                              <p className={`text-3xl font-bold ${stat.color === 'primary' ? '' : `text-${stat.color}`}`}>
                                {stat.value}
                              </p>
                              <div className="flex items-center text-sm text-success mt-1">
                                <TrendingUp className="w-4 h-4 mr-1" />
                                {stat.trend}
                              </div>
                            </div>
                            <div className={`bg-${stat.color}/10 p-3 rounded-full`}>
                              <stat.icon className={`h-8 w-8 text-${stat.color}`} />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Additional Charts and Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Attendance Status */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-primary" />
                          {t('staff.attendanceStatus')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{t('staff.present')}</span>
                            <span className="font-bold text-success">{presentToday}</span>
                          </div>
                          <Progress value={(presentToday / totalEmployees) * 100} className="h-2" />
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{t('staff.late')}</span>
                            <span className="font-bold text-warning">{lateToday}</span>
                          </div>
                          <Progress value={(lateToday / totalEmployees) * 100} className="h-2" />
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{t('staff.absent')}</span>
                            <span className="font-bold text-destructive">{absentToday}</span>
                          </div>
                          <Progress value={(absentToday / totalEmployees) * 100} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Department Distribution */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="h-5 w-5 text-primary" />
                          {t('staff.departmentDistribution')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {departments.slice(0, 5).map((dept, index) => {
                            const count = staff.filter(emp => emp.department === dept).length;
                            const percentage = (count / totalEmployees) * 100;
                            return (
                              <motion.div
                                key={dept}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + index * 0.1 }}
                                className="flex items-center justify-between"
                              >
                                <span className="text-sm">{dept}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{count}</span>
                                  <div className="w-16 bg-secondary rounded-full h-2">
                                    <div
                                      className="bg-primary h-2 rounded-full transition-all duration-1000"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Quick Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-primary" />
                          {t('staff.quickStats')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                            <span className="text-sm">{t('staff.activeEmployees')}</span>
                            <span className="font-bold text-success">{activeEmployees}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg">
                            <span className="text-sm">{t('staff.onLeaveToday')}</span>
                            <span className="font-bold text-warning">{onLeaveEmployees}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
                            <span className="text-sm">{t('staff.inactive')}</span>
                            <span className="font-bold text-destructive">{inactiveEmployees}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Recent Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* New Employees */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <UserPlus className="h-5 w-5 text-primary" />
                          {t('staff.newEmployees')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {staff.slice(-3).map((employee, index) => (
                            <motion.div
                              key={employee.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.9 + index * 0.1 }}
                              className="flex items-center gap-3 p-3 border rounded-lg hover-lift"
                            >
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={employee.avatar} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {employee.name.split(' ')[0][0]}{employee.name.split(' ')[1]?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="font-medium">{employee.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {getRoleText(employee.role)} - {employee.department}
                                </p>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline" className="mb-1">
                                  {employee.hireDate}
                                </Badge>
                                <p className="text-xs text-muted-foreground">{t('staff.hireDate')}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Pending Leave Requests */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-warning" />
                          {t('staff.pendingLeaveRequests')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {leaves.filter(leave => leave.status === 'pending').length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground">
                              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                              <p>{t('staff.noLeaveRequests')}</p>
                            </div>
                          ) : (
                            leaves.filter(leave => leave.status === 'pending').map((leave, index) => (
                              <motion.div
                                key={leave.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.0 + index * 0.1 }}
                                className="flex items-center justify-between p-4 bg-warning/5 border border-warning/20 rounded-lg hover-lift"
                              >
                                <div className="flex-1">
                                  <p className="font-medium">{leave.employeeName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {leave.startDate} - {leave.endDate} ({leave.days} {t('staff.days')})
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {leave.type === 'annual' ? t('staff.annualLeave') :
                                     leave.type === 'sick' ? t('staff.sickLeave') :
                                     leave.type === 'emergency' ? t('staff.emergencyLeave') : t('staff.maternityLeave')}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleRejectLeave(leave.id)}
                                    disabled={isLoading}
                                    className="btn-press"
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    {t('staff.reject')}
                                  </Button>
                                  <Button 
                                    size="sm"
                                    onClick={() => handleApproveLeave(leave.id)}
                                    disabled={isLoading}
                                    className="btn-press"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    {t('staff.approve')}
                                  </Button>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            </TabsContent>

            {/* Staff Tab Content goes here... */}
            <TabsContent value="staff" className="space-y-6 m-0">
              <div className="text-center py-20">
                <h3 className="text-lg font-medium mb-2">{t('staff.employeeList')}</h3>
                <p className="text-muted-foreground">{t('staff.employeeListContent')}</p>
              </div>
            </TabsContent>

            {/* Attendance Tab Content goes here... */}
            <TabsContent value="attendance" className="space-y-6 m-0">
              <div className="text-center py-20">
                <h3 className="text-lg font-medium mb-2">{t('staff.attendanceRecord')}</h3>
                <p className="text-muted-foreground">{t('staff.attendanceRecordContent')}</p>
              </div>
            </TabsContent>

            {/* Leaves Tab Content goes here... */}
            <TabsContent value="leaves" className="space-y-6 m-0">
              <div className="text-center py-20">
                <h3 className="text-lg font-medium mb-2">{t('staff.leaveManagement')}</h3>
                <p className="text-muted-foreground">{t('staff.leaveManagementContent')}</p>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
}