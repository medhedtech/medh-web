# Instructor API Documentation

## Overview

The **Instructor API** (`src/apis/instructor.ts`) is a comprehensive TypeScript API client that provides full instructor management functionality for the Medh platform. It supports both enhanced instructor profiles and legacy instructor data, offering a unified interface for all instructor-related operations.

## Key Features

### 🔄 **Unified Data Management**
- **Enhanced Profiles**: Full instructor profiles with detailed professional information
- **Legacy Support**: Backward compatibility with User model instructor data
- **Common Route**: Unified endpoint that combines both data sources seamlessly

### 📊 **Comprehensive Analytics**
- Performance metrics and statistics
- Workload distribution analysis
- Financial overview and payout management
- Recent activity tracking

### 🎯 **Advanced Features**
- Batch assignment management
- Payout processing and status tracking
- Availability scheduling
- Specialization and certification tracking

## API Structure

### Type Definitions

```typescript
// Core Types
export type TInstructorType = 'on_payroll' | 'hourly_basis' | 'contractual' | 'guest' | 'legacy';
export type TInstructorStatus = 'active' | 'inactive' | 'pending' | 'suspended' | 'terminated';
export type TPayoutStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export type TDataSource = 'users' | 'instructors' | 'both';
```

### Core Interfaces

#### Enhanced Instructor Profile
```typescript
interface IInstructorProfile {
  _id?: string;
  user: string; // Reference to User model
  instructor_type: TInstructorType;
  instructor_status: TInstructorStatus;
  employee_id?: string;
  hire_date?: Date;
  
  // Professional Information
  specializations: IInstructorSpecialization[];
  education: IInstructorEducation[];
  certifications: IInstructorCertification[];
  work_experience: IInstructorExperience[];
  
  // Availability & Compensation
  availability: IInstructorAvailability[];
  hourly_rate?: number;
  monthly_salary?: number;
  
  // Performance Metrics
  performance_metrics: IInstructorPerformanceMetrics;
}
```

#### Unified Instructor Data
```typescript
interface IUnifiedInstructor {
  _id: string;
  user_id: string;
  full_name: string;
  email: string;
  instructor_type: TInstructorType;
  instructor_status: TInstructorStatus;
  performance_metrics: IInstructorPerformanceMetrics;
  has_enhanced_profile: boolean;
  data_source: 'enhanced' | 'legacy';
}
```

## API Methods

### Core CRUD Operations

#### Get All Instructors
```typescript
const getAllInstructors = async (params: IInstructorQueryParams = {})
```

**Example Usage:**
```typescript
import { instructorAPI } from '@/apis/instructor';

// Basic usage
const instructors = await instructorAPI.getAll();

// With filtering
const activeInstructors = await instructorAPI.getAll({
  instructor_status: 'active',
  instructor_type: 'on_payroll',
  page: 1,
  limit: 10
});

// With search
const searchResults = await instructorAPI.getAll({
  search: 'john',
  include_performance_metrics: true
});
```

#### Get Unified Instructor Data (Common Route)
```typescript
const getInstructorsCommon = async (params: IInstructorCommonQueryParams = {})
```

**Example Usage:**
```typescript
// Get all instructors (enhanced + legacy)
const allInstructors = await instructorAPI.getCommon();

// Enhanced profiles only
const enhancedOnly = await instructorAPI.getCommon({
  data_source: 'instructors',
  include_legacy: false
});

// Search across all data sources
const searchResults = await instructorAPI.getCommon({
  search: 'alex',
  instructor_type: 'hourly_basis',
  include_summary: true
});
```

#### Get Instructor by ID
```typescript
const getInstructorById = async (id: string)
```

#### Create Instructor Profile
```typescript
const createInstructor = async (data: IInstructorCreateInput)
```

**Example Usage:**
```typescript
const newInstructor = await instructorAPI.create({
  user_id: 'user123',
  instructor_type: 'on_payroll',
  instructor_status: 'active',
  employee_id: 'EMP001',
  hire_date: new Date(),
  hourly_rate: 50,
  currency: 'USD',
  specializations: [
    {
      name: 'React',
      level: 'expert',
      years_of_experience: 5
    }
  ]
});
```

#### Update Instructor Profile
```typescript
const updateInstructor = async (id: string, data: IInstructorUpdateInput)
```

### Statistics and Analytics

#### Get Instructor Statistics
```typescript
const getInstructorStatistics = async (params: IInstructorStatisticsParams = {})
```

**Example Usage:**
```typescript
// Basic statistics
const stats = await instructorAPI.getStatistics();

// With date range and detailed breakdown
const detailedStats = await instructorAPI.getStatistics({
  date_range: {
    start_date: '2024-01-01',
    end_date: '2024-12-31'
  },
  include_performance_breakdown: true,
  include_financial_details: true,
  include_recent_activities: true
});
```

**Response Structure:**
```typescript
interface IInstructorStatistics {
  overview: {
    total_instructors: number;
    active_instructors: number;
    enhanced_profiles: number;
    legacy_profiles: number;
  };
  by_type: {
    on_payroll: number;
    hourly_basis: number;
    contractual: number;
    guest: number;
    legacy: number;
  };
  performance_metrics: {
    average_rating: number;
    top_rated_instructors: Array<{
      instructor_id: string;
      full_name: string;
      average_rating: number;
      total_students: number;
    }>;
  };
  financial_overview: {
    total_payouts_pending: number;
    total_payouts_this_month: number;
    average_hourly_rate: number;
  };
}
```

#### Get Available Instructors
```typescript
const getAvailableInstructors = async (params: {
  batch_id?: string;
  required_skills?: string[];
  min_rating?: number;
} = {})
```

### Assignment Management

#### Assign Instructor to Batch
```typescript
const assignInstructorToBatch = async (instructorId: string, data: IInstructorAssignmentInput)
```

**Example Usage:**
```typescript
await instructorAPI.assignToBatch('instructor123', {
  batch_id: 'batch456',
  role: 'primary_instructor',
  hourly_rate: 60,
  notes: 'Expert in React and Node.js'
});
```

#### Unassign Instructor from Batch
```typescript
const unassignInstructorFromBatch = async (instructorId: string, batchId: string)
```

### Payout Management

#### Create Instructor Payout
```typescript
const createInstructorPayout = async (instructorId: string, data: IPayoutCreateInput)
```

**Example Usage:**
```typescript
await instructorAPI.payouts.create('instructor123', {
  payout_type: 'monthly_salary',
  amount: 5000,
  currency: 'USD',
  payment_period: {
    start_date: '2024-01-01',
    end_date: '2024-01-31'
  },
  calculation_details: {
    base_amount: 5000,
    bonus_amount: 500,
    deductions: 100,
    tax_amount: 400,
    net_amount: 5000
  },
  due_date: '2024-02-05',
  payment_method: 'bank_transfer'
});
```

#### Get Instructor Payouts
```typescript
const getInstructorPayouts = async (instructorId: string, params: IPayoutQueryParams = {})
```

#### Update Payout Status
```typescript
const updatePayoutStatus = async (instructorId: string, payoutId: string, data: IPayoutStatusUpdateInput)
```

### Utility Functions

#### Search Instructors
```typescript
const searchInstructors = async (query: string, options: {
  data_source?: TDataSource;
  include_legacy?: boolean;
  limit?: number;
} = {})
```

**Example Usage:**
```typescript
// Search all instructors
const results = await instructorAPI.search('john doe');

// Search only enhanced profiles
const enhancedResults = await instructorAPI.search('react expert', {
  data_source: 'instructors',
  include_legacy: false,
  limit: 20
});
```

#### Get Instructor Workload
```typescript
const getInstructorWorkload = async (instructorId: string)
```

**Response:**
```typescript
{
  current_batches: number;
  total_students: number;
  weekly_hours: number;
  workload_status: 'underutilized' | 'optimal' | 'overloaded';
  recommendations: string[];
}
```

#### Get Performance Report
```typescript
const getInstructorPerformanceReport = async (
  instructorId: string,
  timeframe: 'week' | 'month' | 'quarter' | 'year' = 'month'
)
```

## Advanced Features - Payment Batch Management

### 🏦 **Payment Batch System**
The payment batch management system allows for efficient processing of instructor payments in organized batches with full workflow control.

#### Payment Batch Creation
```typescript
import { instructorAPI } from '@/apis/instructor';

// Create a new payment batch
const createBatch = async () => {
  const batch = await instructorAPI.paymentBatches.create({
    batch_name: 'January 2024 Salary Payments',
    payment_frequency: 'monthly',
    payment_date: '2024-02-05',
    payment_period: {
      start_date: '2024-01-01',
      end_date: '2024-01-31',
      period_description: 'January 2024 Monthly Salaries'
    },
    instructor_payouts: ['payout_1', 'payout_2', 'payout_3'],
    payment_method: 'bank_transfer',
    description: 'Regular monthly salary payments for all active instructors',
    tags: ['salary', 'monthly', 'regular']
  });
  
  return batch.data;
};
```

#### Batch Workflow Management
```typescript
// Approve a payment batch
const approveBatch = async (batchId: string) => {
  await instructorAPI.paymentBatches.approve(batchId, 'Approved by Finance Team');
};

// Process payments
const processBatch = async (batchId: string) => {
  // Validate before processing
  const validation = await instructorAPI.paymentBatches.validate(batchId);
  
  if (validation.data.can_process) {
    await instructorAPI.paymentBatches.process(batchId);
  } else {
    console.error('Validation errors:', validation.data.errors);
  }
};
```

#### Automated Batch Generation
```typescript
// Generate recurring payment batches
const setupRecurringPayments = async () => {
  const result = await instructorAPI.paymentBatches.generateRecurring({
    frequency: 'monthly',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    instructor_criteria: {
      instructor_types: ['on_payroll'],
      instructor_status: ['active']
    },
    payment_settings: {
      payment_method: 'bank_transfer',
      auto_approve: false,
      approval_workflow: true
    }
  });
  
  console.log(`Generated ${result.data.generated_batches.length} batches`);
  console.log(`Total amount: ${result.data.total_amount}`);
};
```

## Advanced Features - Availability & Time Management

### ⏰ **Sophisticated Availability System**
The availability system provides comprehensive scheduling, conflict detection, and optimization features.

#### Setting Availability Patterns
```typescript
// Set instructor's weekly availability pattern
const setAvailabilityPattern = async (instructorId: string) => {
  const pattern = await instructorAPI.availability.setPattern(instructorId, {
    pattern_name: 'Standard Teaching Schedule',
    is_default: true,
    weekly_schedule: {
      monday: {
        is_available: true,
        time_slots: [
          { start_time: '09:00', end_time: '12:00', timezone: 'UTC', status: 'available' },
          { start_time: '14:00', end_time: '17:00', timezone: 'UTC', status: 'available' }
        ],
        max_sessions: 4
      },
      tuesday: {
        is_available: true,
        time_slots: [
          { start_time: '10:00', end_time: '16:00', timezone: 'UTC', status: 'available' }
        ],
        max_sessions: 3
      },
      wednesday: { is_available: false, time_slots: [], max_sessions: 0 },
      thursday: {
        is_available: true,
        time_slots: [
          { start_time: '09:00', end_time: '17:00', timezone: 'UTC', status: 'available' }
        ],
        max_sessions: 5
      },
      friday: {
        is_available: true,
        time_slots: [
          { start_time: '09:00', end_time: '15:00', timezone: 'UTC', status: 'available' }
        ],
        max_sessions: 3
      },
      saturday: { is_available: false, time_slots: [], max_sessions: 0 },
      sunday: { is_available: false, time_slots: [], max_sessions: 0 }
    },
    timezone: 'UTC',
    buffer_time_minutes: 15,
    max_consecutive_sessions: 3,
    effective_from: '2024-01-01',
    effective_until: '2024-12-31'
  });
  
  return pattern.data;
};
```

#### Smart Instructor Matching
```typescript
// Find the best instructors for a specific time slot and requirements
const findBestInstructors = async () => {
  const matches = await instructorAPI.optimization.smartMatching({
    time_slot: {
      date: '2024-01-15',
      start_time: '14:00',
      end_time: '16:00',
      timezone: 'UTC'
    },
    required_skills: ['React', 'TypeScript', 'Node.js'],
    preferred_experience_level: 'expert',
    max_instructors: 3,
    budget_constraints: {
      max_hourly_rate: 75,
      currency: 'USD'
    },
    student_preferences: {
      preferred_languages: ['English'],
      previous_instructor_ratings_min: 4.5
    }
  });
  
  // Results include match scores, availability confidence, and reasoning
  matches.data.matched_instructors.forEach(instructor => {
    console.log(`${instructor.instructor_name}: Score ${instructor.match_score}%`);
    console.log(`Reasons: ${instructor.reasons.join(', ')}`);
  });
};
```

#### Conflict Detection & Resolution
```typescript
// Check for scheduling conflicts before booking
const checkConflicts = async (instructorId: string) => {
  const conflicts = await instructorAPI.availability.checkConflicts(instructorId, {
    date: '2024-01-15',
    start_time: '14:00',
    end_time: '16:00',
    timezone: 'UTC'
  });
  
  if (!conflicts.data.can_schedule) {
    console.log('Conflicts found:');
    conflicts.data.conflicts.forEach(conflict => {
      console.log(`${conflict.severity}: ${conflict.description}`);
      console.log(`Suggestions: ${conflict.suggestions?.join(', ')}`);
    });
  }
};
```

#### Optimal Time Slot Finding
```typescript
// Find the best time slots for multiple instructors
const findOptimalSlots = async () => {
  const slots = await instructorAPI.availability.findOptimalSlots({
    instructor_ids: ['instructor1', 'instructor2', 'instructor3'],
    date_range: { start_date: '2024-01-15', end_date: '2024-01-20' },
    session_duration_minutes: 120,
    preferred_times: ['09:00', '14:00'],
    timezone: 'UTC',
    max_results: 10
  });
  
  // Results are ranked by compatibility score
  slots.data.optimal_slots.forEach(slot => {
    console.log(`${slot.date} ${slot.start_time}-${slot.end_time}`);
    console.log(`Available instructors: ${slot.available_instructors.length}`);
    console.log(`Compatibility: ${slot.compatibility_score}%`);
  });
};
```

#### Schedule Optimization
```typescript
// Optimize schedules across multiple instructors
const optimizeSchedules = async () => {
  const optimization = await instructorAPI.optimization.optimizeSchedules({
    instructor_ids: ['instructor1', 'instructor2', 'instructor3'],
    date_range: { start_date: '2024-01-15', end_date: '2024-01-21' },
    constraints: {
      max_daily_hours: 8,
      min_break_minutes: 30,
      preferred_working_hours: { start: '09:00', end: '17:00' },
      maximum_consecutive_days: 5
    },
    goals: {
      maximize_utilization: true,
      balance_workload: true,
      respect_preferences: true
    }
  });
  
  optimization.data.optimized_schedules.forEach(schedule => {
    console.log(`${schedule.instructor_id}: Score ${schedule.optimization_score}%`);
    console.log(`Improvements: ${schedule.improvements.join(', ')}`);
  });
};
```

#### Availability Analytics & Forecasting
```typescript
// Get comprehensive availability analytics
const getAvailabilityInsights = async () => {
  const analytics = await instructorAPI.availability.getAnalytics({
    date_range: { start_date: '2024-01-01', end_date: '2024-01-31' },
    instructor_ids: ['instructor1', 'instructor2'],
    timezone: 'UTC'
  });
  
  console.log(`Total available hours: ${analytics.data.analytics.total_available_hours}`);
  console.log(`Utilization rate: ${analytics.data.analytics.utilization_rate}%`);
  console.log(`Peak times: ${analytics.data.analytics.peak_availability_times.join(', ')}`);
};

// Forecast future availability
const forecastAvailability = async () => {
  const forecast = await instructorAPI.availability.forecast({
    instructor_ids: ['instructor1', 'instructor2'],
    forecast_period_days: 30,
    historical_data_days: 90,
    factors: {
      consider_trends: true,
      consider_seasonality: true,
      consider_workload_patterns: true
    }
  });
  
  forecast.data.forecasts.forEach(instructorForecast => {
    console.log(`${instructorForecast.instructor_name}:`);
    console.log(`Trend: ${instructorForecast.trends.workload_trend}`);
    console.log(`Seasonal patterns: ${instructorForecast.trends.seasonal_patterns.join(', ')}`);
  });
};
```

## Real-World Implementation Examples

### 1. Complete Payment Processing Dashboard

```typescript
import { instructorAPI } from '@/apis/instructor';

const PaymentProcessingDashboard = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  
  // Load payment batches with filtering
  const loadBatches = async (filters = {}) => {
    const response = await instructorAPI.paymentBatches.getAll({
      batch_status: 'pending_approval',
      payment_date_from: '2024-01-01',
      include_payout_details: true,
      sort_by: 'payment_date',
      sort_order: 'asc',
      ...filters
    });
    
    setBatches(response.data.data);
  };
  
  // Bulk approve batches after validation
  const bulkProcessBatches = async (batchIds: string[]) => {
    for (const batchId of batchIds) {
      // Validate each batch
      const validation = await instructorAPI.paymentBatches.validate(batchId);
      
      if (validation.data.can_process) {
        await instructorAPI.paymentBatches.approve(batchId, 'Bulk approval');
        await instructorAPI.paymentBatches.process(batchId);
      } else {
        console.error(`Batch ${batchId} failed validation:`, validation.data.errors);
      }
    }
    
    // Reload batches
    await loadBatches();
  };
  
  return (
    <div>
      <h2>Payment Processing Dashboard</h2>
      {/* Dashboard implementation */}
    </div>
  );
};
```

### 2. Advanced Scheduling System

```typescript
const AdvancedSchedulingSystem = () => {
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  
  // Find available instructors for specific requirements
  const findInstructorsForClass = async (requirements) => {
    // First, find instructors with smart matching
    const matches = await instructorAPI.optimization.smartMatching({
      time_slot: requirements.timeSlot,
      required_skills: requirements.skills,
      preferred_experience_level: requirements.level,
      max_instructors: 5
    });
    
    // Then check availability for each matched instructor
    const availabilityChecks = await Promise.all(
      matches.data.matched_instructors.map(instructor => 
        instructorAPI.availability.checkConflicts(instructor.instructor_id, requirements.timeSlot)
      )
    );
    
    // Filter out instructors with conflicts
    const availableInstructors = matches.data.matched_instructors.filter((instructor, index) => 
      availabilityChecks[index].data.can_schedule
    );
    
    setSelectedInstructors(availableInstructors);
  };
  
  // Optimize class schedule for the week
  const optimizeWeeklySchedule = async () => {
    const instructorIds = selectedInstructors.map(i => i.instructor_id);
    
    const optimized = await instructorAPI.optimization.optimizeSchedules({
      instructor_ids: instructorIds,
      date_range: { 
        start_date: '2024-01-15', 
        end_date: '2024-01-21' 
      },
      constraints: {
        max_daily_hours: 6,
        min_break_minutes: 15,
        preferred_working_hours: { start: '09:00', end: '17:00' },
        maximum_consecutive_days: 5
      },
      goals: {
        maximize_utilization: true,
        balance_workload: true,
        respect_preferences: true
      }
    });
    
    return optimized.data;
  };
  
  return (
    <div>
      <h2>Advanced Scheduling System</h2>
      {/* Scheduling interface */}
    </div>
  );
};
```

### 3. Workload Management & Analytics

```typescript
const WorkloadManagementSystem = () => {
  const [workloadData, setWorkloadData] = useState(null);
  const [instructorAnalytics, setInstructorAnalytics] = useState([]);
  
  // Calculate comprehensive workload for instructor
  const analyzeInstructorWorkload = async (instructorId: string) => {
    // Get current workload
    const workload = await instructorAPI.optimization.calculateWorkload(instructorId, {
      start_date: '2024-01-01',
      end_date: '2024-01-31'
    });
    
    // Get availability analytics
    const availability = await instructorAPI.availability.getAnalytics({
      date_range: { start_date: '2024-01-01', end_date: '2024-01-31' },
      instructor_ids: [instructorId]
    });
    
    // Get performance metrics
    const performance = await instructorAPI.getPerformanceReport(instructorId, 'month');
    
    return {
      workload: workload.data,
      availability: availability.data,
      performance: performance.data
    };
  };
  
  // Monitor and balance workload across all instructors
  const balanceWorkloadAcrossTeam = async () => {
    const instructors = await instructorAPI.getCommon({
      instructor_status: 'active',
      include_performance_metrics: true
    });
    
    const workloadPromises = instructors.data.data.map(instructor => 
      analyzeInstructorWorkload(instructor._id)
    );
    
    const allWorkloads = await Promise.all(workloadPromises);
    
    // Identify overloaded and underutilized instructors
    const overloaded = allWorkloads.filter(w => w.workload.workload_status === 'overloaded');
    const underutilized = allWorkloads.filter(w => w.workload.workload_status === 'underutilized');
    
    // Generate recommendations for rebalancing
    const recommendations = generateWorkloadRecommendations(overloaded, underutilized);
    
    return recommendations;
  };
  
  return (
    <div>
      <h2>Workload Management Dashboard</h2>
      {/* Workload analytics and rebalancing interface */}
    </div>
  );
};
```

## Enhanced Key Benefits

### 🎯 **For Administrators**
- **Automated Payment Processing**: Reduce manual work with batch processing and automation
- **Comprehensive Scheduling**: Avoid conflicts and optimize instructor utilization
- **Analytics-Driven Decisions**: Make data-informed scheduling and payment decisions
- **Compliance Management**: Built-in validation and audit trails

### 💰 **For Finance Teams**
- **Batch Processing**: Handle multiple payments efficiently
- **Validation Systems**: Prevent errors before processing
- **Audit Trails**: Complete tracking of all payment activities
- **Multi-Currency Support**: Handle global instructor payments

### 👨‍🏫 **For Instructors**
- **Flexible Scheduling**: Set detailed availability patterns
- **Conflict Prevention**: Automatic conflict detection
- **Workload Balance**: AI-powered schedule optimization
- **Transparent Payments**: Clear payment tracking and schedules

### 🎓 **For Students**
- **Better Instructor Matching**: Smart algorithms find the best instructors
- **Reliable Scheduling**: Reduced conflicts and cancellations
- **Quality Assurance**: Performance-based instructor recommendations
- **Optimal Learning Times**: Schedule classes at peak instructor availability

This comprehensive instructor API provides everything needed to build sophisticated instructor management features while maintaining backward compatibility with existing systems and providing a smooth migration path to enhanced profiles. 