import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface UserManagementProps {
  language: 'en' | 'ar';
}

const translations = {
  en: {
    title: 'User Management',
    addUser: 'Add User',
    users: 'System Users',
    name: 'Name',
    email: 'Email',
    role: 'Role',
    department: 'Department',
    status: 'Status',
    actions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    admin: 'Admin',
    doctor: 'Doctor',
    nurse: 'Nurse',
    receptionist: 'Receptionist',
    labTech: 'Lab Technician',
    pharmacist: 'Pharmacist',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
  },
  ar: {
    title: 'إدارة المستخدمين',
    addUser: 'إضافة مستخدم',
    users: 'مستخدمي النظام',
    name: 'الاسم',
    email: 'البريد الإلكتروني',
    role: 'الدور',
    department: 'القسم',
    status: 'الحالة',
    actions: 'الإجراءات',
    active: 'نشط',
    inactive: 'غير نشط',
    admin: 'مدير',
    doctor: 'طبيب',
    nurse: 'ممرض',
    receptionist: 'استقبال',
    labTech: 'فني مختبر',
    pharmacist: 'صيدلي',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ',
    cancel: 'إلغاء',
  }
};

const mockUsers = [
  { id: 1, name: 'Dr. Ahmed Hassan', email: 'ahmed@clinic.com', role: 'doctor', department: 'Cardiology', status: 'active' },
  { id: 2, name: 'Sara Mohamed', email: 'sara@clinic.com', role: 'nurse', department: 'General', status: 'active' },
  { id: 3, name: 'Omar Ali', email: 'omar@clinic.com', role: 'receptionist', department: 'Front Desk', status: 'active' },
  { id: 4, name: 'Fatima Khan', email: 'fatima@clinic.com', role: 'pharmacist', department: 'Pharmacy', status: 'inactive' },
];

export default function UserManagement({ language }: UserManagementProps) {
  const [users, setUsers] = useState(mockUsers);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    password: ''
  });

  const t = translations[language];

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: 'bg-red-500',
      doctor: 'bg-blue-500',
      nurse: 'bg-green-500',
      receptionist: 'bg-yellow-500',
      lab_tech: 'bg-purple-500',
      pharmacist: 'bg-pink-500'
    };
    return (
      <Badge className={`${colors[role as keyof typeof colors] || 'bg-gray-500'} text-white`}>
        {t[role as keyof typeof t] || role}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t.title}</CardTitle>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {t.addUser}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.addUser}</DialogTitle>
              <DialogDescription>
                Add a new user to the system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t.name}</Label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.email}</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.role}</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t.admin}</SelectItem>
                    <SelectItem value="doctor">{t.doctor}</SelectItem>
                    <SelectItem value="nurse">{t.nurse}</SelectItem>
                    <SelectItem value="receptionist">{t.receptionist}</SelectItem>
                    <SelectItem value="lab_tech">{t.labTech}</SelectItem>
                    <SelectItem value="pharmacist">{t.pharmacist}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.department}</Label>
                <Input
                  value={newUser.department}
                  onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  placeholder="Enter department"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                {t.cancel}
              </Button>
              <Button onClick={() => setShowAddDialog(false)}>
                {t.save}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">{user.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {getRoleBadge(user.role)}
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                  {user.status === 'active' ? t.active : t.inactive}
                </Badge>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}