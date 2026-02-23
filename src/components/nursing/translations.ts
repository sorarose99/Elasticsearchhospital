export const nursingTranslations = {
  ar: {
    // Main Navigation
    title: 'إدارة التمريض',
    subtitle: 'نظام متكامل لإدارة الرعاية التمريضية والمرضى',
    dashboard: 'لوحة التحكم',
    vitals: 'العلامات الحيوية',
    tasks: 'المهام التمريضية',
    patientCare: 'رعاية المرضى',
    workflow: 'سير العمل',
    monitoring: 'المراقبة',
    
    // Dashboard
    dashboardTitle: 'لوحة تحكم التمريض',
    dashboardSubtitle: 'نظرة شاملة على الأنشطة والمهام التمريضية',
    
    // Stats
    stats: {
      totalPatients: 'إجمالي المرضى',
      pendingTasks: 'المهام المعلقة',
      emergencyCases: 'حالات الطوارئ',
      vitalsToday: 'القياسات اليوم',
      completedRounds: 'الجولات المكتملة',
      overdueChecks: 'فحوصات متأخرة',
      activeMedications: 'أدوية نشطة',
      staffOnDuty: 'طاقم في الخدمة'
    },
    
    // Vital Signs
    vitalSigns: {
      title: 'نظام العلامات الحيوية',
      subtitle: 'متابعة وتسجيل العلامات الحيوية للمرضى',
      addNew: 'إضافة قراءة جديدة',
      editVitals: 'تعديل العلامات الحيوية',
      temperature: 'درجة الحرارة',
      bloodPressure: 'ضغط الدم',
      heartRate: 'معدل النبض',
      respiratoryRate: 'معدل التنفس',
      oxygenSaturation: 'نسبة الأكسجين',
      bloodGlucose: 'سكر الدم',
      painScale: 'مقياس الألم',
      consciousness: 'مستوى الوعي',
      deviceUsed: 'الجهاز المستخدم',
      notes: 'ملاحظات إضافية',
      recordedBy: 'تم التسجيل بواسطة',
      verified: 'مُتحقق منه',
      pendingVerification: 'في انتظار التحقق',
      normal: 'طبيعي',
      warning: 'تحتاج متابعة',
      critical: 'حرج',
      trends: 'اتجاهات العلامات الحيوية',
      showTrends: 'عرض المخططات',
      hideTrends: 'إخفاء المخططات',
      
      // Vital Signs Values
      temperatureUnit: 'الوحدة',
      celsius: 'مئوية',
      fahrenheit: 'فهرنهايت',
      systolic: 'الانقباضي',
      diastolic: 'الانبساطي',
      bpm: 'نبضة/دقيقة',
      perMinute: '/دقيقة',
      percentage: '%',
      mgDl: 'مغ/دل',
      
      // Consciousness Levels
      consciousnessLevels: {
        alert: 'متيقظ',
        drowsy: 'نعسان',
        confused: 'مشوش',
        unconscious: 'فاقد الوعي'
      },
      
      // Pain Scale
      painLevels: {
        mild: 'خفيف',
        moderate: 'متوسط',
        severe: 'شديد'
      },
      
      // Flags and Alerts
      flags: {
        highFever: 'حمى عالية',
        lowTemperature: 'انخفاض درجة الحرارة',
        highBloodPressure: 'ارتفاع ضغط الدم',
        lowBloodPressure: 'انخفاض ضغط الدم',
        tachycardia: 'تسارع النبض',
        bradycardia: 'بطء النبض',
        lowOxygen: 'انخفاض الأكسجين',
        tachypnea: 'تسارع التنفس',
        bradypnea: 'بطء التنفس'
      },
      
      // Form Validation
      validation: {
        selectPatient: 'يرجى اختيار المريض',
        enterTemperature: 'يرجى إدخال درجة الحرارة',
        enterSystolic: 'يرجى إدخال الضغط الانقباضي',
        enterDiastolic: 'يرجى إدخال الضغط الانبساطي',
        enterHeartRate: 'يرجى إدخال معدل النبض',
        enterRespiratory: 'يرجى إدخال معدل التنفس',
        enterOxygen: 'يرجى إدخال نسبة الأكسجين',
        temperatureRange: 'درجة الحرارة خارج النطاق الطبيعي',
        bloodPressureRange: 'ضغط الدم خارج النطاق الطبيعي',
        heartRateRange: 'معدل النبض خارج النطاق الطبيعي',
        oxygenRange: 'نسبة الأكسجين خارج النطاق الطبيعي'
      }
    },
    
    // Tasks
    tasks: {
      title: 'مهام التمريض',
      addTask: 'إضافة مهمة',
      editTask: 'تعديل مهمة',
      taskDescription: 'وصف المهمة',
      assignedTo: 'مكلف إلى',
      dueTime: 'الموعد المحدد',
      priority: 'الأولوية',
      status: 'الحالة',
      
      // Priority Levels
      priorities: {
        high: 'عاجل',
        medium: 'متوسط',
        low: 'منخفض'
      },
      
      // Status
      statuses: {
        pending: 'معلق',
        inProgress: 'جاري',
        completed: 'مكتمل',
        overdue: 'متأخر'
      },
      
      // Task Types
      types: {
        medication: 'إعطاء الدواء',
        vitals: 'قياس العلامات الحيوية',
        assessment: 'تقييم المريض',
        documentation: 'توثيق',
        emergency: 'طوارئ',
        rounds: 'جولة'
      }
    },
    
    // Patient Care
    patientCare: {
      title: 'رعاية المرضى',
      patientInfo: 'معلومات المريض',
      room: 'الغرفة',
      bed: 'السرير',
      condition: 'الحالة',
      careLevel: 'مستوى الرعاية',
      allergies: 'الحساسية',
      medications: 'الأدوية الحالية',
      lastRounds: 'آخر جولة',
      nextAssessment: 'التقييم التالي',
      
      // Care Levels
      careLevels: {
        intensive: 'عناية مركزة',
        moderate: 'عناية متوسطة',
        minimal: 'عناية أساسية'
      },
      
      // Conditions
      conditions: {
        stable: 'مستقر',
        critical: 'حرج',
        improving: 'متحسن',
        declining: 'متدهور',
        monitoring: 'تحت المراقبة'
      }
    },
    
    // Workflow
    workflow: {
      title: 'سير العمل اليومي',
      staffStatus: 'حالة الطاقم',
      achievements: 'إنجازات اليوم',
      completionRate: 'معدل إكمال المهام',
      vitalsCompleted: 'قياسات حيوية مكتملة',
      roundsCompleted: 'جولات مكتملة',
      
      // Staff Status
      staffStatuses: {
        available: 'متاحة',
        busy: 'مشغول',
        onBreak: 'في راحة',
        offDuty: 'خارج الخدمة'
      },
      
      // Workflow Tasks
      workflowTasks: {
        morningRounds: 'جولة صباحية',
        medicationDistribution: 'توزيع الأدوية',
        vitalsCheck: 'قياس العلامات الحيوية',
        shiftReports: 'تقارير الوردية',
        patientAssessment: 'تقييم المرضى',
        documentation: 'التوثيق'
      }
    },
    
    // Monitoring
    monitoring: {
      title: 'مراقبة المرضى الحرجين',
      criticalPatients: 'المرضى الحرجين',
      shiftStats: 'إحصائيات الوردية',
      activePatients: 'مرضى نشطين',
      completedTasks: 'مهام مكتملة',
      activeAlerts: 'تنبيهات نشطة',
      staffOnDuty: 'طاقم في الخدمة',
      alerts: 'التنبيهات',
      criticalAlert: 'تنبيه حرج',
      warningAlert: 'تنبيه تحذيري',
      infoAlert: 'تنبيه معلوماتي'
    },
    
    // Quick Actions
    quickActions: {
      title: 'الإجراءات السريعة',
      measureVitals: 'قياس العلامات',
      addTask: 'إضافة مهمة',
      patientRounds: 'جولة مرضى',
      emergencyAlert: 'تنبيه طارئ',
      medicationReminder: 'تذكير دواء',
      documentCare: 'توثيق الرعاية'
    },
    
    // Recent Activities
    recentActivities: 'الأنشطة الحديثة',
    
    // Alerts
    alerts: {
      title: 'التنبيهات',
      markAsRead: 'تمييز كمقروء',
      viewAll: 'عرض الكل',
      newAlert: 'تنبيه جديد',
      unreadAlerts: 'تنبيهات غير مقروءة'
    },
    
    // Shift Summary
    shiftSummary: {
      title: 'ملخص الوردية',
      currentShift: 'الوردية الحالية',
      startTime: 'البداية',
      endTime: 'النهاية',
      assignedPatients: 'المرضى المكلفين',
      taskProgress: 'تقدم المهام',
      vitalsRecorded: 'القياسات المسجلة',
      emergencyResponses: 'استجابات الطوارئ',
      
      // Shift Types
      shifts: {
        morning: 'صباحية',
        afternoon: 'مسائية',
        night: 'ليلية'
      }
    },
    
    // Common Actions
    actions: {
      add: 'إضافة',
      edit: 'تعديل',
      delete: 'حذف',
      save: 'حفظ',
      cancel: 'إلغاء',
      update: 'تحديث',
      view: 'عرض',
      details: 'تفاصيل',
      complete: 'إكمال',
      assign: 'تكليف',
      verify: 'تحقق',
      print: 'طباعة',
      export: 'تصدير',
      import: 'استيراد',
      refresh: 'تحديث',
      search: 'بحث',
      filter: 'تصفية',
      sort: 'ترتيب'
    },
    
    // Time Formats
    time: {
      now: 'الآن',
      minutesAgo: 'منذ $1 دقيقة',
      hoursAgo: 'منذ $1 ساعة',
      daysAgo: 'منذ $1 يوم',
      today: 'اليوم',
      yesterday: 'أمس',
      thisWeek: 'هذا الأسبوع',
      lastWeek: 'الأسبوع الماضي'
    },
    
    // Messages
    messages: {
      success: {
        vitalsSaved: 'تم حفظ العلامات الحيوية بنجاح',
        taskCompleted: 'تم إكمال المهمة بنجاح',
        taskAdded: 'تم إضافة المهمة بنجاح',
        dataUpdated: 'تم تحديث البيانات بنجاح'
      },
      error: {
        saveFailed: 'فشل في حفظ البيانات',
        loadFailed: 'فشل في تحميل البيانات',
        invalidData: 'بيانات غير صحيحة',
        networkError: 'خطأ في الشبكة'
      },
      confirmation: {
        deleteTask: 'هل أنت متأكد من حذف هذه المهمة؟',
        deleteVitals: 'هل أنت متأكد من حذف هذه القراءة؟',
        completeTask: 'هل تريد تمييز هذه المهمة كمكتملة؟'
      },
      info: {
        noData: 'لا توجد بيانات',
        loading: 'جاري التحميل...',
        saving: 'جاري الحفظ...',
        updating: 'جاري التحديث...'
      }
    },
    
    // Patient Information
    patient: {
      name: 'اسم المريض',
      age: 'العمر',
      gender: 'الجنس',
      admissionDate: 'تاريخ الدخول',
      lastVitals: 'آخر قياس',
      
      // Gender
      genders: {
        male: 'ذكر',
        female: 'أنثى'
      }
    },
    
    // Forms
    forms: {
      required: 'مطلوب',
      optional: 'اختياري',
      selectOption: 'اختر خيار',
      enterValue: 'أدخل القيمة',
      selectPatient: 'اختر المريض',
      selectNurse: 'اختر الممرضة',
      chooseTime: 'اختر الوقت',
      chooseDate: 'اختر التاريخ'
    }
  },
  
  en: {
    // Main Navigation
    title: 'Nursing Management',
    subtitle: 'Comprehensive nursing care and patient management system',
    dashboard: 'Dashboard',
    vitals: 'Vital Signs',
    tasks: 'Nursing Tasks',
    patientCare: 'Patient Care',
    workflow: 'Workflow',
    monitoring: 'Monitoring',
    
    // Dashboard
    dashboardTitle: 'Nursing Dashboard',
    dashboardSubtitle: 'Comprehensive overview of nursing activities and tasks',
    
    // Stats
    stats: {
      totalPatients: 'Total Patients',
      pendingTasks: 'Pending Tasks',
      emergencyCases: 'Emergency Cases',
      vitalsToday: 'Vitals Today',
      completedRounds: 'Completed Rounds',
      overdueChecks: 'Overdue Checks',
      activeMedications: 'Active Medications',
      staffOnDuty: 'Staff On Duty'
    },
    
    // Vital Signs
    vitalSigns: {
      title: 'Vital Signs System',
      subtitle: 'Monitor and record patient vital signs',
      addNew: 'Add New Reading',
      editVitals: 'Edit Vital Signs',
      temperature: 'Temperature',
      bloodPressure: 'Blood Pressure',
      heartRate: 'Heart Rate',
      respiratoryRate: 'Respiratory Rate',
      oxygenSaturation: 'Oxygen Saturation',
      bloodGlucose: 'Blood Glucose',
      painScale: 'Pain Scale',
      consciousness: 'Consciousness Level',
      deviceUsed: 'Device Used',
      notes: 'Additional Notes',
      recordedBy: 'Recorded By',
      verified: 'Verified',
      pendingVerification: 'Pending Verification',
      normal: 'Normal',
      warning: 'Needs Attention',
      critical: 'Critical',
      trends: 'Vital Signs Trends',
      showTrends: 'Show Charts',
      hideTrends: 'Hide Charts',
      
      // Vital Signs Values
      temperatureUnit: 'Unit',
      celsius: 'Celsius',
      fahrenheit: 'Fahrenheit',
      systolic: 'Systolic',
      diastolic: 'Diastolic',
      bpm: 'bpm',
      perMinute: '/min',
      percentage: '%',
      mgDl: 'mg/dL',
      
      // Consciousness Levels
      consciousnessLevels: {
        alert: 'Alert',
        drowsy: 'Drowsy',
        confused: 'Confused',
        unconscious: 'Unconscious'
      },
      
      // Pain Scale
      painLevels: {
        mild: 'Mild',
        moderate: 'Moderate',
        severe: 'Severe'
      },
      
      // Flags and Alerts
      flags: {
        highFever: 'High Fever',
        lowTemperature: 'Low Temperature',
        highBloodPressure: 'High Blood Pressure',
        lowBloodPressure: 'Low Blood Pressure',
        tachycardia: 'Tachycardia',
        bradycardia: 'Bradycardia',
        lowOxygen: 'Low Oxygen',
        tachypnea: 'Tachypnea',
        bradypnea: 'Bradypnea'
      },
      
      // Form Validation
      validation: {
        selectPatient: 'Please select a patient',
        enterTemperature: 'Please enter temperature',
        enterSystolic: 'Please enter systolic pressure',
        enterDiastolic: 'Please enter diastolic pressure',
        enterHeartRate: 'Please enter heart rate',
        enterRespiratory: 'Please enter respiratory rate',
        enterOxygen: 'Please enter oxygen saturation',
        temperatureRange: 'Temperature is outside normal range',
        bloodPressureRange: 'Blood pressure is outside normal range',
        heartRateRange: 'Heart rate is outside normal range',
        oxygenRange: 'Oxygen saturation is outside normal range'
      }
    },
    
    // Tasks
    tasks: {
      title: 'Nursing Tasks',
      addTask: 'Add Task',
      editTask: 'Edit Task',
      taskDescription: 'Task Description',
      assignedTo: 'Assigned To',
      dueTime: 'Due Time',
      priority: 'Priority',
      status: 'Status',
      
      // Priority Levels
      priorities: {
        high: 'High',
        medium: 'Medium',
        low: 'Low'
      },
      
      // Status
      statuses: {
        pending: 'Pending',
        inProgress: 'In Progress',
        completed: 'Completed',
        overdue: 'Overdue'
      },
      
      // Task Types
      types: {
        medication: 'Medication Administration',
        vitals: 'Vital Signs Check',
        assessment: 'Patient Assessment',
        documentation: 'Documentation',
        emergency: 'Emergency',
        rounds: 'Rounds'
      }
    },
    
    // Patient Care
    patientCare: {
      title: 'Patient Care',
      patientInfo: 'Patient Information',
      room: 'Room',
      bed: 'Bed',
      condition: 'Condition',
      careLevel: 'Care Level',
      allergies: 'Allergies',
      medications: 'Current Medications',
      lastRounds: 'Last Rounds',
      nextAssessment: 'Next Assessment',
      
      // Care Levels
      careLevels: {
        intensive: 'Intensive Care',
        moderate: 'Moderate Care',
        minimal: 'Basic Care'
      },
      
      // Conditions
      conditions: {
        stable: 'Stable',
        critical: 'Critical',
        improving: 'Improving',
        declining: 'Declining',
        monitoring: 'Under Monitoring'
      }
    },
    
    // Workflow
    workflow: {
      title: 'Daily Workflow',
      staffStatus: 'Staff Status',
      achievements: 'Today\'s Achievements',
      completionRate: 'Task Completion Rate',
      vitalsCompleted: 'Vitals Completed',
      roundsCompleted: 'Rounds Completed',
      
      // Staff Status
      staffStatuses: {
        available: 'Available',
        busy: 'Busy',
        onBreak: 'On Break',
        offDuty: 'Off Duty'
      },
      
      // Workflow Tasks
      workflowTasks: {
        morningRounds: 'Morning Rounds',
        medicationDistribution: 'Medication Distribution',
        vitalsCheck: 'Vital Signs Check',
        shiftReports: 'Shift Reports',
        patientAssessment: 'Patient Assessment',
        documentation: 'Documentation'
      }
    },
    
    // Monitoring
    monitoring: {
      title: 'Critical Patient Monitoring',
      criticalPatients: 'Critical Patients',
      shiftStats: 'Shift Statistics',
      activePatients: 'Active Patients',
      completedTasks: 'Completed Tasks',
      activeAlerts: 'Active Alerts',
      staffOnDuty: 'Staff On Duty',
      alerts: 'Alerts',
      criticalAlert: 'Critical Alert',
      warningAlert: 'Warning Alert',
      infoAlert: 'Info Alert'
    },
    
    // Quick Actions
    quickActions: {
      title: 'Quick Actions',
      measureVitals: 'Measure Vitals',
      addTask: 'Add Task',
      patientRounds: 'Patient Rounds',
      emergencyAlert: 'Emergency Alert',
      medicationReminder: 'Medication Reminder',
      documentCare: 'Document Care'
    },
    
    // Recent Activities
    recentActivities: 'Recent Activities',
    
    // Alerts
    alerts: {
      title: 'Alerts',
      markAsRead: 'Mark as Read',
      viewAll: 'View All',
      newAlert: 'New Alert',
      unreadAlerts: 'Unread Alerts'
    },
    
    // Shift Summary
    shiftSummary: {
      title: 'Shift Summary',
      currentShift: 'Current Shift',
      startTime: 'Start Time',
      endTime: 'End Time',
      assignedPatients: 'Assigned Patients',
      taskProgress: 'Task Progress',
      vitalsRecorded: 'Vitals Recorded',
      emergencyResponses: 'Emergency Responses',
      
      // Shift Types
      shifts: {
        morning: 'Morning',
        afternoon: 'Afternoon',
        night: 'Night'
      }
    },
    
    // Common Actions
    actions: {
      add: 'Add',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      update: 'Update',
      view: 'View',
      details: 'Details',
      complete: 'Complete',
      assign: 'Assign',
      verify: 'Verify',
      print: 'Print',
      export: 'Export',
      import: 'Import',
      refresh: 'Refresh',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort'
    },
    
    // Time Formats
    time: {
      now: 'Now',
      minutesAgo: '$1 minutes ago',
      hoursAgo: '$1 hours ago',
      daysAgo: '$1 days ago',
      today: 'Today',
      yesterday: 'Yesterday',
      thisWeek: 'This Week',
      lastWeek: 'Last Week'
    },
    
    // Messages
    messages: {
      success: {
        vitalsSaved: 'Vital signs saved successfully',
        taskCompleted: 'Task completed successfully',
        taskAdded: 'Task added successfully',
        dataUpdated: 'Data updated successfully'
      },
      error: {
        saveFailed: 'Failed to save data',
        loadFailed: 'Failed to load data',
        invalidData: 'Invalid data',
        networkError: 'Network error'
      },
      confirmation: {
        deleteTask: 'Are you sure you want to delete this task?',
        deleteVitals: 'Are you sure you want to delete this reading?',
        completeTask: 'Do you want to mark this task as completed?'
      },
      info: {
        noData: 'No data available',
        loading: 'Loading...',
        saving: 'Saving...',
        updating: 'Updating...'
      }
    },
    
    // Patient Information
    patient: {
      name: 'Patient Name',
      age: 'Age',
      gender: 'Gender',
      admissionDate: 'Admission Date',
      lastVitals: 'Last Vitals',
      
      // Gender
      genders: {
        male: 'Male',
        female: 'Female'
      }
    },
    
    // Forms
    forms: {
      required: 'Required',
      optional: 'Optional',
      selectOption: 'Select option',
      enterValue: 'Enter value',
      selectPatient: 'Select patient',
      selectNurse: 'Select nurse',
      chooseTime: 'Choose time',
      chooseDate: 'Choose date'
    }
  }
};