import { DemoAccount } from '../types/User';

export const demoAccounts: DemoAccount[] = [
  { 
    email: 'admin@clinic.com', 
    password: 'admin123', 
    user: { 
      id: 'demo-admin', 
      email: 'admin@clinic.com', 
      name: 'System Administrator', 
      role: 'admin', 
      department: 'Administration' 
    }
  },
  { 
    email: 'doctor@clinic.com', 
    password: 'doctor123', 
    user: { 
      id: 'demo-doctor', 
      email: 'doctor@clinic.com', 
      name: 'Dr. Ahmed Hassan', 
      role: 'doctor', 
      specialization: 'Cardiology', 
      department: 'Medicine' 
    }
  },
  { 
    email: 'nurse@clinic.com', 
    password: 'nurse123', 
    user: { 
      id: 'demo-nurse', 
      email: 'nurse@clinic.com', 
      name: 'Sara Mohamed', 
      role: 'nurse', 
      department: 'Nursing' 
    }
  },
  { 
    email: 'reception@clinic.com', 
    password: 'reception123', 
    user: { 
      id: 'demo-reception', 
      email: 'reception@clinic.com', 
      name: 'Omar Ali', 
      role: 'receptionist', 
      department: 'Front Desk' 
    }
  },
  { 
    email: 'lab@clinic.com', 
    password: 'lab123', 
    user: { 
      id: 'demo-lab', 
      email: 'lab@clinic.com', 
      name: 'Fatima Khan', 
      role: 'lab_tech', 
      department: 'Laboratory' 
    }
  },
  { 
    email: 'pharmacy@clinic.com', 
    password: 'pharmacy123', 
    user: { 
      id: 'demo-pharmacy', 
      email: 'pharmacy@clinic.com', 
      name: 'Mohamed Salah', 
      role: 'pharmacist', 
      department: 'Pharmacy' 
    }
  },
  { 
    email: 'radiology@clinic.com', 
    password: 'radiology123', 
    user: { 
      id: 'demo-radiology', 
      email: 'radiology@clinic.com', 
      name: 'Dr. Layla Ibrahim', 
      role: 'radiologist', 
      specialization: 'Radiology', 
      department: 'Imaging' 
    }
  },
  { 
    email: 'billing@clinic.com', 
    password: 'billing123', 
    user: { 
      id: 'demo-billing', 
      email: 'billing@clinic.com', 
      name: 'Ahmed Mahmoud', 
      role: 'billing', 
      department: 'Finance' 
    }
  },
  { 
    email: 'hr@clinic.com', 
    password: 'hr123', 
    user: { 
      id: 'demo-hr', 
      email: 'hr@clinic.com', 
      name: 'Nadia Hassan', 
      role: 'hr_manager', 
      department: 'Human Resources' 
    }
  },
  { 
    email: 'inventory@clinic.com', 
    password: 'inventory123', 
    user: { 
      id: 'demo-inventory', 
      email: 'inventory@clinic.com', 
      name: 'Khalid Omar', 
      role: 'inventory_manager', 
      department: 'Inventory' 
    }
  }
];